/**
 * Session Fingerprinting
 * Hotels Vendors Security Layer
 *
 * Creates a privacy-preserving hash of device/browser characteristics.
 * Used to detect session hijacking and unauthorized access.
 */

import { createHash } from "crypto";

// ─────────────────────────────────────────
// 1. FINGERPRINT COMPONENTS
// ─────────────────────────────────────────

export interface SessionFingerprint {
  userAgentHash: string;
  acceptLanguageHash: string;
  ipHash: string;          // Hashed IP (never store raw IP)
  screenHash?: string;     // Screen resolution + color depth
  timezone: string;
  timestamp: number;
}

// ─────────────────────────────────────────
// 2. FINGERPRINT GENERATION
// ─────────────────────────────────────────

/**
 * Generate a session fingerprint from request headers.
 * NEVER stores raw IP or User-Agent. Only hashes.
 */
export function fingerprintSession(params: {
  userAgent: string;
  acceptLanguage: string;
  ipAddress: string;
  screenResolution?: string;
  colorDepth?: number;
  timezone?: string;
}): string {
  const { userAgent, acceptLanguage, ipAddress, screenResolution, colorDepth, timezone } = params;

  const components: SessionFingerprint = {
    userAgentHash: hashComponent(userAgent),
    acceptLanguageHash: hashComponent(acceptLanguage),
    ipHash: hashComponent(ipAddress),
    screenHash: screenResolution && colorDepth
      ? hashComponent(`${screenResolution}-${colorDepth}`)
      : undefined,
    timezone: timezone || "UTC",
    timestamp: Date.now(),
  };

  return JSON.stringify(components);
}

// ─────────────────────────────────────────
// 3. FINGERPRINT COMPARISON
// ─────────────────────────────────────────

/**
 * Compare two fingerprints and return a match score (0-1).
 * 1.0 = perfect match, 0.0 = completely different.
 */
export function compareFingerprints(stored: string, current: string): number {
  try {
    const storedFp: SessionFingerprint = JSON.parse(stored);
    const currentFp: SessionFingerprint = JSON.parse(current);

    const weights = {
      userAgent: 0.30,
      acceptLanguage: 0.15,
      ip: 0.25,
      screen: 0.15,
      timezone: 0.15,
    };

    let score = 0;

    // UserAgent (highest weight)
    if (storedFp.userAgentHash === currentFp.userAgentHash) {
      score += weights.userAgent;
    }

    // Accept-Language
    if (storedFp.acceptLanguageHash === currentFp.acceptLanguageHash) {
      score += weights.acceptLanguage;
    }

    // IP (allow for ISP-level changes)
    if (storedFp.ipHash === currentFp.ipHash) {
      score += weights.ip;
    }

    // Screen
    if (storedFp.screenHash && currentFp.screenHash) {
      if (storedFp.screenHash === currentFp.screenHash) {
        score += weights.screen;
      }
    } else {
      // If screen info not available, redistribute weight
      score += weights.screen * 0.5;
    }

    // Timezone
    if (storedFp.timezone === currentFp.timezone) {
      score += weights.timezone;
    }

    return score;
  } catch {
    return 0;
  }
}

// ─────────────────────────────────────────
// 4. UTILITIES
// ─────────────────────────────────────────

function hashComponent(value: string): string {
  return createHash("sha256").update(value).digest("hex").substring(0, 16);
}
