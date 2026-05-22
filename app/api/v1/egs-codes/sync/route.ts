/**
 * EGS Codes Sync API
 * POST — Sync PENDING EGS codes with ETA for a supplier
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  ApiError,
} from "@/lib/api-utils";
import { syncPendingEgsCodes, registerWithEta } from "@/lib/egs/service";

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "product:update");

  const body = await request.json();
  const { supplierId, egsCodeId } = body;

  if (egsCodeId) {
    // Sync a single code
    const result = await registerWithEta(egsCodeId, auth.tenantId);
    return success(result);
  }

  if (!supplierId) {
    throw new ApiError("supplierId or egsCodeId required", 400);
  }

  // Sync all pending codes for supplier
  const result = await syncPendingEgsCodes(supplierId, auth.tenantId);
  return success(result);
});
