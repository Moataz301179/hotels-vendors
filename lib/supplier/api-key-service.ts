/**
 * Supplier API Key Service
 * Manages API key lifecycle: create, list, revoke, validate.
 * Keys are hashed with SHA-256; only the prefix is stored in plaintext.
 * The full key is returned once at creation time and never stored.
 */

import * as crypto from "crypto";
import { prisma } from "@/lib/prisma";

const PREFIX = "hv_live_";
const KEY_BYTES = 32;

export interface CreatedApiKey {
  id: string;
  key: string;
  name: string;
  prefix: string;
  scopes: string[];
  rateLimitPerMinute: number;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface ApiKeySummary {
  id: string;
  name: string;
  description: string | null;
  prefix: string;
  scopes: string[];
  rateLimitPerMinute: number;
  status: string;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
}

function generateKey(): { fullKey: string; prefix: string; hash: string } {
  const random = crypto.randomBytes(KEY_BYTES).toString("base64url");
  const fullKey = `${PREFIX}${random}`;
  const prefix = fullKey.slice(0, 16);
  const hash = crypto.createHash("sha256").update(fullKey).digest("hex");
  return { fullKey, prefix, hash };
}

export async function createApiKey(params: {
  supplierId: string;
  tenantId: string;
  name: string;
  description?: string;
  scopes?: string[];
  rateLimitPerMinute?: number;
  expiresInDays?: number;
}): Promise<CreatedApiKey> {
  const { fullKey, prefix, hash } = generateKey();

  const expiresAt = params.expiresInDays
    ? new Date(Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const record = await prisma.apiKey.create({
    data: {
      keyHash: hash,
      keyPrefix: prefix,
      name: params.name,
      description: params.description ?? null,
      supplierId: params.supplierId,
      tenantId: params.tenantId,
      scopes: params.scopes ?? ["read:orders", "read:inventory"],
      rateLimitPerMinute: params.rateLimitPerMinute ?? 60,
      expiresAt,
    },
  });

  return {
    id: record.id,
    key: fullKey,
    name: record.name,
    prefix: record.keyPrefix,
    scopes: record.scopes,
    rateLimitPerMinute: record.rateLimitPerMinute,
    expiresAt: record.expiresAt,
    createdAt: record.createdAt,
  };
}

export async function listApiKeys(
  supplierId: string,
  tenantId: string
): Promise<ApiKeySummary[]> {
  const keys = await prisma.apiKey.findMany({
    where: { supplierId, tenantId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      keyPrefix: true,
      scopes: true,
      rateLimitPerMinute: true,
      status: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return keys.map((k) => ({
    id: k.id,
    name: k.name,
    description: k.description,
    prefix: k.keyPrefix,
    scopes: k.scopes,
    rateLimitPerMinute: k.rateLimitPerMinute,
    status: k.status,
    lastUsedAt: k.lastUsedAt,
    expiresAt: k.expiresAt,
    createdAt: k.createdAt,
  }));
}

export async function revokeApiKey(
  id: string,
  supplierId: string,
  tenantId: string
): Promise<boolean> {
  const result = await prisma.apiKey.updateMany({
    where: { id, supplierId, tenantId, status: "ACTIVE" },
    data: { status: "REVOKED" },
  });
  return result.count > 0;
}

export async function validateApiKey(
  fullKey: string
): Promise<{ valid: boolean; supplierId?: string; tenantId?: string; scopes?: string[] }> {
  if (!fullKey.startsWith(PREFIX) || fullKey.length < 24) {
    return { valid: false };
  }

  const hash = crypto.createHash("sha256").update(fullKey).digest("hex");

  const record = await prisma.apiKey.findUnique({
    where: { keyHash: hash },
    select: {
      id: true,
      supplierId: true,
      tenantId: true,
      scopes: true,
      status: true,
      expiresAt: true,
    },
  });

  if (!record) return { valid: false };
  if (record.status !== "ACTIVE") return { valid: false };
  if (record.expiresAt && record.expiresAt < new Date()) return { valid: false };

  await prisma.apiKey
    .update({
      where: { id: record.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => undefined);

  return {
    valid: true,
    supplierId: record.supplierId ?? undefined,
    tenantId: record.tenantId,
    scopes: record.scopes,
  };
}
