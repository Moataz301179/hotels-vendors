import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "approval:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = {
    tenantId: auth.tenantId,
    status: { in: ["PENDING_APPROVAL", "APPROVED", "REJECTED"] },
  };

  const status = request.nextUrl.searchParams.get("status");
  if (status) where.status = status;

  if (query.search) {
    where.requestNumber = { contains: query.search };
  }

  const [requests, total] = await Promise.all([
    prisma.spendRequest.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        Hotel: { select: { id: true, name: true } },
        Requester: { select: { id: true, name: true, role: true } },
        ApprovedBy: { select: { id: true, name: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.spendRequest.count({ where }),
  ]);

  return success({
    approvals: requests.map((r) => ({
      id: r.id,
      requestNumber: r.requestNumber,
      status: r.status,
      total: r.total.toNumber(),
      currency: r.currency,
      requiredApproverRole: r.requiredApproverRole,
      approvedAt: r.approvedAt,
      rejectionReason: r.rejectionReason,
      gatekeeperScore: r.gatekeeperScore,
      hotel: r.Hotel,
      requester: r.Requester,
      approvedBy: r.ApprovedBy,
      itemCount: r._count.items,
      createdAt: r.createdAt,
    })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
