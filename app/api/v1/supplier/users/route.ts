import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, requirePermission, validateQuery, success } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "user:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { supplierId: true },
  });
  if (!user?.supplierId) {
    return success({ users: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
  }

  const where: Record<string, unknown> = { supplierId: user.supplierId };
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
    }),
    prisma.user.count({ where }),
  ]);

  return success({
    users: users.map((u) => ({ ...u, lastActive: u.updatedAt?.toISOString() || null, createdAt: u.createdAt.toISOString() })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
