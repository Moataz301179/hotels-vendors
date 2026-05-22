/**
 * EGS Codes Validation API
 * POST — Validate EGS codes for a set of products or an order
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
  validateProductEgsCode,
  validateOrderEgsCodes,
  validateProductIdsEgsCodes,
} from "@/lib/egs/validation";

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "product:read");

  const body = await request.json();

  if (body.orderId) {
    const result = await validateOrderEgsCodes(body.orderId);
    return success(result);
  }

  if (body.productId) {
    const result = await validateProductEgsCode(body.productId);
    return success(result);
  }

  if (Array.isArray(body.productIds)) {
    const result = await validateProductIdsEgsCodes(body.productIds);
    return success(result);
  }

  throw new ApiError("Provide orderId, productId, or productIds", 400);
});
