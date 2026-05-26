import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "hotel:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = {
    tenantId: auth.tenantId,
    status: "ACTIVE",
  };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
      { city: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        governorate: true,
        rating: true,
        reviewCount: true,
        tier: true,
        status: true,
        certifications: true,
        createdAt: true,
        _count: { select: { Product: true, Order: true } },
      },
    }),
    prisma.supplier.count({ where }),
  ]);

  return success({
    suppliers: suppliers.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      city: s.city,
      governorate: s.governorate,
      rating: s.rating?.toNumber() || 0,
      reviewCount: s.reviewCount,
      tier: s.tier,
      status: s.status,
      certifications: s.certifications,
      productCount: s._count.Product,
      orderCount: s._count.Order,
      createdAt: s.createdAt,
    })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
