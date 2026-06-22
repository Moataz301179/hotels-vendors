/**
 * GET /api/v1/swarm/health
 * Returns swarm system health metrics.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, success, ApiError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!auth) throw new ApiError("Unauthorized", 401);

    const [totalJobs, completedJobs, failedJobs, pendingJobs, waitingApproval, recentEvents] = await Promise.all([
      prisma.swarmJob.count({ where: { tenantId: auth.tenantId } }),
      prisma.swarmJob.count({ where: { tenantId: auth.tenantId, status: "COMPLETED" } }),
      prisma.swarmJob.count({ where: { tenantId: auth.tenantId, status: "FAILED" } }),
      prisma.swarmJob.count({ where: { tenantId: auth.tenantId, status: "PENDING" } }),
      prisma.swarmJob.count({ where: { tenantId: auth.tenantId, status: "WAITING_APPROVAL" } }),
      prisma.swarmEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    ]);

    const successRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

    const eventsBySeverity: Record<string, number> = {};
    for (const event of recentEvents) {
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
    }

    // Check LLM provider health
    const ollamaUrl = process.env.OLLAMA_URL || process.env.VPS_API_URL;
    const modelHealth = [];

    if (ollamaUrl) {
      try {
        const res = await fetch(`${ollamaUrl.replace(/\/$/, "")}/api/tags`, {
          signal: AbortSignal.timeout(5000),
        });
        modelHealth.push({
          provider: "ollama",
          model: process.env.OLLAMA_MODEL || "llama3.2:latest",
          status: res.ok ? "HEALTHY" : "DEGRADED",
        });
      } catch {
        modelHealth.push({
          provider: "ollama",
          model: process.env.OLLAMA_MODEL || "llama3.2:latest",
          status: "UNREACHABLE",
        });
      }
    }

    if (process.env.OPENROUTER_API_KEY) {
      modelHealth.push({
        provider: "openrouter",
        model: process.env.OPENROUTER_MODEL || "openrouter/owl-alpha",
        status: "CONFIGURED",
      });
    }

    return success({
      health: {
        summary: {
          totalJobs,
          completedJobs,
          failedJobs,
          pendingJobs,
          waitingApproval,
          successRate,
        },
        eventsBySeverity,
        modelHealth,
      },
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch health" }, { status: 500 });
  }
}
