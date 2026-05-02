import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaymobCallback } from "@/lib/payments/paymob";
import { apiRoute, success, error } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest) => {
  const payload = await request.json();

  // Verify callback authenticity
  if (!verifyPaymobCallback(payload)) {
    return error("Invalid callback signature", 400);
  }

  const isSuccess = payload.success === true || payload.success === "true";
  const paymobOrderId = payload.order?.toString();

  if (!isSuccess || !paymobOrderId) {
    return error("Payment failed or incomplete", 400);
  }

  // Find order by Paymob order ID
  const order = await prisma.order.findFirst({
    where: {
      paymentGuaranteeMethod: "DEPOSIT_PAYMOB",
      paymentGuaranteeSetAt: { not: null },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!order) {
    return error("Order not found for callback", 404);
  }

  // Mark as paid
  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentGuaranteed: true,
      status: "CONFIRMED",
    },
  });

  // Log to audit
  await prisma.auditLog.create({
    data: {
          tenantId: order.tenantId,
        
      entityType: "ORDER",
      entityId: order.id,
      action: "DEPOSIT_PAID",
      actorId: "paymob",
      actorRole: "SYSTEM",
      afterState: JSON.stringify({
        paymobOrderId,
        amountCents: payload.amount_cents,
        transactionId: payload.id,
      }),
    },
  });

  return success({ orderId: order.id, status: "DEPOSIT_CONFIRMED" });
});
