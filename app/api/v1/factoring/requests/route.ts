import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = {};

  const requests = await prisma.factoringRequest.findMany({
    where,
    orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
    skip: (query.page - 1) * query.limit,
    take: query.limit,
    include: {
      invoice: { include: { hotel: { select: { id: true, name: true } }, supplier: { select: { id: true, name: true } } } },
      factoringCompany: { select: { id: true, name: true } },
    },
  });

  const total = await prisma.factoringRequest.count({ where });

  return success({ requests, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } });
});
