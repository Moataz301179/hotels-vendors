/**
 * Idempotency Engine
 * Hotels Vendors Security Layer
 *
 * Prevents duplicate financial transactions.
 * Every mutation that involves money MUST include an idempotency key.
 */

import { createHash, randomBytes } from "crypto";

// In-memory store for development. Use Redis in production.
const idempotencyStore = new Map<string, { processed: boolean; result?: string; expiresAt: number }>();

// ─────────────────────────────────────────
// 1. KEY GENERATION
// ─────────────────────────────────────────

/**
 * Generate a cryptographically secure idempotency key.
 */
export function generateIdempotencyKey(): string {
  return `idem_${randomBytes(16).toString("hex")}`;
}

/**
 * Generate a deterministic idempotency key from request parameters.
 * Useful for retries where the client doesn't generate a key.
 */
export function generateDeterministicKey(params: {
  userId: string;
  action: string;
  amount: number;
  timestamp: number;
}): string {
  const payload = `${params.userId}:${params.action}:${params.amount}:${Math.floor(params.timestamp / 60000)}`; // 1-minute window
  return `idem_${createHash("sha256").update(payload).digest("hex").substring(0, 32)}`;
}

// ─────────────────────────────────────────
// 2. VALIDATION
// ─────────────────────────────────────────

export interface IdempotencyValidationResult {
  valid: boolean;
  reason?: string;
  isDuplicate: boolean;
  previousResult?: string;
}

/**
 * Validate an idempotency key.
 * Returns previous result if key was already processed.
 */
export async function validateIdempotencyKey(
  key: string,
  context: { userId: string; action: string; amount: number }
): Promise<IdempotencyValidationResult> {
  // Clean expired entries
  const now = Date.now();
  for (const [k, v] of idempotencyStore.entries()) {
    if (v.expiresAt < now) {
      idempotencyStore.delete(k);
    }
  }

  const entry = idempotencyStore.get(key);

  if (entry) {
    if (entry.processed) {
      return {
        valid: false,
        reason: "Idempotency key already processed",
        isDuplicate: true,
        previousResult: entry.result,
      };
    }
    // Key exists but not processed (in-flight request)
    return {
      valid: false,
      reason: "Idempotency key in use by another request",
      isDuplicate: false,
    };
  }

  // New key — register it
  idempotencyStore.set(key, {
    processed: false,
    expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours
  });

  return { valid: true, isDuplicate: false };
}

// ─────────────────────────────────────────
// 3. COMPLETION
// ─────────────────────────────────────────

/**
 * Mark an idempotency key as processed with its result.
 */
export function markIdempotencyKeyProcessed(key: string, result: string): void {
  const entry = idempotencyStore.get(key);
  if (entry) {
    entry.processed = true;
    entry.result = result;
  }
}
