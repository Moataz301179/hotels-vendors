/**
 * Factoring Company Dashboard API
 *
 * Returns exposure KPIs, pending requests, risk alerts,
 * settlement calendar, and exposure trend scoped to the factoring company.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/server-auth";

export async function GET() {
  const user = await requireAuth();

  if (user.platformRole !== "FACTORING" && user.platformRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tenantId = user.tenantId;
  const factoringCompanyId = user.factoringCompanyId;

  if (!factoringCompanyId && user.platformRole !== "ADMIN") {
    return NextResponse.json({ error: "No factoring profile" }, { status: 400 });
  }

  try {
    const [pendingRequests, activeRequests, disbursedAgg] = await Promise.all([
      // Pending factoring requests
      prisma.factoringRequest.count({
        where: {
          tenantId,
          ...(factoringCompanyId ? { factoringCompanyId } : {}),
          status: { in: ["PENDING", "UNDER_REVIEW"] },
        },
      }),
      // All active requests (for exposure calculation)
      prisma.factoringRequest.findMany({
        where: {
          tenantId,
          ...(factoringCompanyId ? { factoringCompanyId } : {}),
          status: { in: ["APPROVED", "DISBURSED", "UNDER_REVIEW"] },
        },
        select: { disbursedAmount: true, requestedAmount: true },
      }),
      // Disbursed this month
      prisma.factoringRequest.aggregate({
        where: {
          tenantId,
          ...(factoringCompanyId ? { factoringCompanyId } : {}),
          status: { in: ["DISBURSED", "SETTLED"] },
          disbursedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { disbursedAmount: true },
        _avg: { discountRate: true },
      }),
    ]);

    // Total exposure = sum of disbursed amounts not yet settled
    const totalExposure = activeRequests.reduce(
      (sum, r) => sum + Number(r.disbursedAmount || r.requestedAmount || 0),
      0
    );

    // Pending requests list
    const pendingRequestList = await prisma.factoringRequest.findMany({
      where: {
        tenantId,
        ...(factoringCompanyId ? { factoringCompanyId } : {}),
        status: { in: ["PENDING", "UNDER_REVIEW"] },
      },
      orderBy: { requestedAt: "asc" },
      take: 10,
      select: {
        id: true,
        requestedAmount: true,
        discountRate: true,
        riskTier: true,
        requestedAt: true,
        status: true,
        invoice: {
          select: {
            hotel: { select: { name: true } },
            hotelId: true,
          },
        },
      },
    });

    // Risk alerts — high-risk or overdue
    const highRiskRequests = await prisma.factoringRequest.findMany({
      where: {
        tenantId,
        ...(factoringCompanyId ? { factoringCompanyId } : {}),
        OR: [
          { riskTier: { in: ["HIGH", "CRITICAL"] } },
          {
            status: "DISBURSED",
            settledAt: null,
            disbursedAt: {
              lte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60+ days ago
            },
          },
        ],
      },
      select: {
        id: true,
        riskTier: true,
        disbursedAmount: true,
        riskScore: true,
        invoice: { select: { hotel: { select: { name: true } } } },
      },
      take: 10,
    });

    const riskAlerts = highRiskRequests.map((r) => ({
      id: r.id,
      type: r.riskTier === "CRITICAL" || r.riskTier === "HIGH" ? "High Risk" : "Overdue Payment",
      message: `${r.invoice?.hotel?.name || "Unknown"} — Risk score: ${r.riskScore || "N/A"}`,
      severity:
        r.riskTier === "CRITICAL"
          ? "high" as const
          : r.riskTier === "HIGH"
          ? "medium" as const
          : "low" as const,
    }));

    // Settlement calendar — upcoming settlements
    const upcomingSettlements = await prisma.factoringRequest.findMany({
      where: {
        tenantId,
        ...(factoringCompanyId ? { factoringCompanyId } : {}),
        status: "DISBURSED",
        settledAt: null,
        disbursedAt: { gte: new Date() },
      },
      orderBy: { disbursedAt: "asc" },
      take: 10,
      select: {
        id: true,
        disbursedAmount: true,
        disbursedAt: true,
        invoice: { select: { hotel: { select: { name: true } } } },
      },
    });

    // Exposure trend (last 6 months)
    const exposureData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const [monthExposure, monthDisbursed] = await Promise.all([
        prisma.factoringRequest.aggregate({
          where: {
            tenantId,
            ...(factoringCompanyId ? { factoringCompanyId } : {}),
            status: { in: ["DISBURSED", "SETTLED"] },
            disbursedAt: { lte: monthEnd },
          },
          _sum: { disbursedAmount: true },
        }),
        prisma.factoringRequest.aggregate({
          where: {
            tenantId,
            ...(factoringCompanyId ? { factoringCompanyId } : {}),
            disbursedAt: { gte: monthStart, lte: monthEnd },
          },
          _sum: { disbursedAmount: true },
        }),
      ]);

      exposureData.push({
        month: d.toLocaleString("en", { month: "short" }),
        exposure: Number(monthExposure._sum.disbursedAmount || 0),
        disbursed: Number(monthDisbursed._sum.disbursedAmount || 0),
      });
    }

    return NextResponse.json({
      kpis: {
        pendingRequests,
        totalExposure: totalExposure.toString(),
        disbursedThisMonth: disbursedAgg._sum.disbursedAmount?.toString() || "0",
        averageDiscountRate: (disbursedAgg._avg.discountRate || 0).toFixed(2),
      },
      requests: pendingRequestList.map((r) => ({
        id: r.id,
        requestId: r.id.slice(0, 8).toUpperCase(),
        hotelName: r.invoice?.hotel?.name || "Unknown",
        amount: r.requestedAmount.toString(),
        discountRate: r.discountRate.toString(),
        riskTier: r.riskTier,
        requestedAt: r.requestedAt.toISOString(),
        status: r.status,
      })),
      riskAlerts,
      settlements: upcomingSettlements.map((s) => ({
        id: s.id,
        date: s.disbursedAt?.toISOString() ?? null,
        amount: s.disbursedAmount?.toString() || "0",
        hotelName: s.invoice?.hotel?.name || "Unknown",
      })),
      exposureData,
    });
  } catch (error) {
    console.error("[Dashboard API Factoring]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
