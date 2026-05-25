/**
 * GET /api/v1/intelligence/cashflow-forecast
 * Cashflow Planner — Returns predictive cashflow analysis for a hotel
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { apiRoute, authenticate, success, validateBody } from "@/lib/api-utils";
import { cashflowPlanner } from "@/lib/swarm/agents/cashflow-planner";

const QuerySchema = z.object({
  hotelId: z.string().min(1).optional(),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const { searchParams } = new URL(request.url);
  const query = validateBody(QuerySchema, {
    hotelId: searchParams.get("hotelId") ?? undefined,
  });

  const hotelId = query.hotelId ?? auth.userId;

  const forecast = await cashflowPlanner.generateForecast(hotelId, auth.tenantId);

  return success({
    forecast,
    summary: {
      netPosition: forecast.currentPosition.netPosition,
      availableCredit: forecast.currentPosition.availableCredit,
      creditUtilizationPct: forecast.currentPosition.creditUtilizationPct,
      liquidityGapCount: forecast.liquidityGaps.length,
      factoringRecommendationCount: forecast.factoringRecommendations.length,
      thirtyDayConfidence: forecast.thirtyDayForecast.confidence,
    },
  });
});
