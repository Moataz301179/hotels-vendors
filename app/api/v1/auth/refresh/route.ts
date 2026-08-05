import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { RefreshSchema } from "@/lib/zod";
import { apiRoute, validateBody, success, error, audit } from "@/lib/api-utils";
import { rotateSessionPair } from "@/lib/session";

export const POST = apiRoute(async (request: NextRequest) => {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

  const body = await request.json();
  const data = validateBody(RefreshSchema, body);

  const { refreshToken } = data;

  // Rotate session pair using the refresh token
  const newPair = await rotateSessionPair(refreshToken);

  if (!newPair) {
    return error("Unauthorized", 401);
  }

  // Get user info for audit
  try {
    const payload = await (await import("jose")).jwtVerify(refreshToken, (await import("@/lib/session")).getJwtSecret(), { clockTolerance: 60 });
    const userId = payload.payload.userId as string;
    const platformRole = payload.payload.platformRole as string;
    const tenantId = payload.payload.tenantId as string;

    await audit({
      entityType: "USER",
      entityId: userId,
      action: "REFRESH_TOKEN",
      tenantId: tenantId || "legacy",
      actorId: userId,
      actorRole: platformRole,
      ipAddress: clientIp,
      userAgent: request.headers.get("user-agent"),
    });
  } catch {
    // Audit failure is non-blocking
  }

  return success({
    accessToken: newPair.accessToken,
    refreshToken: newPair.refreshToken,
  });
});