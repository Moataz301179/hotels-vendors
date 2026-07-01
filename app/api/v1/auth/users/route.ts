import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, validateBody, success, error, audit } from "@/lib/api-utils";
import { requirePermission } from "@/lib/auth/rbac";
import { z } from "zod";

const UpdateUserSchema = z.object({
  userId: z.string(),
  roleId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

const DeleteUserSchema = z.object({
  userId: z.string(),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const users = await prisma.user.findMany({
    where: { tenantId: auth.tenantId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      lastActive: true,
      createdAt: true,
      assignedRole: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const [tenant, roles] = await Promise.all([
    prisma.tenant.findUnique({
      where: { id: auth.tenantId },
      select: { name: true, maxUsers: true, seatCount: true, _count: { select: { users: true } } },
    }),
    prisma.role.findMany({
      where: { tenantId: auth.tenantId },
      select: { id: true, name: true },
    }),
  ]);

  return success({
    users,
    roles,
    tenant: {
      name: tenant?.name,
      maxUsers: tenant?.maxUsers ?? 0,
      seatCount: tenant?.seatCount ?? 0,
      totalUsers: tenant?._count.users ?? 0,
    },
  });
});

export const PATCH = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "manage:users");

  const body = await request.json();
  const data = validateBody(UpdateUserSchema, body);

  // Cannot modify self
  if (data.userId === auth.userId) {
    return error("You cannot modify your own account", 400);
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { id: true, email: true, name: true, tenantId: true, role: true, status: true },
  });

  if (!targetUser || targetUser.tenantId !== auth.tenantId) {
    return error("User not found", 404);
  }

  const beforeState = { role: targetUser.role, status: targetUser.status };

  const updatedUser = await prisma.user.update({
    where: { id: data.userId },
    data: {
      ...(data.roleId && { roleId: data.roleId }),
      ...(data.status && { status: data.status }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      lastActive: true,
      createdAt: true,
    },
  });

  await audit({
    entityType: "USER",
    entityId: data.userId,
    action: "UPDATE_USER",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    beforeState: beforeState as Record<string, unknown>,
    afterState: { role: updatedUser.role, status: updatedUser.status } as Record<string, unknown>,
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success(updatedUser);
});

export const DELETE = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "manage:users");

  const body = await request.json();
  const data = validateBody(DeleteUserSchema, body);

  if (data.userId === auth.userId) {
    return error("You cannot remove yourself", 400);
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { id: true, email: true, name: true, tenantId: true, role: true },
  });

  if (!targetUser || targetUser.tenantId !== auth.tenantId) {
    return error("User not found", 404);
  }

  if (targetUser.role === "OWNER") {
    return error("Cannot remove the owner of this organization", 400);
  }

  await prisma.user.delete({ where: { id: data.userId } });

  await audit({
    entityType: "USER",
    entityId: data.userId,
    action: "REMOVE_USER",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    beforeState: { email: targetUser.email, name: targetUser.name, role: targetUser.role } as Record<string, unknown>,
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ removed: data.userId });
});
