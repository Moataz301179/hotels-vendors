import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordApproval } from "@/lib/auth/authority-matrix";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const ApproveSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED", "ESCALATED"]),
  reason: z.string().optional(),
});

export const POST = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;
  const body = await request.json();
  const data = ApproveSchema.parse(body);

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return error("Order not found", 404);
  }

  if (auth.platformRole === "HOTEL" && order.hotelId !== auth.tenantId) {
    return error("Forbidden", 403);
  }

  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) {
    return error("User not found", 404);
  }

  // Permission check: only certain roles can approve
  const canApprove = ["OWNER", "REGIONAL_GM", "GM", "FINANCIAL_CONTROLLER", "DEPARTMENT_HEAD"].includes(user.role);
  if (!canApprove && !user.canOverride) {
    return error("Insufficient permissions to approve orders", 403);
  }

  await recordApproval(id, auth.userId, data.action, data.reason);

  await audit({
    entityType: "ORDER",
    entityId: id,
    action: `ORDER_${data.action}`,
    actorId: auth.userId,
    actorRole: user.role,
    afterState: { action: data.action, reason: data.reason },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ message: `Order ${data.action.toLowerCase()}`, orderId: id });
});
