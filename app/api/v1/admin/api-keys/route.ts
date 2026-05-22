/**
 * API Key Management (Admin)
 * GET  — List API keys
 * POST — Create new API key
 * DELETE — Revoke an API key
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  ApiError,
} from "@/lib/api-utils";
import { createApiKey, listApiKeys, revokeApiKey } from "@/lib/api-keys/service";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:read");

  const keys = await listApiKeys(auth.tenantId);
  return success(keys);
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_tenants");

  const body = await request.json();
  if (!body.name || !body.scopes || !Array.isArray(body.scopes)) {
    throw new ApiError("name and scopes array required", 400);
  }

  const result = await createApiKey({
    name: body.name,
    scopes: body.scopes,
    factoringCompanyId: body.factoringCompanyId,
    tenantId: auth.tenantId,
  });

  return success(
    {
      id: result.apiKey.id,
      name: result.apiKey.name,
      keyPrefix: result.apiKey.keyPrefix,
      scopes: result.apiKey.scopes,
      rawKey: result.rawKey, // SHOWN ONLY ONCE
      createdAt: result.apiKey.createdAt,
    },
    201
  );
});

export const DELETE = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_tenants");

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) throw new ApiError("id query param required", 400);

  await revokeApiKey(id, auth.tenantId, auth.userId);
  return success({ revoked: true });
});
