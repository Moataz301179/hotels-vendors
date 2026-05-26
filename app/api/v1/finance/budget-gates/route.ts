import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "budget:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = { tenantId: auth.tenantId };

  const status = request.nextUrl.searchParams.get("status");
  if (status) where.status = status;

  if (query.search) {
    where.name = { contains: query.search, mode: "insensitive" };
  }

  const [gates, total] = await Promise.all([
    prisma.budgetGate.findMany({
      where,
      orderBy: { [query.sortBy || "periodStart"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        Hotel: { select: { id: true, name: true } },
      },
    }),
    prisma.budgetGate.count({ where }),
  ]);

  return success({
    gates: gates.map((g) => ({
      id: g.id,
      name: g.name,
      period: g.period,
      periodStart: g.periodStart,
      periodEnd: g.periodEnd,
      totalBudget: g.totalBudget.toNumber(),
      spentAmount: g.spentAmount.toNumber(),
      reservedAmount: g.reservedAmount.toNumber(),
      remaining: g.totalBudget.toNumber() - g.spentAmount.toNumber() - g.reservedAmount.toNumber(),
      utilization: g.totalBudget.toNumber() > 0
        ? ((g.spentAmount.toNumber() + g.reservedAmount.toNumber()) / g.totalBudget.toNumber()) * 100
        : 0,
      warningThreshold: g.warningThreshold.toNumber(),
      hardCap: g.hardCap,
      status: g.status,
      hotel: g.Hotel,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
