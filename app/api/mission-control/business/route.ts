import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
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
    ] = await Promise.all([
      prisma.hotel.count(),
      prisma.supplier.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING_APPROVAL" } }),
      prisma.spendRequest.count(),
      prisma.spendRequest.count({ where: { status: "PENDING_APPROVAL" } }),
      prisma.spendRequest.count({ where: { status: "APPROVED" } }),
      prisma.spendRequest.count({ where: { status: "REJECTED" } }),
      prisma.budgetGate.count(),
      prisma.budgetGate.count({ where: { status: "ACTIVE" } }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.factoringRequest.count(),
      prisma.creditFacility.count(),
      prisma.invoice.count(),
    ]);

    const orderTotals = await prisma.order.aggregate({
      where: { status: { in: ["APPROVED", "CONFIRMED", "DELIVERED", "PARTIALLY_DELIVERED"] } },
      _sum: { total: true },
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
        },
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[GET /api/mission-control/business]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
