import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission, audit } from "@/lib/api-utils";
import { z } from "zod";

const FulfillPoschema = z.object({
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  shippedAt: z.string().datetime().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const POST = apiRoute(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:update");
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id: poId } = resolved;
  const body = await request.json();
  const data = FulfillPoschema.parse(body);

  const order = await prisma.order.findUnique({
    where: { id: poId },
    include: { items: true, invoices: true },
  });
  if (!order || order.tenantId !== auth.tenantId) return error("Purchase order not found", 404);

  // Only supplier (or admin) can fulfill
  if (auth.platformRole !== "SUPPLIER" && auth.platformRole !== "ADMIN") {
    return error("Only suppliers can mark orders as fulfilled", 403);
  }

  // Must be ACCEPTED or CONFIRMED before fulfillment
  if (!["ACCEPTED", "CONFIRMED"].includes(order.status)) {
    return error(`Cannot fulfill order with status ${order.status}. Order must be ACCEPTED or CONFIRMED first.`, 400);
  }

  const beforeState = { status: order.status, paymentGuaranteed: order.paymentGuaranteed };

  // Atomic update: set status to CONFIRMED/IN_TRANSIT with tracking info
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // Row lock to prevent race conditions
    const locked = await tx.$queryRaw<Array<{ id: string; status: string }>>`
      SELECT "id", "status" FROM "Order" WHERE "id" = ${poId} FOR UPDATE
    `;
    if (locked.length === 0) throw new Error("Order not found during atomic update");

    const newStatus = data.shippedAt ? "IN_TRANSIT" : "CONFIRMED";

    const updateData: Record<string, unknown> = {
      status: newStatus as any,
    };

    if (data.shippedAt) updateData.shippingMethod = data.carrier || "STANDARD";
    if (data.estimatedDelivery) updateData.estimatedDelivery = new Date(data.estimatedDelivery);

    const updated = await tx.order.update({
      where: { id: poId },
      data: updateData,
      include: {
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true, tier: true } },
        items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        invoices: true,
      },
    });

    // Create approval record for fulfillment
    await tx.orderApproval.create({
      data: {
        orderId: poId,
        approverId: auth.userId,
        action: "APPROVED" as any,
        reason: data.notes || "Supplier marked order as fulfilled",
        beforeState: beforeState.status,
        afterState: newStatus,
      },
    });

    return updated;
  });

  // Audit log
  await audit({
    entityType: "ORDER",
    entityId: poId,
    action: "FULFILL",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    beforeState,
    afterState: { status: updatedOrder.status, trackingNumber: data.trackingNumber, carrier: data.carrier },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    order: updatedOrder,
    message: "Purchase order fulfilled successfully",
    fulfillment: {
      trackingNumber: data.trackingNumber,
      carrier: data.carrier,
      shippedAt: data.shippedAt ? new Date(data.shippedAt) : new Date(),
      estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : null,
    },
  });
});
