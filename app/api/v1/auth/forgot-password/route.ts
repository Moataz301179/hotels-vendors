import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, success, error } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/redis";
import { sendEmail, passwordResetTemplate } from "@/lib/notifications/email";
import { randomBytes } from "crypto";

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export const POST = apiRoute(async (request: NextRequest) => {
  const body = await request.json();
  const { email } = body;

  if (!email || typeof email !== "string") {
    return error("Email is required", 400);
  }

  // Rate limit: 3 requests per hour per email
  const rateLimit = await checkRateLimit(`forgot-password:${email.toLowerCase()}`, 3600, 3);
  if (!rateLimit.allowed) {
    return error("Too many requests. Please try again later.", 429);
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Return success to prevent email enumeration
    return success({ message: "If an account exists, a password reset email has been sent." });
  }

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email: user.email },
  });

  const token = generateToken();
  await prisma.passwordResetToken.create({
    data: {
      email: user.email,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hotels-vendors.com";

  try {
    const reset = passwordResetTemplate({
      name: user.name,
      resetUrl: `${baseUrl}/reset-password?token=${token}`,
    });
    await sendEmail({
      to: [user.email],
      subject: reset.subject,
      html: reset.html,
    });
  } catch {
    console.error("[ForgotPassword] Failed to send reset email to", user.email);
  }

  return success({ message: "If an account exists, a password reset email has been sent." });
});
