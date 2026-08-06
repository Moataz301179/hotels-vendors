/**
 * Idempotency Key Management
 * Hotels Vendors Security Layer
 *
 * Prevents duplicate processing of financial mutations.
 * Backed by the Redis/in-memory idempotency store in `lib/redis.ts`.
 */

import { randomBytes } from "crypto";
import { checkIdempotencyKey } from "@/lib/redis";

export interface IdempotencyResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validates an idempotency key against the shared store.
 * First use of a key is valid (and reserves the key); subsequent uses are
 * rejected as duplicates. Scope is derived from user + action + amount so
 * the same key cannot be replayed across different operations.
 */
export async function validateIdempotencyKey(
  key: string,
  metadata: { userId: string; action: string; amount: number }
): Promise<IdempotencyResult> {
  if (!key || key.length < 8) {
    return { valid: false, reason: "Idempotency key missing or too short" };
  }

  const scope = `${metadata.userId}:${metadata.action}:${metadata.amount}`;
  const result = await checkIdempotencyKey(key, scope);

  if (result.exists) {
    return { valid: false, reason: result.previousResult || "Duplicate request detected" };
  }
  return { valid: true };
}

/** Cryptographically secure idempotency key. */
export function generateIdempotencyKey(): string {
  return `idem_${Date.now()}_${randomBytes(12).toString("hex")}`;
}
