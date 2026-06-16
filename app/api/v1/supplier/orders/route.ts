import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:read");

  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { supplierId: true },
  });

  const where: Record<string, unknown> = { tenantId: auth.tenantId };

  // Scope to the supplier's own orders only
  if (!user?.supplierId) {
    return success({ orders: [], pagination: { page: query.page, limit: query.limit, total: 0, totalPages: 0 } });
  }
  where.supplierId = user.supplierId;

  if (query.search) {
    where.orderNumber = { contains: query.search };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        hotel: { select: { id: true, name: true, city: true } },
        items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        invoices: { select: { id: true, invoiceNumber: true, status: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return success({ orders, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } });
});
