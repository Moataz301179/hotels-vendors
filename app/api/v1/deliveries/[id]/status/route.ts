import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { apiRoute, authenticate, validateBody, success, error, audit, requirePermission } from "@/lib/api-utils";

const VALID_TRANSITIONS: Record<string, string[]> = {
  ASSIGNED: ["ACCEPTED_BY_CARRIER"],
  ACCEPTED_BY_CARRIER: ["PICKED_UP"],
  PICKED_UP: ["IN_TRANSIT"],
  IN_TRANSIT: ["ARRIVED"],
  ARRIVED: ["DELIVERED"],
};

const StatusUpdateSchema = z.object({
  status: z.enum([
    "ACCEPTED_BY_CARRIER",
    "PICKED_UP",
    "IN_TRANSIT",
    "ARRIVED",
    "DELIVERED",
    "FAILED",
    "CANCELLED",
    "RETURNED",
  ]),
  podPhotoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
  otpCode: z.string().optional(),
  notes: z.string().optional(),
});

export const PATCH = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "delivery:update");
  const { id } = await ctx.params;
  const body = await request.json();
  const data = validateBody(StatusUpdateSchema, body);

  const job = await prisma.deliveryJob.findFirst({
    where: { id, tenantId: auth.tenantId },
    include: { carrier: { select: { id: true } } },
  });

  if (!job) return error("Delivery job not found", 404);

  // RBAC: only the assigned carrier's user can update
  if (auth.platformRole === "SHIPPING") {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { carrierId: true },
    });
    if (!user?.carrierId || user.carrierId !== job.carrierId) {
      return error("Not authorized for this delivery job", 403);
    }
  }

  // Validate status transition (no skipping steps)
  const allowedNext = VALID_TRANSITIONS[job.status];
  if (!allowedNext || !allowedNext.includes(data.status)) {
    return error(
      `Invalid status transition: ${job.status} → ${data.status}. Allowed: ${allowedNext?.join(", ") || "none"}`,
      400
    );
  }

  // For DELIVERED, verify OTP if provided
  if (data.status === "DELIVERED" && data.otpCode) {
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
    // Mark OTP verified
    await prisma.otpDelivery.update({
      where: { id: otp.id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        verifiedById: auth.userId,
      },
    });
  }

  const updateData: Record<string, unknown> = {
    status: data.status,
  };

  if (data.status === "DELIVERED") {
    updateData.deliveredAt = new Date();
    if (data.podPhotoUrl) updateData.podPhotoUrl = data.podPhotoUrl;
    if (data.signatureUrl) updateData.signatureUrl = data.signatureUrl;
  }

  if (data.podPhotoUrl && data.status !== "DELIVERED") {
    updateData.podPhotoUrl = data.podPhotoUrl;
  }

  const updated = await prisma.deliveryJob.update({
    where: { id },
    data: updateData,
  });

  // Update trip stop if applicable
  if (job.tripStopId && data.status === "DELIVERED") {
    await prisma.tripStop.update({
      where: { id: job.tripStopId },
      data: {
        status: "DELIVERED",
        actualArrival: new Date(),
        podPhotoUrl: data.podPhotoUrl || job.podPhotoUrl,
        signatureUrl: data.signatureUrl || job.signatureUrl,
      },
    });
  }

  await audit({
    entityType: "DELIVERY_JOB",
    entityId: id,
    action: `STATUS_${data.status}`,
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    beforeState: { status: job.status },
    afterState: { status: data.status },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ deliveryJob: updated });
});
