import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId") || undefined;
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orderWhere: Record<string, unknown> = {
      createdAt: { gte: startDate },
      status: "DELIVERED",
    };
    if (hotelId) orderWhere.hotelId = hotelId;

    const invoiceWhere: Record<string, unknown> = {
      createdAt: { gte: startDate },
    };
    if (hotelId) invoiceWhere.hotelId = hotelId;

    const spendOrderWhere: Record<string, unknown> = {
      status: "DELIVERED",
      createdAt: { gte: startDate },
    };
    if (hotelId) spendOrderWhere.hotelId = hotelId;

    const [
      totalOrders,
      totalSpend,
      ordersWithItems,
      totalInvoices,
      etaAccepted,
      pendingOrders,
      supplierCount,
      productCount,
    ] = await Promise.all([
      prisma.order.count({ where: orderWhere }),
      prisma.order.aggregate({
        where: orderWhere,
        _sum: { total: true },
      }),
      prisma.order.findMany({
        where: spendOrderWhere,
        include: {
          items: {
            include: {
              product: { select: { category: true } },
            },
          },
        },
        take: 1000,
      }),
      prisma.invoice.count({ where: invoiceWhere }),
      prisma.invoice.count({
        where: { ...invoiceWhere, etaStatus: "ACCEPTED" },
      }),
      prisma.order.count({
        where: {
          ...(hotelId ? { hotelId } : {}),
          status: { in: ["PENDING_APPROVAL", "APPROVED"] },
        },
      }),
      prisma.supplier.count(),
      prisma.product.count(),
    ]);

    // Calculate spend by category
    const categoryMap = new Map<string, number>();
    for (const order of ordersWithItems) {
      for (const item of order.items) {
        if (item.product) {
          const cat = item.product.category;
          categoryMap.set(cat, (categoryMap.get(cat) || 0) + item.total);
        }
      }
    }
    const spendByCategory = Array.from(categoryMap.entries()).map(
      ([category, total]) => ({ category, total: Math.round(total * 100) / 100 })
    );

    // Calculate spend by month
    const monthMap = new Map<string, { orders: number; total: number }>();
    for (const order of ordersWithItems) {
      const month = order.createdAt.toISOString().slice(0, 7);
      const existing = monthMap.get(month) || { orders: 0, total: 0 };
      monthMap.set(month, {
        orders: existing.orders + 1,
        total: existing.total + order.total,
      });
    }
    const spendByMonth = Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        orders: data.orders,
        total: Math.round(data.total * 100) / 100,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalOrders,
          totalSpend: totalSpend._sum.total || 0,
          avgOrderValue: totalOrders
            ? Math.round(((totalSpend._sum.total || 0) / totalOrders) * 100) / 100
            : 0,
          totalInvoices,
          etaAccepted,
          etaRate: totalInvoices
            ? Math.round((etaAccepted / totalInvoices) * 100)
            : 0,
          pendingOrders,
          supplierCount,
          productCount,
        },
        spendByCategory,
        spendByMonth,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
