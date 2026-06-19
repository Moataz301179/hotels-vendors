import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success, error, audit } from "@/lib/api-utils";
import { randomBytes } from "crypto";

export const POST = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:approve");

  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      tenantId: true,
      status: true,
      orderNumber: true,
      hotelId: true,
      requesterId: true,
    },
  });

  if (!order || order.tenantId !== auth.tenantId) {
    return error("Order not found", 404);
  }

  // Only APPROVED orders can transition to PENDING_CONFIRMATION
  if (order.status !== "APPROVED") {
    return error(
      `Order must be in APPROVED status to request confirmation. Current status: ${order.status}`,
      400
    );
  }

  // Generate a 32-byte hex confirmation token
  const confirmationToken = randomBytes(32).toString("hex");

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: "PENDING_CONFIRMATION",
      confirmationToken,
      confirmationSentAt: new Date(),
    },
  });

  await audit({
    entityType: "ORDER",
    entityId: order.id,
    action: "CONFIRMATION_REQUESTED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      orderNumber: order.orderNumber,
      previousStatus: order.status,
      newStatus: "PENDING_CONFIRMATION",
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  // TODO: Send confirmation email/SMS to the hotel's authorized confirmers
  // The email should contain a link like:
  // ${baseUrl}/orders/${order.id}/confirm?token=${confirmationToken}

  return success({
    order: {
      id: updated.id,
      orderNumber: updated.orderNumber,
      status: updated.status,
      confirmationSentAt: updated.confirmationSentAt,
    },
    message: "Confirmation request sent. The order will be confirmed once an authorized user approves it.",
  });
});
