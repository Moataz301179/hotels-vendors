/**
 * Admin Credentials Manager — view credential-access audit entries & update .env.
 *
 * SECURITY (architecture-review-2026-07.md, S1):
 * Previously the POST handler wrote the .env file gated only by a hardcoded
 * "panda3011" header password, with no authenticate / RBAC. Now both handlers
 * require an authenticated session with `admin:manage_platform`.
 *
 * The GET handler returns the most recent CREDENTIAL_ACCESS audit entries
 * (mapped from the actual AuditLog schema: beforeState/afterState, not the
 * non-existent `resource`/`details` fields the prior @ts-nocheck code used).
 */
import { NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  error,
  audit,
} from "@/lib/api-utils";

const EnvWriteSchema = z.object({
  content: z.string().max(256 * 1024),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const entries = await prisma.auditLog.findMany({
    where: { action: "CREDENTIAL_ACCESS" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return success(
    entries.map((c) => ({
      id: c.id,
      action: c.action,
      actorId: c.actorId,
      actorRole: c.actorRole,
      beforeState: c.beforeState,
      afterState: c.afterState,
      lastRotated: c.createdAt.toISOString(),
      status: "active",
    }))
  );
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const body = await request.json().catch(() => null);
  const parsed = EnvWriteSchema.safeParse(body);
  if (!parsed.success) {
    return error("Invalid body: expects { content: string }", 400);
  }

  const envPath = join(process.cwd(), ".env");
  try {
    await writeFile(envPath, parsed.data.content, "utf-8");
  } catch (err) {
    console.error("[admin/credentials] write failed:", err);
    return error("Failed to update environment", 500);
  }

  await audit({
    entityType: "system",
    entityId: "credentials",
    action: "ENV_UPDATED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { bytes: parsed.data.content.length, updatedBy: "admin" },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ message: "Environment updated successfully" });
});
