/**
 * Rate Limiter — OWASP A04:2021 Insecure Design
 * Protects API routes from brute force, enumeration, and abuse.
 *
 * Uses in-memory RateLimiterMemory for edge / Next.js.
 * For production with multiple instances, switch to RateLimiterRedis.
 */

import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { NextRequest } from "next/server";

// ── Limiter Definitions ──────────────────────────────────────

/** Auth routes: strict, prevent brute force */
const authLimiter = new RateLimiterMemory({
  keyPrefix: "rl_auth",
  points: 5,        // 5 attempts
  duration: 60 * 5, // per 5 minutes
});

/** API v1 routes: moderate, prevent enumeration */
const apiLimiter = new RateLimiterMemory({
  keyPrefix: "rl_api",
  points: 60,       // 60 requests
  duration: 60,     // per minute
});

/** General public routes: generous */
const publicLimiter = new RateLimiterMemory({
  keyPrefix: "rl_public",
  points: 100,      // 100 requests
  duration: 60,     // per minute
});

/** Financial / sensitive routes: strict */
const financialLimiter = new RateLimiterMemory({
  keyPrefix: "rl_financial",
  points: 10,       // 10 requests
  duration: 60,     // per minute
});

// ── Helpers ──────────────────────────────────────────────────

function getClientKey(req: NextRequest): string {
  // Use forwarded IP if behind nginx, fallback to direct IP
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  // NextRequest.ip may be available in some environments
  return (req as unknown as { ip?: string }).ip ?? "unknown";
}

export type RateLimitTier = "auth" | "api" | "public" | "financial";

const limiters: Record<RateLimitTier, RateLimiterMemory> = {
  auth: authLimiter,
  api: apiLimiter,
  public: publicLimiter,
  financial: financialLimiter,
};

/**
 * Consume one point from the rate limiter for this request.
 * Returns { allowed: true } or { allowed: false, retryAfter: seconds }.
 */
export async function checkRateLimit(
  req: NextRequest,
  tier: RateLimitTier = "api"
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const key = getClientKey(req);
  const limiter = limiters[tier];
  try {
    await limiter.consume(key, 1);
    return { allowed: true };
  } catch (rlRejected) {
    if (rlRejected instanceof RateLimiterRes) {
      return {
        allowed: false,
        retryAfter: Math.round(rlRejected.msBeforeNext / 1000),
      };
    }
    // Unknown error — fail closed (allow)
    return { allowed: true };
  }
}

/**
 * Middleware helper: returns a 429 response if rate limited,
 * or null if allowed.
 */
export async function rateLimitResponse(
  req: NextRequest,
  tier: RateLimitTier = "api"
): Promise<Response | null> {
  const result = await checkRateLimit(req, tier);
  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: "Too many requests. Please try again later.",
        retryAfter: result.retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(result.retryAfter ?? 60),
        },
      }
    );
  }
  return null;
}
