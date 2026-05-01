/**
 * Redis Layer — Hotels Vendors
 * P0 Security gap closure: idempotency, rate limiting, session cache
 */

import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(REDIS_URL, {
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    });
    redis.on("error", (err) => {
      console.error("[Redis] Connection error:", err.message);
    });
  }
  return redis;
}

// ── Idempotency ──
export async function checkIdempotencyKey(
  key: string,
  scope: string,
  ttlSeconds = 86400
): Promise<{ exists: boolean; previousResult?: string }> {
  const r = getRedis();
  const fullKey = `idempotency:${scope}:${key}`;
  const existing = await r.get(fullKey);
  if (existing) {
    return { exists: true, previousResult: existing };
  }
  await r.setex(fullKey, ttlSeconds, "PENDING");
  return { exists: false };
}

export async function completeIdempotency(
  key: string,
  scope: string,
  result: string,
  ttlSeconds = 86400
): Promise<void> {
  const r = getRedis();
  await r.setex(`idempotency:${scope}:${key}`, ttlSeconds, result);
}

// ── Rate Limiting ──
export async function checkRateLimit(
  identifier: string,
  windowSeconds: number,
  maxRequests: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const r = getRedis();
  const key = `ratelimit:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSeconds);
  const windowKey = `${key}:${windowStart}`;

  const current = await r.incr(windowKey);
  if (current === 1) {
    await r.expire(windowKey, windowSeconds);
  }

  const allowed = current <= maxRequests;
  const remaining = Math.max(0, maxRequests - current);
  const resetAt = windowStart + windowSeconds;

  return { allowed, remaining, resetAt };
}

// ── Session Cache ──
export async function cacheSession(
  userId: string,
  data: Record<string, unknown>,
  ttlSeconds = 604800 // 7 days
): Promise<void> {
  const r = getRedis();
  await r.setex(`session:${userId}`, ttlSeconds, JSON.stringify(data));
}

export async function getCachedSession(
  userId: string
): Promise<Record<string, unknown> | null> {
  const r = getRedis();
  const data = await r.get(`session:${userId}`);
  return data ? JSON.parse(data) : null;
}

// ── SSE Event Buffer ──
export async function bufferEvent(
  channel: string,
  event: string,
  ttlSeconds = 3600
): Promise<void> {
  const r = getRedis();
  await r.lpush(`events:${channel}`, event);
  await r.ltrim(`events:${channel}`, 0, 999); // Keep last 1000
  await r.expire(`events:${channel}`, ttlSeconds);
}

export async function getBufferedEvents(channel: string): Promise<string[]> {
  const r = getRedis();
  return r.lrange(`events:${channel}`, 0, -1);
}

// ── Health Check ──
export async function redisHealth(): Promise<{ status: string; latencyMs: number }> {
  const r = getRedis();
  const start = Date.now();
  await r.ping();
  return { status: "healthy", latencyMs: Date.now() - start };
}
