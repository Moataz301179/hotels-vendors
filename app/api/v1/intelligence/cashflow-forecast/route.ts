/**
 * POST /api/v1/intelligence/cashflow-forecast
 * Cashflow Planner endpoint.
 * Body: { hotelId?: string, horizonDays?: number }
 * Returns 90-day cashflow forecast.
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { apiRoute, authenticate, success, validateBody } from "@/lib/api-utils";
import { planCashflow } from "@/lib/swarm/agents/cashflow-planner";

const bodySchema = z.object({
  hotelId: z.string().optional(),
  horizonDays: z.number().int().min(7).max(365).optional(),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = validateBody(bodySchema, await request.json());

  const result = await planCashflow({
    hotelId: body.hotelId ?? auth.userId,
    tenantId: auth.tenantId,
    horizonDays: body.horizonDays,
  });

  return success(result);
});
