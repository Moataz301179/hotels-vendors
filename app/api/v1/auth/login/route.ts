import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { LoginSchema } from "@/lib/zod";
import { apiRoute, validateBody, success, error, audit } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest) => {
  const body = await request.json();
  const data = validateBody(LoginSchema, body);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { hotel: true },
  });

  if (!user || !user.passwordHash) {
    return error("Invalid email or password", 401);
  }

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) {
    return error("Invalid email or password", 401);
  }

  const token = await createSession(user.id, user.platformRole, user.hotelId);

  await audit({
    entityType: "USER",
    entityId: user.id,
    action: "LOGIN",
    actorId: user.id,
    actorRole: user.platformRole,
    afterState: { email: user.email, platformRole: user.platformRole },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, platformRole: user.platformRole, hotelId: user.hotelId } });
});
