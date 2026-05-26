import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateQuery, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invoice:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  const where: Record<string, unknown> = { tenantId: auth.tenantId };

  const status = request.nextUrl.searchParams.get("status");
  if (status) where.status = status;

  if (query.search) {
    where.invoiceNumber = { contains: query.search };
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        Hotel: { select: { id: true, name: true } },
        Supplier: { select: { id: true, name: true } },
        Order: { select: { id: true, orderNumber: true } },
        FactoringRequest: { select: { id: true, status: true } },
      },
    }),
    prisma.invoice.count({ where }),
  ]);

  return success({
    invoices: invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      status: inv.status,
      paymentStatus: inv.paymentStatus,
      factoringStatus: inv.factoringStatus,
      subtotal: inv.subtotal.toNumber(),
      vatAmount: inv.vatAmount.toNumber(),
      total: inv.total.toNumber(),
      currency: inv.currency,
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      paidDate: inv.paidDate,
      hotel: inv.Hotel,
      supplier: inv.Supplier,
      order: inv.Order,
      factoringRequest: inv.FactoringRequest,
      createdAt: inv.createdAt,
    })),
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
