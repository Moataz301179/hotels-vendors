/**
 * Supplier Composite Score API
 * GET — Returns blended risk score for factoring decisions
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
} from "@/lib/api-utils";
import { getCompositeScore } from "@/lib/compliance/scoring";

export const GET = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "supplier:read");

  const { id } = await ctx.params;
  const result = await getCompositeScore(id);
  return success(result);
});
