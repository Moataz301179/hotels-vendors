import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const EXPIRATION_SECONDS = 86400; // Mandatory 24-hour retention window

/**
 * Idempotency Key Vault Guard
 * Ensures heavy financial mutations cannot be double-executed via accidental UI retries
 * or overlapping webhook callbacks. Operates using an atomic Redis `SET NX` constraint.
 */
export class IdempotencyGuard {
  /**
   * Checks if an idempotency key exists in the cache.
   * - If no key exists, it atomically locks the key and returns null.
   * - If the key exists but is "LOCKED", returns the LOCKED state.
   * - If the key has completed, returns the cached final payload.
   */
  static async acquireLock(key: string): Promise<string | null> {
    const isLocked = await redis.set(
      `idempotency:${key}`,
      "LOCKED",
      "EX",
      EXPIRATION_SECONDS,
      "NX"
    );

    if (!isLocked) {
      // The key already exists. Return its current state to prevent race conditions.
      const cachedResponse = await redis.get(`idempotency:${key}`);
      return cachedResponse;
    }

    // Lock successfully acquired. Proceed with exact once processing.
    return null;
  }

  /**
   * Commits the final response payload to the idempotency cache, replacing the "LOCKED" state.
   * Subsequent identical requests will instantly receive this payload without hitting the database.
   */
  static async commitResponse(key: string, responsePayload: string): Promise<void> {
    await redis.set(
      `idempotency:${key}`,
      responsePayload,
      "EX",
      EXPIRATION_SECONDS
    );
  }
}
