import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, validateBody, success, error } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/redis";
import { sendOtpSms } from "@/lib/sms";
import { randomInt } from "crypto";
import { z } from "zod";

const ResendOtpSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const POST = apiRoute(async (request: NextRequest) => {
  // Rate limit: 5 resends per hour per IP
  const clientIp =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rateLimit = await checkRateLimit(`staged-resend:${clientIp}`, 3600, 5);
  if (!rateLimit.allowed) {
    return error("Too many resend attempts. Please try again later.", 429);
  }

  const body = await request.json();
  const data = validateBody(ResendOtpSchema, body);

  // Find the user
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { id: true, phone: true },
  });

  if (!user) {
    return error("User not found", 404);
  }

  if (!user.phone) {
    return error("No phone number on file for this user", 400);
  }

  // Rate limit: max 3 OTP per phone per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentOtps = await prisma.phoneVerificationToken.count({
    where: { phone: user.phone, createdAt: { gte: oneHourAgo } },
  });
  if (recentOtps >= 3) {
    return error("Too many OTP requests. Please try again later.", 429);
  }

  // Invalidate existing unverified tokens
  await prisma.phoneVerificationToken.deleteMany({
    where: { userId: user.id, verified: false },
  });

  // Generate new 6-digit OTP
  const code = String(randomInt(100000, 999999));

  await prisma.phoneVerificationToken.create({
    data: {
      userId: user.id,
      phone: user.phone,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // Send OTP via SMS (non-blocking)
  sendOtpSms(user.phone, code).catch((err) =>
    console.error("[ResendOtp] SMS failed:", err)
  );

  const isDev = process.env.NODE_ENV === "development";

  return success({
    message: "OTP resent successfully",
    ...(isDev ? { devCode: code } : {}),
    expiresIn: 600,
  });
});
