/**
 * API Utilities — Hotels Vendors v1 API Routes
 * Shared helpers for tenant isolation, auth, audit, idempotency, and responses.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySession, getSessionToken } from "@/lib/session";
import { appendAuditEntry } from "@/lib/audit/tamper-proof";
import { checkIdempotencyKey, completeIdempotency as completeRedisIdempotency } from "@/lib/redis";

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

// ─────────────────────────────────────────
// 2. AUTH
// ─────────────────────────────────────────

export interface AuthContext {
  userId: string;
  platformRole: string;
  tenantId: string;
}

export async function authenticate(request: NextRequest): Promise<AuthContext> {
  // Primary: read from session cookie
  let token = await getSessionToken();

  // Fallback: read from middleware-injected header (edge-verified)
  if (!token) {
    const headerToken = request.headers.get("x-session-token");
    if (headerToken) token = headerToken;
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
// 6. RESPONSE HELPERS
// ─────────────────────────────────────────

export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
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
  handler: (request: NextRequest, ctx: any) => Promise<NextResponse>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (request: NextRequest, ctx: any): Promise<NextResponse> => {
    try {
      return await handler(request, ctx);
    } catch (err) {
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
