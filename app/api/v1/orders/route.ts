import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderCreateSchema, PaginationSchema } from "@/lib/zod";
import { evaluateAuthority } from "@/lib/auth/authority-matrix";
import { evaluateOrderForFraud } from "@/lib/fraud/detector";
import { apiRoute, authenticate, validateBody, validateQuery, success, error, audit, requireIdempotencyKey, completeIdempotency, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:read");
  const tenantId = auth.tenantId;
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  // Scope by the user's entity linkage for proper RLS
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { hotelId: true, supplierId: true },
  });

  // Orders are cross-tenant — scope by hotelId or supplierId, NOT by tenantId
  const where: Record<string, unknown> = {};
  
  if (auth.platformRole === "HOTEL" && user?.hotelId) {
    where.hotelId = user.hotelId;
  } else if (auth.platformRole === "SUPPLIER" && user?.supplierId) {
    where.supplierId = user.supplierId;
  } else {
    where.tenantId = tenantId;
  }

  if (query.search) {
    where.orderNumber = { contains: query.search };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: { hotel: { select: { id: true, name: true } }, supplier: { select: { id: true, name: true } }, items: { include: { product: { select: { id: true, name: true, sku: true } } } } },
    }),
    prisma.order.count({ where }),
  ]);

  return success({ orders, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } });
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:create");
  const body = await request.json();
  const data = validateBody(OrderCreateSchema, body);

  const idempotencyKey = await requireIdempotencyKey(request, { userId: auth.userId, action: "CREATE_ORDER", amount: 0 });

  // Calculate totals from items
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatRate = 14;
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  const order = await prisma.order.create({
    data: {
      tenantId: auth.tenantId,
      orderNumber: data.orderNumber,
      hotelId: data.hotelId,
      propertyId: data.propertyId,
      outletId: data.outletId,
      supplierId: data.supplierId,
      requesterId: auth.userId,
      subtotal,
      vatAmount,
      total,
      currency: "EGP",
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      deliveryInstructions: data.deliveryInstructions,
      status: "PENDING_APPROVAL",
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          notes: item.notes,
        })),
      },
    },
    include: { items: { include: { product: true } }, hotel: true, supplier: true },
  });

  // Trigger Authority Matrix evaluation
  const evaluation = await evaluateAuthority(order.id, {
    userId: auth.userId,
    userRole: auth.platformRole === "HOTEL" ? "DEPARTMENT_HEAD" : "OWNER",
    tenantId: auth.tenantId,
    ipAddress: request.headers.get("x-forwarded-for") || undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  await audit({
    entityType: "ORDER",
    entityId: order.id,
    action: "CREATE_ORDER",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { orderNumber: order.orderNumber, total: order.total, status: order.status, evaluation: evaluation.action },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  const fraudResult = await evaluateOrderForFraud(order.id, auth.tenantId, auth.userId, request.headers.get("x-forwarded-for") || undefined);
  if (fraudResult.triggered) {
    const blocked = fraudResult.alerts.some((a) => a.autoAction === "BLOCK_TRANSACTION" || a.autoAction === "SUSPEND_ENTITY");
    if (blocked) {
      await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
      return error("Order blocked by fraud detection", 409);
    }
  }

  completeIdempotency(idempotencyKey, order.id);

  return success({ order, evaluation, fraudAlerts: fraudResult.alerts }, 201);
});
