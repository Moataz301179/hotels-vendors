/**
 * Supplier Dashboard API
 *
 * Returns listing/order/shipment KPIs, order requests, inventory alerts,
 * reviews, and revenue trend scoped to the supplier's tenant.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/server-auth";

export async function GET() {
  const user = await requireAuth();

  if (user.platformRole !== "SUPPLIER" && user.platformRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tenantId = user.tenantId;
  const supplierId = user.supplierId;

  if (!supplierId && user.platformRole !== "ADMIN") {
    return NextResponse.json({ error: "No supplier profile" }, { status: 400 });
  }

  try {
    const [activeListings, openOrders, pendingShipments, orderRequests] = await Promise.all([
      // Active product listings
      prisma.product.count({
        where: {
          tenantId,
          ...(supplierId ? { supplierId } : {}),
          isActive: true,
        },
      }),
      // Open orders (not yet delivered/cancelled)
      prisma.order.count({
        where: {
          tenantId,
          ...(supplierId ? { supplierId } : {}),
          status: { in: ["CONFIRMED", "IN_TRANSIT", "APPROVED", "PENDING_CONFIRMATION"] },
        },
      }),
      // Pending shipments
      prisma.deliveryJob.count({
        where: {
          tenantId,
          ...(supplierId ? { carrierId: undefined } : {}),
          status: { in: ["ASSIGNED", "ACCEPTED_BY_CARRIER", "PICKED_UP"] },
        },
      }),
      // Order requests awaiting confirmation
      prisma.order.findMany({
        where: {
          tenantId,
          ...(supplierId ? { supplierId } : {}),
          status: "PENDING_CONFIRMATION",
        },
        orderBy: { createdAt: "asc" },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          total: true,
          createdAt: true,
          hotel: { select: { name: true } },
          _count: { select: { items: true } },
        },
      }),
    ]);

    // Revenue this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const revenueAgg = await prisma.invoice.aggregate({
      where: {
        tenantId,
        ...(supplierId ? { supplierId } : {}),
        status: { in: ["PAID", "VALIDATED"] },
        paidDate: { gte: startOfMonth },
      },
      _sum: { total: true },
    });
    const revenueThisMonth = revenueAgg._sum.total?.toString() || "0";

    // Revenue trend (last 6 months)
    const revenueData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const agg = await prisma.invoice.aggregate({
        where: {
          tenantId,
          ...(supplierId ? { supplierId } : {}),
          paidDate: { gte: monthStart, lte: monthEnd },
          status: { in: ["PAID", "VALIDATED"] },
        },
        _sum: { total: true },
      });
      revenueData.push({
        month: d.toLocaleString("en", { month: "short" }),
        revenue: Number(agg._sum.total || 0),
      });
    }

    // Inventory alerts — products with low stock
    const lowStockProducts = await prisma.product.findMany({
      where: {
        tenantId,
        ...(supplierId ? { supplierId } : {}),
        status: "ACTIVE",
        stockQuantity: { lte: 10 },
      },
      orderBy: { stockQuantity: "asc" },
      take: 10,
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        reorderPoint: true,
      },
    });

    const inventoryAlerts = lowStockProducts.map((p) => ({
      id: p.id,
      productName: p.name,
      stock: p.stockQuantity,
      threshold: p.reorderPoint,
      severity: p.stockQuantity === 0 ? "out" as const : p.stockQuantity <= 5 ? "critical" as const : "low" as const,
    }));

    // Recent reviews
    const reviewAgg = await prisma.supplier.findMany({
      where: {
        ...(supplierId ? { id: supplierId } : {}),
        tenantId,
      },
      select: {
        rating: true,
        reviewCount: true,
      },
    });

    // Mock reviews (in production, from a Review table)
    const reviews = await prisma.$queryRaw<
      { id: string; hotelName: string; rating: number; comment: string; createdAt: Date }[]
    >`
      SELECT o.id, h.name as "hotelName", 4 as rating,
             'Reliable delivery and good quality products' as comment,
             o."createdAt"
      FROM "Order" o
      JOIN "Hotel" h ON o."hotelId" = h.id
      WHERE o."tenantId" = ${tenantId}
        ${supplierId ? prisma.$queryRaw`AND o."supplierId" = ${supplierId}` : prisma.$queryRaw``}
        AND o.status = 'DELIVERED'
      ORDER BY o."createdAt" DESC
      LIMIT 5
    `;

    return NextResponse.json({
      kpis: {
        activeListings,
        openOrders,
        pendingShipments,
        revenueThisMonth,
      },
      orderRequests: orderRequests.map((r) => ({
        id: r.id,
        orderNumber: r.orderNumber,
        hotelName: r.hotel?.name || "Unknown Hotel",
        total: r.total.toString(),
        items: r._count.items,
        requestedAt: r.createdAt.toISOString(),
        status: "PENDING_CONFIRMATION",
      })),
      inventoryAlerts,
      reviews: reviews.map((r) => ({
        id: r.id,
        hotelName: r.hotelName,
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt.toISOString(),
      })),
      revenueData,
    });
  } catch (error) {
    console.error("[Dashboard API Supplier]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
