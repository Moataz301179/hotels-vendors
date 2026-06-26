/**
 * ETA API Client
 * Hotels Vendors Compliance Layer
 *
 * HTTP client for Egyptian Tax Authority e-invoicing API.
 * Handles authentication, submission, validation, and callback processing.
 */

import { EtaStatus } from "@prisma/client";
import type {
  EtaInvoicePayload,
  EtaSubmissionResponse,
  EtaConfig,
  EtaDocumentStatus,
} from "./types";

// ─────────────────────────────────────────
// 1. CONFIGURATION
// ─────────────────────────────────────────

const ETA_CONFIG: EtaConfig = {
  baseUrl: process.env.ETA_API_URL || "https://api.preprod.invoicing.eta.gov.eg",
  authUrl: process.env.ETA_AUTH_URL || "https://id.preprod.eta.gov.eg",
  apiVersion: "api/v1",
  clientId: process.env.ETA_CLIENT_ID || "",
  clientSecret: process.env.ETA_CLIENT_SECRET || "",
  timeoutMs: 30000,
  maxRetries: 3,
  retryDelayMs: 2000,
};

const STUB_MODE =
  process.env.ETA_STUB_MODE === "true" ||
  (!process.env.ETA_CLIENT_ID && !process.env.ETA_CLIENT_SECRET);

function assertLiveInProduction(): void {
  if (STUB_MODE && process.env.NODE_ENV === "production") {
    throw new Error("[ETA] STUB_MODE enabled in production — refusing to start. Set ETA_CLIENT_ID + ETA_CLIENT_SECRET + ETA_STUB_MODE=false.");
  }
  if (STUB_MODE && process.env.NODE_ENV === "development") {
    console.log(
      "[ETA] Running in STUB MODE — no real ETA API calls. Set ETA_CLIENT_ID + ETA_CLIENT_SECRET + ETA_STUB_MODE=false to use the real sandbox."
    );
  }
}

function generateStubUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─────────────────────────────────────────
// 2. AUTHENTICATION
// ─────────────────────────────────────────

