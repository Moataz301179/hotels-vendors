/**
 * Agent Workflow Orchestrator
 * DAG-based multi-agent execution engine
 * Runs agents in parallel or sequence with state sharing
 */

import { executeLLM } from "../model-router";
import { prisma } from "@/lib/prisma";

interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
  handler: (params: Record<string, unknown>) => Promise<unknown>;
}

interface AgentNode {
  id: string;
  agentType: string;
  systemPrompt: string;
  tools: string[]; // Tool names
  input: Record<string, unknown>;
  parallel?: boolean;
  dependsOn?: string[];
  timeoutMs?: number;
}

interface WorkflowState {
  status: "pending" | "running" | "completed" | "failed";
  results: Record<string, AgentResult>;
  errors: Record<string, string>;
  startedAt: Date;
  completedAt?: Date;
}

interface AgentResult {
  output: Record<string, unknown>;
  rawResponse: string;
  tokensUsed: number;
  latencyMs: number;
  model: string;
}

export class AgentWorkflow {
  private nodes: Map<string, AgentNode> = new Map();
  private state: WorkflowState = {
    status: "pending",
    results: {},
    errors: {},
    startedAt: new Date(),
  };
  private toolRegistry: Map<string, AgentTool> = new Map();
  private workflowId: string;

  constructor(workflowId: string) {
    this.workflowId = workflowId;
  }

  registerTool(tool: AgentTool) {
    this.toolRegistry.set(tool.name, tool);
  }

  addNode(node: AgentNode) {
    this.nodes.set(node.id, node);
  }

  async execute(): Promise<WorkflowState> {
    this.state.status = "running";
    const executed = new Set<string>();
    const inProgress = new Set<string>();

    // Topological execution: parallel where possible
    while (executed.size < this.nodes.size) {
      const ready = Array.from(this.nodes.values()).filter((node) => {
        if (executed.has(node.id) || inProgress.has(node.id)) return false;
        if (!node.dependsOn) return true;
        return node.dependsOn.every((dep) => executed.has(dep));
      });

      if (ready.length === 0 && inProgress.size === 0) {
        throw new Error("Workflow deadlock — circular dependency or missing node");
      }

      // Group parallel-ready nodes
      const parallelBatch = ready.filter((n) => n.parallel || ready.length === 1);
      const sequentialBatch = ready.filter((n) => !n.parallel && ready.length > 1);

      // Execute parallel batch
      if (parallelBatch.length > 0) {
        await Promise.all(
          parallelBatch.map((node) => {
            inProgress.add(node.id);
            return this.executeNode(node).finally(() => {
              inProgress.delete(node.id);
              executed.add(node.id);
            });
          })
        );
      }

      // Execute one sequential node
      if (sequentialBatch.length > 0) {
        const node = sequentialBatch[0];
        inProgress.add(node.id);
        await this.executeNode(node).finally(() => {
          inProgress.delete(node.id);
          executed.add(node.id);
        });
      }
    }

    this.state.status = Object.keys(this.state.errors).length > 0 ? "failed" : "completed";
    this.state.completedAt = new Date();

    // Persist to database
    await prisma.agentRun.create({
      data: {
        agentName: "workflow-orchestrator",
        taskType: "WORKFLOW_EXECUTION",
        taskName: this.workflowId,
        prompt: JSON.stringify(Array.from(this.nodes.values()).map(n => n.id)),
        status: this.state.status.toUpperCase() as "COMPLETED" | "FAILED",
        output: JSON.stringify(this.state.results),
        startedAt: this.state.startedAt,
        completedAt: this.state.completedAt,
        durationMs: this.state.completedAt ? this.state.completedAt.getTime() - this.state.startedAt.getTime() : 0,
      },
    }).catch(() => {});

    return this.state;
  }

  private async executeNode(node: AgentNode): Promise<void> {
    try {
      // Gather inputs from dependencies
      const context: Record<string, unknown> = { ...node.input };
      if (node.dependsOn) {
        for (const depId of node.dependsOn) {
          const depResult = this.state.results[depId];
          if (depResult) {
            context[`${depId}_output`] = depResult.output;
          }
        }
      }

      // Build prompt
      const contextStr = JSON.stringify(context, null, 2);
      const userPrompt = `Analyze the following data and produce a structured JSON response.

INPUT DATA:
${contextStr}

INSTRUCTIONS:
${node.systemPrompt}

You have access to the following tools. If you need to use a tool, call it by name with the required parameters.
Available tools: ${node.tools.join(", ") || "none"}

IMPORTANT: Your final response must be a valid JSON object with no markdown formatting.`;

      // Execute with tool support
      let result: AgentResult;
      
      // Try tool-augmented execution first
      const toolCalls = await this.detectToolCalls(node, contextStr);
      if (toolCalls.length > 0) {
        const toolResults = await Promise.all(
          toolCalls.map((tc) => this.executeToolCall(tc))
        );
        const augmentedPrompt = `${userPrompt}\n\nTOOL RESULTS:\n${JSON.stringify(toolResults, null, 2)}\n\nNow produce your final JSON response.`;
        
        const llmResult = await executeLLM(node.systemPrompt, augmentedPrompt, {
          temperature: 0.2,
          maxTokens: 2000,
          preferredModel: "xai", // Use Grok for agentic tasks
          timeoutMs: node.timeoutMs || 30000,
        });

        result = {
          output: this.parseJSON(llmResult.content),
          rawResponse: llmResult.content,
          tokensUsed: llmResult.tokensUsed || 0,
          latencyMs: llmResult.latencyMs,
          model: llmResult.model,
        };
      } else {
        // Direct LLM execution
        const llmResult = await executeLLM(node.systemPrompt, userPrompt, {
          temperature: 0.2,
          maxTokens: 2000,
          preferredModel: "xai",
          timeoutMs: node.timeoutMs || 30000,
        });

        result = {
          output: this.parseJSON(llmResult.content),
          rawResponse: llmResult.content,
          tokensUsed: llmResult.tokensUsed || 0,
          latencyMs: llmResult.latencyMs,
          model: llmResult.model,
        };
      }

      this.state.results[node.id] = result;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.state.errors[node.id] = msg;
      this.state.results[node.id] = {
        output: { error: msg },
        rawResponse: msg,
        tokensUsed: 0,
        latencyMs: 0,
        model: "error",
      };
    }
  }

