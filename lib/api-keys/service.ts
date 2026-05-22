/**
 * API Key Service
 * Manages partner API keys for external factoring and logistics integrations.
 *
 * Keys are stored as SHA-256 hashes. The raw key is shown ONLY once on creation.
 */

import { prisma } from "@/lib/prisma";
import { randomBytes, createHash } from "crypto";

const KEY_PREFIX_LENGTH = 8;
const KEY_SECRET_LENGTH = 32;

export interface ApiKeyInput {
  name: string;
  scopes: string[];
  factoringCompanyId?: string;
  tenantId: string;
}

function generateRawKey(): string {
  const prefix = randomBytes(KEY_PREFIX_LENGTH / 2).toString("hex");
  const secret = randomBytes(KEY_SECRET_LENGTH / 2).toString("hex");
  return `hv_${prefix}_${secret}`;
}

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/**
 * Create a new API key. Returns the raw key (shown ONCE).
 */
export async function createApiKey(input: ApiKeyInput) {
  const rawKey = generateRawKey();
  const keyHash = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, KEY_PREFIX_LENGTH + 3); // e.g. "hv_a1b2c3d4_"

  const apiKey = await prisma.apiKey.create({
    data: {
      name: input.name,
      keyHash,
      keyPrefix,
      scopes: input.scopes.join(","),
      factoringCompanyId: input.factoringCompanyId,
      tenantId: input.tenantId,
    },
  });

  return { apiKey, rawKey };
}

/**
 * Validate an API key and return its record if valid.
 */
export async function validateApiKey(rawKey: string) {
  const keyHash = hashKey(rawKey);
  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { FactoringCompany: { select: { id: true, name: true, status: true } } },
  });

  if (!apiKey) return null;
  if (apiKey.revokedAt) return null;

  // Update usage
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
  });

  return apiKey;
}

/**
 * Check if an API key has a specific scope.
 */
export function hasScope(apiKey: { scopes: string }, scope: string): boolean {
  const scopes = apiKey.scopes.split(",").map((s) => s.trim());
  return scopes.includes(scope) || scopes.includes("*");
}

/**
 * List API keys for a tenant.
 */
export async function listApiKeys(tenantId: string) {
  return prisma.apiKey.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: {
      FactoringCompany: { select: { id: true, name: true } },
    },
  });
}

/**
 * Revoke an API key.
 */
export async function revokeApiKey(id: string, tenantId: string, revokedBy: string) {
  const key = await prisma.apiKey.findFirst({
    where: { id, tenantId },
  });
  if (!key) throw new Error("API key not found");

  return prisma.apiKey.update({
    where: { id },
    data: { revokedAt: new Date(), revokedBy },
  });
}
