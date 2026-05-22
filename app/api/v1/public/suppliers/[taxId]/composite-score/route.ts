/**
 * Public API — Supplier Composite Score
 * Authenticated via X-API-Key header. For factoring partners.
 *
 * GET /api/v1/public/suppliers/:taxId/composite-score
 */

import { NextRequest } from "next/server";
import { success, error } from "@/lib/api-utils";
import { validateApiKey, hasScope } from "@/lib/api-keys/service";
import { getCompositeScore } from "@/lib/compliance/scoring";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ taxId: string }> }
) {
  const apiKeyHeader = request.headers.get("x-api-key");
  if (!apiKeyHeader) {
    return error("Missing X-API-Key header", 401);
  }

  const apiKey = await validateApiKey(apiKeyHeader);
  if (!apiKey) {
    return error("Invalid or revoked API key", 401);
  }

  if (!hasScope(apiKey, "read:scores")) {
    return error("API key lacks read:scores scope", 403);
  }

  const { taxId } = await ctx.params;

  const supplier = await prisma.supplier.findFirst({
    where: { taxId, tenantId: apiKey.tenantId },
    select: { id: true, name: true, taxId: true, status: true },
  });

  if (!supplier) {
    return error("Supplier not found", 404);
  }

  const composite = await getCompositeScore(supplier.id);

  return success({
    supplier: {
      name: supplier.name,
      taxId: supplier.taxId,
      status: supplier.status,
    },
    compositeScore: composite.compositeScore,
    riskTier: composite.riskTier,
    factors: composite.factors,
    accessedAt: new Date().toISOString(),
  });
}
