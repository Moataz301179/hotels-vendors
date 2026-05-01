import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  if (auth.platformRole !== "HOTEL" && auth.platformRole !== "ADMIN") {
    return error("Forbidden", 403);
  }

  const where: Record<string, unknown> = {
    hotelId: auth.tenantId,
  };

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
        supplier: { select: { id: true, name: true } },
        items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        invoices: { select: { id: true, invoiceNumber: true, status: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return success({ orders, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } });
});
