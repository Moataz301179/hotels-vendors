/**
 * Admin Environment Editor — write the server .env file.
 *
 * SECURITY (architecture-review-2026-07.md, S1):
 * Previously gated by a hardcoded "panda3011" password read from a client
 * header (no authenticate, no RBAC). Now requires an authenticated session
 * with `admin:manage_platform` permission. The .env write itself is preserved
 * as-is (functionality unchanged) — only the auth gate was hardened.
 *
 * NOTE: Writing .env over HTTP is still risky; the long-term fix is to remove
 * this route entirely and use Vercel env vars / a secrets vault (AGENTS.md §
 * "Data Handling"). This patch closes the unauthenticated-access hole only.
 */
import { NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { z } from "zod";
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

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const body = await request.json().catch(() => null);
  const parsed = EnvWriteSchema.safeParse(body);
  if (!parsed.success) {
    return error("Invalid body: expects { content: string }", 400);
  }

  const envPath = join(process.cwd(), ".env");
  const before = await readFileSafe(envPath);

  try {
    await writeFile(envPath, parsed.data.content, "utf-8");
  } catch (err) {
    console.error("[admin/env] write failed:", err);
    return error("Failed to save environment file", 500);
  }

  await audit({
    entityType: "system",
    entityId: "env",
    action: "ENV_UPDATED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    beforeState: { bytes: before.length },
    afterState: { bytes: parsed.data.content.length },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ message: "Environment saved" });
});

async function readFileSafe(path: string): Promise<{ length: number }> {
  try {
    const { readFile } = await import("fs/promises");
    const data = await readFile(path, "utf-8");
    return { length: data.length };
  } catch {
    return { length: 0 };
  }
}
