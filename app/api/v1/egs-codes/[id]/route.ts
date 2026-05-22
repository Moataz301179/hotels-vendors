/**
 * EGS Code Detail API
 * GET    — Retrieve single EGS code
 * PATCH  — Update EGS code
 * DELETE — Remove EGS code
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  ApiError,
} from "@/lib/api-utils";
import { getEgsCode, updateEgsCode, deleteEgsCode } from "@/lib/egs/service";

export const GET = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "product:read");

  const { id } = await ctx.params;
  const code = await getEgsCode(id, auth.tenantId);

  if (!code) {
    throw new ApiError("EGS code not found", 404);
  }

  return success(code);
});

export const PATCH = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "product:update");

  const { id } = await ctx.params;
  const body = await request.json();

  const code = await updateEgsCode(id, auth.tenantId, {
    codeValue: body.codeValue,
    codeType: body.codeType,
    description: body.description,
    activeFrom: body.activeFrom ? new Date(body.activeFrom) : undefined,
    activeTo: body.activeTo === null ? null : body.activeTo ? new Date(body.activeTo) : undefined,
    productId: body.productId,
    status: body.status,
  });

  return success(code);
});

export const DELETE = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "product:delete");

  const { id } = await ctx.params;
  await deleteEgsCode(id, auth.tenantId);

  return success({ deleted: true });
});
