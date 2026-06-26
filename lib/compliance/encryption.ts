/**
 * PII Field-Level Encryption — AES-256-GCM
 * Hotels Vendors Data Protection Layer
 *
 * Encrypts personally identifiable information at rest using AES-256-GCM.
 * Key is derived from PII_ENCRYPTION_KEY env var (base64-encoded 32 bytes).
 *
 * No external dependencies — uses Node.js built-in `crypto` module only.
 */

import * as crypto from "crypto";

// ─────────────────────────────────────────
// 1. KEY MANAGEMENT
// ─────────────────────────────────────────

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 128-bit initialization vector
const AUTH_TAG_LENGTH = 16; // 128-bit auth tag
const KEY_LENGTH = 32; // 256-bit key

function getEncryptionKey(): Buffer {
  const envKey = process.env.PII_ENCRYPTION_KEY;

  if (!envKey) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn(
        "[PII Encryption] PII_ENCRYPTION_KEY not set — using random ephemeral key. " +
          "DO NOT use in production. Generate one: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
      );
      return crypto.randomBytes(KEY_LENGTH);
    }
    throw new Error(
      "PII_ENCRYPTION_KEY environment variable is required in production. " +
        "Generate: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
    );
  }

  const decoded = Buffer.from(envKey, "base64");

  if (decoded.length !== KEY_LENGTH) {
    throw new Error(
      `PII_ENCRYPTION_KEY must decode to exactly ${KEY_LENGTH} bytes. Got ${decoded.length} bytes.`
    );
  }

  return decoded;
}

// ─────────────────────────────────────────
// 2. ENCRYPTION / DECRYPTION
// ─────────────────────────────────────────

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Output format: `base64(iv):base64(authTag):base64(ciphertext)`
 */
export function encryptPII(plaintext: string): string {
  if (!plaintext) return plaintext;

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

/**
 * Decrypt a ciphertext string produced by `encryptPII`.
 * Format: `base64(iv):base64(authTag):base64(ciphertext)`
 */
export function decryptPII(ciphertext: string): string {
  if (!ciphertext) return ciphertext;

  const key = getEncryptionKey();
  const parts = ciphertext.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid PII ciphertext format — expected 3 colon-separated parts");
  }

  const iv = Buffer.from(parts[0], "base64");
  const authTag = Buffer.from(parts[1], "base64");
  const encrypted = Buffer.from(parts[2], "base64");

  if (iv.length !== IV_LENGTH) {
    throw new Error(`Invalid IV length: expected ${IV_LENGTH}, got ${iv.length}`);
  }
  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error(`Invalid auth tag length: expected ${AUTH_TAG_LENGTH}, got ${authTag.length}`);
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  return decipher.update(encrypted) + decipher.final("utf8");
}

// ─────────────────────────────────────────
// 3. MASKING — UI / LOG DISPLAY
// ─────────────────────────────────────────

/**
 * Mask a PII value for safe display in UI or logs.
 *
 * - email: `j***@example.com` (first char + domain preserved)
 * - phone: `+20***1234` (last 4 digits + country code preserved)
 * - name: `J*** Doe` (first char of first name + last name preserved)
 */
export function maskPII(plaintext: string, type: "email" | "phone" | "name"): string {
  if (!plaintext) return plaintext;

  switch (type) {
    case "email": {
      const atIdx = plaintext.indexOf("@");
      if (atIdx <= 1) return "***";
      const firstChar = plaintext[0];
      const domain = plaintext.slice(atIdx);
      return `${firstChar}***${domain}`;
    }

    case "phone": {
      // Keep country code (e.g. +20, +1) and last 4 digits
      const digits = plaintext.replace(/[^\d]/g, "");
      if (digits.length <= 4) return "***";
      const countryCode = plaintext.match(/^\+\d+/)?.[0] || "";
      const last4 = digits.slice(-4);
      return `${countryCode}***${last4}`;
    }

    case "name": {
      // Keep first initial + last name
      const parts = plaintext.trim().split(/\s+/);
      if (parts.length < 2) {
        // Single name: keep first char
        return plaintext.length > 0 ? `${plaintext[0]}***` : "***";
      }
      const firstInitial = parts[0][0];
      const lastName = parts[parts.length - 1];
      return `${firstInitial}*** ${lastName}`;
    }

    default:
      return "***";
  }
}