  private async detectToolCalls(node: AgentNode, context: string): Promise<{ tool: string; params: Record<string, unknown> }[]> {
    if (node.tools.length === 0) return [];

    const toolPrompt = `Given this task and data, which tools do you need to call?
Available tools: ${node.tools.join(", ")}

If no tools are needed, respond with: NO_TOOLS

If tools are needed, respond with a JSON array:
[{"tool": "toolName", "params": {"param1": "value1"}}]

Task context: ${context.slice(0, 2000)}`;

    try {
      const result = await executeLLM(
        "You are a tool selection assistant. Select the minimum tools needed.",
        toolPrompt,
        { temperature: 0, maxTokens: 500, preferredModel: "xai" }
      );

      if (result.content.includes("NO_TOOLS")) return [];
      const parsed = this.parseJSON(result.content);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }

  private async executeToolCall(call: { tool: string; params: Record<string, unknown> }): Promise<{ tool: string; result: unknown }> {
    const tool = this.toolRegistry.get(call.tool);
    if (!tool) return { tool: call.tool, result: { error: `Tool ${call.tool} not found` } };
    
    try {
      const result = await tool.handler(call.params);
      return { tool: call.tool, result };
    } catch (error) {
      return { tool: call.tool, result: { error: String(error) } };
    }
  }

  private parseJSON(text: string): Record<string, unknown> {
    // Try to extract JSON from markdown code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const cleanText = codeBlockMatch ? codeBlockMatch[1].trim() : text.trim();
    
    try {
      return JSON.parse(cleanText);
    } catch {
      // Fallback: return as text field
      return { rawText: cleanText };
    }
  }

  getState(): WorkflowState {
    return this.state;
  }
}

// ── Pre-built tool definitions ─────────────────────────────────

export const FinancialTools: AgentTool[] = [
  {
    name: "calculate_ratios",
    description: "Calculate financial ratios from hotel financials",
    parameters: {
      revenue: { type: "number", description: "Annual revenue", required: true },
      profit: { type: "number", description: "Net profit", required: true },
      assets: { type: "number", description: "Total assets", required: true },
      liabilities: { type: "number", description: "Total liabilities", required: true },
    },
    handler: async (params) => {
      const { revenue, profit, assets, liabilities } = params as Record<string, number>;
      const equity = assets - liabilities;
      return {
        margin: revenue > 0 ? (profit / revenue) * 100 : 0,
        roa: assets > 0 ? (profit / assets) * 100 : 0,
        roe: equity > 0 ? (profit / equity) * 100 : 0,
        debtRatio: assets > 0 ? (liabilities / assets) * 100 : 0,
      };
    },
  },
  {
    name: "score_credit",
    description: "Run Hotels Vendors proprietary credit scoring engine",
    parameters: {
      financials: { type: "object", description: "Hotel financial data", required: true },
      profile: { type: "object", description: "Hotel profile", required: true },
      collateral: { type: "object", description: "Collateral info", required: true },
    },
    handler: async (params) => {
      const { HotelScoreEngine } = await import("@/lib/fintech/scoring/hotel-score-engine");
      return HotelScoreEngine.calculateScore(
        params.financials as any,
        params.profile as any,
        params.collateral as any,
        { sectorInflation: 12, avgPaymentDelayTrend: 5, tourismOccupancyRate: 65, seasonalFactor: 1.0 },
        undefined
      );
    },
  },
  {
    name: "query_market_data",
    description: "Query market intelligence from platform database",
    parameters: {
      governorate: { type: "string", description: "Governorate name", required: true },
      category: { type: "string", description: "Product category", required: false },
    },
    handler: async (params) => {
      const { governorate } = params as { governorate: string };
      // Query aggregated platform data
      const hotels = await prisma.hotel.count({ where: { governorate: { contains: governorate, mode: "insensitive" } } }).catch(() => 0);
      const orders = await prisma.order.count({ where: { hotel: { governorate: { contains: governorate, mode: "insensitive" } } } }).catch(() => 0);
      return { hotelCount: hotels, orderCount: orders, avgOrderValue: 0 };
    },
  },
];
