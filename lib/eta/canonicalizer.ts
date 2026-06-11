/**
 * ETA Canonicalizer — Alphabetical Payload Flattener
 * Hotels Vendors Compliance Layer
 *
 * Implements the ETA V2 "Alphabetical Canonical" flattening specification.
 * Transforms a nested invoice payload into a deterministically-ordered,
 * flat key-value structure suitable for RSA-2048 digital signing.
 *
 * Algorithm:
 *   1. Recursively walk all object properties and arrays
 *   2. Sort every object's keys alphabetically (locale-insensitive)
 *   3. Concatenate into dot-delimited flattened keys
 *   4. Produce a single sorted key-value string for signature input
 *
 * Per ETA spec:
 *   - null / undefined values are emitted as empty string ""
 *   - Dates are normalized to ISO 8601 UTC
 *   - Numbers use fixed-point (no scientific notation)
 *   - Booleans become "true" / "false"
 *   - Strings are trimmed; internal whitespace collapsed
 */

// ─── Types ────────────────────────────────────────────────────────

export type CanonicalValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | CanonicalValue[]
  | { [key: string]: CanonicalValue };

export interface FlatEntry {
  key: string;
  value: string;
}

export interface CanonicalResult {
  /** Sorted dot-delimited key-value pairs ready for signature */
  entries: FlatEntry[];
  /** The canonical string: all entries joined with newline, sorted by key */
  canonicalString: string;
  /** SHA-256 digest of the canonical string (pre-computed convenience) */
  sha256Digest: string;
}

// ─── Constants ────────────────────────────────────────────────────

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
const MAX_DEPTH = 32; // prevent pathological recursion

// ─── Internal Helpers ─────────────────────────────────────────────

function normalizeString(v: string): string {
  return v.trim().replace(/\s+/g, " ");
}

function formatNumber(v: number): string {
  // Avoid scientific notation; fix to max 4 decimal places
  if (!Number.isFinite(v)) return "0";
  return Number(v.toFixed(4)).toString();
}

function serializeScalar(v: CanonicalValue): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return formatNumber(v);
  if (typeof v === "string") {
    // Detect ISO date strings and normalize to ensure consistency
    if (ISO_DATE_RE.test(v)) {
      try {
        const d = new Date(v);
        return d.toISOString();
      } catch {
        // fall through to raw string
      }
    }
    return normalizeString(v);
  }
  return normalizeString(String(v));
}

// ─── Core: Recursive Flatten ─────────────────────────────────────

function flattenRecursive(
  obj: CanonicalValue,
  prefix: string,
  depth: number,
  out: FlatEntry[]
): void {
  if (depth > MAX_DEPTH) return;

  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      const key = prefix ? `${prefix}.${idx}` : `${idx}`;
      if (item !== null && item !== undefined && typeof item === "object") {
        flattenRecursive(item, key, depth + 1, out);
      } else {
        out.push({ key, value: serializeScalar(item) });
      }
    });
    return;
  }

  if (obj !== null && typeof obj === "object") {
    const record = obj as { [key: string]: CanonicalValue };
    const keys = Object.keys(record).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
    for (const k of keys) {
      const child = record[k];
      const key = prefix ? `${prefix}.${k}` : k;
      if (child !== null && child !== undefined && typeof child === "object") {
        flattenRecursive(child, key, depth + 1, out);
      } else {
        out.push({ key, value: serializeScalar(child) });
      }
    }
    return;
  }

  // Scalar at root (unusual but handle gracefully)
  out.push({ key: prefix || "_", value: serializeScalar(obj) });
}

// ─── SHA-256 (Node.js crypto) ─────────────────────────────────────

function sha256Hex(input: string): string {
  // Dynamic require to avoid Bun/edge bundler issues
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Flatten and canonicalize any nested payload for ETA digital signing.
 *
 * @param payload - The ETA invoice payload (or any nested object)
 * @returns CanonicalResult with sorted entries, canonical string, and SHA-256 digest
 *
 * @example
 *   const result = canonicalizeEtaPayload(invoicePayload);
 *   const signature = rsaSign(result.canonicalString, privateKey);
 */
export function canonicalizeEtaPayload(payload: Record<string, unknown>): CanonicalResult {
  const entries: FlatEntry[] = [];
  flattenRecursive(payload as CanonicalValue, "", 0, entries);

  // Sort all flattened entries alphabetically by key
  entries.sort((a, b) => a.key.localeCompare(b.key, undefined, { sensitivity: "base" }));

  // Build canonical string: "key1=value1\nkey2=value2\n..."
  const canonicalString = entries.map((e) => `${e.key}=${e.value}`).join("\n");
  const sha256Digest = sha256Hex(canonicalString);

  return { entries, canonicalString, sha256Digest };
}

/**
 * Convenience wrapper: canonicalize an ETA payload and return only the
 * canonical string (the input to RSA-2048 signing).
 */
export function toCanonicalString(payload: Record<string, unknown>): string {
  return canonicalizeEtaPayload(payload).canonicalString;
}

/**
 * Validate that a canonical string is non-empty and contains at least
 * one entry. Useful as a pre-signing guard.
 */
export function assertCanonicalizable(payload: Record<string, unknown>): void {
  const result = canonicalizeEtaPayload(payload);
  if (result.entries.length === 0) {
    throw new Error("ETA canonicalizer produced empty output: payload has no serializable fields");
  }
}

// ─── Dual-Language Field Support ──────────────────────────────────

/**
 * Build a dual-language field pair for ETA invoice lines.
 * ETA requires product descriptions in both English and Arabic.
 *
 * @param en - English value
 * @param ar - Arabic value
 * @returns Object with codeName/codeNameAr and description/descriptionAr pattern
 */
export function buildDualField(en: string, ar: string): {
  codeName: string;
  codeNameAr: string;
  description: string;
  descriptionAr: string;
} {
  return {
    codeName: en.trim(),
    codeNameAr: ar.trim(),
    description: en.trim(),
    descriptionAr: ar.trim(),
  };
}

/**
 * Merge dual-language fields into an ETA invoice line.
 * Ensures both language variants are present before signing.
 */
export function applyDualLanguage(
  line: Record<string, unknown>,
  descriptionEn: string,
  descriptionAr: string
): Record<string, unknown> {
  return {
    ...line,
    description: descriptionEn.trim(),
    descriptionAr: descriptionAr.trim(),
  };
}
