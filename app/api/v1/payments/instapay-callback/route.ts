import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, success, error } from "@/lib/api-utils";
import { verifyInstaPayCallback } from "@/lib/payments/instapay";
import type { InstaPayCallbackPayload } from "@/lib/payments/instapay";

export const dynamic = "force-dynamic";

export const POST = apiRoute(async (request: NextRequest) => {
  const payload = (await request.json()) as InstaPayCallbackPayload;

  // 1. Verify HMAC signature
  if (!verifyInstaPayCallback(payload)) {
    return error("Invalid callback signature", 400);
  }

  const transactionId = payload.transactionId;
  const isCompleted = payload.status === "COMPLETED";
  const isReversed = payload.status === "REVERSED";

  // 2. Find the payment transaction by gateway reference
  const tx = await prisma.paymentTransaction.findFirst({
    where: { gatewayRef: transactionId },
    orderBy: { createdAt: "desc" },
  });

  if (!tx) {
    console.warn("[InstaPay Callback] Unmatched transaction:", transactionId);
    return success({ acknowledged: true, matched: false });
  }

  // 3. Update transaction status
  const newStatus = isCompleted ? "CONFIRMED" : isReversed ? "REVERSED" : "FAILED";

  await prisma.paymentTransaction.update({
    where: { id: tx.id },
    data: {
      status: newStatus,
      observedMethod: "INSTAPAY",
      metadata: JSON.stringify({
        eventType: payload.eventType,
        status: payload.status,
        amount: payload.amount,
        currency: payload.currency,
        senderWalletId: payload.senderWalletId,
        receiverWalletId: payload.receiverWalletId,
        callbackAt: new Date().toISOString(),
      }),
    },
  });

  // 4. Audit log
  await prisma.auditLog.create({
    data: {
      tenantId: tx.tenantId,
      entityType: "PaymentTransaction",
      entityId: tx.id,
      action: isCompleted
        ? "INSTAPAY_TRANSFER_CONFIRMED"
        : isReversed
        ? "INSTAPAY_TRANSFER_REVERSED"
        : "INSTAPAY_TRANSFER_FAILED",
      actorId: "instapay",
      actorRole: "SYSTEM",
      afterState: JSON.stringify({
        transactionId,
        status: payload.status,
        amount: payload.amount,
        currency: payload.currency,
      }),
    },
  });

  return success({ acknowledged: true, matched: true, status: newStatus });
});
