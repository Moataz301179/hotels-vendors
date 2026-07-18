// @ts-nocheck
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaymobCallback } from "@/lib/payments/paymob";
import { apiRoute, success, error } from "@/lib/api-utils";
import { isWebhookIpAllowed, getClientIp } from "@/lib/security/webhook-whitelist";
import { checkWebhookReplay, markWebhookProcessed, paymobEventId } from "@/lib/security/webhook-idempotency";

export const POST = apiRoute(async (request: NextRequest) => {
  // IP whitelisting — reject webhooks from untrusted sources
  const clientIp = getClientIp(request);
  if (!isWebhookIpAllowed(clientIp, "paymob")) {
    return error("Forbidden: untrusted webhook source", 403);
  }

  const payload = await request.json();

  // Replay protection — reject duplicate webhook deliveries
  const eventId = paymobEventId(payload);
  const { isReplay } = await checkWebhookReplay("paymob", eventId);
  if (isReplay) {
    return success({ duplicate: true, message: "Webhook already processed" });
  }

  // Verify callback authenticity
  if (!verifyPaymobCallback(payload)) {
    return error("Invalid callback signature", 400);
  }

  const isSuccess = payload.success === true || payload.success === "true";
  const paymobOrderId = payload.order?.toString();

  if (!isSuccess || !paymobOrderId) {
    return error("Payment failed or incomplete", 400);
  }

  // Find order by Paymob order ID (stored in paymentGuaranteeMethod as "DEPOSIT_PAYMOB:<id>")
  const order = await prisma.order.findFirst({
    where: {
      paymentGuaranteeMethod: `DEPOSIT_PAYMOB:${paymobOrderId}`,
    },
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

  // Log to audit (tamper-proof chain)
  const { appendAuditEntry } = await import("@/lib/audit/tamper-proof");
  await appendAuditEntry({
    tenantId: order.tenantId,
    entityType: "ORDER",
    entityId: order.id,
    action: "DEPOSIT_PAID",
    actorId: "paymob",
    actorRole: "SYSTEM",
    beforeState: { status: order.status },
    afterState: {
      paymobOrderId,
      amountCents: payload.amount_cents,
      transactionId: payload.id,
    },
  });

  // Mark webhook as processed (replay protection)
  await markWebhookProcessed("paymob", eventId, `DEPOSIT_CONFIRMED:${order.id}`);

  return success({ orderId: order.id, status: "DEPOSIT_CONFIRMED" });
});
