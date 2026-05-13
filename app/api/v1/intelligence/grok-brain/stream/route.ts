/**
 * Grok Brain Streaming API
 * Server-Sent Events (SSE) endpoint that streams execution events in real-time
 * Events: thinking, tool_call, tool_result, screenshot, final_answer, error
 */

import { NextRequest } from "next/server";
import { runGrokBrain, ToolRegistry } from "@/lib/swarm/grok-brain";
import { buildStandardToolRegistry } from "@/lib/swarm/tools";

const SYSTEM_PROMPT = `You are the Hotels Vendors Grok Brain — an autonomous AI agent that helps run the procurement platform.

You have access to powerful tools including OpenClaw browser automation, database queries, memory, email, competitor analysis, and credit scoring.

RULES:
1. When you need information, USE TOOLS. Don't guess.
2. When you discover useful facts, WRITE THEM TO MEMORY.
3. Be concise but thorough in your final answers.
4. For competitor analysis, always visit their site and extract real data.
5. For credit scoring, use the proprietary engine — don't estimate.
6. Database queries are READ-ONLY.

CURRENT DATE: ${new Date().toISOString().split("T")[0]}
PLATFORM: Hotels Vendors — AI-Powered Procurement Ecosystem for Egyptian Hospitality`;

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const body = await request.json();
    const { prompt, tools: toolFilter, maxRounds = 5 } = body;

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Missing prompt" })}\n\n`),
        { status: 400, headers: { "Content-Type": "text/event-stream" } }
      );
    }

    const fullRegistry = buildStandardToolRegistry();
    let registry = fullRegistry;
    if (toolFilter && Array.isArray(toolFilter) && toolFilter.length > 0) {
      const filtered = new ToolRegistry();
      for (const name of toolFilter) {
        const tool = fullRegistry.get(name);
        if (tool) filtered.register(tool);
      }
      registry = filtered;
    }

    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        send("thinking", { message: "Analyzing your request...", prompt });

        try {
          const result = await runGrokBrain(
            SYSTEM_PROMPT,
            prompt,
            registry,
            { maxToolRounds: maxRounds, temperature: 0.3, maxTokens: 4096 }
          );

          // Stream each tool call
          for (let i = 0; i < result.toolCalls.length; i++) {
            const tc = result.toolCalls[i];
            const tr = result.toolResults[i];

            send("tool_call", {
              round: i + 1,
              tool: tc.name,
              arguments: tc.arguments,
            });

            // Simulate delay for realism
            await new Promise((r) => setTimeout(r, 300));

            send("tool_result", {
              round: i + 1,
              tool: tc.name,
              success: !tr.error,
              output: tr.output,
              error: tr.error,
            });

            // If OpenClaw was used, try to include a screenshot reference
            if (tc.name.startsWith("openclaw_")) {
              send("screenshot", {
                round: i + 1,
                tool: tc.name,
                note: "Browser automation completed",
              });
            }
          }

          send("final_answer", {
            answer: result.content,
            metadata: {
              provider: result.provider,
              model: result.model,
              latencyMs: result.latencyMs,
              rounds: result.rounds,
              tokensUsed: result.tokensUsed,
              toolCallsCount: result.toolCalls.length,
            },
          });

          send("done", {});
        } catch (error) {
          send("error", {
            error: error instanceof Error ? error.message : "Grok Brain failed",
          });
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      encoder.encode(
        `event: error\ndata: ${JSON.stringify({ error: error instanceof Error ? error.message : "Stream failed" })}\n\n`
      ),
      { status: 500, headers: { "Content-Type": "text/event-stream" } }
    );
  }
}
