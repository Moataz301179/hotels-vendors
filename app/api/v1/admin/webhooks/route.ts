/**
 * Webhook Subscription Management (Admin)
 * GET  — List webhooks
 * POST — Create webhook
 * PATCH — Update webhook
 * DELETE — Delete webhook
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  ApiError,
} from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:read");

  const subs = await prisma.webhookSubscription.findMany({
    where: { tenantId: auth.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return success(subs);
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_tenants");

  const body = await request.json();
  if (!body.name || !body.url || !body.events) {
    throw new ApiError("name, url, and events required", 400);
  }

  const sub = await prisma.webhookSubscription.create({
    data: {
      tenantId: auth.tenantId,
      name: body.name,
      url: body.url,
      events: Array.isArray(body.events) ? body.events.join(",") : body.events,
      secret: body.secret,
      headers: body.headers ? JSON.stringify(body.headers) : null,
      active: body.active !== false,
    },
  });

  return success(sub, 201);
});

export const PATCH = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_tenants");

  const body = await request.json();
  if (!body.id) throw new ApiError("id required", 400);

  const sub = await prisma.webhookSubscription.updateMany({
    where: { id: body.id, tenantId: auth.tenantId },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.url && { url: body.url }),
      ...(body.events && { events: Array.isArray(body.events) ? body.events.join(",") : body.events }),
      ...(body.secret !== undefined && { secret: body.secret }),
      ...(body.headers && { headers: JSON.stringify(body.headers) }),
      ...(body.active !== undefined && { active: body.active }),
      ...(body.failureCount !== undefined && { failureCount: body.failureCount }),
    },
  });

  return success({ updated: sub.count });
});

export const DELETE = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_tenants");

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) throw new ApiError("id query param required", 400);

  await prisma.webhookSubscription.deleteMany({
    where: { id, tenantId: auth.tenantId },
  });

  return success({ deleted: true });
});
