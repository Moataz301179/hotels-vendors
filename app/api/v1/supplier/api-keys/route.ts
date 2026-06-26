/**
 * GET /api/v1/supplier/api-keys — list all API keys for the authenticated supplier
 * POST /api/v1/supplier/api-keys — create a new API key
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission } from "@/lib/api-utils";
import { createApiKey, listApiKeys } from "@/lib/supplier/api-key-service";
import { z } from "zod";

const CreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  scopes: z.array(z.string()).optional(),
  rateLimitPerMinute: z.number().int().min(1).max(1000).optional(),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "apikey:read");

  const supplier = await prisma.supplier.findFirst({
    where: { tenantId: auth.tenantId },
  });
  if (!supplier) return error("Supplier not found", 404);

  const keys = await listApiKeys(supplier.id, auth.tenantId);
  return success({ keys });
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "apikey:create");

  const supplier = await prisma.supplier.findFirst({
    where: { tenantId: auth.tenantId },
  });
  if (!supplier) return error("Supplier not found", 404);

  const body = await request.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return error(parsed.error.issues[0]?.message ?? "Invalid payload", 400);
  }

  const created = await createApiKey({
    supplierId: supplier.id,
    tenantId: auth.tenantId,
    name: parsed.data.name,
    description: parsed.data.description,
    scopes: parsed.data.scopes,
    rateLimitPerMinute: parsed.data.rateLimitPerMinute,
    expiresInDays: parsed.data.expiresInDays,
  });

  return success({ key: created }, 201);
});
