/**
 * AES-256-GCM Shared Primitive
 * Hotels Vendors Cryptographic Utility
 *
 * Low-level encrypt/decrypt using PII_ENCRYPTION_KEY env var (base64-encoded 32 bytes).
 * Format: `base64(iv):base64(authTag):base64(ciphertext)`.
 * Also derives a 256-bit key from an arbitrary-length passphrase via HKDF-SHA256.
 */

import * as crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function resolveKey(rawKey?: string): Buffer {
  const envKey = rawKey ?? process.env.PII_ENCRYPTION_KEY;

  if (!envKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "PII_ENCRYPTION_KEY env var is required in production. " +
          "Generate: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
      );
    }
    // eslint-disable-next-line no-console
    console.warn("[crypto] PII_ENCRYPTION_KEY not set — using ephemeral key (dev only).");
    return crypto.randomBytes(KEY_LENGTH);
  }

  const decoded = Buffer.from(envKey, "base64");
  if (decoded.length !== KEY_LENGTH) {
    throw new Error(
      `PII_ENCRYPTION_KEY must decode to exactly ${KEY_LENGTH} bytes, got ${decoded.length}.`
    );
  }
  return decoded;
}

export function aesGcmEncrypt(plaintext: string, key?: string): string {
  if (!plaintext) return plaintext;

  const k = resolveKey(key);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, k, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(":");
}

export function aesGcmDecrypt(ciphertext: string, key?: string): string {
  if (!ciphertext) return ciphertext;

  const k = resolveKey(key);
  const parts = ciphertext.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid ciphertext format — expected 3 colon-separated base64 parts.");
  }

  const iv = Buffer.from(parts[0], "base64");
  const authTag = Buffer.from(parts[1], "base64");
  const encrypted = Buffer.from(parts[2], "base64");

  if (iv.length !== IV_LENGTH) throw new Error(`Invalid IV length: ${iv.length}`);
  if (authTag.length !== AUTH_TAG_LENGTH) throw new Error(`Invalid auth tag length: ${authTag.length}`);

  const decipher = crypto.createDecipheriv(ALGORITHM, k, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted) + decipher.final("utf8");
}

export function deriveKey(passphrase: string, salt: Buffer): Buffer {
  return crypto.hkdfSync("sha256", passphrase, salt, "", KEY_LENGTH);
}
