import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordApproval } from "@/lib/auth/authority-matrix";
import { apiRoute, authenticate, success, error, audit, requirePermission } from "@/lib/api-utils";
import { z } from "zod";

const ApproveSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED", "ESCALATED"]),
  reason: z.string().optional(),
});

export const POST = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:approve");
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;
  const body = await request.json();
  const data = ApproveSchema.parse(body);
  const { action, reason } = data;

  const record = await prisma.order.findUnique({
    where: { id },
    select: { tenantId: true, status: true, orderNumber: true },
  });
  if (!record || record.tenantId !== auth.tenantId) return error("Not found", 404);

  if (action === "APPROVED" && record.status !== "PENDING_APPROVAL") {
    return error(`Cannot approve order in status ${record.status}`, 400);
  }
  if (action === "REJECTED" && record.status === "REJECTED") {
    return error("Order is already rejected", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) return error("User not found", 404);

  const canApprove = ["OWNER", "REGIONAL_GM", "GM", "FINANCIAL_CONTROLLER", "DEPARTMENT_HEAD"].includes(user.role);
  if (!canApprove && !user.canOverride) {
    return error("Insufficient permissions to approve orders", 403);
  }

  const orderBefore = await prisma.order.findUnique({
    where: { id },
    select: { status: true, paymentGuaranteed: true, paymentGuaranteeMethod: true },
  });

  await recordApproval(
    id,
    auth.userId,
    auth.tenantId,
    action,
    reason,
    orderBefore ? JSON.stringify(orderBefore) : undefined,
  );

  await audit({
    entityType: "ORDER",
    entityId: id,
    action: `ORDER_${action}`,
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: user.role,
    beforeState: orderBefore ? { status: orderBefore.status } : null,
    afterState: { action, reason },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ message: `Order ${action.toLowerCase()}`, orderId: id });
}, { rateLimit: "api" });
