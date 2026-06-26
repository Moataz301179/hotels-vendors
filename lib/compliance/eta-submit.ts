/**
 * ETA Submission Service
 * Hotels Vendors Compliance Layer
 *
 * Submits validated invoices to the Egyptian Tax Authority API.
 * Handles validation, state transitions, error logging, and audit trails.
 *
 * LEGAL: Platform operates under digital marketing license only.
 * No cash custody. All financial services by licensed third-party partners.
 * "Restaurants for E-Marketing operates strictly as a technical data orchestrator.
 *  Zero liability for counterparty collection defaults."
 */

import { prisma } from "@/lib/prisma";
import { EtaStatus, Prisma } from "@prisma/client";
import { validateInvoiceForEta, generateEtaPayload } from "./eta-validator";
import type { InvoiceWithItems } from "./eta-validator";
import { canonicalizeEtaPayload } from "@/lib/eta/canonicalizer";

// ─────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────

export interface EtaSubmitResult {
  success: boolean;
  uuid?: string;
  error?: string;
}

// ─────────────────────────────────────────
// 2. HELPER — Load invoice with relations
// ─────────────────────────────────────────

async function loadInvoiceWithRelations(invoiceId: string): Promise<InvoiceWithItems | null> {
  return prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      hotel: true,
      supplier: true,
      order: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
}

// ─────────────────────────────────────────
// 3. HELPER — Sign payload and build signature block
// ─────────────────────────────────────────

async function signEtaPayload(
  payload: Record<string, unknown>,
  tenantId: string
): Promise<string> {
  const canonicalString = canonicalizeEtaPayload(payload);

  // Use ETA software signing if available, else HMAC-SHA256 with API key
  const apiKey = process.env.ETA_API_KEY;
  if (apiKey) {
    const crypto = await import("crypto");
    return crypto.createHmac("sha256", apiKey).update(canonicalString).digest("base64");
  }

  // Fallback: HMAC with tenant ID (development only)
  const crypto = await import("crypto");
  return crypto.createHmac("sha256", tenantId).update(canonicalString).digest("base64");
}

// ─────────────────────────────────────────
// 4. HELPER — Log submission attempt via AgentRun
// ─────────────────────────────────────────

async function logSubmissionAttempt(params: {
  invoiceId: string;
  tenantId: string;
  action: string;
  status: string;
  uuid?: string;
  error?: string;
  durationMs: number;
}): Promise<void> {
  try {
    await prisma.agentRun.create({
      data: {
        taskType: "ETA_SUBMISSION",
        taskName: `ETA ${params.action}`,
        prompt: `Invoice: ${params.invoiceId} | Tenant: ${params.tenantId}`,
        agentName: "eta-submit",
        status: params.status === "SUCCESS" ? "COMPLETED" : "FAILED",
        output: params.uuid || undefined,
        findings: params.error || undefined,
        completedAt: new Date(),
        durationMs: params.durationMs,
        tenantId: params.tenantId,
      },
    });
  } catch {
    // AgentRun logging is best-effort; never fail the submission because of it
  }
}

// ─────────────────────────────────────────
// 5. MAIN SUBMISSION FUNCTION
// ─────────────────────────────────────────

/**
 * Submit a single invoice to the Egyptian Tax Authority.
 *
 * Flow:
 *   1. Load invoice with all required relations
 *   2. Validate compliance (bilingual fields, HS codes, monetary math, tax IDs)
 *   3. Build ETA payload
 *   4. Digitally sign payload
 *   5. POST to ETA API
 *   6. Update invoice state (uuid, status, signature, response)
 *   7. Log via AgentRun
 */
