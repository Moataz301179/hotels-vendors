import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReturnCreateSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateBody, success, error, audit, requirePermission } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "return:create");
  const body = await request.json();
  const data = validateBody(ReturnCreateSchema, body);

  const order = await prisma.order.findFirst({
    where: { id: data.orderId, tenantId: auth.tenantId },
    include: { items: true },
  });
  if (!order) return error("Order not found", 404);

  if (!["DELIVERED", "PARTIALLY_DELIVERED"].includes(order.status)) {
    return error(`Cannot create return for order in status: ${order.status}`, 400);
  }

  const orderItemIds = new Set(order.items.map((i) => i.id));
  for (const item of data.items) {
    if (!orderItemIds.has(item.orderItemId)) {
      return error(`Order item ${item.orderItemId} does not belong to this order`, 400);
    }
  }

  const returnNumber = `RET-${Date.now()}`;

  const returnRequest = await prisma.$transaction(async (tx) => {
    const rr = await tx.returnRequest.create({
      data: {
        returnNumber,
        orderId: data.orderId,
        initiatedById: auth.userId,
        hotelId: order.hotelId,
        tenantId: auth.tenantId,
        reason: data.reason,
        description: data.description,
        evidenceUrls: data.evidenceUrls,
        status: "PENDING_SUPPLIER_RESPONSE",
        items: {
          create: data.items.map((item) => ({
            orderItemId: item.orderItemId,
            quantity: item.quantity,
            reason: item.reason,
            description: item.description,
            evidenceUrls: item.evidenceUrls,
            status: "PENDING",
          })),
        },
      },
      include: {
        items: { include: { orderItem: { include: { product: { select: { id: true, name: true, sku: true } } } } } },
        order: { select: { id: true, orderNumber: true } },
      },
    });

    let totalReturnAmount = 0;
    for (const item of rr.items) {
      totalReturnAmount += Number(item.orderItem.unitPrice) * item.quantity;
    }
    await tx.returnRequest.update({
      where: { id: rr.id },
      data: { totalReturnAmount },
    });

    return rr;
  });

  await audit({
    entityType: "RETURN_REQUEST",
    entityId: returnRequest.id,
    action: "CREATE_RETURN",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { returnNumber, orderId: data.orderId, itemCount: data.items.length },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ returnRequest }, 201);
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "return:read");
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId") || undefined;
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const where: Record<string, unknown> = { tenantId: auth.tenantId };
  if (orderId) where.orderId = orderId;
  if (status) where.status = status;

  if (auth.platformRole === "HOTEL") {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { hotelId: true },
    });
    if (user?.hotelId) where.hotelId = user.hotelId;
  }

  const [returns, total] = await Promise.all([
    prisma.returnRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        order: { select: { id: true, orderNumber: true } },
        items: {
          include: {
            orderItem: { include: { product: { select: { id: true, name: true, sku: true } } } },
          },
        },
      },
    }),
    prisma.returnRequest.count({ where }),
  ]);

  return success({ returns, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});
