import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { supplierId: true },
  });

  if (!user?.supplierId) {
    return success({
      totalOrders: 0,
      totalRevenue: 0,
      activeListings: 0,
      pendingOrders: 0,
      etaComplianceRate: 0,
      recentActivity: [],
      monthlyData: [],
    });
  }

  const supplierId = user.supplierId;
  const whereSupplier = { supplierId };

  const [totalOrders, revenueAgg, activeListings, pendingOrders, totalInvoices, acceptedInvoices, recentOrders, monthlyOrders] =
    await Promise.all([
      prisma.order.count({ where: whereSupplier }),
      prisma.order.aggregate({ where: whereSupplier, _sum: { total: true } }),
      prisma.product.count({ where: { ...whereSupplier, status: "ACTIVE" } }),
      prisma.order.count({ where: { ...whereSupplier, status: "PENDING_APPROVAL" } }),
      prisma.invoice.count({ where: whereSupplier }),
      prisma.invoice.count({ where: { ...whereSupplier, etaStatus: "ACCEPTED" } }),
      prisma.order.findMany({
        where: whereSupplier,
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, orderNumber: true, total: true, status: true, createdAt: true },
      }),
      prisma.order.findMany({
        where: {
          supplierId,
          createdAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
        },
        select: { total: true, createdAt: true },
      }),
    ]);

  const etaComplianceRate = totalInvoices > 0 ? Math.round((acceptedInvoices / totalInvoices) * 100) : 0;

  const monthlyMap: Record<string, { revenue: number; orders: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = { revenue: 0, orders: 0 };
  }

  for (const order of monthlyOrders) {
    const d = new Date(order.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap[key]) {
      monthlyMap[key].revenue += Number(order.total);
      monthlyMap[key].orders += 1;
    }
  }

  const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({ month, ...data }));

  return success({
    totalOrders,
    totalRevenue: Number(revenueAgg._sum.total ?? 0),
    activeListings,
    pendingOrders,
    etaComplianceRate,
    recentActivity: recentOrders,
    monthlyData,
  });
});
