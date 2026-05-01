import { NextRequest, NextResponse } from "next/server";
import { AgentOrchestrator } from "@/lib/agents/orchestrator";
import { WORKFLOWS } from "@/lib/agents/agents";
import { AgentId } from "@/lib/agents/types";

const orchestrator = new AgentOrchestrator();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflow, customPrompt, task } = body;

    // Run a pre-defined workflow
    if (workflow && workflow in WORKFLOWS) {
      const results = await orchestrator.runWorkflow(
        workflow as keyof typeof WORKFLOWS,
        customPrompt
      );
      return NextResponse.json({
        success: true,
        data: { workflow, results },
      });
    }

    // Run a single custom task
    if (task) {
      const result = await orchestrator.runTask({
        id: `custom-${Date.now()}`,
        type: task.type,
        title: task.title,
        prompt: task.prompt,
        agentId: task.agentId as AgentId,
        context: task.context,
      });
      return NextResponse.json({
        success: true,
        data: { task: result },
      });
    }

    return NextResponse.json(
      { success: false, error: "Missing workflow or task" },
      { status: 400 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
