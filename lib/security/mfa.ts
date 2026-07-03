/**
 * MFA — Multi-Factor Authentication
 * Hotels Vendors Security Layer
 *
 * Uses TOTP (Time-based One-Time Password) via authenticator apps.
 * Email backup for recovery. SMS only as last resort.
 */

import { createHmac } from "crypto";

// ─────────────────────────────────────────
// 1. TOTP IMPLEMENTATION
// ─────────────────────────────────────────

/**
 * Generate a new TOTP secret for a user.
 * Returns base32-encoded secret.
 */
export function generateTOTPSecret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

/**
 * Generate TOTP URI for QR code scanning.
 */
export function generateTOTPUri(secret: string, email: string, issuer = "HotelsVendors"): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}`;
}

/**
 * Generate current TOTP code.
 */
export function generateTOTP(secret: string, timeStep = 30): string {
  const counter = Math.floor(Date.now() / 1000 / timeStep);
  return generateHOTP(secret, counter);
}

/**
 * Verify TOTP code with window tolerance.
 */
export function verifyTOTP(secret: string, code: string, window = 1): boolean {
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let i = -window; i <= window; i++) {
    if (generateHOTP(secret, counter + i) === code) {
      return true;
    }
  }
  return false;
}

// ─────────────────────────────────────────
// 2. HOTP (HMAC-based OTP)
// ─────────────────────────────────────────

function generateHOTP(secret: string, counter: number): string {
  const key = base32Decode(secret);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const hmac = createHmac("sha1", key);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Dynamic truncation
  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return (code % 1_000_000).toString().padStart(6, "0");
}

// ─────────────────────────────────────────
// 3. BASE32 DECODE
// ─────────────────────────────────────────

function base32Decode(input: string): Buffer {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const char of input.toUpperCase()) {
    const val = chars.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8);
    if (byte.length === 8) {
      bytes.push(parseInt(byte, 2));
    }
  }

  return Buffer.from(bytes);
}

// ─────────────────────────────────────────
// 4. BACKUP CODES
// ─────────────────────────────────────────

/**
 * Generate 10 backup codes for MFA recovery.
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}

/**
 * Hash backup codes for storage (bcrypt is overkill for 8-char codes, use HMAC).
 */
export function hashBackupCode(code: string, pepper: string): string {
  return createHmac("sha256", pepper).update(code).digest("hex");
}
