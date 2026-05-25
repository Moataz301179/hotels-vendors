/**
 * GET /api/v1/intelligence/cost-optimization
 * Cost Optimizer — Returns cost reduction opportunities for a hotel
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { apiRoute, authenticate, success, validateBody } from "@/lib/api-utils";
import { costOptimizer } from "@/lib/swarm/agents/cost-optimizer";

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

  const report = await costOptimizer.generateReport(hotelId, auth.tenantId);

  return success({
    report,
    summary: {
      totalOpportunities: report.totalOpportunities,
      totalPotentialSavings: report.totalPotentialSavings,
      supplierSwitchCount: report.supplierSwitches.length,
      consolidationCount: report.consolidationOpportunities.length,
      volumeDiscountCount: report.volumeDiscounts.length,
    },
  });
});
