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

  // 3. Tenant isolation: merchantRefNumber is our internal paymentNumber (PAY-<ts>).
  // Look up the Payment to derive the expected tenant and reject cross-tenant callbacks.
  const expectedPayment = await prisma.payment.findFirst({
    where: { referenceCode: merchantRefNumber },
    select: { tenantId: true },
  });
  if (expectedPayment && tx.tenantId !== expectedPayment.tenantId) {
    console.error(
      `[Fawry Callback] Tenant mismatch: tx.tenantId=${tx.tenantId} expected=${expectedPayment.tenantId} ref=${referenceNumber}`
    );
    return error("Callback tenant mismatch", 403);
  }

  // 4. Update transaction status
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

  // 5. If confirmed, update linked Payment record
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

  // 6. Audit log
  await prisma.auditLog.create({
    data: {
      tenantId: tx.tenantId,
      entityType: "PaymentTransaction",
      entityId: tx.id,
      action: isPaid ? "FAWRY_PAYMENT_CONFIRMED" : "FAWRY_PAYMENT_FAILED",
      actorId: "fawry",
      actorRole: "SYSTEM",
      afterState: JSON.stringify({
        referenceNumber,
        merchantRefNumber,
        orderStatus: payload.orderStatus,
        amount: payload.paymentAmount,
      }),
    },
  });

  return success({ acknowledged: true, matched: true, status: newStatus });
});
