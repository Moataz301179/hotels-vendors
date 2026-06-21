/**
 * POST /api/v1/swarm/orchestrate
 * Run the multi-agent orchestrator on a given task.
 * Decomposes the task, dispatches to relevant agents, and returns a plan.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, success, ApiError } from "@/lib/api-utils";
import { executeLLM } from "@/lib/ai/llm";
import { z } from "zod";

const OrchestrateSchema = z.object({
  task: z.string().min(1).max(5000),
  skipApproval: z.boolean().optional().default(false),
});

const AGENT_REGISTRY: Record<string, { name: string; avatar: string; role: string; squad: string }> = {
  "lead-scout": { name: "Lead Scout", avatar: "🔍", role: "Hotel & supplier lead discovery", squad: "growth" },
  "content-engine": { name: "Content Engine", avatar: "✍️", role: "Content generation", squad: "growth" },
  "market-analyst": { name: "Market Analyst", avatar: "📊", role: "Market intelligence", squad: "intelligence" },
  "compliance-checker": { name: "Compliance Checker", avatar: "🛡️", role: "Compliance validation", squad: "risk" },
  "support-agent": { name: "Support Agent", avatar: "💬", role: "Support assistance", squad: "operations" },
};

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!auth) throw new ApiError("Unauthorized", 401);

    const body = await req.json();
    const { task, skipApproval } = OrchestrateSchema.parse(body);

    // Use LLM to decompose the task and determine which agents to dispatch
    const decomposition = await executeLLM(
      `You are the Director agent for HotelsVendors, Egypt's B2B hospitality procurement platform.`,
      `Decompose this task into subtasks and determine which agents should handle each subtask. Available agents: ${Object.entries(AGENT_REGISTRY).map(([id, a]) => `${id} (${a.role})`).join(", ")}.

Task: "${task}"

Respond in JSON format:
{
  "subtasks": [
    {
      "agentId": "agent-id",
      "prompt": "specific prompt for this agent",
      "priority": 1-10
    }
  ],
  "summary": "brief summary of the execution plan"
}`,
      { jsonMode: true, maxTokens: 2048 }
    );

    let plan: { subtasks: Array<{ agentId: string; prompt: string; priority: number }>; summary: string };
    try {
      plan = JSON.parse(decomposition.content);
    } catch {
      plan = {
        subtasks: [{
          agentId: "content-engine",
          prompt: task,
          priority: 5,
        }],
        summary: "Single-agent execution (decomposition unavailable)",
      };
    }

    // Create jobs for each subtask
    const createdJobs = [];
    for (const subtask of plan.subtasks.slice(0, 5)) {
      const agentInfo = AGENT_REGISTRY[subtask.agentId];
      if (!agentInfo) continue;

      const job = await prisma.swarmJob.create({
        data: {
          queueName: "orchestration",
          assignedAgent: subtask.agentId,
          squad: agentInfo.squad,
          jobType: "orchestrated",
          jobName: `${agentInfo.name} — ${task.slice(0, 60)}`,
          status: skipApproval ? "RUNNING" : "WAITING_APPROVAL",
          payload: subtask.prompt,
          priority: subtask.priority || 5,
          tenantId: auth.tenantId,
          startedAt: skipApproval ? new Date() : null,
        },
      });

      createdJobs.push(job);
    }

    const agents = plan.subtasks
      .map((s) => AGENT_REGISTRY[s.agentId])
      .filter(Boolean)
      .map((a, i) => ({
        id: plan.subtasks[i].agentId,
        name: a!.name,
        avatar: a!.avatar,
        role: a!.role,
        squad: a!.squad,
      }));

    return success({
      missionId: `mission-${Date.now()}`,
      agents,
      summary: plan.summary,
      jobs: createdJobs,
      jobsCreated: createdJobs.length,
    }, 201);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Orchestration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
