import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderCreateSchema, PaginationSchema } from "@/lib/zod";
import { evaluateAuthority } from "@/lib/auth/authority-matrix";
import { checkCreditLimit, checkAndReserveCredit, CREDIT_EXCEEDED_ERROR } from "@/lib/credit-gate";
import { apiRoute, authenticate, validateBody, validateQuery, success, error, audit, requireIdempotencyKey, completeIdempotency, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:read");
  const tenantId = auth.tenantId;
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = { tenantId };
  // TODO: Scope by actual hotelId/supplierId based on user's entity linkage
  // Currently simplified — full RLS will filter by tenantId only

  if (query.search) {
    where.orderNumber = { contains: query.search };
  }
  // Status filter (mobile approvals screen + dashboard tabs)
  const statusParam = request.nextUrl.searchParams.get("status");
  if (statusParam) {
    const statuses = ["DRAFT","PENDING_APPROVAL","APPROVED","REJECTED","CONFIRMED","IN_TRANSIT","PARTIALLY_DELIVERED","DELIVERED","DISPUTED","CANCELLED"] as const;
    if ((statuses as readonly string[]).includes(statusParam)) {
      where.status = statusParam;
    }
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

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { hotel: true },
  });

  if (!user) {
    return error("User account not found", 404);
  }
  if (!user.hotelId) {
    return error("No hotel associated with user", 400);
  }

  const hotelId = data.hotelId || user.hotelId;
  const requesterId = data.requesterId || auth.userId;

  const supplier = await prisma.supplier.findUnique({ where: { id: data.supplierId } });
  if (!supplier || supplier.tenantId !== auth.tenantId) {
    return error("Supplier not found or unavailable", 404);
  }

  const idempotencyKey = await requireIdempotencyKey(request, {
    userId: auth.userId,
    action: "CREATE_ORDER",
    amount: data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
  });

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatRate = 14;
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  // ── CREDIT GATE: reject before any mutation ──
  const creditCheck = await checkCreditLimit(hotelId, total);
  if (!creditCheck.allowed) {
    completeIdempotency(idempotencyKey, "CREDIT_DENIED");
    return error(
      `Order rejected: ${creditCheck.reason}. Available credit: EGP ${creditCheck.available.toFixed(2)}`,
      402,
    );
  }

  // ── ATOMIC ORDER + CREDIT CAPTURE ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let order: any;
  try {
    order = await prisma.$transaction(async (tx) => {
      // ATOMIC credit gate: SELECT ... FOR UPDATE row lock, then check and
      // increment in the same transaction. Throws CREDIT_EXCEEDED_ERROR to
      // roll back if the concurrent exposure would breach the limit.
      await checkAndReserveCredit(tx, hotelId, total);

      const createdOrder = await tx.order.create({
        data: {
          tenantId: auth.tenantId,
          orderNumber: data.orderNumber,
          hotelId,
          propertyId: data.propertyId,
          outletId: data.outletId,
          supplierId: data.supplierId,
          requesterId,
          subtotal,
          vatAmount,
          total,
          currency: "EGP",
          deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
          deliveryInstructions: data.deliveryInstructions,
          status: "DRAFT",
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

      return createdOrder;
    });
  } catch (err) {
    if (err instanceof CREDIT_EXCEEDED_ERROR) {
      completeIdempotency(idempotencyKey, "CREDIT_DENIED");
      return error(err.message, 402);
    }
    throw err;
  }

  // Trigger Authority Matrix evaluation
  const evaluation = await evaluateAuthority(order.id, {
    userId: auth.userId,
    userRole: auth.platformRole === "HOTEL" ? "DEPARTMENT_HEAD" : "OWNER",
    tenantId: auth.tenantId,
    ipAddress: request.headers.get("x-forwarded-for") || undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  // Set order status based on authority evaluation
  let finalStatus: "APPROVED" | "PENDING_APPROVAL" = "PENDING_APPROVAL";
  if (evaluation.action === "AUTO_APPROVE" && evaluation.canProceed) {
    finalStatus = "APPROVED";
  }

  if (finalStatus !== order.status) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: finalStatus },
    });
    order.status = finalStatus;
  }

  await audit({
    entityType: "ORDER",
    entityId: order.id,
    action: "CREATE_ORDER",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      evaluation: evaluation.action,
      creditCaptured: total,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  completeIdempotency(idempotencyKey, order.id);

  return success({ order, evaluation }, 201);
}, { rateLimit: "api" });
