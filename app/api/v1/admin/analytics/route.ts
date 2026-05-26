import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsers7d,
    totalHotels,
    totalSuppliers,
    totalOrders,
    orders7d,
    totalRevenue,
    revenue7d,
    ordersByStatus,
    topHotels,
    topSuppliers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.hotel.count(),
    prisma.supplier.count(),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.order.aggregate({ where: { status: { in: ["DELIVERED", "DISPUTED"] } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { createdAt: { gte: sevenDaysAgo }, status: { in: ["DELIVERED", "DISPUTED"] } }, _sum: { total: true } }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.order.groupBy({ by: ["hotelId"], _count: { _all: true }, _sum: { total: true }, orderBy: { _sum: { total: "desc" } }, take: 5 }),
    prisma.order.groupBy({ by: ["supplierId"], _count: { _all: true }, _sum: { total: true }, orderBy: { _sum: { total: "desc" } }, take: 5 }),
  ]);

  const hotelIds = topHotels.map((h) => h.hotelId);
  const supplierIds = topSuppliers.map((s) => s.supplierId);

  const [hotels, suppliers] = await Promise.all([
    hotelIds.length ? prisma.hotel.findMany({ where: { id: { in: hotelIds } }, select: { id: true, name: true } }) : [],
    supplierIds.length ? prisma.supplier.findMany({ where: { id: { in: supplierIds } }, select: { id: true, name: true } }) : [],
  ]);

  const hotelMap = new Map(hotels.map((h) => [h.id, h]));
  const supplierMap = new Map(suppliers.map((s) => [s.id, s]));

  return success({
    overview: {
      totalUsers,
      newUsers7d,
      totalHotels,
      totalSuppliers,
      totalOrders,
      orders7d,
      totalRevenue: totalRevenue._sum?.total?.toNumber() || 0,
      revenue7d: revenue7d._sum?.total?.toNumber() || 0,
    },
    ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count._all })),
    topHotels: topHotels.map((h) => ({
      hotel: hotelMap.get(h.hotelId),
      orderCount: h._count._all,
      totalRevenue: h._sum.total?.toNumber() || 0,
    })),
    topSuppliers: topSuppliers.map((s) => ({
      supplier: supplierMap.get(s.supplierId),
      orderCount: s._count._all,
      totalRevenue: s._sum.total?.toNumber() || 0,
    })),
  });
});
