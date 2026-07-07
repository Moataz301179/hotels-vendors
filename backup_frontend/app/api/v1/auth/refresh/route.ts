import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionToken, verifySession, createSession } from "@/lib/session";
import { apiRoute, success, error, audit } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest) => {
  const token = await getSessionToken();
  if (!token) {
    return error("Unauthorized", 401);
  }

  const session = await verifySession(token);
  if (!session) {
    return error("Invalid or expired session", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user || user.status !== "ACTIVE") {
    return error("User not found or inactive", 401);
  }

  const newToken = await createSession(user.id, user.platformRole, user.tenantId || user.hotelId || "legacy");

  await audit({
    entityType: "USER",
    entityId: user.id,
    action: "REFRESH_TOKEN",
    tenantId: user.tenantId || user.hotelId || "legacy",
    actorId: user.id,
    actorRole: user.platformRole,
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ token: newToken, user: { id: user.id, email: user.email, name: user.name, role: user.role, platformRole: user.platformRole } });
});
