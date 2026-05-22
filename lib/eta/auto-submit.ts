/**
 * ETA Auto-Submission Orchestrator
 * Hotels Vendors Compliance Layer
 *
 * Triggered when an order is marked DELIVERED.
 * 1. Auto-creates invoice from order (if not exists)
 * 2. Runs pre-submission audit
 * 3. Queues ETA submission if audit passes
 * 4. Logs everything
 */

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { runPreSubmissionAudit, ensureDigitalSignature, type AuditReport } from "./audit";
import { addEtaSubmissionJob } from "./queue";

export interface AutoSubmitResult {
  success: boolean;
  invoiceId?: string;
  auditReport?: AuditReport;
  queued?: boolean;
  message: string;
  errorCode?:
    | "INVOICE_CREATION_FAILED"
    | "AUDIT_FAILED"
    | "QUEUE_FAILED"
    | "ALREADY_SUBMITTED"
    | "INTERNAL_ERROR";
}

/**
 * Orchestrate the full auto-submission flow for a delivered order.
 * This is the SINGLE ENTRY POINT called from the order status handler.
 */
export async function orchestrateEtaAutoSubmit(
  orderId: string,
  actorContext: { userId: string; tenantId: string; platformRole: string }
): Promise<AutoSubmitResult> {
  try {
    // ── Step 1: Find or create invoice ──
    let invoice = await prisma.invoice.findFirst({
      where: { orderId },
      include: { hotel: true, supplier: true },
    });

    if (!invoice) {
      invoice = await createInvoiceFromOrder(orderId);
      if (!invoice) {
        return {
          success: false,
          message: "Failed to auto-create invoice from delivered order",
          errorCode: "INVOICE_CREATION_FAILED",
        };
      }
    }

    // Already submitted?
    if (invoice.etaUuid || ["SUBMITTING", "ACCEPTED"].includes(invoice.etaStatus)) {
      return {
        success: true,
        invoiceId: invoice.id,
        message: `Invoice already submitted to ETA (status: ${invoice.etaStatus})`,
      };
    }

    // ── Step 2: Ensure digital signature ──
    await ensureDigitalSignature(invoice.id);

    // ── Step 3: Run comprehensive audit ──
    const auditReport = await runPreSubmissionAudit(invoice.id);

    if (!auditReport.passedAll) {
      // Log blocked submission
      await prisma.auditLog.create({
        data: {
          entityType: "INVOICE",
          entityId: invoice.id,
          action: "ETA_SUBMIT_BLOCKED",
          tenantId: actorContext.tenantId,
          actorId: actorContext.userId,
          actorRole: actorContext.platformRole,
          afterState: JSON.stringify({
            reason: "AUDIT_FAILED",
            criticalFailures: auditReport.criticalFailures,
            failures: auditReport.results.filter((r) => !r.passed).map((r) => ({
              assertion: r.assertion,
              message: r.message,
            })),
          }),
        },
      });

      return {
        success: false,
        invoiceId: invoice.id,
        auditReport,
        message: `ETA submission blocked: ${auditReport.criticalFailures} critical audit failure(s)`,
        errorCode: "AUDIT_FAILED",
      };
    }

    // ── Step 4: Queue ETA submission ──
    try {
      await addEtaSubmissionJob({
        invoiceId: invoice.id,
        tenantId: actorContext.tenantId,
        userId: actorContext.userId,
        platformRole: actorContext.platformRole,
      });

      // Update invoice status to reflect it's in the queue
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { etaStatus: "SUBMITTING", status: "SUBMITTED" },
      });

      await prisma.auditLog.create({
        data: {
          entityType: "INVOICE",
          entityId: invoice.id,
          action: "ETA_SUBMIT_QUEUED",
          tenantId: actorContext.tenantId,
          actorId: actorContext.userId,
          actorRole: actorContext.platformRole,
          afterState: JSON.stringify({ etaStatus: "SUBMITTING", auditPassed: true }),
        },
      });

      return {
        success: true,
        invoiceId: invoice.id,
        auditReport,
        queued: true,
        message: "Invoice passed audit and queued for ETA submission",
      };
    } catch (queueErr) {
      const msg = queueErr instanceof Error ? queueErr.message : "Queue error";
      return {
        success: false,
        invoiceId: invoice.id,
        auditReport,
        message: `Audit passed but queue failed: ${msg}`,
        errorCode: "QUEUE_FAILED",
      };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      message: `Auto-submission orchestration failed: ${msg}`,
      errorCode: "INTERNAL_ERROR",
    };
  }
}

// ── Helper: Create invoice from order ──

async function createInvoiceFromOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      hotel: true,
      supplier: true,
      items: { include: { product: true } },
    },
  });

  if (!order) return null;

  // Compute totals
  const subtotal = order.items.reduce(
    (sum, item) => sum + new Prisma.Decimal(item.unitPrice).mul(item.quantity).toNumber(),
    0
  );
  const vatRate = 14; // Egypt standard VAT
  const vatAmount = new Prisma.Decimal(subtotal).mul(vatRate).div(100);
  const total = new Prisma.Decimal(subtotal).add(vatAmount);

  // Generate invoice number: INV-YYYYMMDD-XXXX
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  const invoiceNumber = `INV-${dateStr}-${random}`;

  try {
    const invoice = await prisma.invoice.create({
      data: {
        tenantId: order.tenantId,
        invoiceNumber,
        orderId: order.id,
        hotelId: order.hotelId,
        supplierId: order.supplierId,
        subtotal: new Prisma.Decimal(subtotal.toFixed(2)),
        vatRate: new Prisma.Decimal(vatRate),
        vatAmount: vatAmount,
        total: total,
        currency: "EGP",
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30
        status: "DRAFT",
        paymentStatus: "UNPAID",
        etaStatus: "PENDING",
        factoringStatus: "NOT_FACTORABLE",
      },
      include: { hotel: true, supplier: true },
    });

    return invoice;
  } catch (err) {
    console.error("[ETA-AUTO] Invoice creation failed:", err);
    return null;
  }
}
