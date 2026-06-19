import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";
import { randomInt } from "crypto";

const SendOtpSchema = z.object({
  phone: z.string().min(10).max(15),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const body = await request.json();
  const { phone } = SendOtpSchema.parse(body);

  // Check if phone is already verified by another user
  const existing = await prisma.user.findFirst({
    where: { phone, phoneVerifiedAt: { not: null }, id: { not: auth.userId } },
  });
  if (existing) {
    return error("This phone number is already verified by another account", 409);
  }

  // Rate limit: max 3 OTP requests per phone per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentOtps = await prisma.phoneVerificationToken.count({
    where: { phone, createdAt: { gte: oneHourAgo } },
  });
  if (recentOtps >= 3) {
    return error("Too many OTP requests. Please try again later.", 429);
  }

  // Invalidate any existing unverified tokens for this user
  await prisma.phoneVerificationToken.deleteMany({
    where: { userId: auth.userId, verified: false },
  });

  // Generate 6-digit OTP
  const code = String(randomInt(100000, 999999));

  // Store token with 10-minute expiry
  await prisma.phoneVerificationToken.create({
    data: {
      userId: auth.userId,
      phone,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await audit({
    entityType: "USER",
    entityId: auth.userId,
    action: "PHONE_OTP_SENT",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { phone },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  // TODO: Send OTP via SMS provider (e.g., Twilio, Vonage)
  // For development, return the code in the response
  const isDev = process.env.NODE_ENV === "development";

  return success({
    message: "OTP sent successfully",
    ...(isDev ? { code } : {}),
    expiresIn: 600, // seconds
  });
});
