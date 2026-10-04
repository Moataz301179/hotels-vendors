import { NextRequest } from "next/server";
import { apiRoute, authenticate, error, requirePermission, success } from "@/lib/api-utils";
import { aggregateHotelDemand } from "@/lib/demand/aggregation";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:read");
  const days = Number(request.nextUrl.searchParams.get("days") || "30");
  const minHotels = Number(request.nextUrl.searchParams.get("minHotels") || "2");
  if (!Number.isFinite(days) || days < 7 || days > 180) return error("days must be between 7 and 180", 400);
  if (!Number.isFinite(minHotels) || minHotels < 1 || minHotels > 100) return error("minHotels must be between 1 and 100", 400);
  const demand = await aggregateHotelDemand(auth.tenantId, { days, minHotels });
  return success({
    windowDays: days, minHotels, demand,
    summary: {
      opportunities: demand.length,
      aggregatedQuantity: demand.reduce((sum, item) => sum + item.requestedQuantity, 0),
      currentSpend: Number(demand.reduce((sum, item) => sum + item.currentSpend, 0).toFixed(2)),
      highSignal: demand.filter(item => item.volumeDealSignal === "HIGH").length,
    },
  });
});
