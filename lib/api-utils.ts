/**
 * API Utilities — Hotels Vendors v1 API Routes
 * Shared helpers for tenant isolation, auth, audit, idempotency, and responses.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { verifySession, getSessionToken } from "@/lib/session";
import { captureException } from "@sentry/nextjs";
import { appendAuditEntry } from "@/lib/audit/tamper-proof";
import { reserveIdempotency } from "@/lib/redis";
import { rateLimitResponse, type RateLimitTier } from "@/lib/security/rate-limiter";
import { logAuthFailure, logRateLimit } from "@/lib/security/security-logger";

/**
 * Hash an IP address with a daily-rotating salt for audit log privacy.
 * Returns the last octet for IPv4 (e.g., "192.168.1.xxx") or a truncated hash.
 */
function hashIpAddress(ip: string | null): string | null {
  if (!ip || ip === "unknown") return null;
  const salt = new Date().toISOString().slice(0, 10); // Daily rotation
  const hash = createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 16);
  // For IPv4, mask last octet
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  return `hashed:${hash}`;
}

// ─────────────────────────────────────────
// 1. TENANT ISOLATION
// ─────────────────────────────────────────

export function getTenantId(request: NextRequest): string | null {
  // DEPRECATED: Do not use. Tenant ID must come from the JWT session.
  return request.headers.get("x-tenant-id");
}

export function requireTenantId(request: NextRequest): string {
  const tenantId = getTenantId(request);
  if (!tenantId) {
    throw new ApiError("Missing x-tenant-id header", 400);
  }
  return tenantId;
}

export function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization")?.trim();
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    return null;
  }
  return header.slice(7).trim();
}

export function requireServiceKey(request: NextRequest, envName = "INVO_SERVICE_KEY") {
  const apiKey = process.env[envName] || (process.env.NODE_ENV !== "production" ? "dev-key-insecure" : undefined);
  if (!apiKey) {
    throw new ApiError(`${envName} is not configured`, 500);
  }

  const token = getBearerToken(request);
  if (!token || token !== apiKey) {
    throw new ApiError("Unauthorized", 401);
  }
}

// ─────────────────────────────────────────
// 2. AUTH
// ─────────────────────────────────────────

export interface AuthContext {
  userId: string;
  platformRole: string;
  tenantId: string;
}

export async function authenticate(request: NextRequest): Promise<AuthContext> {
  // Primary: session cookie (web). Fallback: Authorization Bearer (mobile / API clients).
  let token = await getSessionToken();
  if (!token) {
    token = getBearerToken(request) ?? undefined;
  }

  if (!token) {
    throw new ApiError("Unauthorized", 401);
  }

  const session = await verifySession(token);
  if (!session) {
    throw new ApiError("Invalid or expired session", 401);
  }

  // Tenant ID comes from the JWT session — NEVER trust client-sent headers
  return { userId: session.userId, platformRole: session.platformRole, tenantId: session.tenantId };
}

export async function optionalAuth(request: NextRequest): Promise<AuthContext | null> {
  try {
    return await authenticate(request);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────
// 3. ZOD VALIDATION
// ─────────────────────────────────────────

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    const messages = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    throw new ApiError(`Validation error: ${messages}`, 400);
  }
  return result.data;
}

export function validateQuery<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams): T {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of searchParams.entries()) {
    // Handle arrays
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        (obj[key] as string[]).push(value);
      } else {
        obj[key] = [obj[key] as string, value];
      }
    } else {
      obj[key] = value;
    }
  }
  const result = schema.safeParse(obj);
  if (!result.success) {
    const messages = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    throw new ApiError(`Query validation error: ${messages}`, 400);
  }
  return result.data;
}

// ─────────────────────────────────────────
// 4. IDEMPOTENCY (SEC-01 — Redis-backed, atomic SET NX EX reservation)
// Key format: idem:{scope}:{userId}:{key}; states PENDING -> completed(result JSON).
// TTL: 24h for financial scopes, 72h when the scope denotes a webhook.

const IDEM_TTL_FINANCIAL = 24 * 60 * 60;
const IDEM_TTL_WEBHOOK = 72 * 60 * 60;

function idemTtl(scope: string): number {
  return scope.toLowerCase().includes("webhook") ? IDEM_TTL_WEBHOOK : IDEM_TTL_FINANCIAL;
}

/**
 * Enforce idempotency for a mutation request.
 * - Reads x-idempotency-key header; auto-generates a UUID for POST mutations
 *   when absent (other methods still require an explicit key).
 * - Atomically reserves the key; concurrent/duplicate requests get a 409
 *   carrying the stored result of the original execution.
 * - Returns an opaque token to pass to completeIdempotency() once the
 *   business mutation has committed.
 */
