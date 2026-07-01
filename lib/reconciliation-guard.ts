import { prisma } from "@/lib/prisma";

export enum ReconciliationStatus {
  MATCHED = "MATCHED",
  MINOR_DISCREPANCY = "MINOR_DISCREPANCY",
  DISPUTE_RECONCILIATION = "DISPUTE_RECONCILIATION",
}

export interface ReconciliationResult {
  status: ReconciliationStatus;
  orderId: string;
  grnId: string;
  invoiceId: string;
  discrepancies: Array<{
    sku: string;
    productName: string;
    orderedQty: number;
    receivedQty: number;
    invoicedQty: number;
    variance: number;
  }>;
  totalVariancePercent: number;
  blocksFactoring: boolean;
}

export async function reconcileOrderGrnInvoice(
  orderId: string,
  grnId: string,
  invoiceId: string
): Promise<ReconciliationResult> {
  const [order, grn, invoice] = await Promise.all([
    prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { select: { id: true, name: true, sku: true } } } },
      },
    }),
    prisma.grn.findUnique({
      where: { id: grnId },
      include: {
        items: { include: { product: { select: { id: true, name: true, sku: true } } } },
      },
    }),
    prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        order: {
          include: {
            items: { include: { product: { select: { id: true, name: true, sku: true } } } },
          },
        },
      },
    }),
  ]);

  if (!order || !grn || !invoice) {
    throw new Error("Order, GRN, or Invoice not found for reconciliation");
  }

  const discrepancies: ReconciliationResult["discrepancies"] = [];
  let totalVariancePercent = 0;
  let checkedItems = 0;

  for (const orderItem of order.items) {
    const sku = orderItem.product.sku;
    const orderedQty = orderItem.quantity;

    const grnItem = grn.items.find(
      (gi) => gi.orderItemId === orderItem.id
    );
    const receivedQty = grnItem?.receivedQuantity ?? 0;

    const invoiceOrderItem = invoice.order?.items.find(
      (ioi) => ioi.id === orderItem.id || ioi.productId === orderItem.productId
    );
    const invoicedQty = invoiceOrderItem?.quantity ?? orderedQty;

    const variance = Math.abs(receivedQty - orderedQty) + Math.abs(invoicedQty - receivedQty);

    if (variance > 0) {
      discrepancies.push({
        sku,
        productName: orderItem.product.name,
        orderedQty,
        receivedQty,
        invoicedQty,
        variance,
      });
    }

    totalVariancePercent += orderedQty > 0 ? (variance / orderedQty) * 100 : 0;
    checkedItems++;
  }

  totalVariancePercent = checkedItems > 0 ? totalVariancePercent / checkedItems : 0;

  let status: ReconciliationStatus;
  let blocksFactoring = false;

  if (totalVariancePercent === 0) {
    status = ReconciliationStatus.MATCHED;
  } else if (totalVariancePercent <= 0.01) {
    status = ReconciliationStatus.MINOR_DISCREPANCY;
  } else {
    status = ReconciliationStatus.DISPUTE_RECONCILIATION;
    blocksFactoring = true;
  }

  return {
    status,
    orderId,
    grnId,
    invoiceId,
    discrepancies,
    totalVariancePercent: Math.round(totalVariancePercent * 100) / 100,
    blocksFactoring,
  };
}

export async function applyReconciliationToInvoice(
  result: ReconciliationResult
): Promise<void> {
  if (result.status === ReconciliationStatus.DISPUTE_RECONCILIATION) {
    await prisma.$transaction([
      prisma.invoice.update({
        where: { id: result.invoiceId },
        data: {
          status: "DISPUTED",
          factoringStatus: "NOT_FACTORABLE",
        },
      }),
      prisma.grn.update({
        where: { id: result.grnId },
        data: { status: "DISPUTED" },
      }),
      prisma.order.update({
        where: { id: result.orderId },
        data: { status: "DISPUTED" },
      }),
      prisma.auditLog.create({
        data: {
          tenantId: (await prisma.order.findUnique({ where: { id: result.orderId }, select: { tenantId: true } }))!.tenantId,
          entityType: "RECONCILIATION",
          entityId: result.invoiceId,
          action: "DISPUTE_RECONCILIATION",
          actorId: "system",
          actorRole: "SYSTEM",
          afterState: JSON.stringify({
            totalVariancePercent: result.totalVariancePercent,
            discrepancyCount: result.discrepancies.length,
            blocksFactoring: true,
          }),
        },
      }),
    ]);
  }
}
