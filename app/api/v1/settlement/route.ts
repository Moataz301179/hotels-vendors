import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission, audit } from "@/lib/api-utils";
import { z } from "zod";

const SettlementSchema = z.object({
  invoiceId: z.string().cuid(),
  paymentMethod: z.enum(["BANK_TRANSFER", "CASH", "CHECK", "CREDIT_CARD", "E_WALLET"]).default("BANK_TRANSFER"),
  amount: z.number().positive().optional(),
  referenceCode: z.string().optional(),
  notes: z.string().optional(),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invoice:update");
  const body = await request.json();
  const data = SettlementSchema.parse(body);

  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
    include: {
      order: { include: { items: { include: { product: true } } } },
      hotel: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true, tier: true } },
      payments: true,
    },
  });

  if (!invoice || invoice.tenantId !== auth.tenantId) return error("Invoice not found", 404);

  // Invoice must be in a valid state for settlement
  if (invoice.paymentStatus === "PAID") {
    return error("Invoice is already paid", 400);
  }

  const settledAmount = data.amount || Number(invoice.total);
  if (settledAmount <= 0) return error("Settlement amount must be positive", 400);

  const beforeState = { paymentStatus: invoice.paymentStatus, total: invoice.total };

  // Generate payment number
  const paymentCount = await prisma.payment.count({ where: { tenantId: auth.tenantId } });
  const paymentNumber = `PAY-${String(paymentCount + 1).padStart(8, "0")}`;

  // Atomic settlement: create payment, update invoice status, calculate savings
  const result = await prisma.$transaction(async (tx) => {
    // Create payment record
    const payment = await tx.payment.create({
      data: {
        paymentNumber,
        amount: settledAmount,
        invoiceId: data.invoiceId,
        hotelId: invoice.hotelId,
        method: data.paymentMethod as any,
        status: "PAID",
        paidAt: new Date(),
        referenceCode: data.referenceCode,
        metadata: data.notes,
        tenantId: auth.tenantId,
      },
    });

    // Calculate realized savings vs original RFQ prices
    const order = await tx.order.findUnique({
      where: { id: invoice.orderId },
      include: { items: { include: { product: true } } },
    });

    // Calculate original RFQ total from order items (pre-negotiation baseline)
    // Decimal values need to be converted to numbers for arithmetic
    const originalRfqTotal = order?.items.reduce((sum, item) => {
      const unitPrice = item.unitPrice ? Number(item.unitPrice) : 0;
      return sum + unitPrice * item.quantity;
    }, 0) || 0;

    // Realized savings = original RFQ total - actual invoice total
    const invoiceTotal = invoice.total ? Number(invoice.total) : 0;
    const realizedSavings = Math.max(0, originalRfqTotal - invoiceTotal);
    const savingsRate = originalRfqTotal > 0 ? (realizedSavings / originalRfqTotal) * 100 : 0;

    // Update invoice: mark as PAID, set paidDate
    const updatedInvoice = await tx.invoice.update({
      where: { id: data.invoiceId },
      data: {
        paymentStatus: "PAID",
        status: "VALIDATED",
        paidDate: new Date(),
      },
    });

    // Update supplier rating based on timely fulfillment
    if (order?.supplierId) {
      await tx.supplier.update({
        where: { id: order.supplierId },
        data: { rating: { increment: 0.1 } },
      });
    }

    // Create SavingsLedger entry for realized savings
    if (realizedSavings > 0) {
      await tx.savingsLedger.create({
        data: {
          tenantId: auth.tenantId,
          type: "SETTLEMENT_SAVINGS",
          transactionId: data.invoiceId,
          supplierId: invoice.supplierId,
          baseline: originalRfqTotal,
          potentialSaving: originalRfqTotal - (order?.subtotal ? Number(order.subtotal) : 0),
          expectedSaving: originalRfqTotal - (order?.subtotal ? Number(order.subtotal) : 0),
          realizedAmount: realizedSavings,
          status: "REALIZED",
        },
      });
    }

    // Audit log
    await tx.auditLog.create({
      data: {
        tenantId: auth.tenantId,
        entityName: "INVOICE",
        entityId: data.invoiceId,
        actionType: "SETTLE" as any,
        actorId: auth.userId,
        changes: {
          before: beforeState,
          after: { paymentStatus: "PAID", settledAmount, paymentNumber, realizedSavings, savingsRate },
        },
      },
    });

    return { payment, updatedInvoice, realizedSavings, savingsRate, originalRfqTotal };
  });

  // Audit log via audit helper
  await audit({
    entityType: "INVOICE",
    entityId: data.invoiceId,
    action: "SETTLE",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    beforeState,
    afterState: {
      paymentStatus: "PAID",
      settledAmount,
      paymentNumber,
      realizedSavings: result.realizedSavings,
      savingsRate: result.savingsRate,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    settlement: {
      paymentId: result.payment.id,
      paymentNumber,
      invoiceId: data.invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      amount: settledAmount,
      method: data.paymentMethod as any,
      referenceCode: data.referenceCode,
      paidAt: new Date(),
      status: "PAID",
    },
    savings: {
      originalRfqTotal: result.originalRfqTotal,
      realizedSavings: result.realizedSavings,
      savingsRate: result.savingsRate,
    },
    invoice: result.updatedInvoice,
    message: "Invoice settled successfully",
  });
});
