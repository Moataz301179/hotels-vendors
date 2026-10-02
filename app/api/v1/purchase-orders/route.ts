import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:read");
  const tenantId = auth.tenantId;
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = { tenantId };

  const statusParam = request.nextUrl.searchParams.get("status");
  if (statusParam) {
    const statuses = ["DRAFT","PENDING_APPROVAL","APPROVED","REJECTED","ACCEPTED","CONFIRMED","IN_TRANSIT","PARTIALLY_DELIVERED","DELIVERED","DISPUTED","CANCELLED","FULFILLED"];
    if (statuses.includes(statusParam)) {
      where.status = statusParam;
    }
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true, tier: true } },
        items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        invoices: { select: { id: true, invoiceNumber: true, total: true, status: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return success({ orders, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } });
});
