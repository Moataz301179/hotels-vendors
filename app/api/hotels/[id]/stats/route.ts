import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalOrders,
      pendingOrders,
      totalSpend,
      spend30Days,
      invoiceCount,
      etaAccepted,
      productCount,
    ] = await Promise.all([
      prisma.order.count({ where: { hotelId: id } }),
      prisma.order.count({
        where: {
          hotelId: id,
          status: { in: ["PENDING_APPROVAL", "APPROVED", "CONFIRMED"] },
        },
      }),
      prisma.order.aggregate({
        where: { hotelId: id, status: "DELIVERED" },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          hotelId: id,
          status: "DELIVERED",
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { total: true },
      }),
      prisma.invoice.count({ where: { hotelId: id } }),
      prisma.invoice.count({
        where: { hotelId: id, etaStatus: "ACCEPTED" },
      }),
      prisma.product.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        totalSpend: totalSpend._sum.total || 0,
        spend30Days: spend30Days._sum.total || 0,
        invoiceCount,
        etaAccepted,
        productCount,
        avgOrderValue: totalOrders
          ? Math.round((totalSpend._sum.total || 0) / totalOrders)
          : 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch hotel stats" },
      { status: 500 }
    );
  }
}
