/**
 * Grok Brain API — Autonomous agent with native tool calling
 * POST /api/v1/intelligence/grok-brain
 * Body: { prompt: string, tools?: string[], maxRounds?: number }
 */

import { NextRequest } from "next/server";
import { runGrokBrain, ToolRegistry } from "@/lib/swarm/grok-brain";
import { buildStandardToolRegistry } from "@/lib/swarm/tools";

const SYSTEM_PROMPT = `You are the Hotels Vendors Grok Brain — an autonomous AI agent that helps run the procurement platform.

You have access to powerful tools:
- **openclaw_***: Browser automation — navigate websites, extract data, scrape competitor pages, smart navigation
- **db_query/db_count/db_aggregate**: Query the platform database for hotels, suppliers, orders, products, leads, invoices
- **memory_write/memory_read**: Store and retrieve knowledge across sessions
- **email_send**: Send transactional emails
- **analyze_competitor**: Visit a competitor's website and produce structured intelligence
- **score_hotel_credit**: Run the proprietary credit scoring engine

RULES:
1. When you need information, USE TOOLS. Don't guess.
2. When you discover useful facts, WRITE THEM TO MEMORY so they're available later.
3. Be concise but thorough in your final answers.
4. For competitor analysis, always visit their site and extract real data.
5. For credit scoring, use the proprietary engine — don't estimate.
6. Database queries are READ-ONLY. You cannot modify data.

CURRENT DATE: ${new Date().toISOString().split("T")[0]}
PLATFORM: Hotels Vendors — AI-Powered Procurement Ecosystem for Egyptian Hospitality`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, tools: toolFilter, maxRounds = 5 } = body;

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ success: false, error: "Missing prompt" }, { status: 400 });
    }

    // Build registry
    const fullRegistry = buildStandardToolRegistry();

    // Filter tools if requested
    let registry = fullRegistry;
    if (toolFilter && Array.isArray(toolFilter) && toolFilter.length > 0) {
      const filtered = new ToolRegistry();
      for (const name of toolFilter) {
        const tool = fullRegistry.get(name);
        if (tool) filtered.register(tool);
      }
      registry = filtered;
    }

    const result = await runGrokBrain(
      SYSTEM_PROMPT,
      prompt,
      registry,
      { maxToolRounds: maxRounds, temperature: 0.3, maxTokens: 4096 }
    );

    return Response.json({
      success: true,
      data: {
        answer: result.content,
        toolCalls: result.toolCalls.map((tc) => ({
          tool: tc.name,
          arguments: tc.arguments,
        })),
        toolResults: result.toolResults.map((tr) => ({
          tool: tr.name,
          success: !tr.error,
          output: tr.output,
          error: tr.error,
        })),
        metadata: {
          provider: result.provider,
          model: result.model,
          latencyMs: result.latencyMs,
          rounds: result.rounds,
          tokensUsed: result.tokensUsed,
        },
      },
    });
  } catch (error) {
    console.error("Grok Brain error:", error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Grok Brain failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const registry = buildStandardToolRegistry();
  return Response.json({
    success: true,
    data: {
      availableTools: registry.list().map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      })),
      usage: {
        endpoint: "POST /api/v1/intelligence/grok-brain",
        body: {
          prompt: "Your task or question",
          tools: ["optional array of tool names to enable"],
          maxRounds: "optional, default 5",
        },
      },
    },
  });
}
