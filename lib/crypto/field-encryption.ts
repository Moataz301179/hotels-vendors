import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  hkdfSync,
  randomBytes,
} from "crypto";

/**
 * PII encryption at rest (SEC-03, chunk 1C).
 *
 * - AES-256-GCM with a random 12-byte IV per value.
 * - Per-field keys derived from ENCRYPTION_MASTER_KEY (64 hex chars = 32
 *   bytes) via HKDF-SHA256 with the field name as salt/info.
 * - Ciphertext format: base64(iv || authTag || ciphertext), prefixed
 *   "enc:v1:" so plaintext legacy values remain readable during migration.
 *
 * Exact-match search: encrypted values are non-deterministic (random IV), so
 * equality lookups cannot hit the DB directly. For Hotel.taxId and
 * Supplier.taxId we additionally store `taxIdSearch` = HMAC-SHA256(fieldKey,
 * fieldName + value), a deterministic keyed digest supporting unique indexes
 * and exact-match WHERE clauses. Queries must filter on `taxIdSearch`.
 */

const ENC_PREFIX = "enc:v1:";

function getMasterKey(): Buffer {
  const hex = process.env.ENCRYPTION_MASTER_KEY;
  if (!hex || !/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error(
      "ENCRYPTION_MASTER_KEY must be set to exactly 64 hex chars (32 bytes) for PII field encryption"
    );
  }
  return Buffer.from(hex, "hex");
}

/** HKDF-derived 32-byte key for a specific field. */
function deriveFieldKey(fieldName: string): Buffer {
  return Buffer.from(
    hkdfSync(
      "sha256",
      getMasterKey(),
      Buffer.from(fieldName),
      Buffer.from(`hv-pii:${fieldName}`),
      32
    )
  );
}

export function encryptField(
  plaintext: string | null | undefined,
  fieldName: string
): string | null {
  if (plaintext === null || plaintext === undefined || plaintext === "")
    return plaintext ?? null;
  if (plaintext.startsWith(ENC_PREFIX)) return plaintext; // already encrypted
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", deriveFieldKey(fieldName), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ENC_PREFIX + Buffer.concat([iv, tag, enc]).toString("base64");
}

export function decryptField(
  stored: string | null | undefined,
  fieldName: string
): string | null {
  if (stored === null || stored === undefined || stored === "") return stored ?? null;
  if (!stored.startsWith(ENC_PREFIX)) return stored; // legacy plaintext
  const raw = Buffer.from(stored.slice(ENC_PREFIX.length), "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ciphertext = raw.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", deriveFieldKey(fieldName), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

/**
 * Deterministic keyed digest for exact-match search on an encrypted field.
 * Same (field, value) always yields the same digest; safe to index/unique.
 */
export function searchHash(
  value: string | null | undefined,
  fieldName: string
): string | null {
  if (value === null || value === undefined || value === "") return null;
  return createHmac("sha256", deriveFieldKey(`${fieldName}:search`))
    .update(`${fieldName}:${value}`)
    .digest("hex");
}

/** Fields subject to encryption at rest, mapped to their model.field name. */
export const ENCRYPTED_FIELDS: Record<string, Record<string, string>> = {
  Hotel: { taxId: "Hotel.taxId" },
  Supplier: {
    taxId: "Supplier.taxId",
    bankAccount: "Supplier.bankAccount",
    bankName: "Supplier.bankName",
  },
  User: { phone: "User.phone" },
};

/** Models whose taxId also gets a deterministic taxIdSearch companion column. */
export const SEARCHABLE_FIELDS: Record<string, { source: string; target: string }> = {
  Hotel: { source: "taxId", target: "taxIdSearch" },
  Supplier: { source: "taxId", target: "taxIdSearch" },
};
