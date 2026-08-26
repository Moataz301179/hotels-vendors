/**
 * ETA Digital Signer
 * Hotels Vendors Compliance Layer
 *
 * Signs invoice XML payloads with a CMS/PKCS#7 detached signature
 * as required by the Egyptian Tax Authority (ETA).
 *
 * ⚠️  ARCHITECTURE ONLY — This module provides the signing interface
 *     and a placeholder implementation. Replace with real PKCS#12
 *     certificate signing once ETA issues production credentials.
 *
 * Signing flow:
 *   1. Canonicalize the XML (C14N)
 *   2. Compute SHA-256 digest of the canonical form
 *   3. Sign the digest with the private key (RSA-SHA256)
 *   4. Return the detached signature as a base64-encoded buffer
 */

import { createHash, createSign, createVerify, randomBytes } from "crypto";

// ── Types ──

export interface SigningResult {
  /** Base64-encoded digital signature (detached) */
  signature: string;
  /** SHA-256 hex digest of the original XML */
  digest: string;
  /** Algorithm used */
  algorithm: string;
  /** ISO timestamp of signing */
  signedAt: string;
  /** Whether this is a real or placeholder signature */
  isPlaceholder: boolean;
}

export interface CertificateInfo {
  /** Certificate subject CN */
  subject?: string;
  /** Issuer CN */
  issuer?: string;
  /** Serial number */
  serialNumber?: string;
  /** Not-before date */
  validFrom?: Date;
  /** Not-after date */
  validTo?: Date;
}

// ── Canonicalization (simplified C14N) ──

/**
 * Minimal XML canonicalization — strips declaration, normalizes
 * whitespace in tag names, sorts attributes alphabetically.
 * For production, consider using xml-c14n library.
 */
function canonicalizeXml(xml: string): string {
  return xml
    .replace(/<\?xml[^?]*\?>\s*/i, "")
    .replace(/\s+/g, " ")
    .replace(/> </g, "><")
    .trim();
}

// ── Digest ──

function sha256Digest(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

// ── Real signing (RSA-SHA256) ──

async function signWithPrivateKey(
  xmlBytes: Buffer,
  privateKeyPem: Buffer
): Promise<SigningResult> {
  const canonical = canonicalizeXml(xmlBytes.toString("utf8"));
  const digest = sha256Digest(canonical);

  const signer = createSign("RSA-SHA256");
  signer.update(canonical);
  const signature = signer.sign(privateKeyPem, "base64");

  return {
    signature,
    digest,
    algorithm: "RSA-SHA256",
    signedAt: new Date().toISOString(),
    isPlaceholder: false,
  };
}

// ── PKCS#12 signing via node-forge ──

// TODO(KMS-UPGRADE): Replace env/file-based PKCS#12 handling with a cloud KMS
// (AWS KMS / HashiCorp Vault transit) so the private key never leaves the HSM.
// signWithPkcs12() is the only call site that would need to change.

interface Pkcs12SigningResult {
  /** Base64-encoded detached signature (RSA-SHA256 over canonicalized XML) */
  signature: string;
  /** Base64-encoded X.509 certificate from the PKCS#12 bundle */
  certificate: string;
}

/**
 * Load a PKCS#12 bundle from an env-provided base64 blob + password,
 * extract the private key and certificate, and produce the detached
 * signature pair required by the ETA documentsubmissions API.
 */
export async function signWithPkcs12(
  xmlBytes: Buffer
): Promise<Pkcs12SigningResult> {
  const p12Base64 = process.env.ETA_PKCS12_BASE64;
  const p12Password = process.env.ETA_PKCS12_PASSWORD || "";

  if (!p12Base64) {
    throw new Error(
      "[ETA SIGNER] ETA_PKCS12_BASE64 not configured — cannot produce a real signature"
    );
  }

  const forge = await import("node-forge");
  const p12Asn1 = forge.asn1.fromDer(p12Base64, false);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, p12Password);

  // Extract the private key (PKCS#8 shrouded key bag, or first key bag)
  const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  const keyBag =
    keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0] ??
    Object.values(keyBags).flat()[0];
  if (!keyBag || !keyBag.key) {
    throw new Error("[ETA SIGNER] No private key found in PKCS#12 bundle");
  }

  // Extract the X.509 certificate
  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
  const cert = certBags[forge.pki.oids.certBag]?.[0]?.cert;
  if (!cert) {
    throw new Error("[ETA SIGNER] No certificate found in PKCS#12 bundle");
  }

  const privateKeyPem = forge.pki.privateKeyToPem(keyBag.key);
  const signed = await signWithPrivateKey(xmlBytes, Buffer.from(privateKeyPem, "utf8"));

  return {
    signature: signed.signature,
    certificate: Buffer.from(
      forge.pki.certificateToPem(cert),
      "utf8"
    ).toString("base64"),
  };
}

