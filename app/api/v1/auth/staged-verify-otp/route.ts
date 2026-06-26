import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { apiRoute, validateBody, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const StagedVerifyOtpSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const body = await request.json();
  const data = validateBody(StagedVerifyOtpSchema, body);

  // Find the user (no auth required — this is a public endpoint)
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: {
      id: true,
      email: true,
      name: true,
      platformRole: true,
      phone: true,
      tenantId: true,
    },
  });

  if (!user) {
    return error("User not found", 404);
  }

  // Rate limit: max 10 verification attempts per user per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentAttempts = await prisma.phoneVerificationToken.count({
    where: {
      userId: user.id,
      createdAt: { gte: oneHourAgo },
    },
  });
  if (recentAttempts > 10) {
    return error("Too many verification attempts. Please request a new code.", 429);
  }

  // Find the most recent unverified token for this user + code
  const token = await prisma.phoneVerificationToken.findFirst({
    where: {
      userId: user.id,
      code: data.code,
      verified: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!token) {
    return error("Invalid verification code", 400);
  }

  if (token.expiresAt < new Date()) {
    await prisma.phoneVerificationToken.delete({ where: { id: token.id } });
    return error("Verification code has expired. Please request a new one.", 400);
  }

  // Mark token as verified and update user's phone verification
  await prisma.$transaction([
    prisma.phoneVerificationToken.update({
      where: { id: token.id },
      data: { verified: true },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        phone: token.phone,
        phoneVerifiedAt: new Date(),
      },
    }),
  ]);

  // Create session — user is now verified and can access the platform
  const sessionToken = await createSession(user.id, user.platformRole, user.tenantId);

  await audit({
    entityType: "USER",
    entityId: user.id,
    action: "PHONE_VERIFIED_STAGED",
    tenantId: user.tenantId,
    actorId: user.id,
    actorRole: user.platformRole,
    afterState: { phone: token.phone, phoneVerifiedAt: new Date().toISOString() },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    token: sessionToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      platformRole: user.platformRole,
    },
  });
});
