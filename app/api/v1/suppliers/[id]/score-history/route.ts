/**
 * Supplier Score History API
 * GET — Returns historical scores for charting (all sources, time-series)
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
} from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export const GET = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "supplier:read");

  const { id } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || undefined;
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "50", 10));

  const scores = await prisma.companyScore.findMany({
    where: {
      supplierId: id,
      tenantId: auth.tenantId,
      ...(source && { source: source as any }),
    },
    orderBy: { assessedAt: "asc" },
    take: limit,
    select: {
      id: true,
      source: true,
      scoreValue: true,
      scoreLabel: true,
      riskTier: true,
      creditLimit: true,
      assessedAt: true,
      expiresAt: true,
    },
  });

  // Group by source for multi-line chart
  const bySource: Record<string, typeof scores> = {};
  for (const s of scores) {
    if (!bySource[s.source]) bySource[s.source] = [];
    bySource[s.source].push(s);
  }

  return success({
    scores,
    bySource,
    summary: {
      total: scores.length,
      sources: Object.keys(bySource),
      latest: scores.length > 0 ? scores[scores.length - 1] : null,
    },
  });
});
