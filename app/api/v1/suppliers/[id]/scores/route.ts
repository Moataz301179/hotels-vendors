/**
 * Supplier Company Scores API
 * GET  — List all scores for a supplier
 * POST — Add a new score (admin/manual entry)
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  ApiError,
} from "@/lib/api-utils";
import {
  recordCompanyScore,
  getSupplierScores,
} from "@/lib/compliance/scoring";

export const GET = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "supplier:read");

  const { id } = await ctx.params;
  const scores = await getSupplierScores(id);
  return success(scores);
});

export const POST = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "supplier:update");

  const { id } = await ctx.params;
  const body = await request.json();

  if (!body.source || body.scoreValue === undefined) {
    throw new ApiError("source and scoreValue required", 400);
  }

  const score = await recordCompanyScore({
    supplierId: id,
    source: body.source,
    sourceRef: body.sourceRef,
    scoreValue: body.scoreValue,
    scoreLabel: body.scoreLabel,
    riskTier: body.riskTier,
    creditLimit: body.creditLimit,
    reportUrl: body.reportUrl,
    rawData: body.rawData,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    tenantId: auth.tenantId,
  });

  return success(score, 201);
});
