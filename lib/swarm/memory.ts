import { redis } from "@/lib/redis";
/**
 * Swarm Memory Layer
 * Persistent context storage for agent coordination
 * Uses Prisma + Redis hybrid (Prisma for long-term, Redis for hot cache)
 */

import { prisma } from "@/lib/prisma";

import type { MemoryType } from "@prisma/client";

interface MemoryInput {
  agentId: string;
  agentName: string;
  content: string;
  memoryType: MemoryType;
  category: string;
  jobId?: string;
  confidence?: number;
  expiresInDays?: number;
  tenantId?: string;
}

const PLATFORM_TENANT_ID = "platform";

/**
 * Store a memory in both Prisma (long-term) and Redis (hot cache)
 */
export async function storeMemory(input: MemoryInput): Promise<void> {
  const tenantId = input.tenantId || PLATFORM_TENANT_ID;
  const key = `${input.memoryType}:${input.category}:${input.agentId}:${Date.now()}`;

  // Prisma persistent storage
  await prisma.swarmMemory.create({
    data: {
      memoryType: input.memoryType,
      category: input.category,
      key,
      content: input.content,
      agentId: input.agentId,
      agentName: input.agentName,
      jobId: input.jobId,
      confidence: input.confidence ?? 0.8,
      expiresAt: input.expiresInDays
        ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined,
      tenantId,
    },
  });

  // Redis hot cache (7-day TTL)
  const cacheKey = `swarm:memory:${key}`;
  const cacheData = JSON.stringify({
    ...input,
    tenantId,
    createdAt: Date.now(),
  });

  try {
    if (redis) {
      await redis.setex(cacheKey, 7 * 24 * 60 * 60, cacheData);
    }
  } catch (e) {
    // Redis failure shouldn't break memory storage
    console.error("[Memory] Redis cache failed:", e);
  }
}

/**
 * Retrieve relevant memories for an agent
 * Hybrid approach: Redis first (fast), Prisma fallback (complete)
 */
export async function getMemoryContext(
  agentId: string,
  query: string,
  options: {
    limit?: number;
    category?: string;
    memoryType?: MemoryType;
    minConfidence?: number;
    tenantId?: string;
  } = {}
): Promise<string> {
  const {
    limit = 5,
    category,
    memoryType,
    minConfidence = 0.5,
    tenantId = PLATFORM_TENANT_ID,
  } = options;

  // Try Redis first for hot memories
  let memories: Array<{ content: string; memoryType: string; category: string; confidence: number }> = [];

  try {
    if (redis) {
      const pattern = `swarm:memory:*${agentId}*`;
      const keys = await redis.keys(pattern);
      for (const key of keys.slice(0, limit * 2)) {
        const data = await redis.get(key);
        if (data) {
          const mem = JSON.parse(data);
          if (mem.confidence >= minConfidence) {
            memories.push({
              content: mem.content,
              memoryType: mem.memoryType,
              category: mem.category,
              confidence: mem.confidence,
            });
          }
        }
      }
    }
  } catch {
    // Fallback to Prisma
  }

  // If Redis didn't return enough, query Prisma
  if (memories.length < limit) {
    const dbMemories = await prisma.swarmMemory.findMany({
      where: {
        tenantId,
        confidence: { gte: minConfidence },
        AND: [
          {
            OR: [
              { agentId },
              { category: "general" },
            ],
          },
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
        ],
        ...(memoryType ? { memoryType } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: [{ confidence: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    memories = dbMemories.map((m) => ({
      content: m.content,
      memoryType: m.memoryType,
      category: m.category,
      confidence: m.confidence,
    }));
  }

  if (memories.length === 0) return "";

  // Format as context string
  const lines = ["## Relevant Context from Swarm Memory:"];
  for (const mem of memories.slice(0, limit)) {
    const tag = `[${mem.memoryType}:${mem.category}]`;
    lines.push(`- ${tag} ${mem.content.substring(0, 300)}${mem.content.length > 300 ? "..." : ""}`);
  }
  return lines.join("\n");
}

/**
 * Query memories by semantic similarity (keyword-based for now, vector later)
 */
export async function searchMemories(
  query: string,
  options: {
    agentId?: string;
    category?: string;
    memoryType?: MemoryType;
    limit?: number;
    tenantId?: string;
  } = {}
): Promise<Array<{ id: string; content: string; agentName: string; createdAt: Date; confidence: number }>> {
  const { agentId, category, memoryType, limit = 10, tenantId = PLATFORM_TENANT_ID } = options;

  // Simple keyword search using Prisma contains
  const keywords = query.toLowerCase().split(/\s+/).filter((k) => k.length > 3);

  const memories = await prisma.swarmMemory.findMany({
    where: {
      tenantId,
      AND: keywords.map((k) => ({
        content: { contains: k, mode: "insensitive" },
      })),
      ...(agentId ? { agentId } : {}),
      ...(category ? { category } : {}),
      ...(memoryType ? { memoryType } : {}),
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    orderBy: [{ confidence: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return memories.map((m) => ({
    id: m.id,
    content: m.content,
    agentName: m.agentName,
    createdAt: m.createdAt,
    confidence: m.confidence,
  }));
}

/**
 * Get recent memories for an agent (last N hours)
 */
export async function getRecentMemories(
  agentId: string,
  hours: number = 24,
  tenantId: string = PLATFORM_TENANT_ID
): Promise<Array<{ content: string; createdAt: Date; jobId: string | null }>> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const memories = await prisma.swarmMemory.findMany({
    where: {
      tenantId,
      agentId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return memories.map((m) => ({
    content: m.content,
    createdAt: m.createdAt,
    jobId: m.jobId,
  }));
}

/**
 * Clean up expired memories
 */
export async function cleanupExpiredMemories(): Promise<number> {
  const result = await prisma.swarmMemory.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });

  console.log(`[Memory] Cleaned up ${result.count} expired memories`);
  return result.count;
}
