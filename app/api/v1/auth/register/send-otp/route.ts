/**
 * POST /api/v1/auth/register/send-otp
 * Send phone OTP during registration (no auth required).
 * Rate-limited: 3 attempts per phone per hour.
 * Stores OTP in PhoneVerificationToken with a temporary sessionId reference.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/redis";
import { sendOtpSms } from "@/lib/sms";
import { randomInt } from "crypto";
import { z } from "zod";

const SendOtpSchema = z.object({
  phone: z.string().min(10).max(15),
});

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;
  return "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);

  // Rate limit: 5 OTP sends per hour per IP
  const rateLimit = await checkRateLimit(`register:otp:${ip}`, 3600, 5);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many OTP requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = SendOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Valid phone number required" }, { status: 400 });
  }

  const { phone } = parsed.data;

  // Rate limit per phone: 3 per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentOtps = await prisma.phoneVerificationToken.count({
    where: { phone, createdAt: { gte: oneHourAgo } },
  });
  if (recentOtps >= 3) {
    return NextResponse.json(
      { success: false, error: "Too many OTP requests for this number. Try again later." },
      { status: 429 }
    );
  }

  // Check if phone is already verified by an existing user
  const existing = await prisma.user.findFirst({
    where: { phone, phoneVerifiedAt: { not: null } },
  });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "This phone number is already registered" },
      { status: 409 }
    );
  }

  // Invalidate existing tokens for this phone
  await prisma.phoneVerificationToken.deleteMany({
    where: { phone, verified: false },
  });

  // Generate 6-digit OTP
  const code = String(randomInt(100000, 999999));

  // Store with 10-minute expiry — use a registration session marker
  await prisma.phoneVerificationToken.create({
    data: {
      userId: `reg-${ip.slice(0, 20)}`,
      phone,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const isDev = process.env.NODE_ENV === "development";

  // Send OTP via SMS (non-blocking)
  sendOtpSms(phone, code).catch((err) =>
    console.error("[SendOtp] SMS failed:", err)
  );

  return NextResponse.json({
    success: true,
    data: {
      message: "OTP sent successfully",
      ...(isDev ? { code } : {}),
      expiresIn: 600,
    },
  });
}
