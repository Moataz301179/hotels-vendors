/**
 * POST /api/v1/intelligence/cost-optimization
 * Cost Optimizer endpoint.
 * Body: { cartId: string }
 * Returns cost-saving recommendations.
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { apiRoute, authenticate, success, validateBody } from "@/lib/api-utils";
import { optimizeCosts } from "@/lib/swarm/agents/cost-optimizer";

const bodySchema = z.object({
  cartId: z.string().min(1),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = validateBody(bodySchema, await request.json());

  const result = await optimizeCosts({
    cartId: body.cartId,
    hotelId: auth.userId,
    tenantId: auth.tenantId,
  });

  return success(result);
});
