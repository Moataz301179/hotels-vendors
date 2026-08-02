import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "supplier:read");

  // Get supplier's own rating (for their own dashboard)
  const supplier = await prisma.supplier.findFirst({
    where: { tenantId: auth.tenantId },
    select: {
      id: true,
      name: true,
      rating: true,
      avgRating: true,
      totalOrders: true,
      completedOrders: true,
      onTimeDeliveryRate: true,
      ratingCount: true,
      _count: { select: { orders: true } },
    },
  });

  if (!supplier) {
    return error("Supplier not found", 404);
  }

  // Calculate weighted rating
  const rating = supplier.avgRating || 0;
  const orderCount = supplier._count.orders;
  const deliveryRate = supplier.onTimeDeliveryRate || 0;

  // Weighted score: 60% rating, 30% delivery rate, 10% order volume factor
  const volumeFactor = Math.min(orderCount / 100, 1);
  const weightedScore = (rating * 0.6) + (deliveryRate * 0.3) + (volumeFactor * 0.1);

  return success({
    supplier: {
      id: supplier.id,
      name: supplier.name,
      rating: Number(rating.toFixed(2)),
      totalOrders: orderCount,
      completedOrders: supplier.completedOrders || 0,
      onTimeDeliveryRate: Number(deliveryRate.toFixed(2)),
      weightedScore: Number(weightedScore.toFixed(2)),
      period: "all_time",
    },
  });
});