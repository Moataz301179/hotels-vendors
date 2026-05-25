import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.platformRole !== "ADMIN" && user.role !== "HOTEL_OWNER" && !user.canOverride) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tenantId = user.tenantId;

    // Run all counts in parallel
    const [
      hotels,
      suppliers,
      orders,
      pendingOrders,
      spendRequests,
      pendingSpendRequests,
      approvedSpendRequests,
      rejectedSpendRequests,
      budgetGates,
      activeBudgetGates,
      users,
      products,
      factoringRequests,
      creditFacilities,
      invoices,
      recentOrders,
      recentSpendRequests,
      lowStockProducts,
      pendingApprovals,
    ] = await Promise.all([
      prisma.hotel.count({ where: { tenantId } }),
      prisma.supplier.count({ where: { tenantId } }),
      prisma.order.count({ where: { tenantId } }),
      prisma.order.count({ where: { tenantId, status: "PENDING_APPROVAL" } }),
      prisma.spendRequest.count({ where: { tenantId } }),
      prisma.spendRequest.count({ where: { tenantId, status: "PENDING_APPROVAL" } }),
      prisma.spendRequest.count({ where: { tenantId, status: "APPROVED" } }),
      prisma.spendRequest.count({ where: { tenantId, status: "REJECTED" } }),
      prisma.budgetGate.count({ where: { tenantId } }),
      prisma.budgetGate.count({ where: { tenantId, status: "ACTIVE" } }),
      prisma.user.count({ where: { tenantId } }),
      prisma.product.count({ where: { tenantId } }),
      prisma.factoringRequest.count({ where: { tenantId } }),
      prisma.creditFacility.count({ where: { tenantId } }),
      prisma.invoice.count({ where: { tenantId } }),
      prisma.order.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { Hotel: { select: { name: true } }, Supplier: { select: { name: true } } },
      }),
      prisma.spendRequest.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { Hotel: { select: { name: true } }, Requester: { select: { name: true } } },
      }),
      prisma.product.findMany({
        where: { tenantId, stockQuantity: { lte: 10 } },
        take: 5,
        include: { Supplier: { select: { name: true } } },
      }),
      prisma.order.findMany({
        where: { tenantId, status: "PENDING_APPROVAL" },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { Hotel: { select: { name: true } }, Supplier: { select: { name: true } }, Requester: { select: { name: true } } },
      }),
    ]);

    // Financial aggregates
    const orderTotals = await prisma.order.aggregate({
      where: { tenantId, status: { in: ["APPROVED", "CONFIRMED", "DELIVERED", "PARTIALLY_DELIVERED"] } },
      _sum: { total: true },
    });

    const spendGatekeeperStats = await prisma.spendRequest.groupBy({
      by: ["status"],
      where: { tenantId },
      _count: { id: true },
      _sum: { total: true },
    });

    const budgetStatus = await prisma.budgetGate.findMany({
      where: { tenantId, status: { in: ["ACTIVE", "WARNING", "EXHAUSTED"] } },
      select: { id: true, name: true, totalBudget: true, spentAmount: true, reservedAmount: true, status: true, periodStart: true, periodEnd: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          hotels, suppliers, orders, pendingOrders,
          spendRequests, pendingSpendRequests, approvedSpendRequests, rejectedSpendRequests,
          budgetGates, activeBudgetGates, users, products,
          factoringRequests, creditFacilities, invoices,
        },
        financials: {
          totalOrderValue: orderTotals._sum.total || 0,
          spendGatekeeperStats,
        },
        budgetStatus: budgetStatus.map((b) => ({
          ...b,
          pctUsed: b.totalBudget ? Math.round((Number(b.spentAmount) + Number(b.reservedAmount)) / Number(b.totalBudget) * 100) : 0,
        })),
        recentOrders,
        recentSpendRequests,
        lowStockProducts,
        pendingApprovals,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[GET /api/v1/mission-control]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
