/**
 * API Utilities — Hotels Vendors v1 API Routes
 * Shared helpers for tenant isolation, auth, audit, idempotency, and responses.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySession, getSessionToken } from "@/lib/session";
import { appendAuditEntry } from "@/lib/audit/tamper-proof";
import { checkIdempotencyKey, completeIdempotency as completeRedisIdempotency } from "@/lib/redis";
import { rateLimitResponse, type RateLimitTier } from "@/lib/security/rate-limiter";
import { logAuthFailure, logRateLimit } from "@/lib/security/security-logger";

// ─────────────────────────────────────────
// 1. TENANT ISOLATION
// ─────────────────────────────────────────

export function requireTenantId(request: NextRequest): string {
  // Tenant id is read from the JWT session by authenticate(); this helper is retained only for routes that
  // need an explicit check beyond authentication. Do NOT read x-tenant-id from headers.
  throw new ApiError("Missing tenant context", 400);
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
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const path = request.nextUrl?.pathname || request.headers.get("x-forwarded-path") || "/unknown";

  // Primary: read from session cookie
  let token = await getSessionToken();

  // Fallback: read from middleware-injected header (edge-verified)
  if (!token) {
    const headerToken = request.headers.get("x-session-token");
    if (headerToken) token = headerToken;
  }

  if (!token) {
    logAuthFailure(ip, path, "No session token provided");
    throw new ApiError("Unauthorized", 401);
  }

  const session = await verifySession(token);
  if (!session) {
    logAuthFailure(ip, path, "Invalid or expired session token");
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
// 4. IDEMPOTENCY
// ─────────────────────────────────────────

export async function requireIdempotencyKey(
  request: NextRequest,
  context: { userId: string; action: string; amount: number }
): Promise<string> {
  const key = request.headers.get("x-idempotency-key");
  if (!key) {
    throw new ApiError("Missing x-idempotency-key header for monetary mutation", 400);
  }
  const scope = `${context.userId}:${context.action}`;
  const result = await checkIdempotencyKey(key, scope);
  if (result.exists) {
    throw new ApiError(result.previousResult || "Duplicate request detected", 409);
  }
  return key;
}

export function completeIdempotency(key: string, result: string): void {
  completeRedisIdempotency(key, "global", result);
}

// ─────────────────────────────────────────
// 5. AUDIT LOG
// ─────────────────────────────────────────

export async function audit(
  params: {
    entityType: string;
    entityId: string;
    action: string;
    tenantId: string;
    actorId?: string | null;
    actorRole?: string | null;
    beforeState?: Record<string, unknown> | null;
    afterState?: Record<string, unknown> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }
): Promise<void> {
  try {
    await appendAuditEntry(params);
  } catch {
    // Audit failure should not break the request, but log it somewhere
    // eslint-disable-next-line no-console
    console.error("Audit log failed:", params);
  }
}

// ─────────────────────────────────────────
// 6. JSON SERIALIZATION — Decimal → Number
// ─────────────────────────────────────────

/**
 * Recursively convert Prisma Decimls to plain numbers.
 * Prevents Decimal values from serializing as strings in JSON responses.
 */
function serializeResponse(value: unknown): unknown {
  // Check for Prisma Decimal (has toNumber method)
  if (value !== null && typeof value === "object" && "toNumber" in (value as Record<string, unknown>)) {
    return (value as { toNumber: () => number }).toNumber();
  }
  if (Array.isArray(value)) {
    return value.map(serializeResponse);
  }
  if (value !== null && typeof value === "object") {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      obj[k] = serializeResponse(v);
    }
    return obj;
  }
  return value;
}

// ─────────────────────────────────────────
// 7. RESPONSE HELPERS
// ─────────────────────────────────────────

export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(serializeResponse({ success: true, data }), { status });
}

export function error(message: string, status = 500): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
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
