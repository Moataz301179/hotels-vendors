/**
 * Grok Brain Streaming API
 * Server-Sent Events (SSE) endpoint that streams execution events in real-time
 * Events: thinking, tool_call, tool_result, screenshot, final_answer, error
 *
 * Screenshot handling: Extracts base64 screenshots from OpenClaw tool results
 * and emits them as screenshot events for inline thumbnail display.
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

/**
 * Extract screenshot data from an OpenClaw tool result.
 * OpenClaw returns screenshot_b64 at various nesting levels depending on endpoint.
 */
function extractScreenshot(output: unknown): string | null {
  if (!output || typeof output !== "object") return null;
  const o = output as Record<string, unknown>;

  // Direct screenshot_b64 on navigate/extract response
  if (o.screenshot_b64 && typeof o.screenshot_b64 === "string") {
    return o.screenshot_b64;
  }

  // Nested in data (some OpenClaw endpoints)
  if (o.data && typeof o.data === "object") {
    const d = o.data as Record<string, unknown>;
    if (d.screenshot_b64 && typeof d.screenshot_b64 === "string") {
      return d.screenshot_b64;
    }
  }

  // Skill execution returns results array with screenshot_b64 in each step
  if (o.results && Array.isArray(o.results)) {
    // Find the last step that has a screenshot
    for (let i = o.results.length - 1; i >= 0; i--) {
      const step = o.results[i] as Record<string, unknown>;
      if (step.data && typeof step.data === "object") {
        const sd = step.data as Record<string, unknown>;
        if (sd.screenshot_b64 && typeof sd.screenshot_b64 === "string") {
          return sd.screenshot_b64;
        }
      }
    }
  }

  return null;
}

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

          // Stream each tool call with results and screenshots
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

            // Extract and emit screenshots from tool results
            const screenshotB64 = extractScreenshot(tr.output);
            if (screenshotB64) {
              send("screenshot", {
                round: i + 1,
                tool: tc.name,
                imageBase64: screenshotB64,
                note: "Browser screenshot captured",
              });
            } else if (tc.name.startsWith("openclaw_")) {
              // Fallback: still emit a screenshot event for OpenClaw tools
              // even if no image was captured (for UI consistency)
              send("screenshot", {
                round: i + 1,
                tool: tc.name,
                imageBase64: null,
                note: "Browser automation completed (no screenshot captured)",
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
