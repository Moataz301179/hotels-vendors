import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "supplier:read");

  const supplier = await prisma.supplier.findFirst({
    where: { tenantId: auth.tenantId },
    select: { id: true },
  });
  if (!supplier) return error("Supplier not found", 404);

  const supplierId = supplier.id;

  const [
    totalProducts,
    lowStockProducts,
    totalOrders,
    pendingOrders,
    totalRevenue,
    averageRating,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { supplierId } }),
    prisma.product.count({ where: { supplierId, stockQuantity: { lte: 10 } } }),
    prisma.order.count({ where: { supplierId } }),
    prisma.order.count({ where: { supplierId, status: { in: ["DRAFT", "PENDING_APPROVAL", "CONFIRMED"] } } }),
    prisma.order.aggregate({
      where: { supplierId, status: { in: ["DELIVERED", "DISPUTED"] } },
      _sum: { total: true },
    }),
    prisma.productReview.aggregate({
      where: { Product: { supplierId } },
      _avg: { rating: true },
    }),
    prisma.order.findMany({
      where: { supplierId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        Hotel: { select: { id: true, name: true } },
        OrderItem: { take: 3, include: { Product: { select: { name: true } } } },
      },
    }),
  ]);

  return success({
    kpis: {
      totalProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue._sum?.total?.toNumber() || 0,
      averageRating: averageRating._avg?.rating || 0,
    },
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total.toNumber(),
      currency: o.currency,
      hotel: o.Hotel,
      itemCount: o.OrderItem.length,
      createdAt: o.createdAt,
    })),
  });
});
