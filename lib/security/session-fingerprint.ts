/**
 * Session Fingerprinting - SEC-02
 * Hotels Vendors Security Layer
 *
 * Generates a lightweight device/session fingerprint from request headers,
 * stores it at session creation, and compares it on every validated request
 * to detect session hijacking (cookie theft / replay from another device).
 *
 * Fingerprint material (privacy-preserving):
 *   - User-Agent
 *   - First 2 octets of the client IP (tolerates mobile network rotation)
 *   - Accept-Language
 *
 * Edge-safe: uses Web Crypto (crypto.subtle) only, so it can run in both the
 * Node.js runtime (fortress.ts, API routes) and the Edge middleware.
 */

import { getRedis } from "@/lib/redis";

const FP_VERSION = "v1";

// Component weights for fuzzy comparison. UA dominates because a hijacker on
// a different device almost always has a different UA; IP rotates legitimately.
const WEIGHT_UA = 0.6;
const WEIGHT_IP = 0.25;
const WEIGHT_LANG = 0.15;

/** Minimum similarity score for a fingerprint to be considered a match. */
export const FINGERPRINT_TOLERANCE = 0.8;

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function firstTwoIpOctets(ip: string | null): string {
  if (!ip) return "unknown";
  const trimmed = ip.split(",")[0].trim();
  const parts = trimmed.split(".");
  if (parts.length >= 2 && parts.every((p) => /^\d+$/.test(p))) {
    return `${parts[0]}.${parts[1]}`;
  }
  // IPv6 or opaque - use first segment
  return trimmed.split(":")[0] || "unknown";
}

/**
 * Build the raw fingerprint components for a request (exposed for testing).
 */
export function fingerprintComponents(request: Request): {
  userAgent: string;
  ipPrefix: string;
  language: string;
} {
  const headers = request.headers;
  const ip =
    headers.get("x-forwarded-for") ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip");
  return {
    userAgent: headers.get("user-agent") || "unknown",
    ipPrefix: firstTwoIpOctets(ip),
    language: (headers.get("accept-language") || "unknown").split(",")[0].trim(),
  };
}

/**
 * Generate the canonical session fingerprint for a request:
 * sha256 over hashed userAgent + IP first-2-octets + accept-language.
 *
 * The returned string is a composite of per-component hashes so that
 * compareFingerprints() can score partial matches (see weights above),
 * while hashFingerprint() collapses it to a single opaque digest for storage.
 */
export async function generateFingerprint(request: Request): Promise<string> {
  const { userAgent, ipPrefix, language } = fingerprintComponents(request);
  const [uaHash, ipHash, langHash] = await Promise.all([
    sha256Hex(userAgent),
    sha256Hex(ipPrefix),
    sha256Hex(language),
  ]);
  return `${FP_VERSION}|${uaHash}|${ipHash}|${langHash}`;
}

/**
 * Legacy helper kept for existing callers (fortress.ts imports).
 * Same composite format, built from explicit values instead of a Request.
 */
export async function fingerprintSession(
  userAgent: string,
  ip: string,
  acceptLanguage = ""
): Promise<string> {
  const [uaHash, ipHash, langHash] = await Promise.all([
    sha256Hex(userAgent),
    sha256Hex(firstTwoIpOctets(ip)),
    sha256Hex((acceptLanguage || "unknown").split(",")[0].trim()),
  ]);
  return `${FP_VERSION}|${uaHash}|${ipHash}|${langHash}`;
}

/**
 * Collapse a composite fingerprint into a single opaque SHA-256 digest.
 * Used as a storage key / audit identifier - never reversed.
 */
export async function hashFingerprint(fingerprint: string): Promise<string> {
  return sha256Hex(fingerprint);
}

/**
 * Score similarity between two fingerprints in [0, 1].
 * Weighted per-component match; >= FINGERPRINT_TOLERANCE (0.8) passes.
 */
export function compareFingerprints(stored: string, current: string): number {
  if (!stored || !current) return 0;
  if (stored === current) return 1;

  const parse = (fp: string) => {
    const parts = fp.split("|");
    if (parts.length === 4 && parts[0] === FP_VERSION) {
      return { ua: parts[1], ip: parts[2], lang: parts[3] };
    }
    return null;
  };

  const a = parse(stored);
  const b = parse(current);
  if (!a || !b) return stored === current ? 1 : 0; // legacy/plain values

  let score = 0;
  if (a.ua === b.ua) score += WEIGHT_UA;
  if (a.ip === b.ip) score += WEIGHT_IP;
  if (a.lang === b.lang) score += WEIGHT_LANG;
  return Math.round(score * 100) / 100;
}

