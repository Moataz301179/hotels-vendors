import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit, requirePermission } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ jobId: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "delivery:manage");
  const { jobId } = await ctx.params;

  const body = await request.json();
  const receiverPhone = body.receiverPhone as string;
  const receiverName = body.receiverName as string | undefined;
  const deliveryChannel = (body.deliveryChannel as string) || "SMS";

  if (!receiverPhone || receiverPhone.length < 10) {
    return error("Valid receiver phone is required", 400);
  }

  const job = await prisma.deliveryJob.findFirst({
    where: { id: jobId, tenantId: auth.tenantId },
    include: { order: { select: { id: true, orderNumber: true } } },
  });
  if (!job) return error("Delivery job not found", 404);

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  const otpDelivery = await prisma.otpDelivery.create({
    data: {
      otpCode,
      orderId: job.orderId,
      tripStopId: job.tripStopId,
      receiverName,
      receiverPhone,
      deliveryChannel,
      status: "PENDING",
      expiresAt,
      tenantId: auth.tenantId,
    },
  });

  await audit({
    entityType: "OTP_DELIVERY",
    entityId: otpDelivery.id,
    action: "GENERATE_OTP",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { jobId, receiverPhone, deliveryChannel },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    otpDelivery: {
      id: otpDelivery.id,
      otpCode,
      expiresAt,
      deliveryChannel,
    },
  });
});
