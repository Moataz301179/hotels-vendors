/**
 * POST /api/v1/auth/register/verify-otp
 * Verify phone OTP during registration (no auth required).
 * Returns a verification token that can be included in the registration payload.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const VerifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(6),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = VerifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Phone and 6-digit code required" }, { status: 400 });
  }

  const { phone, code } = parsed.data;

  // Find the most recent unverified token for this phone
  const token = await prisma.phoneVerificationToken.findFirst({
    where: { phone, code, verified: false },
    orderBy: { createdAt: "desc" },
  });

  if (!token) {
    return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 });
  }

  if (token.expiresAt < new Date()) {
    await prisma.phoneVerificationToken.delete({ where: { id: token.id } });
    return NextResponse.json(
      { success: false, error: "Verification code has expired. Please request a new one." },
      { status: 400 }
    );
  }

  // Mark token as verified
  await prisma.phoneVerificationToken.update({
    where: { id: token.id },
    data: { verified: true },
  });

  return NextResponse.json({
    success: true,
    data: {
      message: "Phone verified successfully",
      phone,
    },
  });
}
