/**
 * Checkout API
 * POST — Calculate pricing for all payment lanes and execute checkout
 */

import { NextRequest } from "next/server";
import { apiRoute, authenticate, success, ApiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { calculateLanePricing, executeCheckout } from "@/lib/payments/lanes";

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const body = await request.json();
  if (!body.orderId || !body.lane) {
    throw new ApiError("orderId and lane required", 400);
  }

  const result = await executeCheckout({
    orderId: body.orderId,
    hotelId: auth.userId, // or get hotelId from user's context
    lane: body.lane,
    tenantId: auth.tenantId,
    masterInvoiceId: body.masterInvoiceId,
  });

  if (!result.success) {
    throw new ApiError(result.message, 400);
  }

  return success(result);
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) throw new ApiError("orderId query param required", 400);

  const order = await prisma.order.findUnique({
    where: { id: orderId, tenantId: auth.tenantId },
    include: { OrderItem: { include: { Product: true } } },
  });

  if (!order) throw new ApiError("Order not found", 404);

  const items = order.OrderItem.map((oi) => ({
    productId: oi.productId,
    quantity: oi.quantity,
  }));

  const lanes = await calculateLanePricing(items, order.hotelId);

  return success(lanes);
});
