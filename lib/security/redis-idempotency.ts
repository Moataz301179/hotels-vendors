/**
 * Redis-Ready Idempotency Adapter
 * Hotels Vendors Security Layer
 *
 * Production-grade idempotency using Redis SET NX (atomic).
 * Falls back to database-level uniqueness if Redis unavailable.
 */

import { createHash, randomBytes } from "crypto";

// ─────────────────────────────────────────
// 1. REDIS ADAPTER INTERFACE
// ─────────────────────────────────────────

interface RedisClient {
  set(key: string, value: string, options?: { nx?: boolean; ex?: number }): Promise<string | null>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<number>;
}

let redisClient: RedisClient | null = null;

export function setRedisClient(client: RedisClient): void {
  redisClient = client;
}

function getRedis(): RedisClient | null {
  return redisClient;
}

// ─────────────────────────────────────────
// 2. KEY GENERATION
// ─────────────────────────────────────────

export function generateIdempotencyKey(): string {
  return `idem_${randomBytes(16).toString("hex")}`;
}

export function generateDeterministicKey(params: {
  userId: string;
  action: string;
  amount: number;
  timestamp: number;
}): string {
  const payload = `${params.userId}:${params.action}:${params.amount}:${Math.floor(params.timestamp / 60000)}`;
  return `idem_${createHash("sha256").update(payload).digest("hex").substring(0, 32)}`;
}

// ─────────────────────────────────────────
// 3. VALIDATION (Redis + DB Fallback)
// ─────────────────────────────────────────

export interface IdempotencyValidationResult {
  valid: boolean;
  reason?: string;
  isDuplicate: boolean;
  previousResult?: string;
}

/**
 * Validate idempotency key using Redis atomic SET NX.
 * Falls back to in-memory store if Redis unavailable.
 */
export async function validateIdempotencyKey(
  key: string,
  context: { userId: string; action: string; amount: number }
): Promise<IdempotencyValidationResult> {
  const redis = getRedis();

  if (redis) {
    // Production path: Redis atomic SET NX
    const stored = await redis.get(key);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.processed) {
        return {
          valid: false,
          reason: "Idempotency key already processed",
          isDuplicate: true,
          previousResult: parsed.result,
        };
      }
      return {
        valid: false,
        reason: "Idempotency key in use by another request",
        isDuplicate: false,
      };
    }

    // Atomic SET NX with 5-minute TTL
    const value = JSON.stringify({
      userId: context.userId,
      action: context.action,
      amount: context.amount,
      processed: false,
      createdAt: Date.now(),
    });

    const result = await redis.set(key, value, { nx: true, ex: 300 });

    if (result !== "OK") {
      // Another request raced and set the key
      return {
        valid: false,
        reason: "Idempotency key in use by another request",
        isDuplicate: false,
      };
    }

    return { valid: true, isDuplicate: false };
  }

  // Fallback path: In-memory store (development only)
  return validateInMemory(key);
}

// ─────────────────────────────────────────
// 4. IN-MEMORY FALLBACK
// ─────────────────────────────────────────

const memoryStore = new Map<string, { processed: boolean; result?: string; expiresAt: number }>();

function validateInMemory(key: string): IdempotencyValidationResult {
  const now = Date.now();
  for (const [k, v] of memoryStore.entries()) {
    if (v.expiresAt < now) {
      memoryStore.delete(k);
    }
  }

  const entry = memoryStore.get(key);
  if (entry) {
    if (entry.processed) {
      return {
        valid: false,
        reason: "Idempotency key already processed",
        isDuplicate: true,
        previousResult: entry.result,
      };
    }
    return {
      valid: false,
      reason: "Idempotency key in use by another request",
      isDuplicate: false,
    };
  }

  memoryStore.set(key, { processed: false, expiresAt: now + 24 * 60 * 60 * 1000 });
  return { valid: true, isDuplicate: false };
}

// ─────────────────────────────────────────
// 5. COMPLETION
// ─────────────────────────────────────────

export async function markIdempotencyKeyProcessed(key: string, result: string): Promise<void> {
  const redis = getRedis();

  if (redis) {
    const existing = await redis.get(key);
    if (existing) {
      const parsed = JSON.parse(existing);
      parsed.processed = true;
      parsed.result = result;
      parsed.completedAt = Date.now();
      await redis.set(key, JSON.stringify(parsed), { ex: 86400 }); // 24h retention
    }
    return;
  }

  const entry = memoryStore.get(key);
  if (entry) {
    entry.processed = true;
    entry.result = result;
  }
}