export async function requireIdempotencyKey(
  request: NextRequest,
  context: { userId: string; action: string; amount: number }
): Promise<string> {
  let key = request.headers.get("x-idempotency-key")?.trim();
  if (!key) {
    if (request.method !== "POST") {
      throw new ApiError("Missing x-idempotency-key header for monetary mutation", 400);
    }
    // Auto-generate for POST mutations so retries without a client key are still tracked.
    key = crypto.randomUUID();
  }

  const scope = context.action || "global";
  const res = await reserveIdempotency(scope, context.userId, key, {
    ttlSeconds: idemTtl(scope),
  });

  if (res.replay) {
    const stored =
      res.storedResult && res.storedResult !== "PENDING"
        ? safeParseStored(res.storedResult)
        : null;
    throw new ApiError(
      JSON.stringify({
        error: "Duplicate request detected",
        replay: true,
        ...(stored !== null ? { previousResult: stored } : {}),
      }),
      409
    );
  }

  // Opaque completion token carrying scope/user/key for completeIdempotency().
  return [scope, context.userId, key].map(encodeURIComponent).join("::");
}

function safeParseStored(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

/** Mark a reserved idempotency token as completed with its result payload. */
export async function completeIdempotency(key: string, result: string): Promise<void> {
  const parts = key.split("::").map(decodeURIComponent);
  if (parts.length !== 3) {
    // Legacy/unknown token format — nothing to mark completed.
    return;
  }
  const [scope, userId, rawKey] = parts;
  await reserveIdempotency(scope, userId, rawKey, {
    value: result,
    ttlSeconds: idemTtl(scope),
  });
}

// 5. AUDIT LOG
// ─────────────────────────────────────────

export async function audit(
  params: {
    entityType?: string;
    entityName?: string;
    entityId: string;
    action?: string;
    actionType?: string;
    tenantId: string;
    actorId?: string | null;
    actorRole?: string | null;
    beforeState?: Record<string, unknown> | null;
    afterState?: Record<string, unknown> | null;
    changes?: Record<string, unknown> | string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }
): Promise<void> {
  try {
    const changes = params.changes ?? {
      ...(params.beforeState ? { before: params.beforeState } : {}),
      ...(params.afterState ? { after: params.afterState } : {}),
    };
    await appendAuditEntry({
      entityName: params.entityName || params.entityType,
      entityId: params.entityId,
      actionType: params.actionType || params.action,
      tenantId: params.tenantId,
      actorId: params.actorId,
      actorRole: params.actorRole,
      changes,
      ipAddress: hashIpAddress(params.ipAddress ?? null),
      userAgent: params.userAgent,
    });
  } catch {
    // Audit failure should not break the request, but log it somewhere
    console.error("Audit log failed:", params);
  }
}

// ─────────────────────────────────────────
// 6. RESPONSE HELPERS
// ─────────────────────────────────────────

export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function error(message: string, status = 500, details?: unknown): NextResponse {
  const body: Record<string, unknown> = { success: false, error: message };
  if (details !== undefined) body.details = details;
  return NextResponse.json(body, { status });
}

// ─────────────────────────────────────────
// 7. ERROR HANDLING
// ─────────────────────────────────────────

export class ApiError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return error(err.message, err.statusCode);
  }
  if (err instanceof z.ZodError) {
    const messages = err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    return error(`Validation error: ${messages}`, 400);
  }
  // Permission denied → 403 (PermissionDeniedError extends Error but has name="PermissionDeniedError")
  if (err instanceof Error && err.name === "PermissionDeniedError") {
    return error(err.message, 403);
  }
  if (err instanceof Error) {
    return error(err.message, 500);
  }
  return error("Unknown error", 500);
}

// ─────────────────────────────────────────
// 8. ROUTE WRAPPER
// ─────────────────────────────────────────

export function apiRoute(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (request: NextRequest, ctx: any) => Promise<NextResponse | Response>,
  options?: { rateLimit?: RateLimitTier; skipAuthLog?: boolean }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (request: NextRequest, ctx: any): Promise<NextResponse | Response> => {
    // Rate limiting check (if configured)
    if (options?.rateLimit) {
      const rateLimited = await rateLimitResponse(request, options.rateLimit);
      if (rateLimited) {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        logRateLimit(ip, request.url, options.rateLimit);
        return rateLimited;
      }
    }

    try {
      return await handler(request, ctx);
    } catch (err) {
      // Log auth failures for security monitoring
      if (!options?.skipAuthLog && err instanceof ApiError && err.statusCode === 401) {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        logAuthFailure(ip, request.url, err.message);
      }
      // Capture unexpected errors in Sentry (if configured)
      try {
        captureException(err);
      } catch {
        // ignore Sentry capture failures
      }
      return handleApiError(err);
    }
  };
}

// ─────────────────────────────────────────
// 9. RBAC & TENANT RE-EXPORTS
// ─────────────────────────────────────────

export { requirePermission, PermissionDeniedError } from "@/lib/auth/rbac";
export { tenantWhereClause, enforceTenantOwnership } from "@/lib/tenant/scope";
export type { TenantContext } from "@/lib/tenant/scope";
