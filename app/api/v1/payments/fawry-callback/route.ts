import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, success, error } from "@/lib/api-utils";
import { verifyFawryCallback } from "@/lib/payments/fawry";
import type { FawryCallbackPayload } from "@/lib/payments/fawry";

export const dynamic = "force-dynamic";

export const POST = apiRoute(async (request: NextRequest) => {
  const payload = (await request.json()) as FawryCallbackPayload;

  // 1. Verify HMAC signature
  if (!verifyFawryCallback(payload)) {
    return error("Invalid callback signature", 400);
  }

  const referenceNumber = payload.referenceNumber;
  const merchantRefNumber = payload.merchantRefNumber;
  const isPaid = payload.orderStatus === "PAID";

  // 2. Find the payment transaction by gateway reference
  const tx = await prisma.paymentTransaction.findFirst({
    where: { gatewayRef: referenceNumber },
    orderBy: { createdAt: "desc" },
  });

  if (!tx) {
    // Acknowledge webhook to stop retries, but log unmatched
    console.warn("[Fawry Callback] Unmatched reference:", referenceNumber);
    return success({ acknowledged: true, matched: false });
  }

  // 3. Update transaction status
  const newStatus = isPaid ? "CONFIRMED" : payload.orderStatus === "REFUNDED" ? "REVERSED" : "FAILED";

  await prisma.paymentTransaction.update({
    where: { id: tx.id },
    data: {
      status: newStatus,
      observedMethod: "PAYMOB_B2B", // closest mapped enum value
      metadata: JSON.stringify({
        merchantRefNumber,
        orderStatus: payload.orderStatus,
        paymentAmount: payload.paymentAmount,
        paymentMethod: payload.paymentMethod,
        fawryFees: payload.fawryFees,
        callbackAt: new Date().toISOString(),
      }),
    },
  });

  // 4. If confirmed, update linked Payment record
  if (isPaid) {
    const payment = await prisma.payment.findFirst({
      where: { referenceCode: merchantRefNumber },
    });
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });
    }
  }

  // 5. Audit log (tamper-proof chain)
  const { appendAuditEntry } = await import("@/lib/audit/tamper-proof");
  await appendAuditEntry({
    tenantId: tx.tenantId,
    entityType: "PaymentTransaction",
    entityId: tx.id,
    action: isPaid ? "FAWRY_PAYMENT_CONFIRMED" : "FAWRY_PAYMENT_FAILED",
    actorId: "fawry",
    actorRole: "SYSTEM",
    afterState: {
      referenceNumber,
      merchantRefNumber,
      orderStatus: payload.orderStatus,
      amount: payload.paymentAmount,
    },
  });

  return success({ acknowledged: true, matched: true, status: newStatus });
});