interface EtaTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if valid
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token;
  }

  const url = `${ETA_CONFIG.authUrl}/connect/token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: ETA_CONFIG.clientId,
    client_secret: ETA_CONFIG.clientSecret,
  });

  const response = await fetchWithRetry(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`ETA auth failed: ${response.status} ${await response.text()}`);
  }

  const data: EtaTokenResponse = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

// ─────────────────────────────────────────
// 3. HTTP CLIENT
// ─────────────────────────────────────────

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = ETA_CONFIG.maxRetries
): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ETA_CONFIG.timeoutMs);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (retries > 0) {
      await delay(ETA_CONFIG.retryDelayMs * (ETA_CONFIG.maxRetries - retries + 1));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function etaFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  const url = `${ETA_CONFIG.baseUrl}/${ETA_CONFIG.apiVersion}${path}`;

  return fetchWithRetry(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

// ─────────────────────────────────────────
// 4. API METHODS
// ─────────────────────────────────────────

/**
 * Submit an invoice to the ETA.
 */
export async function submitInvoice(
  payload: EtaInvoicePayload
): Promise<EtaSubmissionResponse> {
  assertLiveInProduction();
  if (STUB_MODE) {
    const now = new Date().toISOString();
    const uuid = generateStubUuid();
    return {
      submissionId: `stub-${uuid}`,
      uuid,
      longId: `STUB-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      internalId: `INT-${Date.now()}`,
      typeName: "Invoice",
      typeVersionName: "1.0",
      issuerId: payload.issuer?.id || "ISSUER-001",
      issuerName: payload.issuer?.name || "Hotel",
      receiverId: payload.receiver?.id || "RECEIVER-001",
      receiverName: payload.receiver?.name || "Supplier",
      dateTimeIssued: now,
      dateTimeReceived: now,
      totalSales: payload.totalSalesAmount || 0,
      totalDiscount: payload.totalDiscountAmount || 0,
      netAmount: payload.netAmount || 0,
      total: payload.totalAmount || 0,
      status: "Submitted",
      documentCount: 1,
    };
  }

  const response = await etaFetch("/documentsubmissions", {
    method: "POST",
    body: JSON.stringify({
      documents: [payload],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ETA submission failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  // ETA returns an array of accepted documents
  const accepted = data.acceptedDocuments?.[0];
  if (!accepted) {
    const rejected = data.rejectedDocuments?.[0];
    throw new Error(
      `ETA rejected invoice: ${rejected?.error?.message || "Unknown rejection"}`
    );
  }

  return {
    submissionId: data.submissionId,
    uuid: accepted.uuid,
    longId: accepted.longId,
    internalId: accepted.internalId,
    typeName: accepted.typeName,
    typeVersionName: accepted.typeVersionName,
    issuerId: accepted.issuerId,
    issuerName: accepted.issuerName,
    receiverId: accepted.receiverId,
    receiverName: accepted.receiverName,
    dateTimeIssued: accepted.dateTimeIssued,
    dateTimeReceived: data.dateTimeReceived,
    totalSales: accepted.totalSales,
    totalDiscount: accepted.totalDiscount,
    netAmount: accepted.netAmount,
    total: accepted.total,
    status: "Submitted",
    documentCount: data.documentCount,
  };
}

/**
 * Get an invoice by UUID from ETA.
 */
export async function getInvoice(
  uuid: string
): Promise<EtaSubmissionResponse | null> {
  assertLiveInProduction();
  if (STUB_MODE) {
    return {
      submissionId: `stub-${uuid}`,
      uuid,
      longId: `STUB-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      internalId: `INT-${Date.now()}`,
      typeName: "Invoice",
      typeVersionName: "1.0",
      issuerId: "ISSUER-001",
      issuerName: "Hotel",
      receiverId: "RECEIVER-001",
      receiverName: "Supplier",
      dateTimeIssued: new Date().toISOString(),
      dateTimeReceived: new Date().toISOString(),
      totalSales: 0,
      totalDiscount: 0,
      netAmount: 0,
      total: 0,
      status: "Valid",
      documentCount: 1,
      dateTimeValidated: new Date().toISOString(),
    };
  }

  const response = await etaFetch(`/documents/${uuid}/raw`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ETA get invoice failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return {
    submissionId: data.submissionId || "",
    uuid: data.uuid,
    longId: data.longId,
    internalId: data.internalId,
    typeName: data.typeName,
    typeVersionName: data.typeVersionName,
    issuerId: data.issuer?.id,
    issuerName: data.issuer?.name,
    receiverId: data.receiver?.id,
    receiverName: data.receiver?.name,
    dateTimeIssued: data.dateTimeIssued,
    dateTimeReceived: data.dateTimeReceived,
    totalSales: data.totalSales,
    totalDiscount: data.totalDiscount,
    netAmount: data.netAmount,
    total: data.total,
    status: data.status,
    documentCount: 1,
    dateTimeValidated: data.dateTimeValidated,
    rejectionReasons: data.rejectionReasons,
  };
}

/**
 * Get invoice status by UUID.
 */
export async function getInvoiceStatus(
  uuid: string
): Promise<EtaDocumentStatus | null> {
  assertLiveInProduction();
  if (STUB_MODE) {
    return "Valid";
  }

  const response = await etaFetch(`/documents/${uuid}/status`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`ETA status check failed: ${response.status}`);
  }

  const data = await response.json();
  return data.status as EtaDocumentStatus;
}

/**
 * Cancel a submitted invoice (before validation).
 */
export async function cancelInvoice(uuid: string, reason: string): Promise<void> {
  assertLiveInProduction();
  if (STUB_MODE) {
    return;
  }

  const response = await etaFetch(`/documents/${uuid}/cancel`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error(
      `ETA cancel failed: ${response.status} ${await response.text()}`
    );
  }
}

/**
 * Reject a received invoice.
 */
export async function rejectInvoice(uuid: string, reason: string): Promise<void> {
  assertLiveInProduction();
  if (STUB_MODE) {
    return;
  }

  const response = await etaFetch(`/documents/${uuid}/reject`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error(
      `ETA reject failed: ${response.status} ${await response.text()}`
    );
  }
}

// ─────────────────────────────────────────
// 5. CALLBACK HANDLER
// ─────────────────────────────────────────

export interface EtaCallbackPayload {
  uuid: string;
  status: EtaDocumentStatus;
  dateTimeValidated?: string;
  rejectionReasons?: { error: string; errorCode: string }[];
}

/**
 * Process an ETA callback/webhook.
 * Updates the local invoice record with ETA status.
 *
 * TENANT VERIFICATION: Validates that the invoice belongs to an active tenant
 * before any state mutation. This is a defense-in-depth measure — the HTTP layer
 * (callback route) handles HMAC verification, but this function ensures tenant
 * integrity for any internal callers.
 */
export async function processCallback(payload: EtaCallbackPayload): Promise<void> {
  assertLiveInProduction();
  const { prisma } = await import("@/lib/prisma");

  const invoice = await prisma.invoice.findUnique({
    where: { etaUuid: payload.uuid },
    include: { tenant: { select: { id: true, status: true } } },
  });

  if (!invoice) {
    throw new Error(`Invoice not found for ETA UUID: ${payload.uuid}`);
  }

  // TENANT VERIFICATION: Ensure the invoice's tenant is valid and active
  if (!invoice.tenant || invoice.tenant.status !== "ACTIVE") {
    throw new Error(
      `ETA callback rejected: invoice ${invoice.id} belongs to inactive/missing tenant`
    );
  }

  // Idempotency check: skip if this exact callback was already processed
  let existingLog: Record<string, unknown> = {};
  try {
    existingLog = invoice.submissionLog ? JSON.parse(invoice.submissionLog) : {};
  } catch {
    // Malformed log — continue processing
  }
  if (
    existingLog.lastCallback &&
    (existingLog.lastCallback as Record<string, unknown>).uuid === payload.uuid &&
    (existingLog.lastCallback as Record<string, unknown>).status === payload.status
  ) {
    return; // Already processed this exact callback
  }

  // Map ETA status to internal status
  const etaStatusMap: Record<string, EtaStatus> = {
    Submitted: "SUBMITTING",
    Valid: "ACCEPTED",
    Invalid: "REJECTED",
    Rejected: "REJECTED",
    Cancelled: "MANUAL_RESOLUTION",
  };

  const newEtaStatus = etaStatusMap[payload.status] ?? "RETRYING";

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      etaStatus: newEtaStatus,
      submissionLog: JSON.stringify({
        ...existingLog,
        lastCallback: payload,
        updatedAt: new Date().toISOString(),
      }),
    },
  });

  // Write audit log
  await prisma.auditLog.create({
    data: {
      entityType: "INVOICE",
      entityId: invoice.id,
      action: "ETA_CALLBACK_PROCESSED",
      tenantId: invoice.tenantId,
      actorId: "system",
      actorRole: "SYSTEM",
      beforeState: JSON.stringify({ etaStatus: invoice.etaStatus }),
      afterState: JSON.stringify({ etaStatus: newEtaStatus }),
    },
  });
}

// ─────────────────────────────────────────
// 6. EXPORT
// ─────────────────────────────────────────

export function getEtaStatus(): {
  mode: "stub" | "live";
  configured: boolean;
  baseUrl: string;
  authUrl: string;
} {
  return {
    mode: STUB_MODE ? "stub" : "live",
    configured: Boolean(process.env.ETA_CLIENT_ID && process.env.ETA_CLIENT_SECRET),
    baseUrl: ETA_CONFIG.baseUrl,
    authUrl: ETA_CONFIG.authUrl,
  };
}

export const etaClient = {
  submitInvoice,
  getInvoice,
  getInvoiceStatus,
  cancelInvoice,
  rejectInvoice,
  processCallback,
  getEtaStatus,
};
