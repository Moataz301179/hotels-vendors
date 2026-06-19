import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const ConfirmSchema = z.object({
  token: z.string().min(10),
});

export const POST = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:confirm");

  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;

  const body = await request.json();
  const { token } = ConfirmSchema.parse(body);

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      tenantId: true,
      status: true,
      orderNumber: true,
      confirmationToken: true,
      confirmationSentAt: true,
      hotelId: true,
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

  // Check token expiry (24 hours)
  if (order.confirmationSentAt) {
    const expiryMs = 24 * 60 * 60 * 1000;
    if (Date.now() - order.confirmationSentAt.getTime() > expiryMs) {
      return error("Confirmation token has expired. Please request a new confirmation.", 410);
    }
  }

  // Confirm the order — transition to CONFIRMED
  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: "CONFIRMED",
      confirmedById: auth.userId,
      confirmedAt: new Date(),
      confirmationToken: null, // Clear token after use
    },
  });

  await audit({
    entityType: "ORDER",
    entityId: order.id,
    action: "ORDER_CONFIRMED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      orderNumber: order.orderNumber,
      previousStatus: "PENDING_CONFIRMATION",
      newStatus: "CONFIRMED",
      confirmedById: auth.userId,
      confirmedAt: updated.confirmedAt,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    order: {
      id: updated.id,
      orderNumber: updated.orderNumber,
      status: updated.status,
      confirmedAt: updated.confirmedAt,
    },
    message: "Order confirmed successfully. The supplier has been notified to proceed with fulfillment.",
  });
});
