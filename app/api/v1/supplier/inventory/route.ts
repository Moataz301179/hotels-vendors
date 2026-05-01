import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  if (auth.platformRole !== "SUPPLIER" && auth.platformRole !== "ADMIN") {
    return error("Forbidden", 403);
  }

  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const supplier = await prisma.supplier.findFirst({
    where: auth.platformRole === "SUPPLIER" ? { id: auth.tenantId } : {},
  });

  if (!supplier && auth.platformRole === "SUPPLIER") {
    return error("Supplier not found", 404);
  }

  const where: Record<string, unknown> = {};
  if (auth.platformRole === "SUPPLIER") {
    where.supplierId = auth.tenantId;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: { inventorySnapshots: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
    prisma.product.count({ where }),
  ]);

  return success({ products, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } });
});
