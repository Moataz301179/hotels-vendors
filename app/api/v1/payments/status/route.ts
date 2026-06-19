import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTransactionStatus } from "@/lib/payments/paymob";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { z } from "zod";

const StatusQuerySchema = z.object({
  paymentId: z.string().min(1).optional(),
  gatewayRef: z.string().min(1).optional(),
}).refine((data) => data.paymentId || data.gatewayRef, {
  message: "Either paymentId or gatewayRef is required",
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const { searchParams } = new URL(request.url);
  const { paymentId, gatewayRef } = StatusQuerySchema.parse(
    Object.fromEntries(searchParams.entries())
  );

  // Find local payment record
  let localRecord;
  if (paymentId) {
    localRecord = await prisma.paymentTransaction.findFirst({
      where: { id: paymentId, tenantId: auth.tenantId },
    });
  } else if (gatewayRef) {
    localRecord = await prisma.paymentTransaction.findFirst({
      where: { gatewayRef, tenantId: auth.tenantId },
    });
  }

  if (!localRecord) {
    return error("Payment record not found", 404);
  }

  // If we have a gatewayRef (Paymob order ID), check live status
  let liveStatus = null;
  if (localRecord.gatewayRef) {
    try {
      liveStatus = await getTransactionStatus(Number(localRecord.gatewayRef));

      // Update local record if status changed
      if (liveStatus.success && localRecord.status !== "COMPLETED") {
        await prisma.paymentTransaction.update({
          where: { id: localRecord.id },
          data: { status: "COMPLETED" },
        });
        localRecord.status = "COMPLETED";
      }
    } catch {
      // Paymob lookup failed — return local status
    }
  }

  // Parse metadata for extra context
  let metadata: Record<string, unknown> = {};
  try {
    metadata = localRecord.metadata ? JSON.parse(localRecord.metadata) : {};
  } catch { /* ignore */ }

  return success({
    payment: {
      id: localRecord.id,
      status: localRecord.status,
      amount: Number(localRecord.amount),
      currency: localRecord.currency,
      transactionType: localRecord.transactionType,
      observedMethod: localRecord.observedMethod,
      metadata,
      createdAt: localRecord.createdAt,
      updatedAt: localRecord.updatedAt,
    },
    liveStatus,
  });
});
