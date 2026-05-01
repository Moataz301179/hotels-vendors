import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      hotel: { select: { id: true, name: true, taxId: true } },
      supplier: { select: { id: true, name: true, taxId: true } },
      order: { include: { items: { include: { product: { select: { id: true, name: true, sku: true } } } } } },
      factoringCompany: true,
      payments: true,
    },
  });

  if (!invoice) {
    return error("Invoice not found", 404);
  }

  if (auth.platformRole === "HOTEL" && invoice.hotelId !== auth.tenantId) {
    return error("Forbidden", 403);
  }
  if (auth.platformRole === "SUPPLIER" && invoice.supplierId !== auth.tenantId) {
    return error("Forbidden", 403);
  }

  return success({ invoice });
});
