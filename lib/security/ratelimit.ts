/**
 * Rate Limiting & Request Throttling System
 * Hotels Vendors Security Layer — DDoS Protection & API Abuse Prevention
 *
 * COMPLIANCE MANDATES:
 * 1. Stateless distributed rate limiting via Redis
 * 2. Tiered limits: Unauthenticated < Authenticated < Admin
 * 3. Exponential backoff for violations
 * 4. Audit logging for blocked requests
 */

import { Redis } from 'ioredis';
import { NextRequest, NextResponse } from 'next/server';

// Rate limit tiers (requests per window)
interface RateLimitConfig {
  requests: number;
  window: number; // seconds
  burst?: number; // burst capacity
}

const TIER_LIMITS: Record<string, RateLimitConfig> = {
  // Unauthenticated users (strictest)
  unauthenticated: { requests: 30, window: 60, burst: 5 },
  // Authenticated regular users
  authenticated: { requests: 100, window: 60, burst: 20 },
  // Premium/verified users
  premium: { requests: 300, window: 60, burst: 50 },
  // Admin/internal APIs
  admin: { requests: 1000, window: 60, burst: 100 },
  // Specific endpoints
  auth: { requests: 5, window: 60, burst: 2 },      // Login/register
  webhooks: { requests: 500, window: 60, burst: 100 }, // Webhook endpoints
  search: { requests: 20, window: 60, burst: 5 },      // Search operations
};

// Redis client for rate limiting
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Sliding window rate limiting with Redis
 * Uses sorted sets for efficient O(log n) operations
 */
export async function checkRateLimit(
  identifier: string,
  tier: keyof typeof TIER_LIMITS = 'unauthenticated'
): Promise<RateLimitResult> {
  const config = TIER_LIMITS[tier];
  const now = Date.now();
  const windowStart = now - (config.window * 1000);
  const key = `ratelimit:${tier}:${identifier}`;

  try {
    // Remove old entries outside window
    await redis.zremrangebyscore(key, 0, windowStart);
    
    // Get current count
    const currentCount = await redis.zcard(key);
    
    if (currentCount >= config.requests) {
      // Rate limit exceeded
      const oldestEntry = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const resetTime = parseInt(oldestEntry[1]) + (config.window * 1000);
      
      // Log violation
      await redis.zadd('ratelimit:violations', now, JSON.stringify({
        identifier,
        tier,
        timestamp: now,
        count: currentCount,
      }));
      
      return {
        success: false,
        limit: config.requests,
        remaining: 0,
        reset: resetTime,
        retryAfter: Math.ceil((resetTime - now) / 1000),
      };
    }
    
    // Add current request
    await redis.zadd(key, now, `${now}-${Math.random().toString(36).substr(2, 9)}`);
    await redis.pexpire(key, config.window * 1000);
    
    // Get updated count
    const newCount = await redis.zcard(key);
    
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - newCount,
      reset: now + (config.window * 1000),
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Fail open - allow request if Redis is down
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests,
      reset: now + (config.window * 1000),
    };
  }
}

/**
 * Apply rate limiting to NextRequest and return response
 */
export async function applyRateLimit(
  request: NextRequest,
  tier: keyof typeof TIER_LIMITS = 'unauthenticated'
): Promise<NextResponse | null> {
  // Extract identifier from request
  const ip = request.ip || 'unknown';
  const userId = request.headers.get('x-user-id');
  const identifier = userId || ip;
  
  const result = await checkRateLimit(identifier, tier);
  
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
          'Retry-After': String(result.retryAfter),
        },
      }
    );
  }
  
  // Return null to allow request to continue
  return null;
}

/**
 * Higher-order function for API route rate limiting
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  tier: keyof typeof TIER_LIMITS = 'authenticated'
) {
  return async function rateLimitedHandler(request: NextRequest): Promise<NextResponse> {
    const rateLimitResponse = await applyRateLimit(request, tier);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    return handler(request);
  };
}

/**
 * Token bucket algorithm for burst handling
 * Allows short bursts while maintaining overall rate limits
 */
export async function checkTokenBucket(
  identifier: string,
  tokens: number = 1
): Promise<{ allowed: boolean; tokensRemaining: number }> {
  const key = `bucket:${identifier}`;
  const capacity = 100; // Max tokens
  const refillRate = 10; // Tokens per second
  
  const now = Date.now();
  
  try {
    const pipeline = redis.pipeline();
    
    // Get current bucket state
    pipeline.hgetall(key);
    const results = await pipeline.exec();
    const bucket = results?.[0]?.[1] as { tokens?: string; lastRefill?: string } || {};
    
    const currentTokens = parseFloat(bucket.tokens || String(capacity));
    const lastRefill = parseInt(bucket.lastRefill || String(now));
    
    // Calculate tokens to add
    const timePassed = (now - lastRefill) / 1000;
    const tokensToAdd = Math.min(timePassed * refillRate, capacity);
    const newTokenCount = Math.min(currentTokens + tokensToAdd, capacity);
    
    // Check if request can be fulfilled
    if (newTokenCount >= tokens) {
      const remaining = newTokenCount - tokens;
      await redis.hmset(key, {
        tokens: remaining,
        lastRefill: now,
      });
      await redis.pexpire(key, 60000); // 60s expiry
      
      return { allowed: true, tokensRemaining: remaining };
    } else {
      // Not enough tokens
      await redis.hmset(key, {
        tokens: newTokenCount,
        lastRefill: now,
      });
      await redis.pexpire(key, 60000);
      
      return { allowed: false, tokensRemaining: newTokenCount };
    }
  } catch (error) {
    console.error('Token bucket error:', error);
    return { allowed: true, tokensRemaining: capacity }; // Fail open
  }
}

/**
 * Get rate limit status for a user/endpoint
 */
export async function getRateLimitStatus(
  identifier: string,
  tier: keyof typeof TIER_LIMITS = 'unauthenticated'
): Promise<{
  tier: string;
  limit: number;
  remaining: number;
  window: number;
  reset: number;
}> {
  const config = TIER_LIMITS[tier];
  const key = `ratelimit:${tier}:${identifier}`;
  const now = Date.now();
  
  try {
    const currentCount = await redis.zcard(key);
    const ttl = await redis.pttl(key);
    
    return {
      tier,
      limit: config.requests,
      remaining: Math.max(0, config.requests - currentCount),
      window: config.window,
      reset: now + (ttl > 0 ? ttl : config.window * 1000),
    };
  } catch (error) {
    return {
      tier,
      limit: config.requests,
      remaining: config.requests,
      window: config.window,
      reset: now + (config.window * 1000),
    };
  }
}

// Middleware-compatible check
export async function middlewareRateLimit(
  request: NextRequest
): Promise<NextResponse | null> {
  const path = request.nextUrl.pathname;
  
  // Determine tier based on path
  let tier: keyof typeof TIER_LIMITS = 'authenticated';
  
  if (path.startsWith('/api/auth/')) {
    tier = 'auth';
  } else if (path.startsWith('/api/webhooks/')) {
    tier = 'webhooks';
  } else if (path.includes('/search')) {
    tier = 'search';
  } else if (path.startsWith('/api/admin/')) {
    tier = 'admin';
  } else if (!request.cookies.get('session')) {
    tier = 'unauthenticated';
  }
  
  return await applyRateLimit(request, tier);
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await redis.quit();
});

export default {
  checkRateLimit,
  applyRateLimit,
  withRateLimit,
  checkTokenBucket,
  getRateLimitStatus,
  middlewareRateLimit,
  TIER_LIMITS,
};
