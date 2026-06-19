import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const ConvertSchema = z.object({
  sampleRequestId: z.string().min(1),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const { sampleRequestId } = ConvertSchema.parse(body);

  const sample = await prisma.sampleRequest.findUnique({
    where: { id: sampleRequestId },
  });

  if (!sample) return error("Sample request not found", 404);
  if (sample.status !== "DELIVERED") {
    return error("Sample must be delivered before converting to an order", 400);
  }
  if (sample.convertedToOrderId) {
    return error("This sample has already been converted to an order", 400);
  }

  // Create a draft order from the sample
  const order = await prisma.order.create({
    data: {
      orderNumber: `ORD-SAMPLE-${Date.now()}`,
      status: "DRAFT",
      subtotal: 0,
      vatAmount: 0,
      total: 0,
      tenantId: auth.tenantId,
      hotelId: sample.hotelId!,
      supplierId: "",
      requesterId: sample.userId,
    },
  });

  await prisma.sampleRequest.update({
    where: { id: sampleRequestId },
    data: { convertedToOrderId: order.id },
  });

  await prisma.sampleRequestLog.create({
    data: {
      sampleRequestId,
      action: "CONVERTED",
      actorId: auth.userId,
      actorRole: auth.platformRole,
      notes: `Converted to order ${order.id}`,
    },
  });

  await audit({
    entityType: "SAMPLE_REQUEST",
    entityId: sampleRequestId,
    action: "SAMPLE_CONVERTED_TO_ORDER",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { orderId: order.id, orderNumber: order.orderNumber },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ order, message: "Sample converted to draft order" });
});
