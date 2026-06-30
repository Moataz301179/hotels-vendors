import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { InvoiceCreateSchema, PaginationSchema } from "@/lib/zod";
import { evaluateInvoiceForFraud } from "@/lib/fraud/detector";
import { apiRoute, authenticate, validateBody, validateQuery, success, error, audit, requireIdempotencyKey, completeIdempotency, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invoice:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = { tenantId: auth.tenantId };

  if (query.search) {
    where.invoiceNumber = { contains: query.search };
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: { hotel: { select: { id: true, name: true } }, supplier: { select: { id: true, name: true } }, order: { select: { id: true, orderNumber: true } } },
    }),
    prisma.invoice.count({ where }),
  ]);

  return success({ invoices, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } });
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invoice:create");
  const body = await request.json();
  const data = validateBody(InvoiceCreateSchema, body);

  // Cross-entity validation: verify order, hotel, and supplier belong to the same tenant
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    select: { tenantId: true, hotelId: true, supplierId: true },
  });
  if (!order) {
    return error("Order not found", 404);
  }
  if (order.tenantId !== auth.tenantId) {
    return error("Order does not belong to your tenant", 403);
  }
  if (order.hotelId !== data.hotelId) {
    return error("Hotel does not match the order", 422);
  }
  if (order.supplierId !== data.supplierId) {
    return error("Supplier does not match the order", 422);
  }

  const idempotencyKey = await requireIdempotencyKey(request, { userId: auth.userId, action: "CREATE_INVOICE", amount: data.total });

  const invoice = await prisma.invoice.create({
    data: {
      tenantId: auth.tenantId,
      invoiceNumber: data.invoiceNumber,
      orderId: data.orderId,
      hotelId: data.hotelId,
      supplierId: data.supplierId,
      subtotal: data.subtotal,
      vatRate: data.vatRate,
      vatAmount: data.vatAmount,
      total: data.total,
      issueDate: new Date(data.issueDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      status: "DRAFT",
      paymentStatus: "UNPAID",
      etaStatus: "PENDING",
      factoringStatus: "NOT_FACTORABLE",
    },
    include: { hotel: true, supplier: true, order: true },
  });

  await audit({
    entityType: "INVOICE",
    entityId: invoice.id,
    action: "CREATE_INVOICE",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { invoiceNumber: invoice.invoiceNumber, total: invoice.total, orderId: invoice.orderId },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  const fraudResult = await evaluateInvoiceForFraud(invoice.id, auth.tenantId, auth.userId, request.headers.get("x-forwarded-for") || undefined);
  if (fraudResult.triggered) {
    const blocked = fraudResult.alerts.some((a) => a.autoAction === "BLOCK_TRANSACTION" || a.autoAction === "SUSPEND_ENTITY");
    if (blocked) {
      await prisma.invoice.update({ where: { id: invoice.id }, data: { status: "DISPUTED" } });
      return error("Invoice blocked by fraud detection", 409);
    }
  }

  completeIdempotency(idempotencyKey, invoice.id);

  return success({ invoice, fraudAlerts: fraudResult.alerts }, 201);
});
