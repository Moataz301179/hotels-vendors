/**
 * JWT Signing/Verification Secret — SINGLE SOURCE OF TRUTH.
 *
 * Edge-safe: imports no Node-only APIs (`next/headers`, `cookies`, Prisma,
 * ioredis). Safe to import from `middleware.ts` (edge runtime) AND from
 * server code (`lib/session.ts`, API routes).
 *
 * SECURITY (architecture-review-2026-07.md, S11):
 * Previously `lib/session.ts` and `middleware.ts` each inlined their own
 * `getJwtSecret`/`SECRET` with DIFFERENT dev fallback strings
 * (`"dev-secret-do-not-use-in-production"` vs `"dev-secret-change-in-production"`).
 * In dev (no SESSION_SECRET set) the edge could verify tokens Node signed with
 * a different secret. Both now delegate here.
 *
 * TODO(S10): edge middleware still skips the Redis token blacklist — revoked
 * tokens pass the edge until JWT exp. Closing this requires an edge-compatible
 * revocation mechanism (short-TTL claim or edge Redis client). Tracked as a
 * Phase 1 follow-up.
 */

const DEV_FALLBACK = "dev-secret-do-not-use-in-production";

export function getJwtSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FATAL: SESSION_SECRET environment variable is required in production. " +
          "Generate one with: openssl rand -hex 32"
      );
    }
    console.warn(
      "[Auth] WARNING: Using development fallback for SESSION_SECRET. Do NOT deploy without setting SESSION_SECRET."
    );
  }
  return new TextEncoder().encode(secret || DEV_FALLBACK);
}
