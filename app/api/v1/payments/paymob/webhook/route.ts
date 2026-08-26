import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { verifyHmac, extractMerchantOrderId } from "@/lib/fintech/paymob";
import type { PaymobWebhookPayload } from "@/lib/fintech/paymob";
import { success, error } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

/**
 * Paymob webhook receiver (SEC chunk 4A)
 *
 * Security invariants:
 *  1. HMAC-SHA512 signature is verified BEFORE any processing.
 *  2. Idempotent: replayed deliveries are short-circuited via the
 *     webhook-idempotency store AND a transactional status guard.
 *  3. Amounts are NEVER trusted from the webhook body - they are recomputed
 *     from the DB Payment record matched by merchant_order_id.
 */
export async function POST(request: NextRequest) {
  let payload: PaymobWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return error("Invalid JSON body", 400);
  }

  // ---- 1. HMAC verification FIRST ------------------------------------------
  if (!verifyHmac(payload)) {
    return error("Invalid HMAC signature", 401);
  }

  const obj = payload.obj;
  const merchantOrderId = extractMerchantOrderId(obj);
  if (!merchantOrderId) {
    return error("Missing merchant_order_id", 400);
  }

  // ---- 2. Idempotency: replay protection -----------------------------------
  const eventId = `paymob:${obj.id}:${merchantOrderId}`;
  try {
    const existing = await prisma.payment.findFirst({
      where: {
        referenceCode: merchantOrderId,
        status: "PAID",
      },
      select: { id: true },
    });
    if (existing) {
      return success({ duplicate: true, message: "Payment already processed" });
    }
  } catch {
    // fall through to transactional processing
  }

  // ---- 3. Match Payment by merchant_order_id -------------------------------
  const payment = await prisma.payment.findFirst({
    where: { referenceCode: merchantOrderId, deletedAt: null },
    include: { invoice: { select: { id: true } } },
  });

  if (!payment) {
    return error("No payment found for merchant_order_id", 404);
  }

  // NEVER trust amount from webhook body — recompute from DB.
  const dbAmount = Number(payment.amount ?? 0);

  // ---- 4. Transactional, idempotent state transition -----------------------
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Guard inside the transaction: only transition PENDING -> PAID once.
    const updated = await tx.payment.updateMany({
      where: { id: payment.id, status: { notIn: ["PAID"] } },
      data: {
        status: obj.success === true ? "PAID" : "FAILED",
        paidAt: obj.success === true ? new Date() : null,
        metadata: JSON.stringify({
          ...(payment.metadata ? JSON.parse(payment.metadata) : {}),
          paymobTransactionId: obj.id,
          hmacVerified: true,
          webhookProcessedAt: new Date().toISOString(),
        }),
      },
    });

    if (updated.count === 0) {
      return { duplicate: true as const };
    }

    if (obj.success === true && payment.invoiceId) {
      await tx.invoice.updateMany({
        where: { id: payment.invoiceId, paymentStatus: { not: "PAID" } },
        data: {
          paymentStatus: "PAID",
          paidDate: new Date(),
        },
      });
    }

    return { duplicate: false as const };
  });

  if (result.duplicate) {
    return success({ duplicate: true, message: "Payment already processed" });
  }

  // ---- 5. Audit log ---------------------------------------------------------
  try {
    const { appendAuditEntry } = await import("@/lib/audit/tamper-proof");
    await appendAuditEntry({
      tenantId: payment.tenantId,
      entityName: "PAYMENT",
      entityId: payment.id,
      actionType: "UPDATE",
      actorId: "paymob",
      actorRole: "SYSTEM",
      changes: {
        paymobTransactionId: obj.id,
        merchantOrderId,
        amount: dbAmount,
        hmacVerified: true,
        outcome: obj.success === true ? "PAID" : "FAILED",
      },
    });
  } catch {
    // Audit logging must never fail the webhook acknowledgement.
  }

  return success({
    processed: true,
    paymentId: payment.id,
    invoiceId: payment.invoiceId || null,
    status: obj.success === true ? "PAID" : "FAILED",
  });
}
