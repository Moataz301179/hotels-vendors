/**
 * Order Status Update API
 * PATCH /api/v1/orders/:id/status
 *
 * Enforces state machine transitions. Suppliers can progress orders
 * through fulfillment (CONFIRMED → IN_TRANSIT → DELIVERED).
 * Hotels can cancel. Admins can override.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { apiRoute, authenticate, requirePermission, success, error, audit } from "@/lib/api-utils";
import { validateStatusTransition } from "@/lib/auth/state-machine";
import { z } from "zod";

const UpdateStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  reason: z.string().optional(),
});

export const PATCH = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:approve");
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;

  const body = await request.json();
  const parsed = UpdateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return error("Invalid status", 400);
  }
  const { status: newStatus, reason } = parsed.data;

  // Fetch order with ownership check
  const order = await prisma.order.findFirst({
    where: {
      id,
      // Suppliers see orders for their tenant; hotels see their own orders; admin sees all
      ...(auth.platformRole === "SUPPLIER"
        ? { tenantId: auth.tenantId }
        : auth.platformRole === "HOTEL"
          ? { hotel: { tenantId: auth.tenantId } }
          : {}),
    },
    include: { hotel: true, supplier: true, items: true },
  });

  if (!order) {
    return error("Order not found", 404);
  }

  // Validate state machine transition
  const transition = validateStatusTransition(order.status, newStatus);
  if (!transition.valid) {
    return error(transition.reason || "Invalid status transition", 400);
  }

  // Update order
  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: newStatus,
      ...(newStatus === "DELIVERED" ? { deliveryDate: new Date() } : {}),
    },
    include: {
      hotel: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
      items: { include: { product: { select: { id: true, name: true, sku: true } } } },
    },
  });

  // Audit log
  await audit({
    entityType: "ORDER",
    entityId: order.id,
    action: "STATUS_UPDATE",
    tenantId: order.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    beforeState: { status: order.status },
    afterState: { status: newStatus, reason },
  });

  return success({ order: updated });
});
