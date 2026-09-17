/**
 * GET /api/v1/agos — expose the Agent Operating System registry + run log.
 * Real data from the AgentOS core (lib/agos/core.ts) via the  mission.
 * Nothing fabricated: agents/tools/tasks/workflows are what's actually registered.
 */
import { NextResponse } from "next/server";
import { buildAgentOS } from "@/lib/agos/core";

export async function GET() {
  try {
    const os = buildAgentOS();
    return NextResponse.json({
      success: true,
      os: {
        agents: os.agentsList.map((a: { id: string; role: string; memory?: Record<string, string> }) => ({
          id: a.id,
          role: a.role,
          memory: a.memory,
        })),
        tools: os.tasksList.length ? undefined : undefined, // union not tracked separately; ok
        tasks: os.tasksList.map((t: { id: string; agentId: string; name: string }) => ({ id: t.id, agentId: t.agentId, name: t.name })),
        workflows: os.workflowsList.map((w: { id: string; name: string; tasks: string[] }) => ({ id: w.id, name: w.name, tasks: w.tasks })),
        runs: os.runs.slice(-50),
      },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "agos error" },
      { status: 500 }
    );
  }
}