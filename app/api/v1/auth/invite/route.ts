import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, validateBody, success, error, audit } from "@/lib/api-utils";
import { randomBytes } from "crypto";
import { z } from "zod";

const InviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  roleId: z.string().optional(),
});

export const POST = apiRoute(
  async (request: NextRequest) => {
    const auth = await authenticate(request);

    const body = await request.json();
    const data = validateBody(InviteSchema, body);

    // Verify inviter has manage:users permission or is ADMIN
    const inviter = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { platformRole: true, roleId: true },
    });

    if (!inviter) {
      return error("User not found", 404);
    }

    if (inviter.platformRole !== "ADMIN") {
      const hasPerm = await prisma.rolePermission.findFirst({
        where: {
          roleId: inviter.roleId,
          permission: { code: "manage:users" },
        },
      });
      if (!hasPerm) {
        return error("You do not have permission to invite users", 403);
      }
    }

    // Check tenant capacity
    const tenant = await prisma.tenant.findUnique({
      where: { id: auth.tenantId },
      include: { _count: { select: { users: true } } },
    });

    if (!tenant) {
      return error("Tenant not found", 404);
    }

    if (tenant._count.users >= tenant.maxUsers) {
      return error(
        `User limit reached (${tenant.maxUsers}). Please upgrade your plan to add more users.`,
        403
      );
    }

    // Check if email already has an active user in this tenant
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        tenantId: auth.tenantId,
      },
    });

    if (existingUser) {
      return error("This user already belongs to your organization", 409);
    }

    // Check for existing pending invite
    const existingInvite = await prisma.invite.findFirst({
      where: {
        email: data.email,
        tenantId: auth.tenantId,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      return error("An invitation has already been sent to this email", 409);
    }

    // Generate invite token
    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = await prisma.invite.create({
      data: {
        email: data.email,
        companyName: tenant.name,
        type: "HOTEL",
        token,
        status: "PENDING",
        invitedById: auth.userId,
        tenantId: auth.tenantId,
        expiresAt,
      },
    });

    await audit({
      entityType: "INVITE",
      entityId: invite.id,
      action: "USER_INVITE",
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.platformRole,
      afterState: { email: data.email, token },
      ipAddress: request.headers.get("x-forwarded-for") || null,
      userAgent: request.headers.get("user-agent"),
    });

    return success(
      {
        id: invite.id,
        email: invite.email,
        token: invite.token,
        expiresAt: invite.expiresAt,
      },
      201
    );
  },
  { rateLimit: "auth" }
);
