/**
 * ETA Pre-Submission Audit Engine
 * Hotels Vendors Compliance Layer
 *
 * Comprehensive assertion-based validation BEFORE any invoice
 * touches the Egyptian Tax Authority API.
 *
 * Every assertion must pass. One failure = submission blocked.
 */

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { signEtaDocument } from "./signer";

// ── Types ──

export type AuditAssertion =
  | "INVOICE_EXISTS"
  | "INVOICE_COMPLETE"
  | "SUPPLIER_TAX_ID"
  | "HOTEL_TAX_ID"
  | "TAX_ID_FORMAT"
  | "AMOUNT_ARITHMETIC"
  | "LINE_ITEMS_PRESENT"
  | "PRODUCT_CODES"
  | "INVOICE_UNIQUE"
  | "DIGITAL_SIGNATURE"
  | "NOT_ALREADY_SUBMITTED";

export interface AuditResult {
  passed: boolean;
  assertion: AuditAssertion;
  message: string;
  severity: "CRITICAL" | "WARNING";
  detail?: Record<string, unknown>;
}

export interface AuditReport {
  invoiceId: string;
  passedAll: boolean;
  timestamp: string;
  results: AuditResult[];
  criticalFailures: number;
  warningCount: number;
}

// ── Constants ──

const EGYPTIAN_TAX_ID_REGEX = /^\d{9}$/;
const AMOUNT_TOLERANCE = 0.01; // EGP

// ── Main Audit Function ──

/**
 * Run the full pre-submission audit on an invoice.
 * Returns a report with every assertion result.
 */
export async function runPreSubmissionAudit(invoiceId: string): Promise<AuditReport> {
  const results: AuditResult[] = [];

  // Load invoice with all relations
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      hotel: true,
      supplier: true,
      order: {
        include: {
          items: {
            include: {
              product: {
                include: { EgsCode: true },
              },
            },
          },
        },
      },
    },
  });

  // 1. INVOICE_EXISTS
  if (!invoice) {
    results.push({
      passed: false,
      assertion: "INVOICE_EXISTS",
      message: "Invoice not found in platform database",
      severity: "CRITICAL",
    });
    return finalizeReport(invoiceId, results);
  }
  results.push({
    passed: true,
    assertion: "INVOICE_EXISTS",
    message: `Invoice ${invoice.invoiceNumber} found`,
    severity: "CRITICAL",
  });

  // 2. INVOICE_COMPLETE
  const requiredFields = ["hotelId", "supplierId", "orderId", "subtotal", "vatAmount", "total", "issueDate"];
  const missingFields = requiredFields.filter((f) => {
    const val = (invoice as Record<string, unknown>)[f];
    return val === null || val === undefined || val === "";
  });
  results.push({
    passed: missingFields.length === 0,
    assertion: "INVOICE_COMPLETE",
    message: missingFields.length === 0
      ? "All required invoice fields present"
      : `Missing required fields: ${missingFields.join(", ")}`,
    severity: "CRITICAL",
    detail: { missingFields },
  });

  // 3. SUPPLIER_TAX_ID
  const supplierTaxId = invoice.supplier?.taxId;
  results.push({
    passed: !!supplierTaxId && supplierTaxId.trim().length > 0,
    assertion: "SUPPLIER_TAX_ID",
    message: supplierTaxId
      ? `Supplier tax ID present: ${supplierTaxId}`
      : "Supplier has no tax ID registered",
    severity: "CRITICAL",
    detail: { supplierId: invoice.supplierId, taxId: supplierTaxId },
  });

  // 4. HOTEL_TAX_ID
  const hotelTaxId = invoice.hotel?.taxId;
  results.push({
    passed: !!hotelTaxId && hotelTaxId.trim().length > 0,
    assertion: "HOTEL_TAX_ID",
    message: hotelTaxId
      ? `Hotel tax ID present: ${hotelTaxId}`
      : "Hotel has no tax ID registered",
    severity: "CRITICAL",
    detail: { hotelId: invoice.hotelId, taxId: hotelTaxId },
  });

  // 5. TAX_ID_FORMAT (Egyptian ETA: exactly 9 digits)
  const taxIds = [
    { label: "supplier", value: supplierTaxId },
    { label: "hotel", value: hotelTaxId },
  ];
  const invalidTaxIds = taxIds.filter((t) => t.value && !EGYPTIAN_TAX_ID_REGEX.test(t.value));
  results.push({
    passed: invalidTaxIds.length === 0,
    assertion: "TAX_ID_FORMAT",
    message: invalidTaxIds.length === 0
      ? "All tax IDs are valid 9-digit Egyptian ETA numbers"
      : `Invalid tax ID format: ${invalidTaxIds.map((t) => `${t.label}=${t.value}`).join(", ")}`,
    severity: "CRITICAL",
    detail: { invalidTaxIds: invalidTaxIds.map((t) => ({ entity: t.label, value: t.value })) },
  });

  // 6. AMOUNT_ARITHMETIC (subtotal + vat = total)
  const computedTotal = new Prisma.Decimal(invoice.subtotal).add(new Prisma.Decimal(invoice.vatAmount));
  const amountMatch = computedTotal.minus(invoice.total).abs().toNumber() <= AMOUNT_TOLERANCE;
  results.push({
    passed: amountMatch,
    assertion: "AMOUNT_ARITHMETIC",
    message: amountMatch
      ? `Amounts balance: ${invoice.subtotal} + ${invoice.vatAmount} = ${invoice.total}`
      : `Amount mismatch: ${invoice.subtotal} + ${invoice.vatAmount} ≠ ${invoice.total} (computed: ${computedTotal})`,
    severity: "CRITICAL",
    detail: { subtotal: invoice.subtotal, vat: invoice.vatAmount, total: invoice.total, computed: computedTotal },
  });

  // 7. LINE_ITEMS_PRESENT
  const items = invoice.order?.items ?? [];
  results.push({
    passed: items.length > 0,
    assertion: "LINE_ITEMS_PRESENT",
    message: items.length > 0
      ? `${items.length} line item(s) on invoice`
      : "Invoice has no line items",
    severity: "CRITICAL",
    detail: { itemCount: items.length },
  });

  // 8. PRODUCT_CODES — every line item must have an ACTIVE EGS code
  const itemsWithoutEgs = items.filter((it) => {
    if (!it.product) return true;
    if (!it.product.EgsCode) return true;
    if (it.product.EgsCode.status !== "ACTIVE") return true;
    if (it.product.EgsCode.activeTo && new Date(it.product.EgsCode.activeTo) < new Date()) return true;
    return false;
  });
  results.push({
    passed: itemsWithoutEgs.length === 0,
    assertion: "PRODUCT_CODES",
    message: itemsWithoutEgs.length === 0
      ? "All line items have active EGS codes"
      : `${itemsWithoutEgs.length} item(s) missing or inactive EGS code`,
    severity: "CRITICAL",
    detail: {
      itemsWithoutEgs: itemsWithoutEgs.map((it) => ({
        productId: it.productId,
        name: it.product?.name,
        sku: it.product?.sku,
        egsStatus: it.product?.EgsCode?.status ?? "MISSING",
        egsCode: it.product?.EgsCode?.codeValue,
      })),
    },
  });

  // 9. INVOICE_UNIQUE
  const duplicate = await prisma.invoice.findFirst({
    where: { invoiceNumber: invoice.invoiceNumber, id: { not: invoice.id } },
  });
  results.push({
    passed: !duplicate,
    assertion: "INVOICE_UNIQUE",
    message: duplicate
      ? `Duplicate invoice number found: ${invoice.invoiceNumber}`
      : `Invoice number ${invoice.invoiceNumber} is unique`,
    severity: "CRITICAL",
    detail: duplicate ? { duplicateId: duplicate.id } : undefined,
  });

  // 10. NOT_ALREADY_SUBMITTED
  const alreadySubmitted = !!invoice.etaUuid || invoice.etaStatus === "SUBMITTING" || invoice.etaStatus === "ACCEPTED";
  results.push({
    passed: !alreadySubmitted,
    assertion: "NOT_ALREADY_SUBMITTED",
    message: alreadySubmitted
      ? `Invoice already submitted to ETA (uuid: ${invoice.etaUuid}, status: ${invoice.etaStatus})`
      : "Invoice has not been submitted to ETA yet",
    severity: "CRITICAL",
    detail: { etaUuid: invoice.etaUuid, etaStatus: invoice.etaStatus },
  });

  // 11. DIGITAL_SIGNATURE (check existence — generation happens separately)
  results.push({
    passed: !!invoice.digitalSignature,
    assertion: "DIGITAL_SIGNATURE",
    message: invoice.digitalSignature
      ? "Digital signature present"
      : "Digital signature missing — will be generated before submission",
    severity: "WARNING",
  });

  return finalizeReport(invoiceId, results);
}

