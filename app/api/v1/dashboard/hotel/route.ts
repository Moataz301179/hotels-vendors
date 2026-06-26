/**
 * Hotel Buyer Dashboard API
 *
 * Returns procurement KPIs, recent orders, pending approvals,
 * upcoming deliveries, and budget alerts scoped to the user's tenant.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/server-auth";

export async function GET() {
  const user = await requireAuth();

  if (user.platformRole !== "HOTEL" && user.platformRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tenantId = user.tenantId;
  const hotelId = user.hotelId;

  try {
    const [openPOs, pendingInvoices, activeDeliveries, recentOrders, pendingApprovals] =
      await Promise.all([
        // Open POs: orders not yet delivered/cancelled
        prisma.order.count({
          where: {
            tenantId,
            ...(hotelId ? { hotelId } : {}),
            status: { in: ["CONFIRMED", "IN_TRANSIT", "PARTIALLY_DELIVERED", "APPROVED"] },
          },
        }),
        // Pending invoices
        prisma.invoice.count({
          where: {
            tenantId,
            ...(hotelId ? { hotelId } : {}),
            paymentStatus: { in: ["PENDING", "UNPAID", "PARTIALLY_PAID"] },
          },
        }),
        // Active deliveries
        prisma.deliveryJob.count({
          where: {
            tenantId,
            status: { in: ["IN_TRANSIT", "PICKED_UP", "ACCEPTED_BY_CARRIER"] },
          },
        }),
        // Recent orders (last 5)
        prisma.order.findMany({
          where: {
            tenantId,
            ...(hotelId ? { hotelId } : {}),
          },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
            estimatedDelivery: true,
            supplier: { select: { name: true } },
          },
        }),
        // Pending approvals (orders waiting for authority matrix sign-off)
        prisma.order.findMany({
          where: {
            tenantId,
            ...(hotelId ? { hotelId } : {}),
            status: "PENDING_APPROVAL",
          },
          orderBy: { createdAt: "asc" },
          take: 10,
          select: {
            id: true,
            orderNumber: true,
            total: true,
            createdAt: true,
            requester: { select: { name: true } },
          },
        }),
      ]);

    // Upcoming deliveries with ETA
    const upcomingDeliveries = await prisma.order.findMany({
      where: {
        tenantId,
        ...(hotelId ? { hotelId } : {}),
        estimatedDelivery: { gte: new Date() },
        status: { in: ["CONFIRMED", "IN_TRANSIT"] },
      },
      orderBy: { estimatedDelivery: "asc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        estimatedDelivery: true,
        status: true,
        supplier: { select: { name: true } },
      },
    });

    // Budget alerts — compute utilization by category
    // Aggregate order totals grouped by cost center
    const budgetByCategory = await prisma.order.groupBy({
      by: ["costCenter"],
      where: {
        tenantId,
        ...(hotelId ? { hotelId } : {}),
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
        status: { notIn: ["CANCELLED", "REJECTED"] },
      },
      _sum: { total: true },
    });

    // Mock budget thresholds (in production, fetch from Budget/Config table)
    const BUDGET_LIMITS: Record<string, number> = {
      "F&B": 500000,
      "FOOD & BEVERAGE": 500000,
      "HOUSEKEEPING": 200000,
      "LINEN": 150000,
      "CHEMICALS": 100000,
      "MAINTENANCE": 180000,
      "OPERATIONS": 250000,
    };

    const budgetAlerts = budgetByCategory
      .filter((b) => b.costCenter)
      .map((b) => {
        const category = b.costCenter!.toUpperCase();
        const spent = Number(b._sum.total || 0);
        const limit = BUDGET_LIMITS[category] || 300000;
        return {
          category: b.costCenter!,
          utilization: Math.round((spent / limit) * 100),
          threshold: 85,
        };
      })
      .filter((b) => b.utilization >= 70)
      .sort((a, b) => b.utilization - a.utilization);

    // Compute overall budget utilization
    const totalSpent = budgetByCategory.reduce(
      (sum, b) => sum + Number(b._sum.total || 0),
      0
    );
    const totalBudget = Object.values(BUDGET_LIMITS).reduce((s, v) => s + v, 0);
    const budgetUtilization = Math.round((totalSpent / totalBudget) * 100);

    return NextResponse.json({
      kpis: {
        openPOs,
        pendingInvoices,
        activeDeliveries,
        budgetUtilization,
      },
      orders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        supplierName: o.supplier?.name || "Unknown",
        total: o.total.toString(),
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        estimatedDelivery: o.estimatedDelivery?.toISOString() || null,
      })),
      approvals: pendingApprovals.map((a) => ({
        id: a.id,
        orderNumber: a.orderNumber,
        amount: a.total.toString(),
        requestedBy: a.requester?.name || "Unknown",
        waitingSince: a.createdAt.toISOString(),
      })),
      upcoming: upcomingDeliveries.map((d) => ({
        id: d.id,
        orderNumber: d.orderNumber,
        supplierName: d.supplier?.name || "Unknown",
        eta: d.estimatedDelivery?.toISOString() || "",
        status: d.status,
      })),
      budgetAlerts,
    });
  } catch (error) {
    console.error("[Dashboard API Hotel]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
