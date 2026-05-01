import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      hotel: { select: { id: true, name: true, city: true } },
      supplier: { select: { id: true, name: true, tier: true } },
      property: true,
      outlet: true,
      items: { include: { product: { select: { id: true, name: true, sku: true, unitOfMeasure: true } } } },
      approvals: { include: { approver: { select: { id: true, name: true, role: true } } }, orderBy: { createdAt: "desc" } },
      invoices: { select: { id: true, invoiceNumber: true, total: true, status: true, etaStatus: true } },
    },
  });

  if (!order) {
    return error("Order not found", 404);
  }

  if (auth.platformRole === "HOTEL" && order.hotelId !== auth.tenantId) {
    return error("Forbidden", 403);
  }
  if (auth.platformRole === "SUPPLIER" && order.supplierId !== auth.tenantId) {
    return error("Forbidden", 403);
  }

  return success({ order });
});
