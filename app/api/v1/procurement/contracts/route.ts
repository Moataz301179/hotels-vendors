import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "agreement:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = { tenantId: auth.tenantId };

  const status = request.nextUrl.searchParams.get("status");
  if (status) where.status = status;

  if (query.search) {
    where.OR = [
      { template: { name: { contains: query.search, mode: "insensitive" } } },
      { Hotel: { name: { contains: query.search, mode: "insensitive" } } },
      { Supplier: { name: { contains: query.search, mode: "insensitive" } } },
    ];
  }

  const [contracts, total] = await Promise.all([
    prisma.digitalAgreement.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        template: { select: { id: true, name: true, slug: true } },
        Hotel: { select: { id: true, name: true } },
        Supplier: { select: { id: true, name: true } },
        FactoringCompany: { select: { id: true, name: true } },
      },
    }),
    prisma.digitalAgreement.count({ where }),
  ]);

  return success({
    contracts: contracts.map((c) => ({
      id: c.id,
      status: c.status,
      template: c.template,
      hotel: c.Hotel,
      supplier: c.Supplier,
      factoringCompany: c.FactoringCompany,
      signedByHotelAt: c.signedByHotelAt,
      signedBySupplierAt: c.signedBySupplierAt,
      signedByNbfiAt: c.signedByNbfiAt,
      documentUrl: c.documentUrl,
      etaDocumentUuid: c.etaDocumentUuid,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
