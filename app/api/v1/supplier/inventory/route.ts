import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "product:read");

  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { supplierId: true },
  });

  const where: Record<string, unknown> = { tenantId: auth.tenantId };

  // Scope to the supplier's own products only
  if (!user?.supplierId) {
    return success({ products: [], pagination: { page: query.page, limit: query.limit, total: 0, totalPages: 0 } });
  }
  where.supplierId = user.supplierId;

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