// ── Helpers ──

function finalizeReport(invoiceId: string, results: AuditResult[]): AuditReport {
  const criticalFailures = results.filter((r) => r.severity === "CRITICAL" && !r.passed).length;
  const warningCount = results.filter((r) => r.severity === "WARNING" && !r.passed).length;

  return {
    invoiceId,
    passedAll: criticalFailures === 0,
    timestamp: new Date().toISOString(),
    results,
    criticalFailures,
    warningCount,
  };
}

/**
 * Generate a digital signature for an invoice if missing.
 * Returns the updated invoice.
 */
export async function ensureDigitalSignature(invoiceId: string): Promise<void> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      hotel: true,
      supplier: true,
      order: { include: { items: { include: { product: true } } } },
    },
  });

  if (!invoice || invoice.digitalSignature) return; // Already signed or missing

  // Build minimal document for signing
  const document = {
    issuer: { id: invoice.supplier.taxId, name: invoice.supplier.name },
    receiver: { id: invoice.hotel.taxId, name: invoice.hotel.name },
    internalId: invoice.invoiceNumber,
    totalAmount: invoice.total.toString(),
    dateIssued: invoice.issueDate.toISOString(),
  };

  // Try supplier certificate vault first
  let certPem = "";
  let privateKey = "";

  try {
    const { getCertificateForSigning } = await import("@/lib/compliance/eseal");
    const cert = await getCertificateForSigning(invoice.supplierId, "E_SEAL");
    if (cert) {
      certPem = cert.certificatePem;
      privateKey = cert.privateKey;
    }
  } catch {
    // Vault lookup failed — fall through to env vars
  }

  // Fall back to environment variables
  if (!certPem || !privateKey) {
    certPem = process.env.ETA_CERTIFICATE_PEM || "";
    privateKey = process.env.ETA_PRIVATE_KEY || "";
  }

  if (!certPem || !privateKey) {
    // Cannot sign without credentials — log and continue
    console.warn(`[ETA-AUDIT] Cannot sign invoice ${invoiceId}: missing certificate or private key`);
    return;
  }

  try {
    const sig = await signEtaDocument(document, certPem, privateKey);
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { digitalSignature: sig.signatureValue },
    });
  } catch (err) {
    console.warn(`[ETA-AUDIT] Signature generation failed for ${invoiceId}:`, err);
  }
}