// -----------------------------------------
// Redis-backed storage (Node runtime)
// Mirrors lib/redis.ts fallback patterns: in-memory when Redis unavailable.
// -----------------------------------------

const FP_TTL_SECONDS = 60 * 60 * 24; // align with 24h session lifetime

interface StoredMeta {
  createdAt: number;
}

interface MemoryEntry {
  fp: string;
  meta: StoredMeta;
}

const memoryFingerprints = new Map<
  string,
  { value: MemoryEntry; expiresAt: number }
>();
const memoryTokenIndex = new Map<string, Map<string, number>>(); // userId -> tokenHash -> expiresAt

function cleanExpiredFingerprints() {
  const now = Date.now();
  for (const [k, v] of memoryFingerprints.entries()) {
    if (v.expiresAt < now) memoryFingerprints.delete(k);
  }
}

/** Avoid storing raw session tokens in Redis keys. */
async function tokenKeyPart(token: string): Promise<string> {
  return hashFingerprint(`tok:${token}`);
}

/** Store the fingerprint + creation time for a freshly issued session. */
export async function storeSessionFingerprint(
  userId: string,
  sessionToken: string,
  fingerprint: string
): Promise<void> {
  const tok = await tokenKeyPart(sessionToken);
  const now = Math.floor(Date.now() / 1000);
  const r = getRedis();
  if (r) {
    try {
      const fpKey = `sec:fp:${userId}:${tok}`;
      const metaKey = `sec:meta:${userId}:${tok}`;
      const idxKey = `sec:tokens:${userId}`;
      await r
        .multi()
        .setex(fpKey, FP_TTL_SECONDS, fingerprint)
        .setex(metaKey, FP_TTL_SECONDS, JSON.stringify({ createdAt: now }))
        .sadd(idxKey, tok)
        .expire(idxKey, FP_TTL_SECONDS)
        .exec();
      return;
    } catch {
      // fall through to memory fallback
    }
  }
  const expiresAt = Date.now() + FP_TTL_SECONDS * 1000;
  memoryFingerprints.set(`${userId}:${tok}`, {
    value: { fp: fingerprint, meta: { createdAt: now } },
    expiresAt,
  });
  let idx = memoryTokenIndex.get(userId);
  if (!idx) {
    idx = new Map();
    memoryTokenIndex.set(userId, idx);
  }
  idx.set(tok, expiresAt);
}

async function readStored(
  userId: string,
  tok: string
): Promise<{ fingerprint: string | null; meta: StoredMeta | null }> {
  const r = getRedis();
  if (r) {
    try {
      const [fp, meta] = await Promise.all([
        r.get(`sec:fp:${userId}:${tok}`),
        r.get(`sec:meta:${userId}:${tok}`),
      ]);
      return {
        fingerprint: fp ?? null,
        meta: meta ? (JSON.parse(meta) as StoredMeta) : null,
      };
    } catch {
      // fall through to memory fallback
    }
  }
  cleanExpiredFingerprints();
  const entry = memoryFingerprints.get(`${userId}:${tok}`);
  if (!entry) return { fingerprint: null, meta: null };
  return { fingerprint: entry.value.fp, meta: entry.value.meta };
}

export async function getStoredFingerprint(
  userId: string,
  sessionToken: string
): Promise<string | null> {
  const tok = await tokenKeyPart(sessionToken);
  const { fingerprint } = await readStored(userId, tok);
  return fingerprint;
}

/**
 * Session age in milliseconds since creation (0 if unknown).
 * Pass userId when available - the store is keyed by (userId, token).
 */
export async function getSessionAge(
  sessionToken: string,
  userId?: string
): Promise<number> {
  if (!userId) return 0;
  const tok = await tokenKeyPart(sessionToken);
  const { meta } = await readStored(userId, tok);
  if (!meta?.createdAt) return 0;
  return Date.now() - meta.createdAt;
}

/** Invalidate every stored session record for a user (lockdown path). */
export async function invalidateAllSessions(userId: string): Promise<void> {
  const r = getRedis();
  if (r) {
    try {
      const idxKey = `sec:tokens:${userId}`;
      const toks = await r.smembers(idxKey);
      if (toks.length > 0) {
        const pipeline = r.multi();
        for (const tok of toks) {
          pipeline.del(`sec:fp:${userId}:${tok}`);
          pipeline.del(`sec:meta:${userId}:${tok}`);
        }
        pipeline.del(idxKey);
        await pipeline.exec();
      }
      return;
    } catch {
      // fall through to memory fallback
    }
  }
  const idx = memoryTokenIndex.get(userId);
  if (idx) {
    for (const tok of idx.keys()) {
      memoryFingerprints.delete(`${userId}:${tok}`);
    }
    memoryTokenIndex.delete(userId);
  }
}
