/**
 * Invoice Access Guard — Pre-Action Compliance Checks
 * Hotels Vendors Compliance Layer
 *
 * Validates that a user can perform an action on an invoice before execution.
 * Used by API routes to enforce ownership, status, and authority rules.
 *
 * LEGAL: "Restaurants for E-Marketing operates strictly as a technical data
 * orchestrator. Zero liability for counterparty collection defaults."
 */

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { validateInvoiceForEta } from "./eta-validator";
import type { InvoiceWithItems } from "./eta-validator";

// ─────────────────────────────────────────
// 1. CUSTOM ERROR TYPES
// ─────────────────────────────────────────

export class InvoiceAccessError extends Error {
  constructor(message: string, public code: string, public statusCode: number = 403) {
    super(message);
    this.name = "InvoiceAccessError";
  }
}

// ─────────────────────────────────────────
// 2. LOAD HELPER
// ─────────────────────────────────────────

async function loadInvoice(invoiceId: string) {
  return prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      factoringRequests: {
        where: { status: { in: ["PENDING", "UNDER_REVIEW", "APPROVED", "DISBURSED"] } },
        select: { id: true },
      },
    },
  });
}

// ─────────────────────────────────────────
// 3. ASSERT CAN SUBMIT INVOICE TO ETA
// ─────────────────────────────────────────

/**
 * Assert that a user can submit this invoice to ETA.
 *
 * Checks:
 *   - Invoice exists
 *   - User owns the invoice (supplier role → must own the supplier) or is ADMIN
 *   - Invoice status is DRAFT or ISSUED (not already submitted/validated)
 *   - All ETA required fields are present (via validateInvoiceForEta)
 *
 * Throws InvoiceAccessError on any violation.
 */
export async function assertCanSubmitInvoice(
  invoiceId: string,
  userId: string,
  userRole: string
): Promise<void> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      supplier: { select: { id: true } },
      hotel: { select: { id: true } },
      order: {
        include: {
          items: {
            include: {
              product: { select: { id: true, hsCode: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!invoice) {
    throw new InvoiceAccessError("Invoice not found", "INVOICE_NOT_FOUND", 404);
  }

  // Ownership check: non-admin users must own the supplier
  if (userRole !== "ADMIN") {
    // For SUPPLIER role: check if the user is linked to this invoice's supplier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { supplierId: true, platformRole: true },
    });

    if (!user) {
      throw new InvoiceAccessError("User not found", "USER_NOT_FOUND", 401);
    }

    if (user.platformRole === "SUPPLIER" && user.supplierId !== invoice.supplierId) {
      throw new InvoiceAccessError(
        "You do not have permission to submit this invoice to ETA",
        "NOT_INVOICE_OWNER",
        403
      );
    }

    if (user.platformRole === "HOTEL") {
      throw new InvoiceAccessError(
        "Hotels cannot submit invoices to ETA — only suppliers may submit",
        "ROLE_NOT_AUTHORIZED",
        403
      );
    }
  }

  // Status check: only DRAFT or ISSUED invoices can be submitted
  const allowedStatuses = ["DRAFT", "ISSUED"];
  if (!allowedStatuses.includes(invoice.status)) {
    throw new InvoiceAccessError(
      `Invoice status '${invoice.status}' does not allow ETA submission. Allowed: ${allowedStatuses.join(", ")}`,
      "INVALID_STATUS",
      409
    );
  }

  // ETA-specific status check: not already submitted
  const nonSubmitEtaStatuses = ["SUBMITTING", "ACCEPTED", "VALIDATED"];
  if (nonSubmitEtaStatuses.includes(invoice.etaStatus)) {
    throw new InvoiceAccessError(
      `Invoice ETA status '${invoice.etaStatus}' prevents resubmission`,
      "ALREADY_SUBMITTED",
      409
    );
  }

  // Full ETA validation
  const fullInvoice = invoice as unknown as InvoiceWithItems;
  const validation = validateInvoiceForEta(fullInvoice);
  if (!validation.valid) {
    throw new InvoiceAccessError(
      `Invoice not ETA-compliant: ${validation.errors.join("; ")}`,
      "ETA_VALIDATION_FAILED",
      422
    );
  }
}

// ─────────────────────────────────────────
// 4. ASSERT CAN REQUEST FACTORING
// ─────────────────────────────────────────

/**
 * Assert that a user can request factoring for this invoice.
 *
 * Checks:
 *   - User has `canRequestFactoring` in their AuthorityRule
 *   - invoice.netPayable <= authority.maxFactoringAmount (if set)
 *   - invoice.etaStatus is VALIDATED (only Evalidated invoices are factorable)
 *   - No existing active FactoringRequest for this invoice
 *
 * Throws InvoiceAccessError on any violation.
 */
export async function assertCanRequestFactoring(
  invoiceId: string,
  userId: string,
  userRole: string,
  authority: {
    canRequestFactoring: boolean;
    maxFactoringAmount: Prisma.Decimal | null;
  }
): Promise<void> {
  // Authority check: user must have factoring permission
  if (!authority.canRequestFactoring) {
    throw new InvoiceAccessError(
      "Your role does not have permission to request factoring",
      "NO_FACTORING_AUTHORITY",
      403
    );
  }

  // Load invoice
  const invoice = await loadInvoice(invoiceId);

  if (!invoice) {
    throw new InvoiceAccessError("Invoice not found", "INVOICE_NOT_FOUND", 404);
  }

  // ETA status check: invoice must be validated (InvoiceStatus.VALVED) or ETA-accepted
  const isEligible =
    invoice.status === "VALIDATED" || invoice.etaStatus === "ACCEPTED";
  if (!isEligible) {
    throw new InvoiceAccessError(
      `Invoice must be VALIDATED to request factoring. Current status: ${invoice.status}, ETA: ${invoice.etaStatus}`,
      "ETA_NOT_VALIDATED",
      409
    );
  }

  // Amount check: netPayable must not exceed maxFactoringAmount
  if (authority.maxFactoringAmount) {
    const netPayable = invoice.netPayable || invoice.total;
    if (netPayable.greaterThan(authority.maxFactoringAmount)) {
      throw new InvoiceAccessError(
        `Invoice net payable (${netPayable.toString()} EGP) exceeds your maximum factoring amount (${authority.maxFactoringAmount.toString()} EGP)`,
        "AMOUNT_EXCEEDS_LIMIT",
        422
      );
    }
  }

  // Existing factoring request check
  if (invoice.factoringRequests && invoice.factoringRequests.length > 0) {
    throw new InvoiceAccessError(
      "An active factoring request already exists for this invoice",
      "FACTORING_ALREADY_REQUESTED",
      409
    );
  }
}
