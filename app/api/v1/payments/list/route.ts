import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20", 10));
  const status = searchParams.get("status") || undefined;

  const where: Record<string, unknown> = { tenantId: auth.tenantId };
  if (status) where.status = status;

  const [transactions, total, stats] = await Promise.all([
    prisma.paymentTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.paymentTransaction.count({ where }),
    prisma.paymentTransaction.aggregate({
      where: { tenantId: auth.tenantId },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const pendingCount = await prisma.paymentTransaction.count({
    where: { tenantId: auth.tenantId, status: "PENDING" },
  });

  const completedAgg = await prisma.paymentTransaction.aggregate({
    where: { tenantId: auth.tenantId, status: "COMPLETED" },
    _sum: { amount: true },
    _count: true,
  });

  const failedCount = await prisma.paymentTransaction.count({
    where: { tenantId: auth.tenantId, status: "FAILED" },
  });

  return success({
    transactions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    stats: {
      totalProcessed: stats._sum.amount || 0,
      totalCount: stats._count,
      pendingCount,
      completedAmount: completedAgg._sum.amount || 0,
      completedCount: completedAgg._count,
      failedCount,
    },
  });
});
