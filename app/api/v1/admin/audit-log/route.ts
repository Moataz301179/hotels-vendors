import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  if (auth.platformRole !== "ADMIN") {
    return error("Forbidden", 403);
  }

  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = {};
  if (query.search) {
    where.OR = [
      { entityType: { contains: query.search } },
      { action: { contains: query.search } },
      { entityId: { contains: query.search } },
    ];
  }

  const [entries, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return success({
    entries,
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
