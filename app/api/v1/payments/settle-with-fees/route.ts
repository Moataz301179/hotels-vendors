import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission, audit } from "@/lib/api-utils";
import { settleInvoiceWithFees } from "@/lib/fintech/fee-calculator";
import { reconcileOrderGrnInvoice, applyReconciliationToInvoice } from "@/lib/reconciliation-guard";
import { z } from "zod";

const SettleWithFeesSchema = z.object({
  invoiceId: z.string().min(1),
  skipReconciliation: z.boolean().optional().default(false),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "payment:create");

  const body = await request.json();
  const { invoiceId, skipReconciliation } = SettleWithFeesSchema.parse(body);

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      order: { include: { grns: { select: { id: true }, take: 1 } } },
    },
  });

  if (!invoice || invoice.tenantId !== auth.tenantId) {
    return error("Invoice not found", 404);
  }

  if (invoice.paymentStatus === "PAID" || invoice.paymentStatus === "FACTORED") {
    return error("Invoice already settled", 409);
  }

  if (!skipReconciliation && invoice.order.grns.length > 0) {
    const grnId = invoice.order.grns[0].id;
    const reconciliation = await reconcileOrderGrnInvoice(
      invoice.orderId,
      grnId,
      invoice.id
    );

    if (reconciliation.status === "DISPUTE_RECONCILIATION") {
      await applyReconciliationToInvoice(reconciliation);
      return error(
        `Reconciliation variance ${reconciliation.totalVariancePercent}% exceeds threshold. ` +
        `Invoice moved to DISPUTE. Set skipReconciliation=true to override.`,
        409
      );
    }
  }

  try {
    const result = await settleInvoiceWithFees(invoiceId, auth.tenantId);

    await audit({
      entityType: "SETTLEMENT",
      entityId: invoiceId,
      action: "SETTLE_WITH_FEES",
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.platformRole,
      afterState: {
        paymentId: result.paymentId,
        journalEntryId: result.journalEntryId,
        invoiceId,
      },
      ipAddress: request.headers.get("x-forwarded-for") || null,
      userAgent: request.headers.get("user-agent"),
    });

    return success({
      paymentId: result.paymentId,
      journalEntryId: result.journalEntryId,
      message: "Invoice settled with 1% infrastructure fee split applied",
    }, 201);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Settlement failed";
    return error(message, 500);
  }
});
