import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission, audit } from "@/lib/api-utils";
import { z } from "zod";

const AcceptPoschema = z.object({
  note: z.string().optional(),
});

export const POST = apiRoute(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:update");
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id: poId } = resolved;
  const body = await request.json();
  const data = AcceptPoschema.parse(body);

  const order = await prisma.order.findUnique({
    where: { id: poId },
    include: { items: true, invoices: true },
  });
  if (!order || order.tenantId !== auth.tenantId) return error("Purchase order not found", 404);

  // Only supplier (or admin) can accept
  if (auth.platformRole !== "SUPPLIER" && auth.platformRole !== "ADMIN") {
    return error("Only suppliers can accept purchase orders", 403);
  }

  // Validate transition to ACCEPTED
  if (order.status === "ACCEPTED") {
    return error("Purchase order already accepted", 400);
  }

  const validFromStatuses = ["APPROVED", "CONFIRMED", "PENDING_APPROVAL"];
  if (!validFromStatuses.includes(order.status)) {
    return error(`Cannot accept order with status ${order.status}`, 400);
  }

  const beforeState = { status: order.status };

  // Atomic update: set status to ACCEPTED, record acceptance
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // Row lock to prevent race conditions
    const locked = await tx.$queryRaw<Array<{ id: string; status: string }>>`
      SELECT "id", "status" FROM "Order" WHERE "id" = ${poId} FOR UPDATE
    `;
    if (locked.length === 0) throw new Error("Order not found during atomic update");

    const updated = await tx.order.update({
      where: { id: poId },
      data: { status: "ACCEPTED" as any },
      include: {
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true, tier: true } },
        items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        invoices: true,
      },
    });

    // Create approval record for acceptance
    await tx.orderApproval.create({
      data: {
        orderId: poId,
        approverId: auth.userId,
        action: "APPROVED" as any,
        reason: data.note || "Supplier accepted the purchase order",
        beforeState: beforeState.status,
        afterState: "ACCEPTED",
      },
    });

    return updated;
  });

  // Audit log
  await audit({
    entityType: "ORDER",
    entityId: poId,
    action: "ACCEPT",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    beforeState,
    afterState: { status: "ACCEPTED" },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ order: updatedOrder, message: "Purchase order accepted successfully" });
});
