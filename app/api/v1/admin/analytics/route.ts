import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/api-utils";
import { requirePermission } from "@/lib/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    const authCtx = await authenticate(request);
    await requirePermission(authCtx, "admin:read");

    const period = request.nextUrl.searchParams.get("period") || "30d";
    const now = new Date();
    const startDate = new Date(now.getTime() - (period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365) * 24 * 60 * 60 * 1000);

    const [
      totalUsers, totalSuppliers, totalHotels, totalOrders, completedOrders, pendingOrders,
      totalRevenueResult, factoringVolumeResult, topSuppliers, topHotels, ordersByStatus,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.supplier.count(),
      prisma.hotel.count(),
      prisma.order.count({ where: { createdAt: { gte: startDate } } }),
      prisma.order.count({ where: { status: "DELIVERED", createdAt: { gte: startDate } } }),
      prisma.order.count({ where: { status: "PENDING_APPROVAL", createdAt: { gte: startDate } } }),
      prisma.order.aggregate({
        where: { status: { in: ["DELIVERED", "CONFIRMED"] }, createdAt: { gte: startDate } },
        _sum: { total: true },
      }),
      prisma.invoice.aggregate({
        where: { factoringStatus: { in: ["ACCEPTED", "PAID"] }, createdAt: { gte: startDate } },
        _sum: { total: true },
      }),
      prisma.supplier.findMany({
        orderBy: { orders: { _count: "desc" } },
        take: 5,
        select: { id: true, name: true, _count: { select: { orders: true } } },
      }),
      prisma.hotel.findMany({
        orderBy: { orders: { _count: "desc" } },
        take: 5,
        select: { id: true, name: true, _count: { select: { orders: true } } },
      }),
      prisma.order.groupBy({
        by: ["status"],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }),
    ]);

    const activeUsers = await prisma.user.count({
      where: { lastActive: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
    });

    const totalRevenue = Number(totalRevenueResult._sum?.total ?? 0);
    const factoringVolume = Number(factoringVolumeResult._sum?.total ?? 0);
    const platformFees = Math.round(totalRevenue * 0.025);

    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousRevenue = await prisma.order.aggregate({
      where: { status: { in: ["DELIVERED", "CONFIRMED"] }, createdAt: { gte: previousPeriodStart, lt: startDate } },
      _sum: { total: true },
    });
    const prevTotal = Number(previousRevenue._sum?.total ?? 0);
    const monthlyGrowth = prevTotal > 0 ? Math.round(((totalRevenue - prevTotal) / prevTotal) * 1000) / 10 : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalSuppliers,
        totalHotels,
        platformFees,
        factoringVolume,
        avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        monthlyGrowth,
        activeUsers,
        pendingOrders,
        completedOrders,
        rejectedOrders: totalOrders - completedOrders - pendingOrders,
        topSuppliers: topSuppliers.map((s) => ({ id: s.id, name: s.name, orderCount: s._count.orders })),
        topHotels: topHotels.map((h) => ({ id: h.id, name: h.name, orderCount: h._count.orders })),
        revenueByMonth: [],
        ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count })),
      },
    });
  } catch (error: any) {
    if (error?.name === "ApiError" || error?.name === "PermissionDeniedError") {
      return NextResponse.json({ error: error.message }, { status: error.statusCode || 403 });
    }
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
