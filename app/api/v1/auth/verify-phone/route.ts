import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const VerifyPhoneSchema = z.object({
  code: z.string().length(6),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const body = await request.json();
  const { code } = VerifyPhoneSchema.parse(body);

  // Find the most recent unverified token for this user
  const token = await prisma.phoneVerificationToken.findFirst({
    where: {
      userId: auth.userId,
      code,
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

  // Mark token as verified and update user
  await prisma.$transaction([
    prisma.phoneVerificationToken.update({
      where: { id: token.id },
      data: { verified: true },
    }),
    prisma.user.update({
      where: { id: auth.userId },
      data: {
        phone: token.phone,
        phoneVerifiedAt: new Date(),
      },
    }),
  ]);

  await audit({
    entityType: "USER",
    entityId: auth.userId,
    action: "PHONE_VERIFIED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { phone: token.phone, phoneVerifiedAt: new Date().toISOString() },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    message: "Phone number verified successfully",
    phone: token.phone,
  });
});
