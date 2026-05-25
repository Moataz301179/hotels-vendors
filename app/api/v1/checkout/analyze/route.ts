/**
 * POST /api/v1/checkout/analyze
 * Pre-Spend Gatekeeper endpoint.
 * Body: { cartId: string }
 * Returns gate decision with full analysis.
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { apiRoute, authenticate, success, validateBody } from "@/lib/api-utils";
import { analyzePreSpend } from "@/lib/swarm/agents/pre-spend-gatekeeper";

const bodySchema = z.object({
  cartId: z.string().min(1),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = validateBody(bodySchema, await request.json());

  const result = await analyzePreSpend({
    cartId: body.cartId,
    hotelId: auth.userId, // TODO: resolve hotelId from user profile if multi-hotel
    tenantId: auth.tenantId,
    userId: auth.userId,
  });

  return success(result);
});
