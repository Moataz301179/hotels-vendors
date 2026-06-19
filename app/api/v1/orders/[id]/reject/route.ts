import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const RejectSchema = z.object({
  token: z.string().min(10),
  reason: z.string().min(3).max(500).optional(),
});

export const POST = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:confirm");

  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;

  const body = await request.json();
  const { token, reason } = RejectSchema.parse(body);

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      tenantId: true,
      status: true,
      orderNumber: true,
      confirmationToken: true,
      confirmationSentAt: true,
    },
  });

  if (!order || order.tenantId !== auth.tenantId) {
    return error("Order not found", 404);
  }

  if (order.status !== "PENDING_CONFIRMATION") {
    return error(
      `Order is not awaiting confirmation. Current status: ${order.status}`,
      400
    );
  }

  // Validate token
  if (!order.confirmationToken || order.confirmationToken !== token) {
    return error("Invalid confirmation token", 403);
  }

  // Reject — transition back to APPROVED (so it can be re-confirmed or cancelled)
  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: "APPROVED",
      confirmationToken: null,
      confirmationSentAt: null,
    },
  });

  await audit({
    entityType: "ORDER",
    entityId: order.id,
    action: "ORDER_CONFIRMATION_REJECTED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      orderNumber: order.orderNumber,
      previousStatus: "PENDING_CONFIRMATION",
      newStatus: "APPROVED",
      rejectionReason: reason || null,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    order: {
      id: updated.id,
      orderNumber: updated.orderNumber,
      status: updated.status,
    },
    message: "Order confirmation rejected. The order has returned to APPROVED status.",
  });
});
