/**
 * Redis Layer — Hotels Vendors
 * P0 Security gap closure: idempotency, rate limiting, session cache
 *
 * Falls back to in-memory storage when Redis is unavailable.
 */

import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

let redis: Redis | null = null;
let redisAvailable = false;

// In-memory fallback stores
const memoryIdempotency = new Map<string, { value: string; expiresAt: number }>();
const memoryRateLimits = new Map<string, { count: number; resetAt: number }>();
const memorySessions = new Map<string, { data: string; expiresAt: number }>();
const memoryEvents = new Map<string, string[]>();

function cleanExpired(map: Map<string, { expiresAt: number }>) {
  const now = Date.now();
  for (const [k, v] of map.entries()) {
    if (v.expiresAt < now) map.delete(k);
  }
}

export { redis as redis };

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build" || process.env.CI === "true";

export function getRedis(): Redis | null {
  if (!REDIS_URL) return null;
  if (!redis) {
    try {
      redis = new Redis(REDIS_URL, {
        password: REDIS_PASSWORD,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        maxRetriesPerRequest: 1,
        connectTimeout: 5000,
        lazyConnect: true,
      });
      redis.on("connect", () => {
        redisAvailable = true;
      });
      redis.on("error", (err) => {
        redisAvailable = false;
        if (!isBuildTime) {
           
          console.error("[Redis] Connection error:", err.message);
        }
      });
    } catch {
      redis = null;
      redisAvailable = false;
    }
  }
  return redis;
}

async function redisOrMemory<T>(redisFn: (r: Redis) => Promise<T>, memoryFn: () => T): Promise<T> {
  const r = getRedis();
  if (r && redisAvailable) {
    try {
      return await redisFn(r);
    } catch {
      return memoryFn();
    }
  }
  return memoryFn();
}

