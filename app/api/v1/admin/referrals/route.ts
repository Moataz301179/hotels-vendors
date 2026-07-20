import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { apiRoute, authenticate, requirePermission, validateQuery, success } from "@/lib/api-utils";

const ListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  stage: z.string().optional(),
  entityType: z.enum(["HOTEL", "SUPPLIER"]).optional(),
  search: z.string().optional(),
});

/**
 * GET /api/v1/admin/referrals
 *
 * Admin pipeline view: paginated, filterable by stage + entity type + name
 * search. Cross-tenant visible (platform admin only — RBAC enforced).
 */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:read");
  const query = validateQuery(ListSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = {};
  if (query.stage) where.stage = query.stage;
  if (query.entityType) where.entityType = query.entityType;
  if (query.search) {
    where.OR = [
      { entityName: { contains: query.search, mode: "insensitive" } },
      { entityEmail: { contains: query.search, mode: "insensitive" } },
      { entityTaxId: { contains: query.search } },
    ];
  }

  const [referrals, total] = await Promise.all([
    prisma.referral.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.referral.count({ where }),
  ]);

  return success({
    referrals,
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
