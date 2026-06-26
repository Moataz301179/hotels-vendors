/**
 * Admin Dashboard API
 *
 * Returns platform-wide KPIs, health metrics, pending verifications,
 * system alerts, GMV trend, and user growth. Admin-only.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/server-auth";

export async function GET() {
  const user = await requireAuth();

  if (user.platformRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [totalUsers, activeHotels, activeSuppliers, monthlyGmv] = await Promise.all([
      prisma.user.count(),
      prisma.hotel.count({ where: { status: "ACTIVE" } }),
      prisma.supplier.count({ where: { status: "ACTIVE" } }),
      prisma.order.aggregate({
        where: {
          status: { notIn: ["CANCELLED", "REJECTED"] },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { total: true },
      }),
    ]);

    // Pending verifications
    const pendingSuppliers = await prisma.supplier.findMany({
      where: { status: "PENDING_VERIFICATION" },
      orderBy: { createdAt: "asc" },
      take: 10,
      select: {
        id: true,
        name: true,
        createdAt: true,
        city: true,
      },
    });

    const pendingHotels = await prisma.hotel.findMany({
      where: { status: "PENDING_VERIFICATION" },
      orderBy: { createdAt: "asc" },
      take: 10,
      select: {
        id: true,
        name: true,
        createdAt: true,
        city: true,
      },
    });

    const verifications = [
      ...pendingSuppliers.map((s) => ({
        id: s.id,
        type: "supplier" as const,
        name: s.name,
        submittedAt: s.createdAt.toISOString(),
      })),
      ...pendingHotels.map((h) => ({
        id: h.id,
        type: "hotel" as const,
        name: h.name,
        submittedAt: h.createdAt.toISOString(),
      })),
    ].sort(
      (a, b) =>
        new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );

    // System alerts — detect anomalies
    const alerts = [];

    // Overdue invoices (potential fraud/error)
    const overdueCount = await prisma.invoice.count({
      where: {
        paymentStatus: { in: ["UNPAID", "OVERDUE"] },
        dueDate: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });
    if (overdueCount > 0) {
      alerts.push({
        id: "overdue-invoices",
        type: "sla" as const,
        message: `${overdueCount} invoices overdue by 30+ days`,
        severity: overdueCount > 10 ? "critical" as const : "high" as const,
        timestamp: new Date().toISOString(),
      });
    }

    // Failed deliveries today
    const failedToday = await prisma.deliveryJob.count({
      where: {
        status: "FAILED",
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    if (failedToday > 0) {
      alerts.push({
        id: "failed-deliveries",
        type: "error" as const,
        message: `${failedToday} deliveries failed today`,
        severity: failedToday > 5 ? "critical" as const : "medium" as const,
        timestamp: new Date().toISOString(),
      });
    }

    // GMV trend (last 30 days)
    const gmvData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      const agg = await prisma.order.aggregate({
        where: {
          status: { notIn: ["CANCELLED", "REJECTED"] },
          createdAt: { gte: dayStart, lte: dayEnd },
        },
        _sum: { total: true },
      });

      gmvData.push({
        day: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
        gmv: Number(agg._sum.total || 0),
      });
    }

    // User growth (last 6 months)
    const userGrowthData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const count = await prisma.user.count({
        where: { createdAt: { lte: monthStart } },
      });
      userGrowthData.push({
        month: d.toLocaleString("en", { month: "short" }),
        users: count,
      });
    }

    // Platform health (mock — in production, pull from monitoring)
    const health = {
      apiUptime: "99.97%",
      avgResponseTime: "142ms",
      errorRate: "0.12%",
      activeConnections: totalUsers,
    };

    return NextResponse.json({
      kpis: {
        totalUsers,
        activeHotels,
        activeSuppliers,
        monthlyGmv: monthlyGmv._sum.total?.toString() || "0",
      },
      health,
      verifications,
      alerts,
      gmvData,
      userGrowthData,
    });
  } catch (error) {
    console.error("[Dashboard API Admin]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
