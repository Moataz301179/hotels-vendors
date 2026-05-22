/**
 * e-Seal Certificate Management
 * Handles storage and retrieval of ETA digital certificates.
 *
 * Certificates are stored encrypted at the application level.
 * The encryption key should be a strong, environment-specific secret.
 */

import { prisma } from "@/lib/prisma";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ENCRYPTION_KEY = process.env.CERTIFICATE_ENCRYPTION_KEY || process.env.SESSION_SECRET || "fallback-key";

// Derive a 32-byte key from the encryption secret
function getKey(): Buffer {
  return scryptSync(ENCRYPTION_KEY, "hotels-vendors-salt", 32);
}

function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encryptedHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

export interface CertificateInput {
  supplierId: string;
  type: "E_SEAL" | "E_SIGNATURE" | "HSM";
  provider?: string;
  serialNumber?: string;
  certificatePem: string;
  privateKey: string;
  pin?: string;
  issuedAt?: Date;
  expiresAt?: Date;
  tenantId: string;
}

/**
 * Store a certificate with AES-256-GCM encryption.
 */
export async function storeCertificate(input: CertificateInput) {
  const existing = await prisma.supplierCertificate.findFirst({
    where: {
      supplierId: input.supplierId,
      type: input.type,
      status: { in: ["ACTIVE", "PENDING_UPLOAD"] },
    },
  });

  if (existing) {
    // Update existing
    return prisma.supplierCertificate.update({
      where: { id: existing.id },
      data: {
        certificatePem: encrypt(input.certificatePem),
        privateKey: encrypt(input.privateKey),
        ...(input.pin && { pin: encrypt(input.pin) }),
        provider: input.provider,
        serialNumber: input.serialNumber,
        issuedAt: input.issuedAt,
        expiresAt: input.expiresAt,
        status: "ACTIVE",
        lastUsedAt: new Date(),
      },
    });
  }

  return prisma.supplierCertificate.create({
    data: {
      supplierId: input.supplierId,
      type: input.type,
      status: "ACTIVE",
      provider: input.provider,
      serialNumber: input.serialNumber,
      certificatePem: encrypt(input.certificatePem),
      privateKey: encrypt(input.privateKey),
      ...(input.pin && { pin: encrypt(input.pin) }),
      issuedAt: input.issuedAt,
      expiresAt: input.expiresAt,
      tenantId: input.tenantId,
    },
  });
}

/**
 * Retrieve and decrypt a certificate for signing.
 */
export async function getCertificateForSigning(supplierId: string, type?: string) {
  const cert = await prisma.supplierCertificate.findFirst({
    where: {
      supplierId,
      ...(type && { type: type as any }),
      status: "ACTIVE",
    },
  });

  if (!cert || !cert.certificatePem || !cert.privateKey) {
    return null;
  }

  // Check expiry
  if (cert.expiresAt && new Date(cert.expiresAt) < new Date()) {
    await prisma.supplierCertificate.update({
      where: { id: cert.id },
      data: { status: "EXPIRED" },
    });
    return null;
  }

  // Update last used
  await prisma.supplierCertificate.update({
    where: { id: cert.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    id: cert.id,
    provider: cert.provider,
    serialNumber: cert.serialNumber,
    certificatePem: decrypt(cert.certificatePem),
    privateKey: decrypt(cert.privateKey),
    pin: cert.pin ? decrypt(cert.pin) : undefined,
    issuedAt: cert.issuedAt,
    expiresAt: cert.expiresAt,
  };
}

/**
 * List certificates for a supplier.
 */
export async function listCertificates(supplierId: string) {
  return prisma.supplierCertificate.findMany({
    where: { supplierId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      status: true,
      provider: true,
      serialNumber: true,
      issuedAt: true,
      expiresAt: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });
}

/**
 * Delete/revoke a certificate.
 */
export async function revokeCertificate(id: string, tenantId: string) {
  const cert = await prisma.supplierCertificate.findFirst({
    where: { id, tenantId },
  });
  if (!cert) throw new Error("Certificate not found");

  return prisma.supplierCertificate.update({
    where: { id },
    data: { status: "REVOKED" },
  });
}
