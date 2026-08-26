/**
 * Idempotency Key Management
 * Hotels Vendors Security Layer (SEC-01)
 *
 * Real Redis-backed idempotency for financial mutations.
 * Key format: idem:{scope}:{userId}:{key}
 * Lifecycle: PENDING -> completed (result JSON), TTL 24h financial / 72h webhook.
 * Atomic reservation via SET NX EX prevents duplicate processing under concurrency.
 */

import {
  reserveIdempotency,
  getIdempotencyResult,
} from "@/lib/redis";

export const IDEMPOTENCY_TTL_FINANCIAL = 24 * 60 * 60; // 24h
export const IDEMPOTENCY_TTL_WEBHOOK = 72 * 60 * 60; // 72h

export interface IdempotencyResult {
  valid: boolean;
  reason?: string;
  /** Stored result JSON from a previous completed request, when replayed. */
  storedResult?: string | null;
}

function ttlForScope(scope: string): number {
  return scope.toLowerCase().includes("webhook")
    ? IDEMPOTENCY_TTL_WEBHOOK
    : IDEMPOTENCY_TTL_FINANCIAL;
}

/**
 * Reserve an idempotency key. Returns valid=false on replay with the
 * previously stored result so callers can return 409 + stored payload.
 */
export async function validateIdempotencyKey(
  key: string,
  metadata: { userId: string; action: string; amount?: number }
): Promise<IdempotencyResult> {
  const ttl = ttlForScope(metadata.action);
  const res = await reserveIdempotency(metadata.action, metadata.userId, key, {
    ttlSeconds: ttl,
  });
  if (!res.replay) {
    return { valid: true };
  }
  if (res.storedResult === "PENDING" || res.storedResult === null) {
    return { valid: false, reason: "Request already in progress", storedResult: null };
  }
  return { valid: false, reason: "Duplicate request", storedResult: res.storedResult };
}

/** Mark a reserved key as completed with its result payload (JSON). */
export async function completeIdempotencyKey(
  scope: string,
  userId: string,
  key: string,
  resultJson: string
): Promise<void> {
  await reserveIdempotency(scope, userId, key, {
    value: resultJson,
    ttlSeconds: ttlForScope(scope),
  });
}

/** Read a previously stored result without reserving (for 409 replay responses). */
export async function getStoredIdempotencyResult(
  scope: string,
  userId: string,
  key: string
): Promise<string | null> {
  return getIdempotencyResult(scope, userId, key);
}

export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}