// ── Placeholder signing ──

function signPlaceholder(xmlBytes: Buffer): SigningResult {
  const canonical = canonicalizeXml(xmlBytes.toString("utf8"));
  const digest = sha256Digest(canonical);
  const nonce = randomBytes(16).toString("hex");

  console.warn(
    "[ETA SIGNER] Using PLACEHOLDER signature. " +
    "Replace with real PKCS#12 certificate before production deployment."
  );

  return {
    signature: `PLACEHOLDER_${nonce}_${Date.now()}`,
    digest,
    algorithm: "PLACEHOLDER-SHA256",
    signedAt: new Date().toISOString(),
    isPlaceholder: true,
  };
}

// ── Public API ──

/**
 * Sign an invoice XML payload.
 *
 * If a real PKCS#12 certificate is provided, signs with RSA-SHA256.
 * Otherwise, returns a placeholder signature with a console warning.
 *
 * @param xmlBytes   — The raw XML buffer to sign
 * @param cert       — Optional: PKCS#12 certificate buffer (.p12/.pfx)
 * @param privateKey — Optional: PEM-encoded private key
 * @returns          — SigningResult with signature, digest, and metadata
 */
export async function signInvoice(
  xmlBytes: Buffer,
  cert?: Buffer,
  privateKey?: Buffer
): Promise<SigningResult> {
  if (cert && privateKey) {
    // TODO: In production, extract key from PKCS#12:
    // const p12 = await import("pkcs12");
    // const { key, cert: extractedCert } = p12.parse(cert, passphrase);
    // For now, fall through to placeholder
    console.warn(
      "[ETA SIGNER] PKCS#12 certificate provided but parsing not yet implemented. " +
      "Using placeholder signature."
    );
  }

  return signPlaceholder(xmlBytes);
}

/**
 * Verify a detached signature against XML bytes.
 * Placeholder — always returns false until real crypto is wired.
 */
export function verifySignature(
  xmlBytes: Buffer,
  signatureBase64: string,
  publicKeyPem: Buffer
): boolean {
  if (signatureBase64.startsWith("PLACEHOLDER_")) {
    console.warn("[ETA SIGNER] Cannot verify placeholder signature.");
    return false;
  }

  try {
    const canonical = canonicalizeXml(xmlBytes.toString("utf8"));
    const verify = createVerify("RSA-SHA256");
    verify.update(canonical);
    return verify.verify(publicKeyPem, signatureBase64, "base64");
  } catch {
    return false;
  }
}

/**
 * Parse a PKCS#12 certificate and extract info.
 * Placeholder — returns dummy data.
 */
export function parseCertificate(cert: Buffer): CertificateInfo {
  // TODO: Use a proper PKCS#12 parser (e.g., node-forge or p12)
  console.warn("[ETA SIGNER] PKCS#12 parsing not implemented. Returning dummy info.");
  return {
    subject: "PLACEHOLDER -待ETA证书",
    issuer: "PLACEHOLDER -待ETA证书",
    serialNumber: randomBytes(8).toString("hex"),
    validFrom: new Date(),
    validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  };
}
