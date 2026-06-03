/**
 * Agent Executor — Autonomous Tool-Using Agent Loop
 *
 * Flow:
 *   1. Build system prompt with tool descriptions
 *   2. Call LLM → get reasoning + tool calls
 *   3. Execute tools
 *   4. Call LLM again with tool results → final answer
 *   5. Store result in memory
 *
 * This replaces the simple text-only executeLLM call in the scheduler.
 */

import { executeLLM, type RouterResult } from "./model-router";
import { buildToolPrompt, parseToolCalls, executeTool, type ToolResult } from "./toolkit";

const MAX_TOOL_ROUNDS = 3;

export interface AgentExecutionResult {
  content: string;
  toolResults: ToolResult[];
  provider: string;
  model: string;
  latencyMs: number;
  toolRounds: number;
}

/**
 * Execute an agent job with autonomous tool use.
 */
export async function executeAgentJob(params: {
  agentId: string;
  agentName: string;
  systemPrompt: string;
  userPrompt: string;
  tools: string[];
  memoryContext?: string | null;
  temperature?: number;
  maxTokens?: number;
}): Promise<AgentExecutionResult> {
  const start = Date.now();
  const toolResults: ToolResult[] = [];
  let toolRounds = 0;

  // Build enriched system prompt with tool descriptions
  const toolSection = buildToolPrompt(params.tools);
  const enrichedSystem = toolSection
    ? `${params.systemPrompt}\n\n${toolSection}\n\nWhen you need to use a tool, output exactly:\n\`\`\`tool_call\n{"tool": "tool_name", "params": {}}\n\`\`\``
    : params.systemPrompt;

  // First LLM call
  const memoryPrefix = params.memoryContext ? `[Previous Context]\n${params.memoryContext}\n\n` : "";
  const firstPrompt = `${memoryPrefix}[Task]\n${params.userPrompt}\n\nIf you need to use tools, output them now. Otherwise provide your final answer directly.`;

  const firstResult = await executeLLM(enrichedSystem, firstPrompt, {
    temperature: params.temperature ?? 0.3,
    maxTokens: params.maxTokens ?? 4096,
  });

  // Parse tool calls from response
  let { text: currentText, calls } = parseToolCalls(firstResult.content);

  // Tool execution loop
  while (calls.length > 0 && toolRounds < MAX_TOOL_ROUNDS) {
    toolRounds++;

    // Execute all tool calls in this round
    const roundResults: ToolResult[] = [];
    for (const call of calls) {
      const result = await executeTool(call, params.agentId);
      roundResults.push(result);
      toolResults.push(result);
    }

    // Build follow-up prompt with tool results
    const toolResultText = roundResults
      .map((r, i) => `[Tool Result ${i + 1}]\n${JSON.stringify(r, null, 2)}`)
      .join("\n\n");

    const followUpPrompt = `${currentText}\n\n${toolResultText}\n\nBased on these results, provide your final answer or make additional tool calls if needed.`;

    const followUpResult = await executeLLM(enrichedSystem, followUpPrompt, {
      temperature: params.temperature ?? 0.3,
      maxTokens: params.maxTokens ?? 4096,
    });

    const parsed = parseToolCalls(followUpResult.content);
    currentText = parsed.text;
    calls = parsed.calls;
  }

  const latencyMs = Date.now() - start;

  return {
    content: currentText,
    toolResults,
    provider: firstResult.provider,
    model: firstResult.model,
    latencyMs,
    toolRounds,
  };
}
