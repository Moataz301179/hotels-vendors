/**
 * Admin Analytics — platform-wide aggregate metrics.
 *
 * SECURITY (architecture-review-2026-07.md, S6):
 * Previously exported a raw GET handler with NO authentication — exposing
 * cross-tenant counts of users, suppliers, hotels, and orders to anyone. Now
 * wrapped in `apiRoute` + `authenticate` + `requirePermission("admin:manage_platform")`.
 *
 * The metrics are intentionally platform-wide (not tenant-scoped) — that is the
 * purpose of an admin analytics endpoint. The fix is to gate it behind admin
 * RBAC, not to scope it to a single tenant.
 */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const period = request.nextUrl.searchParams.get("period") || "30d";
  const now = new Date();
  const startDate = new Date(
    now.getTime() -
      (period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365) *
        24 *
        60 *
        60 *
        1000
  );

  const [
    totalUsers,
    totalSuppliers,
    totalHotels,
    totalOrders,
    completedOrders,
    pendingOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.supplier.count(),
    prisma.hotel.count(),
    prisma.order.count({ where: { createdAt: { gte: startDate } } }),
    prisma.order.count({
      where: { status: "DELIVERED", createdAt: { gte: startDate } },
    }),
    prisma.order.count({
      where: { status: "PENDING_APPROVAL", createdAt: { gte: startDate } },
    }),
  ]);

  const activeUsers = await prisma.user.count({
    where: {
      lastActive: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
    },
  });

  return Response.json({
    success: true,
    data: {
      totalRevenue: 1250000,
      totalOrders,
      totalUsers,
      totalSuppliers,
      totalHotels,
      platformFees: 25000,
      factoringVolume: 4200000,
      avgOrderValue: totalOrders > 0 ? Math.round(1250000 / totalOrders) : 0,
      monthlyGrowth: 12.5,
      activeUsers,
      pendingOrders,
      completedOrders,
      rejectedOrders: totalOrders - completedOrders - pendingOrders,
      topSuppliers: [],
      topHotels: [],
      revenueByMonth: [],
      ordersByStatus: [],
    },
  });
});
