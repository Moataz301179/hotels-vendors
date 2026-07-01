import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission } from "@/lib/api-utils";
import { reconcileOrderGrnInvoice, applyReconciliationToInvoice } from "@/lib/reconciliation-guard";
import { z } from "zod";

const ReconcileSchema = z.object({
  orderId: z.string().min(1),
  grnId: z.string().min(1),
  invoiceId: z.string().min(1),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invoice:read");

  const body = await request.json();
  const { orderId, grnId, invoiceId } = ReconcileSchema.parse(body);

  const [order, grn, invoice] = await Promise.all([
    prisma.order.findUnique({ where: { id: orderId }, select: { tenantId: true } }),
    prisma.grn.findUnique({ where: { id: grnId }, select: { tenantId: true } }),
    prisma.invoice.findUnique({ where: { id: invoiceId }, select: { tenantId: true } }),
  ]);

  if (!order || order.tenantId !== auth.tenantId) return error("Order not found", 404);
  if (!grn || grn.tenantId !== auth.tenantId) return error("GRN not found", 404);
  if (!invoice || invoice.tenantId !== auth.tenantId) return error("Invoice not found", 404);

  const result = await reconcileOrderGrnInvoice(orderId, grnId, invoiceId);

  if (result.status === "DISPUTE_RECONCILIATION") {
    await applyReconciliationToInvoice(result);

    return success({
      result,
      action: "FACTORING_BLOCKED",
      message: `Reconciliation variance ${result.totalVariancePercent}% exceeds threshold. Invoice moved to DISPUTE_RECONCILIATION, factoring triggers disabled.`,
    });
  }

  return success({
    result,
    action: "RECONCILIATION_PASSED",
    message: `Reconciliation variance ${result.totalVariancePercent}%. No action required.`,
  });
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invoice:read");

  const invoiceId = request.nextUrl.searchParams.get("invoiceId");
  if (!invoiceId) return error("Missing invoiceId query parameter", 400);

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId, tenantId: auth.tenantId },
    select: { id: true, status: true, factoringStatus: true },
  });

  if (!invoice) return error("Invoice not found", 404);

  const grns = await prisma.grn.findMany({
    where: { order: { invoices: { some: { id: invoiceId } } } },
    select: { id: true, grnNumber: true, status: true },
  });

  const discrepancies = await prisma.auditLog.findMany({
    where: {
      entityType: "RECONCILIATION",
      entityId: invoiceId,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return success({ invoice, grns, reconciliationLogs: discrepancies });
});
