import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { LoginSchema, MobileLoginSchema } from "@/lib/zod";
import { createSession, createSessionPair } from "@/lib/session";
import { apiRoute, validateBody, success, error, audit } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/redis";
import { normalizePhone, isValidEgyptianPhone } from "@/lib/auth/phone";

export const POST = apiRoute(async (request: NextRequest) => {
  // Rate limit: 5 attempts per minute per IP
  const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const rateLimit = await checkRateLimit(`login:${clientIp}`, 60, 5);
  if (!rateLimit.allowed) {
    return error("Too many login attempts. Please try again later.", 429);
  }

  const body = await request.json();

  // Detect if mobile-style login (has identifier field)
  const isMobileLogin = body.identifier && !body.email;
  const schema = isMobileLogin ? MobileLoginSchema : LoginSchema;
  const data = validateBody(
    schema as unknown as z.ZodSchema<{ identifier: string; email: string; password: string }>,
    body
  );

  const identifier = isMobileLogin ? data.identifier : data.email;
  const password = data.password;

  // Resolve user: by phone if identifier looks like phone, else by email
  let user;
  const normalizedPhone = isValidEgyptianPhone(identifier) ? normalizePhone(identifier) : null;

  if (normalizedPhone) {
    user = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
      include: { hotel: true },
    });
  } else if (identifier.toLowerCase() === "admin") {
    user = await prisma.user.findFirst({
      where: { email: "admin@hotelsvendors.com" },
      include: { hotel: true },
    });
  } else {
    user = await prisma.user.findUnique({
      where: { email: identifier },
      include: { hotel: true },
    });
  }

  if (!user || !user.passwordHash) {
    return error("Invalid credentials", 401);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return error("Invalid credentials", 401);
  }

  // Enforce email verification before allowing login
  // Skip if user has verified phone (phoneVerifiedAt is set)
  const isPlaceholderEmail = user.email?.endsWith("@hotelsvendors.local");
  if (!user.emailVerifiedAt && !user.phoneVerifiedAt && !isPlaceholderEmail) {
    return error("Please verify your email address before logging in. Check your inbox for the verification link.", 403);
  }

  // For web (cookie-based), use createSession; for mobile, use createSessionPair
  const isWebLogin = !isMobileLogin;
  let token: string;
  let refreshToken: string | undefined;

  if (isWebLogin) {
    token = await createSession(user.id, user.platformRole, user.tenantId || user.hotelId || "legacy");
  } else {
    const pair = await createSessionPair(user.id, user.platformRole, user.tenantId || user.hotelId || "legacy");
    token = pair.accessToken;
    refreshToken = pair.refreshToken;
  }

  const loginAlias = identifier.toLowerCase() === "admin" ? "admin" : (normalizedPhone || identifier);

  await audit({
    entityType: "USER",
    entityId: user.id,
    action: "LOGIN",
    tenantId: user.tenantId || user.hotelId || "legacy",
    actorId: user.id,
    actorRole: user.platformRole,
    afterState: { loginAlias, method: normalizedPhone ? "phone" : "email" },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  const userResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    platformRole: user.platformRole,
    hotelId: user.hotelId,
    tenantId: user.tenantId,
    phone: user.phone,
    phoneVerifiedAt: user.phoneVerifiedAt,
    supplierId: user.supplierId,
  };

  const responseData: Record<string, unknown> = { token, user: userResponse };
  if (refreshToken) responseData.refreshToken = refreshToken;
  // Keep `token` for web back-compat
  if (isWebLogin) responseData.token = token;

  return success(responseData);
});