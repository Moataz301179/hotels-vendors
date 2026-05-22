/**
 * EGS Codes API
 * GET  — List EGS codes (supplier / admin scoped)
 * POST — Create a new EGS code
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
  listEgsCodes,
  createEgsCode,
  bulkImportEgsCodes,
} from "@/lib/egs/service";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "product:read");

  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId") || undefined;
  const status = searchParams.get("status") || undefined;
  const productId = searchParams.get("productId") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(100, parseInt(searchParams.get("pageSize") || "50", 10));

  // Non-admin users can only see their own supplier's codes
  const effectiveSupplierId = auth.platformRole === "ADMIN" ? supplierId : undefined;

  const result = await listEgsCodes({
    tenantId: auth.tenantId,
    supplierId: effectiveSupplierId,
    status,
    productId,
    page,
    pageSize,
  });

  return success(result);
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "product:update");

  const body = await request.json();

  // Bulk import mode
  if (body.bulk && Array.isArray(body.rows)) {
    const supplierId = body.supplierId;
    if (!supplierId) throw new ApiError("supplierId required for bulk import", 400);

    const result = await bulkImportEgsCodes(body.rows, supplierId, auth.tenantId);
    return success(result);
  }

  // Single create
  const code = await createEgsCode({
    codeValue: body.codeValue,
    codeType: body.codeType || "EGS",
    description: body.description,
    activeFrom: body.activeFrom ? new Date(body.activeFrom) : new Date(),
    activeTo: body.activeTo ? new Date(body.activeTo) : null,
    supplierId: body.supplierId,
    productId: body.productId || null,
    tenantId: auth.tenantId,
  });

  return success(code, 201);
});
