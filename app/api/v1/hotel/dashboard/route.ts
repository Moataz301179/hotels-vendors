import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "hotel:read");

  const hotel = await prisma.hotel.findFirst({
    where: { tenantId: auth.tenantId },
    select: { id: true },
  });
  if (!hotel) return error("Hotel not found", 404);

  const hotelId = hotel.id;

  const [
    totalOrders,
    pendingOrders,
    totalSpendRequests,
    pendingApprovals,
    totalSpent,
    recentOrders,
    topSuppliers,
  ] = await Promise.all([
    prisma.order.count({ where: { hotelId } }),
    prisma.order.count({ where: { hotelId, status: { in: ["DRAFT", "PENDING_APPROVAL", "CONFIRMED"] } } }),
    prisma.spendRequest.count({ where: { hotelId } }),
    prisma.spendRequest.count({ where: { hotelId, status: "PENDING_APPROVAL" } }),
    prisma.order.aggregate({
      where: { hotelId, status: { in: ["DELIVERED", "DISPUTED"] } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      where: { hotelId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        Supplier: { select: { id: true, name: true } },
        OrderItem: { take: 3, include: { Product: { select: { name: true } } } },
      },
    }),
    prisma.order.groupBy({
      by: ["supplierId"],
      where: { hotelId },
      _count: { _all: true },
      _sum: { total: true },
      orderBy: { _sum: { total: "desc" } },
      take: 5,
    }),
  ]);

  const supplierIds = topSuppliers.map((s) => s.supplierId);
  const suppliers = supplierIds.length
    ? await prisma.supplier.findMany({
        where: { id: { in: supplierIds } },
        select: { id: true, name: true, rating: true },
      })
    : [];

  const supplierMap = new Map(suppliers.map((s) => [s.id, s]));

  return success({
    kpis: {
      totalOrders,
      pendingOrders,
      totalSpendRequests,
      pendingApprovals,
      totalSpent: totalSpent._sum?.total?.toNumber() || 0,
    },
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total.toNumber(),
      currency: o.currency,
      supplier: o.Supplier,
      itemCount: o.OrderItem.length,
      createdAt: o.createdAt,
    })),
    topSuppliers: topSuppliers.map((s) => ({
      supplier: supplierMap.get(s.supplierId),
      orderCount: s._count._all,
      totalSpent: s._sum.total?.toNumber() || 0,
    })),
  });
});
