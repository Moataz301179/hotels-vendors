/**
 * Split Payment Detail API
 * GET — Get split transaction details
 * PATCH — Mark a split item as paid
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  ApiError,
} from "@/lib/api-utils";
import { markSplitItemPaid, releaseReserveAndPay, getSplitTransaction } from "@/lib/payments/split";

export const GET = apiRoute(async (request: NextRequest, ctx) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:read");

  const params = await ctx.params;
  const id = params.id as string;
  const tx = await getSplitTransaction(id);

  if (!tx || tx.tenantId !== auth.tenantId) {
    throw new ApiError("Split transaction not found", 404);
  }

  return success(tx);
});

export const PATCH = apiRoute(async (request: NextRequest, ctx) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_payments");

  const params = await ctx.params;
  const id = params.id as string;
  const body = await request.json();

  if (body.action === "mark_paid" && body.splitItemId) {
    await markSplitItemPaid(body.splitItemId, body.payoutRef, body.payoutMethod);
    return success({ marked: true });
  }

  if (body.action === "release_reserve" && body.splitItemId) {
    await releaseReserveAndPay(body.splitItemId);
    return success({ released: true });
  }

  throw new ApiError("Invalid action. Use mark_paid or release_reserve", 400);
});
