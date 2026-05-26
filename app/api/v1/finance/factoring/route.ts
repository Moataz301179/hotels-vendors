import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "factoring:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = { tenantId: auth.tenantId };

  const status = request.nextUrl.searchParams.get("status");
  if (status) where.status = status;

  if (query.search) {
    where.OR = [
      { Invoice: { invoiceNumber: { contains: query.search } } },
    ];
  }

  const [requests, total] = await Promise.all([
    prisma.factoringRequest.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        Invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
            currency: true,
            Hotel: { select: { id: true, name: true } },
            Supplier: { select: { id: true, name: true } },
          },
        },
        FactoringCompany: { select: { id: true, name: true } },
      },
    }),
    prisma.factoringRequest.count({ where }),
  ]);

  return success({
    requests: requests.map((r) => ({
      id: r.id,
      status: r.status,
      requestedAmount: r.requestedAmount.toNumber(),
      grossAmount: r.grossAmount?.toNumber() || 0,
      disbursedAmount: r.disbursedAmount?.toNumber() || 0,
      discountRate: r.discountRate.toNumber(),
      platformFee: r.platformFee?.toNumber() || 0,
      netPlatformFee: r.netPlatformFee?.toNumber() || 0,
      invoice: r.Invoice,
      factoringCompany: r.FactoringCompany,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