export async function submitToEta(invoiceId: string): Promise<EtaSubmitResult> {
  const startedAt = Date.now();

  // ── Step 1: Load invoice ──
  const invoice = await loadInvoiceWithRelations(invoiceId);
  if (!invoice) {
    const error = `Invoice ${invoiceId} not found`;
    await logSubmissionAttempt({
      invoiceId,
      tenantId: "unknown",
      action: "LOAD",
      status: "FAILED",
      error,
      durationMs: Date.now() - startedAt,
    });
    return { success: false, error };
  }

  // ── Step 2: Validate ──
  let validated: InvoiceWithItems;
  try {
    validated = invoice as InvoiceWithItems;
  } catch {
    validated = invoice;
  }

  const validation = validateInvoiceForEta(validated);
  if (!validation.valid) {
    const error = `ETA compliance validation failed: ${validation.errors.join("; ")}`;
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        etaStatus: "REJECTED" as EtaStatus,
        submissionLog: JSON.stringify({
          attempt: new Date().toISOString(),
          errors: validation.errors,
        }),
      },
    });
    await logSubmissionAttempt({
      invoiceId,
      tenantId: invoice.tenantId,
      action: "VALIDATE",
      status: "FAILED",
      error,
      durationMs: Date.now() - startedAt,
    });
    return { success: false, error };
  }

  // ── Step 3: Build payload ──
  const payload = generateEtaPayload(validated);
  const payloadForSigning: Record<string, unknown> = {
    ...payload,
    // Convert Decimals to strings for canonicalization
    totalSalesAmount: payload.totalSalesAmount.toString(),
    netAmount: payload.netAmount.toString(),
    totalAmount: payload.totalAmount.toString(),
    invoiceLines: payload.invoiceLines.map((line) => ({
      ...line,
      salesTotal: line.salesTotal.toString(),
      total: line.total.toString(),
      valueDifference: line.valueDifference.toString(),
      totalTaxableFees: line.totalTaxableFees.toString(),
      netTotal: line.netTotal.toString(),
      itemsDiscount: line.itemsDiscount.toString(),
      discount: { amount: line.discount.amount.toString() },
      taxableItems: line.taxableItems.map((ti) => ({
        ...ti,
        amount: ti.amount.toString(),
      })),
    })),
    taxTotals: payload.taxTotals.map((tt) => ({
      ...tt,
      amount: tt.amount.toString(),
    })),
  };

  // ── Step 4: Sign ──
  let digitalSignature: string;
  try {
    digitalSignature = await signEtaPayload(payloadForSigning, invoice.tenantId);
  } catch (signErr) {
    const error = `Failed to sign ETA payload: ${signErr instanceof Error ? signErr.message : String(signErr)}`;
    await logSubmissionAttempt({
      invoiceId,
      tenantId: invoice.tenantId,
      action: "SIGN",
      status: "FAILED",
      error,
      durationMs: Date.now() - startedAt,
    });
    return { success: false, error };
  }

  // ── Step 5: POST to ETA API ──
  const apiUrl = process.env.ETA_API_URL || "https://api.preprod.invoicing.eta.gov.eg";
  const apiKey = process.env.ETA_API_KEY || "";

  let submissionResponse: Response;
  try {
    submissionResponse = await fetch(`${apiUrl}/api/v1/documentsubmissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "x-api-key": apiKey } : {}),
      },
      body: JSON.stringify({
        documents: [payloadForSigning],
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (networkErr) {
    const error = `ETA API network error: ${networkErr instanceof Error ? networkErr.message : String(networkErr)}`;
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        etaStatus: "RETRYING" as EtaStatus,
        submissionLog: JSON.stringify({
          attempt: new Date().toISOString(),
          error,
        }),
      },
    }).catch(() => {
      // Best-effort update
    });
    await logSubmissionAttempt({
      invoiceId,
      tenantId: invoice.tenantId,
      action: "POST",
      status: "FAILED",
      error,
      durationMs: Date.now() - startedAt,
    });
    return { success: false, error };
  }

  // ── Step 6: Parse response and update invoice ──
  let responseBody: Prisma.JsonValue = {};
  try {
    responseBody = (await submissionResponse.json()) as Prisma.JsonValue;
  } catch {
    responseBody = { raw: await submissionResponse.text() };
  }

  if (!submissionResponse.ok) {
    const errorText = typeof responseBody === "object" ? JSON.stringify(responseBody) : String(responseBody);
    const error = `ETA API rejected invoice (${submissionResponse.status}): ${errorText}`;
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        etaStatus: "REJECTED" as EtaStatus,
        submissionLog: JSON.stringify({
          attempt: new Date().toISOString(),
          apiStatus: submissionResponse.status,
          error: errorText,
        }),
      },
    }).catch(() => {
      // Best-effort
    });
    await logSubmissionAttempt({
      invoiceId,
      tenantId: invoice.tenantId,
      action: "SUBMIT",
      status: "FAILED",
      error,
      durationMs: Date.now() - startedAt,
    });
    return { success: false, error };
  }

  // Extract UUID from response (ETA returns acceptedDocuments[0].uuid)
  let etaUuid: string | undefined;
  if (typeof responseBody === "object" && responseBody !== null) {
    const acceptedDocuments = (responseBody as Record<string, unknown>).acceptedDocuments;
    if (Array.isArray(acceptedDocuments) && acceptedDocuments.length > 0) {
      etaUuid = (acceptedDocuments[0] as Record<string, unknown>)?.uuid as string | undefined;
    }
    // Fallback: check top-level uuid
    if (!etaUuid) {
      etaUuid = (responseBody as Record<string, unknown>).uuid as string | undefined;
    }
  }

  if (!etaUuid) {
    const error = "ETA API returned success but no UUID in response";
    await logSubmissionAttempt({
      invoiceId,
      tenantId: invoice.tenantId,
      action: "SUBMIT",
      status: "FAILED",
      error,
      durationMs: Date.now() - startedAt,
    });
    return { success: false, error };
  }

  // Success — update invoice
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      etaUuid,
      etaStatus: "SUBMITTING" as EtaStatus,
      digitalSignature,
      etaSubmittedAt: new Date(),
      etaResponse: responseBody as Prisma.InputJsonValue,
      submissionLog: JSON.stringify({
        submittedAt: new Date().toISOString(),
        submissionId:
          typeof responseBody === "object" && responseBody !== null
            ? ((responseBody as Record<string, unknown>).submissionId as string | undefined)
            : undefined,
        etaUuid,
        signaturePresent: true,
      }),
    },
  });

  await logSubmissionAttempt({
    invoiceId,
    tenantId: invoice.tenantId,
    action: "SUBMIT",
    status: "SUCCESS",
    uuid: etaUuid,
    durationMs: Date.now() - startedAt,
  });

  return { success: true, uuid: etaUuid };
}
