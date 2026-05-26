import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = {};
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { slug: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [tenants, total] = await Promise.all([
    prisma.tenant.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        _count: { select: { User: true, Hotel: true, Supplier: true, Order: true } },
      },
    }),
    prisma.tenant.count({ where }),
  ]);

  return success({
    tenants: tenants.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      type: t.type,
      status: t.status,
      taxId: t.taxId,
      logoUrl: t.logoUrl,
      primaryColor: t.primaryColor,
      userCount: t._count.User,
      hotelCount: t._count.Hotel,
      supplierCount: t._count.Supplier,
      orderCount: t._count.Order,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
