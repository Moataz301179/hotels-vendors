import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, apiRoute, success, error } from "@/lib/api-utils";
import { enforceTenantSeatCapacity, SeatLimitExceededError } from "@/lib/seat-limits";
import { z } from "zod";
import crypto from "crypto";

const CreateInviteSchema = z.object({
  email: z.string().email().max(255),
  companyName: z.string().min(1).max(200),
  type: z.enum(["SUPPLIER", "HOTEL"]),
  message: z.string().max(1000).optional(),
});

const INVITE_EXPIRY_DAYS = 30;

function generateInviteToken(): { token: string; hash: string; expiresAt: Date } {
  const token = crypto.randomBytes(24).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  return { token, hash, expiresAt };
}

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const parsed = CreateInviteSchema.parse(body);

  // Enforce seat capacity before allowing invite
  try {
    await enforceTenantSeatCapacity(auth.tenantId);
  } catch (e) {
    if (e instanceof SeatLimitExceededError) {
      return error(e.message, 403);
    }
    throw e;
  }

  // Fetch inviting user info
  const inviter = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { name: true, companyName: true, platformRole: true },
  });
  if (!inviter) return error("User not found", 404);

  // Check if a user with this email already exists in the tenant
  const existingUser = await prisma.user.findFirst({
    where: { email: parsed.email, tenantId: auth.tenantId },
  });
  if (existingUser) {
    return error("A user with this email already belongs to your organisation", 409);
  }

  // Generate invite token
  const { token, hash, expiresAt } = generateInviteToken();

  // Create the invite record
  const invite = await prisma.invite.create({
    data: {
      email: parsed.email,
      companyName: parsed.companyName,
      type: parsed.type,
      message: parsed.message || null,
      token: hash,
      status: "PENDING",
      invitedById: auth.userId,
      tenantId: auth.tenantId,
      expiresAt,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      action: "INVITE_SENT",
      entityType: "INVITE",
      entityId: invite.id,
      actorId: auth.userId,
      actorRole: auth.platformRole,
      tenantId: auth.tenantId,
      afterState: JSON.stringify({
        email: parsed.email,
        companyName: parsed.companyName,
        type: parsed.type,
        expiresAt: expiresAt.toISOString(),
      }),
    },
  });

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://hotelsvendors.com"}/register?token=${token}&invitedBy=${auth.userId}&type=${parsed.type}&tenantId=${auth.tenantId}`;

  return success({
    id: invite.id,
    inviteLink,
    message: "Invite created successfully. Share the link with your partner.",
    expiresAt: expiresAt.toISOString(),
  }, 201);
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const invites = await prisma.invite.findMany({
    where: { tenantId: auth.tenantId },
    orderBy: { createdAt: "desc" },
    include: {
      invitedBy: { select: { id: true, name: true, email: true } },
    },
  });

  return success({ invites });
});
