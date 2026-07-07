import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, success, error } from "@/lib/api-utils";
import { verifyInstaPayCallback } from "@/lib/payments/instapay";
import type { InstaPayCallbackPayload } from "@/lib/payments/instapay";

export const dynamic = "force-dynamic";

export const POST = apiRoute(async (request: NextRequest) => {
  const payload = (await request.json()) as InstaPayCallbackPayload;

  if (!verifyInstaPayCallback(payload)) {
    return error("Invalid callback signature", 400);
  }

  const { transactionId, eventType, amount, status: callbackStatus } = payload;
  const isCompleted = eventType === "transfer.completed";
  const isFailed = eventType === "transfer.failed";

  const tx = await prisma.paymentTransaction.findFirst({
    where: { gatewayRef: transactionId },
  });

  if (!tx) {
    console.warn("[InstaPay Callback] Unmatched transaction:", transactionId);
    return success({ acknowledged: true, matched: false });
  }

  const newStatus = isCompleted ? "CONFIRMED" : isFailed ? "FAILED" : "PENDING";

  await prisma.paymentTransaction.update({
    where: { id: tx.id },
    data: {
      status: newStatus,
      metadata: JSON.stringify({
        eventType,
        callbackStatus,
        amount,
        transactionId,
        callbackAt: new Date().toISOString(),
      }),
    },
  });

  if (isCompleted) {
    const payment = await prisma.payment.findFirst({
      where: { referenceCode: tx.gatewayRef },
    });
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", paidAt: new Date() },
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      tenantId: tx.tenantId,
      entityType: "PaymentTransaction",
      entityId: tx.id,
      action: isCompleted ? "INSTAPAY_TRANSFER_COMPLETED" : "INSTAPAY_TRANSFER_FAILED",
      actorId: "instapay",
      actorRole: "SYSTEM",
      afterState: JSON.stringify({
        transactionId,
        eventType,
        amount,
        status: newStatus,
      }),
    },
  });

  return success({ acknowledged: true, matched: true, status: newStatus });
});
