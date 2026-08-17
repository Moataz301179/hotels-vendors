import { NextRequest, NextResponse } from "next/server";
import { registry } from "@/lib/agos/registry";
import { agentOS } from "@/lib/agos/core";

// GET endpoint - registry, health check
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";
  const health = searchParams.get("health");

  // Health check endpoint
  if (health === "true") {
    return NextResponse.json({
      status: "healthy",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    });
  }

  try {
    const entries = registry.listEntries();
    const data = {
      success: true,
      agents: type === "all" ? registry.getAgents() : [],
      tools: type === "all" || type === "tools" ? registry.getTools() : [],
      skills: type === "all" || type === "skills" ? registry.getSkills() : [],
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list registry entries",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST endpoint - registration, task execution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Register agent
    if (body.action === "register" && body.type === "agent") {
      const { id, name, description, metadata } = body;
      registry.registerAgent({
        id,
        name,
        description,
        type: "agent",
        metadata,
        createdAt: Date.now()
      } as RegistryEntry);

      return NextResponse.json({
        success: true,
        message: "Agent registered successfully",
        timestamp: new Date().toISOString()
      });
    }

    // Register tool
    if (body.action === "register" && body.type === "tool") {
      const { id, name, description, metadata } = body;
      registry.registerTool({
        id,
        name,
        description,
        type: "tool",
        metadata,
        createdAt: Date.now()
      } as RegistryEntry);

      return NextResponse.json({
        success: true,
        message: "Tool registered successfully",
        timestamp: new Date().toISOString()
      });
    }

    // Execute task
    if (body.action === "execute") {
      const { taskId, agentId, description } = body;
      const task = agentOS.startTask(taskId, agentId, description);

      return NextResponse.json({
        success: true,
        message: "Task started",
        taskId,
        agentId,
        task,
        timestamp: new Date().toISOString()
      });
    }

    // Execute LLM
    if (body.action === "llm") {
      const { messages, options } = body;
      // Dynamic import to avoid circular dependencies
      const { executeLLM } = await import("@/lib/ai/llm");
      const result = await executeLLM(messages, options);

      return NextResponse.json({
        success: true,
        result,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}