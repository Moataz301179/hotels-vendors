import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success } from "@/lib/api-utils";
import { getReorderAlerts, getBuyAheadCandidates, getSupplierRanking } from "@/lib/procurement/predictive-engine";

/**
 * GET /api/v1/procurement/insights?hotelId=…
 * One call powering the F&B Director dashboard:
 *   reorder alerts (occupancy-adjusted) + buy-ahead candidates + supplier ranking.
 * Honest-empty when the tenant has no products/GRN history yet.
 */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const hotelId = request.nextUrl.searchParams.get("hotelId") ?? undefined;

  const [reorderAlerts, buyAhead, supplierRanking] = await Promise.all([
    getReorderAlerts(auth.tenantId, hotelId),
    getBuyAheadCandidates(auth.tenantId),
    getSupplierRanking(auth.tenantId),
  ]);

  const critical = reorderAlerts.filter((a) => a.urgency === "CRITICAL").length;

  return success({
    summary: {
      criticalAlerts: critical,
      reorderAlerts: reorderAlerts.filter((a) => a.urgency === "REORDER").length,
      watchlist: reorderAlerts.filter((a) => a.urgency === "WATCH").length,
      buyAheadOpportunities: buyAhead.length,
      rankedSuppliers: supplierRanking.filter((s) => s.grade !== "INSUFFICIENT_DATA").length,
    },
    reorderAlerts,
    buyAhead,
    supplierRanking,
    occupancyAdjusted: true,
    note: "All figures derive from live stock, real consumption forecasts, and actual GRN history.",
  });
});