// ── Idempotency ──
export async function checkIdempotencyKey(
  key: string,
  scope: string,
  ttlSeconds = 86400
): Promise<{ exists: boolean; previousResult?: string }> {
  const fullKey = `idempotency:${scope}:${key}`;

  return redisOrMemory(
    async (r) => {
      const existing = await r.get(fullKey);
      if (existing) {
        return { exists: true, previousResult: existing };
      }
      await r.setex(fullKey, ttlSeconds, "PENDING");
      return { exists: false };
    },
    () => {
      cleanExpired(memoryIdempotency);
      const entry = memoryIdempotency.get(fullKey);
      if (entry) {
        return { exists: true, previousResult: entry.value };
      }
      memoryIdempotency.set(fullKey, {
        value: "PENDING",
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      return { exists: false };
    }
  );
}

/**
 * Atomically reserve an idempotency key using SET NX EX.
 * Key format: idem:{scope}:{userId}:{key}
 */
export async function reserveIdempotency(
  scope: string,
  userId: string,
  key: string,
  opts?: { ttlSeconds?: number; value?: string }
): Promise<{ replay: boolean; storedResult: string | null }> {
  const fullKey = `idem:${scope}:${userId}:${key}`;
  const value = opts?.value ?? "PENDING";
  const ttlSeconds = opts?.ttlSeconds ?? 86400;

  return redisOrMemory(
    async (r) => {
      const res = await r.set(fullKey, value, "EX", ttlSeconds, "NX");
      if (res === "OK") return { replay: false, storedResult: null };
      const existing = await r.get(fullKey);
      return { replay: true, storedResult: existing };
    },
    () => {
      cleanExpired(memoryIdempotency);
      const entry = memoryIdempotency.get(fullKey);
      if (entry) return { replay: true, storedResult: entry.value };
      memoryIdempotency.set(fullKey, {
        value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      return { replay: false, storedResult: null };
    }
  );
}

/** Read a stored idempotency result without reserving (null while PENDING). */
export async function getIdempotencyResult(
  scope: string,
  userId: string,
  key: string
): Promise<string | null> {
  const fullKey = `idem:${scope}:${userId}:${key}`;
  return redisOrMemory(
    async (r) => {
      const v = await r.get(fullKey);
      return v && v !== "PENDING" ? v : null;
    },
    () => {
      const entry = memoryIdempotency.get(fullKey);
      if (!entry || entry.expiresAt < Date.now() || entry.value === "PENDING") return null;
      return entry.value;
    }
  );
}

export async function completeIdempotency(
  key: string,
  scope: string,
  result: string,
  ttlSeconds = 86400
): Promise<void> {
  const fullKey = `idem:${scope}:${key}`;

  await redisOrMemory(
    async (r) => {
      await r.setex(fullKey, ttlSeconds, result);
    },
    () => {
      memoryIdempotency.set(fullKey, {
        value: result,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
    }
  );
}

// ── Rate Limiting ──
export async function checkRateLimit(
  identifier: string,
  windowSeconds: number,
  maxRequests: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSeconds);
  const windowKey = `${identifier}:${windowStart}`;

  return redisOrMemory(
    async (r) => {
      const current = await r.incr(`ratelimit:${windowKey}`);
      if (current === 1) {
        await r.expire(`ratelimit:${windowKey}`, windowSeconds);
      }
      const allowed = current <= maxRequests;
      const remaining = Math.max(0, maxRequests - current);
      const resetAt = windowStart + windowSeconds;
      return { allowed, remaining, resetAt };
    },
    () => {
      const entry = memoryRateLimits.get(windowKey);
      let current = 1;
      if (entry && entry.resetAt > now) {
        current = entry.count + 1;
        entry.count = current;
      } else {
        memoryRateLimits.set(windowKey, { count: current, resetAt: windowStart + windowSeconds });
      }
      const allowed = current <= maxRequests;
      const remaining = Math.max(0, maxRequests - current);
      const resetAt = windowStart + windowSeconds;
      return { allowed, remaining, resetAt };
    }
  );
}

// ── Session Cache ──
export async function cacheSession(
  userId: string,
  data: Record<string, unknown>,
  ttlSeconds = 604800
): Promise<void> {
  const key = `session:${userId}`;
  const payload = JSON.stringify(data);

  await redisOrMemory(
    async (r) => {
      await r.setex(key, ttlSeconds, payload);
    },
    () => {
      memorySessions.set(key, {
        data: payload,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
    }
  );
}

export async function getCachedSession(
  userId: string
): Promise<Record<string, unknown> | null> {
  const key = `session:${userId}`;

  return redisOrMemory(
    async (r) => {
      const data = await r.get(key);
      return data ? JSON.parse(data) : null;
    },
    () => {
      const entry = memorySessions.get(key);
      if (!entry || entry.expiresAt < Date.now()) {
        memorySessions.delete(key);
        return null;
      }
      return JSON.parse(entry.data);
    }
  );
}

// ── SSE Event Buffer ──
export async function bufferEvent(
  channel: string,
  event: string,
  ttlSeconds = 3600
): Promise<void> {
  const key = `events:${channel}`;

  await redisOrMemory(
    async (r) => {
      await r.lpush(key, event);
      await r.ltrim(key, 0, 999);
      await r.expire(key, ttlSeconds);
    },
    () => {
      const list = memoryEvents.get(key) || [];
      list.unshift(event);
      if (list.length > 1000) list.length = 1000;
      memoryEvents.set(key, list);
    }
  );
}

export async function getBufferedEvents(channel: string): Promise<string[]> {
  const key = `events:${channel}`;

  return redisOrMemory(
    async (r) => r.lrange(key, 0, -1),
    () => memoryEvents.get(key) || []
  );
}

// ── Health Check ──
export async function redisHealth(): Promise<{ status: string; latencyMs: number }> {
  const r = getRedis();
  if (!r) {
    return { status: "no-redis-url", latencyMs: 0 };
  }
  try {
    const start = Date.now();
    await r.ping();
    return { status: "healthy", latencyMs: Date.now() - start };
  } catch {
    return { status: "unavailable", latencyMs: 0 };
  }
}
