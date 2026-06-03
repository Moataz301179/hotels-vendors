/**
 * Grok Brain — Native Tool-Calling Agent Engine
 * Makes xAI Grok the autonomous brain with OpenClaw, DB, Memory, and Comms as limbs
 * Uses OpenAI-compatible function calling (xAI native support)
 */

import { executeLLM, RouterOptions } from "./model-router";

// ── Tool Definition ────────────────────────────────────────────

export interface ToolParameter {
  type: string;
  description: string;
  enum?: string[];
  items?: { type: string };
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, ToolParameter>;
    required?: string[];
  };
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  name: string;
  output: unknown;
  error?: string;
}

// ── Tool Registry ──────────────────────────────────────────────

export class ToolRegistry {
  private tools = new Map<string, ToolDefinition>();

  register(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /** Convert to xAI/OpenAI tools format */
  toOpenAITools(): Array<{
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: ToolDefinition["parameters"];
    };
  }> {
    return this.list().map((t) => ({
      type: "function" as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));
  }
}

// ── Grok Brain Agent ───────────────────────────────────────────

interface BrainMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  name?: string;
}

export interface BrainRunOptions extends RouterOptions {
  maxToolRounds?: number;
  toolChoice?: "auto" | "none" | { type: "function"; function: { name: string } };
}

export interface BrainRunResult {
  content: string;
  toolCalls: ToolCall[];
  toolResults: ToolResult[];
  tokensUsed?: number;
  provider: string;
  model: string;
  latencyMs: number;
  rounds: number;
}

/**
 * Execute an agentic conversation with Grok where Grok decides which tools to call.
 * Supports multi-round tool execution (Grok calls tools → results fed back → Grok decides again).
 */
export async function runGrokBrain(
  systemPrompt: string,
  userPrompt: string,
  registry: ToolRegistry,
  options: BrainRunOptions = {}
): Promise<BrainRunResult> {
  const { maxToolRounds = 5, temperature = 0.3, maxTokens = 4096, timeoutMs } = options;
  const start = Date.now();
  const allToolCalls: ToolCall[] = [];
  const allToolResults: ToolResult[] = [];

  const messages: BrainMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  // Build native tool schema for xAI
  const tools = registry.toOpenAITools();
  const hasTools = tools.length > 0;

  for (let round = 0; round < maxToolRounds; round++) {
    // ── Call Grok with tool schema ─────────────────────────────
    const llmResult = await callGrokWithTools(
      messages,
      hasTools ? tools : undefined,
      options.toolChoice || (hasTools ? "auto" : "none"),
      temperature,
      maxTokens,
      timeoutMs
    );

    const assistantMessage: BrainMessage = {
      role: "assistant",
      content: llmResult.content || "",
    };

    // Check if Grok wants to call tools
    if (llmResult.toolCalls && llmResult.toolCalls.length > 0) {
      assistantMessage.tool_calls = llmResult.toolCalls;
      messages.push(assistantMessage);

      // ── Execute each tool ──────────────────────────────────
      const results: ToolResult[] = [];
      for (const tc of llmResult.toolCalls) {
        const toolName = tc.function.name;
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(tc.function.arguments);
        } catch {
          // Invalid JSON arguments
        }

        allToolCalls.push({ id: tc.id, name: toolName, arguments: args });

        const tool = registry.get(toolName);
        let output: unknown;
        let error: string | undefined;

        if (!tool) {
          error = `Tool "${toolName}" not found in registry.`;
          output = { error };
        } else {
          try {
            output = await tool.handler(args);
          } catch (err) {
            error = err instanceof Error ? err.message : String(err);
            output = { error };
          }
        }

        const result: ToolResult = {
          toolCallId: tc.id,
          name: toolName,
          output,
          error,
        };
        results.push(result);
        allToolResults.push(result);

        // Add tool result to conversation
        messages.push({
          role: "tool",
          content: JSON.stringify(output),
          tool_call_id: tc.id,
          name: toolName,
        });
      }
    } else {
      // Grok gave a final answer — no more tool calls
      messages.push(assistantMessage);
      return {
        content: llmResult.content || "",
        toolCalls: allToolCalls,
        toolResults: allToolResults,
        tokensUsed: llmResult.tokensUsed,
        provider: llmResult.provider,
        model: llmResult.model,
        latencyMs: Date.now() - start,
        rounds: round + 1,
      };
    }
  }

  // Max rounds reached — return last content if any
  const lastAssistant = messages.filter((m) => m.role === "assistant").pop();
  return {
    content: lastAssistant?.content || "Max tool rounds reached without final answer.",
    toolCalls: allToolCalls,
    toolResults: allToolResults,
    provider: "xai",
    model: "grok-4-1-fast",
    latencyMs: Date.now() - start,
    rounds: maxToolRounds,
  };
}

// ── Internal: Call xAI with native tool support ────────────────

async function callGrokWithTools(
  messages: BrainMessage[],
  tools: Array<{ type: "function"; function: { name: string; description: string; parameters: unknown } }> | undefined,
  toolChoice: "auto" | "none" | { type: "function"; function: { name: string } },
  temperature: number,
  maxTokens: number,
  timeoutMs?: number
): Promise<{
  content: string | null;
  toolCalls: BrainMessage["tool_calls"];
  tokensUsed?: number;
  provider: string;
  model: string;
}> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY not set. Cannot use Grok Brain.");
  }

  const body: Record<string, unknown> = {
    model: "grok-4-1-fast",
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = toolChoice;
  }

  const controller = new AbortController();
  const timeout = timeoutMs || 30_000;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`xAI HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    const message = data.choices?.[0]?.message;

    return {
      content: message?.content || null,
      toolCalls: message?.tool_calls || undefined,
      tokensUsed: data.usage?.total_tokens,
      provider: "xai",
      model: "grok-4-1-fast",
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ── Convenience: Create a brain with standard tools ─────────────

export function createStandardBrain(): { registry: ToolRegistry; run: typeof runGrokBrain } {
  const registry = new ToolRegistry();

  // These will be populated by the caller with actual implementations
  return {
    registry,
    run: (system, user, reg, opts) => runGrokBrain(system, user, reg || registry, opts),
  };
}
