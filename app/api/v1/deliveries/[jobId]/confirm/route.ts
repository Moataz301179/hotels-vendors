import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { DeliveryConfirmSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateBody, success, error, audit, requirePermission } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ jobId: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "delivery:confirm");
  const { jobId } = await ctx.params;
  const body = await request.json();
  const data = validateBody(DeliveryConfirmSchema, body);

  const job = await prisma.deliveryJob.findFirst({
    where: { id: jobId, tenantId: auth.tenantId },
    include: {
      tripStop: true,
      otpDelivery: true,
    },
  });
  if (!job) return error("Delivery job not found", 404);

  const otp = await prisma.otpDelivery.findFirst({
    where: {
      otpCode: data.otpCode,
      orderId: job.orderId,
      tenantId: auth.tenantId,
      status: "PENDING",
    },
  });
  if (!otp) return error("Invalid OTP", 401);
  if (new Date() > otp.expiresAt) {
    await prisma.otpDelivery.update({ where: { id: otp.id }, data: { status: "EXPIRED" } });
    return error("OTP has expired", 401);
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.otpDelivery.update({
      where: { id: otp.id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        verifiedById: auth.userId,
        deliveryPhotoUrl: data.podPhotoUrl,
        signatureUrl: data.signatureUrl,
        notes: data.notes,
      },
    });

    const updatedJob = await tx.deliveryJob.update({
      where: { id: jobId },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date(),
        podPhotoUrl: data.podPhotoUrl,
        signatureUrl: data.signatureUrl,
      },
    });

    if (job.tripStopId) {
      await tx.tripStop.update({
        where: { id: job.tripStopId },
        data: {
          status: "DELIVERED",
          actualArrival: new Date(),
          podPhotoUrl: data.podPhotoUrl,
          signatureUrl: data.signatureUrl,
        },
      });
    }

    await tx.order.update({
      where: { id: job.orderId },
      data: { status: "DELIVERED" },
    });

    return updatedJob;
  });

  await audit({
    entityType: "DELIVERY_JOB",
    entityId: jobId,
    action: "CONFIRM_DELIVERY",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { status: "DELIVERED", deliveredAt: new Date().toISOString() },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ deliveryJob: result });
});
