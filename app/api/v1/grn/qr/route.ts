import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { createDeliveryToken, validateDeliveryToken, getOrderForReceiving } from "@/lib/fintech/grn-token";

/** GET /api/v1/grn/qr?orderId=xxx — supplier/driver gets the QR payload (order must be CONFIRMED/IN_TRANSIT). */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const orderId = request.nextUrl.searchParams.get("orderId");
  if (!orderId) return error("orderId required", 400);

  const order = await prisma.order.findFirst({
    where: { id: orderId, tenantId: auth.tenantId },
    select: { id: true, status: true, orderNumber: true },
  });
  if (!order) return error("Order not found", 404);
  if (!["CONFIRMED", "IN_TRANSIT", "PARTIALLY_DELIVERED"].includes(order.status)) {
    return error(`QR available only for confirmed/in-transit orders (current: ${order.status})`, 400);
  }

  return success({ orderId: order.id, orderNumber: order.orderNumber, qrPayload: createDeliveryToken(order.id) });
});

const VerifyBodySchema = z.object({
  token: z.string().min(10),
  lines: z.array(z.object({
    orderItemId: z.string(),
    receivedQuantity: z.number().int().min(0),
    rejectedQuantity: z.number().int().min(0).default(0),
    rejectionReason: z.string().optional(),
    batchNumber: z.string().optional(),
  })).min(1),
  warehouseLocation: z.string().optional(),
  vehiclePlate: z.string().optional(),
  deliveryNoteRef: z.string().optional(),
});

/** POST /api/v1/grn/qr — hotel scans QR, submits received lines → GRN created. */
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = VerifyBodySchema.parse(await request.json());

  const orderId = validateDeliveryToken(body.token);
  if (!orderId) return error("Invalid or expired delivery QR", 400);

  // Full order row for hotelId/supplierId + scoped items
  const order = await prisma.order.findFirst({
    where: { id: orderId, tenantId: auth.tenantId },
    include: { items: { include: { product: { select: { id: true, name: true, sku: true } } } } },
  });
  if (!order) return error("Order not found in your organization", 404);
  if (!["CONFIRMED", "IN_TRANSIT", "PARTIALLY_DELIVERED"].includes(order.status)) {
    return error(`Cannot receive order in status ${order.status}`, 400);
  }

  // Line validations
  const itemById = new Map(order.items.map((i) => [i.id, i]));
  for (const line of body.lines) {
    const item = itemById.get(line.orderItemId);
    if (!item) return error(`Line ${line.orderItemId} does not belong to order ${order.orderNumber}`, 400);
    if (line.rejectedQuantity > line.receivedQuantity) {
      return error(`Rejected quantity cannot exceed received for ${item.product?.name ?? line.orderItemId}`, 400);
    }
    const already = item.receivedQuantity ?? 0;
    if (already + line.receivedQuantity > item.quantity) {
      return error(`Received quantity for ${item.product?.name ?? line.orderItemId} exceeds ordered amount`, 400);
    }
  }

  const grnNumber = `GRN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now().toString().slice(-6)}`;

  const result = await prisma.$transaction(async (tx) => {
    const created = await tx.goodsReceiptNote.create({
      data: {
        grnNumber,
        status: "RECEIVING",
        orderId: order.id,
        hotelId: order.hotelId,
        supplierId: order.supplierId,
        tenantId: auth.tenantId,
        receivedById: auth.userId,
        warehouseLocation: body.warehouseLocation,
        vehiclePlate: body.vehiclePlate,
        deliveryNoteRef: body.deliveryNoteRef,
      },
    });

    for (const line of body.lines) {
      const item = itemById.get(line.orderItemId)!;
      const accepted = line.receivedQuantity - line.rejectedQuantity;

      await tx.grnLineItem.create({
        data: {
          grnId: created.id,
          orderItemId: line.orderItemId,
          productId: item.product?.id ?? "",
          orderedQuantity: item.quantity,
          receivedQuantity: line.receivedQuantity,
          acceptedQuantity: accepted,
          rejectedQuantity: line.rejectedQuantity,
          rejectionReason: line.rejectionReason,
          batchNumber: line.batchNumber,
        },
      });

      await tx.orderItem.update({
        where: { id: line.orderItemId },
        data: {
          receivedQuantity: (item.receivedQuantity ?? 0) + line.receivedQuantity,
          returnedQuantity: line.rejectedQuantity,
          returnReason: line.rejectionReason,
        },
      });
    }

    // GRN status from the submitted lines (mirrors main GRN route logic)
    const allAccepted = body.lines.every((li) => li.rejectedQuantity === 0 && li.receivedQuantity > 0);
    const allRejected = body.lines.every((li) => li.receivedQuantity === 0 || li.rejectedQuantity === li.receivedQuantity);
    const grnStatus = allRejected ? "REJECTED" : allAccepted ? "ACCEPTED" : "PARTIALLY_ACCEPTED";

    await tx.goodsReceiptNote.update({
      where: { id: created.id },
      data: { status: grnStatus, acceptedAt: grnStatus === "ACCEPTED" ? new Date() : null },
    });

    // Fully received? → order PARTIALLY_DELIVERED/DELIVERED marker on items
    const refreshed = await tx.orderItem.findMany({ where: { orderId: order.id }, select: { quantity: true, receivedQuantity: true } });
    const fullyReceived = refreshed.every((i) => (i.receivedQuantity ?? 0) >= i.quantity);
    const anyReceived = refreshed.some((i) => (i.receivedQuantity ?? 0) > 0);

    return { grnId: created.id, grnNumber, grnStatus, fullyReceived, anyReceived };
  });

  return success({
    grnNumber: result.grnNumber,
    grnId: result.grnId,
    status: result.grnStatus,
    orderFullyReceived: result.fullyReceived,
    note: result.fullyReceived
      ? "Fully received. Move the order to DELIVERED to trigger invoice + ETA."
      : result.anyReceived
        ? "Partially received — discrepancies recorded."
        : "Nothing accepted — GRN recorded as rejected.",
  }, 201);
});
