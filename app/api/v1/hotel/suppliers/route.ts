import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, requirePermission, validateQuery, success } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { hotelId: true, tenantId: true },
  });
  if (!user?.hotelId) {
    return success({ suppliers: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
  }

  // Get suppliers that this hotel has ordered from or been invited by
  const orderSupplierIds = await prisma.order.findMany({
    where: { hotelId: user.hotelId },
    select: { supplierId: true },
    distinct: ["supplierId"],
  });
  const supplierIds = orderSupplierIds.map((o) => o.supplierId);

  const where: Record<string, unknown> = { id: { in: supplierIds } };
  if (query.search) {
    where.name = { contains: query.search, mode: "insensitive" };
  }

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: { _count: { select: { products: true } } },
    }),
    prisma.supplier.count({ where }),
  ]);

  return success({
    suppliers: suppliers.map((s) => ({
      id: s.id,
      name: s.name,
      tier: s.tier || "STANDARD",
      city: s.city,
      status: s.status,
      productCount: s._count.products,
    })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
