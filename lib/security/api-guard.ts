/**
 * API Guard — HMAC Signatures + Rate Limiting
 * Hotels Vendors Security Layer
 *
 * All internal API calls between services use HMAC signatures.
 * Partner APIs use API keys + HMAC.
 */

import { createHmac, timingSafeEqual } from "crypto";

// ─────────────────────────────────────────
// 1. HMAC GENERATION
// ─────────────────────────────────────────

/**
 * Generate HMAC-SHA256 signature for API request.
 */
export function generateHMAC(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Verify HMAC signature using timing-safe comparison.
 */
export function verifyHMAC(signature: string, expected: string): boolean {
  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    return timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────
// 2. REQUEST SIGNING
// ─────────────────────────────────────────

export interface SignedRequest {
  apiKey: string;
  timestamp: number;
  signature: string;
}

/**
 * Sign an API request.
 */
export function signRequest(params: {
  apiKey: string;
  apiSecret: string;
  method: string;
  endpoint: string;
  payload: string;
}): SignedRequest {
  const { apiKey, apiSecret, method, endpoint, payload } = params;
  const timestamp = Date.now();
  const message = `${method}:${endpoint}:${timestamp}:${payload}`;
  const signature = generateHMAC(message, apiSecret);

  return { apiKey, timestamp, signature };
}

/**
 * Verify a signed API request.
 */
export function verifyRequest(params: {
  apiSecret: string;
  method: string;
  endpoint: string;
  payload: string;
  signedRequest: SignedRequest;
}): boolean {
  const { apiSecret, method, endpoint, payload, signedRequest } = params;
  const { apiKey, timestamp, signature } = signedRequest;

  // Check timestamp (5-minute window)
  if (Math.abs(Date.now() - timestamp) > 300000) {
    return false;
  }

  const message = `${method}:${endpoint}:${timestamp}:${payload}`;
  const expected = generateHMAC(message, apiSecret);

  return verifyHMAC(signature, expected);
}

// ─────────────────────────────────────────
// 3. RATE LIMITING (In-Memory)
// ─────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if request is within rate limit.
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    rateLimitStore.set(identifier, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.windowStart + windowMs,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.windowStart + windowMs,
  };
}
