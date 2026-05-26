import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "supplier:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const supplier = await prisma.supplier.findFirst({
    where: { tenantId: auth.tenantId },
    select: { id: true },
  });
  if (!supplier) return error("Supplier not found", 404);

  const supplierId = supplier.id;

  const where: Record<string, unknown> = { supplierId };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { sku: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        _count: { select: { OrderItem: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return success({
    products: products.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      description: p.description,
      category: p.category,
      unitPrice: p.unitPrice.toNumber(),
      creditPrice: p.creditPrice?.toNumber() || null,
      currency: p.currency,
      stockQuantity: p.stockQuantity,
      minOrderQty: p.minOrderQty,
      leadTimeDays: p.leadTimeDays,
      reorderPoint: p.reorderPoint,
      status: p.status,
      orderCount: p._count.OrderItem,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
