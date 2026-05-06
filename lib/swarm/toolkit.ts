/**
 * Swarm Toolkit — Agent Tool Execution Engine
 * Maps every agent tool name to an actual executable function.
 * Enables autonomous tool use by swarm agents.
 */

import { prisma } from "@/lib/prisma";
import { getMemoryContext, storeMemory } from "./memory";
import { recordSwarmEvent } from "./monitoring";
import { addSwarmJob } from "./scheduler";
import {
  OPENCLAW_AUTOMATION_URL,
  OPENCLAW_GATEWAY_URL,
} from "@/lib/integrations/openclaw";

// ── Tool Definitions (for LLM prompt construction) ──

export interface ToolParam {
  type: string;
  description: string;
  required?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, ToolParam>;
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "openclaw_navigate",
    description: "Navigate a web browser to a specific URL. Returns page content and optional screenshot.",
    parameters: {
      url: { type: "string", description: "Full URL to navigate to", required: true },
      wait_for: { type: "string", description: "CSS selector to wait for before returning", required: false },
      screenshot: { type: "boolean", description: "Capture a screenshot", required: false },
      timeout: { type: "number", description: "Timeout in milliseconds (default 30000)", required: false },
    },
  },
  {
    name: "openclaw_extract",
    description: "Extract structured data from a webpage using CSS selectors.",
    parameters: {
      url: { type: "string", description: "URL to extract from", required: true },
      selectors: { type: "object", description: "Map of field names to CSS selectors", required: true },
      wait_for: { type: "string", description: "CSS selector to wait for", required: false },
      screenshot: { type: "boolean", description: "Capture a screenshot", required: false },
    },
  },
  {
    name: "openclaw_fill",
    description: "Fill out a web form and optionally submit it.",
    parameters: {
      url: { type: "string", description: "URL containing the form", required: true },
      fields: { type: "object", description: "Map of field selectors to values", required: true },
      submit_selector: { type: "string", description: "CSS selector for the submit button", required: false },
      wait_for: { type: "string", description: "CSS selector to wait for after submission", required: false },
    },
  },
  {
    name: "openclaw_search",
    description: "Perform a web search and return results.",
    parameters: {
      query: { type: "string", description: "Search query", required: true },
      max_results: { type: "number", description: "Maximum results to return (default 10)", required: false },
    },
  },
  {
    name: "openclaw_deep_scrape",
    description: "Deep scrape a paginated listing page. Extracts multiple items with structured fields.",
    parameters: {
      url: { type: "string", description: "URL to scrape", required: true },
      item_selector: { type: "string", description: "CSS selector for each item row/card", required: true },
      fields: { type: "object", description: "Map of field names to CSS selectors (relative to item)", required: true },
      max_pages: { type: "number", description: "Maximum pages to scrape (default 5)", required: false },
      next_selector: { type: "string", description: "CSS selector for pagination next button", required: false },
    },
  },
  {
    name: "memory_read",
    description: "Read previous memories and context for this agent.",
    parameters: {
      query: { type: "string", description: "Search query for memory retrieval", required: true },
      limit: { type: "number", description: "Maximum memories to retrieve (default 5)", required: false },
    },
  },
  {
    name: "memory_write",
    description: "Store a new memory for this agent.",
    parameters: {
      content: { type: "string", description: "Content to store", required: true },
      category: { type: "string", description: "Memory category (e.g. lead, strategy, market_signal)", required: false },
      memory_type: { type: "string", description: "Type: OBSERVATION, ACTION_PLAN, LESSON", required: false },
    },
  },
  {
    name: "database_query",
    description: "Query the platform database for hotels, suppliers, orders, or leads. READ-ONLY.",
    parameters: {
      entity: { type: "string", description: "Entity type: hotel, supplier, order, lead, product", required: true },
      filters: { type: "object", description: "Filter conditions as key-value pairs", required: false },
      limit: { type: "number", description: "Maximum records (default 20)", required: false },
    },
  },
  {
    name: "job_assign",
    description: "Assign a new job to another agent or squad.",
    parameters: {
      agent_id: { type: "string", description: "Target agent ID", required: true },
      job_type: { type: "string", description: "Type of job", required: true },
      instructions: { type: "string", description: "Detailed instructions for the job", required: true },
      priority: { type: "number", description: "Priority 1-10 (default 5)", required: false },
    },
  },
  {
    name: "event_log",
    description: "Log a platform event for monitoring and auditing.",
    parameters: {
      event: { type: "string", description: "Event name", required: true },
      level: { type: "string", description: "Level: INFO, WARNING, ERROR", required: true },
      details: { type: "object", description: "Additional details", required: false },
    },
  },
  {
    name: "email_send",
    description: "Send an email notification.",
    parameters: {
      to: { type: "string", description: "Recipient email", required: true },
      subject: { type: "string", description: "Email subject", required: true },
      body: { type: "string", description: "Email body (HTML or text)", required: true },
    },
  },
  {
    name: "whatsapp_send",
    description: "Send a WhatsApp message.",
    parameters: {
      to: { type: "string", description: "Recipient phone number", required: true },
      message: { type: "string", description: "Message text", required: true },
    },
  },
];

// ── Tool Call Interface ──

export interface ToolCall {
  tool: string;
  params: Record<string, unknown>;
}

export interface ToolResult {
  success: boolean;
  data: unknown;
  error?: string;
  durationMs?: number;
}

// ── Prompt Builder ──

export function buildToolPrompt(tools: string[]): string {
  const relevant = TOOL_DEFINITIONS.filter((t) => tools.includes(t.name));
  if (relevant.length === 0) return "";

  const lines = [
    "",
    "=== AVAILABLE TOOLS ===",
    "You have access to the following tools. When you need to use a tool, output a JSON block like this:",
    "",
    '```tool_call\n{\n  "tool": "tool_name",\n  "params": { "param1": "value1" }\n}\n```',
    "",
    "You may call multiple tools in sequence. After each tool executes, you will see the result. Then provide your final answer.",
    "",
  ];

  for (const tool of relevant) {
    lines.push(`TOOL: ${tool.name}`);
    lines.push(`  Description: ${tool.description}`);
    lines.push("  Parameters:");
    for (const [name, param] of Object.entries(tool.parameters)) {
      const req = param.required ? " (required)" : " (optional)";
      lines.push(`    - ${name}: ${param.type}${req} — ${param.description}`);
    }
    lines.push("");
  }

  lines.push("=== END TOOLS ===");
  return lines.join("\n");
}

// ── Tool Execution ──

export async function executeTool(call: ToolCall, agentId: string): Promise<ToolResult> {
  const start = Date.now();
  try {
    switch (call.tool) {
      case "openclaw_navigate":
        return await executeOpenClawNavigate(call.params);
      case "openclaw_extract":
        return await executeOpenClawExtract(call.params);
      case "openclaw_fill":
        return await executeOpenClawFill(call.params);
      case "openclaw_search":
        return await executeOpenClawSearch(call.params);
      case "openclaw_deep_scrape":
        return await executeOpenClawDeepScrape(call.params);
      case "memory_read":
        return await executeMemoryRead(call.params, agentId);
      case "memory_write":
        return await executeMemoryWrite(call.params, agentId);
      case "database_query":
        return await executeDatabaseQuery(call.params);
      case "job_assign":
        return await executeJobAssign(call.params);
      case "event_log":
        return await executeEventLog(call.params);
      case "email_send":
        return await executeEmailSend(call.params);
      case "whatsapp_send":
        return await executeWhatsAppSend(call.params);
      default:
        return { success: false, data: null, error: `Unknown tool: ${call.tool}` };
    }
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    return { success: false, data: null, error: err, durationMs: Date.now() - start };
  }
}

// ── OpenClaw Automation Tools ──

async function executeOpenClawNavigate(params: Record<string, unknown>): Promise<ToolResult> {
  const url = String(params.url);
  const res = await fetch(`${OPENCLAW_AUTOMATION_URL}/navigate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      wait_for: params.wait_for || undefined,
      screenshot: params.screenshot || false,
      timeout: params.timeout || 30000,
    }),
    signal: AbortSignal.timeout(60000),
  });
  const data = await res.json();
  return { success: res.ok, data, durationMs: 0 };
}

async function executeOpenClawExtract(params: Record<string, unknown>): Promise<ToolResult> {
  const res = await fetch(`${OPENCLAW_AUTOMATION_URL}/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: params.url,
      selectors: params.selectors,
      wait_for: params.wait_for || undefined,
      screenshot: params.screenshot || false,
      timeout: params.timeout || 30000,
    }),
    signal: AbortSignal.timeout(60000),
  });
  const data = await res.json();
  return { success: res.ok, data, durationMs: 0 };
}

async function executeOpenClawFill(params: Record<string, unknown>): Promise<ToolResult> {
  const res = await fetch(`${OPENCLAW_AUTOMATION_URL}/fill-form`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: params.url,
      fields: params.fields,
      submit_selector: params.submit_selector || undefined,
      wait_for: params.wait_for || undefined,
      timeout: params.timeout || 30000,
    }),
    signal: AbortSignal.timeout(60000),
  });
  const data = await res.json();
  return { success: res.ok, data, durationMs: 0 };
}

async function executeOpenClawSearch(params: Record<string, unknown>): Promise<ToolResult> {
  const res = await fetch(`${OPENCLAW_AUTOMATION_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: params.query,
      max_results: params.max_results || 10,
    }),
    signal: AbortSignal.timeout(30000),
  });
  const data = await res.json();
  return { success: res.ok, data, durationMs: 0 };
}

async function executeOpenClawDeepScrape(params: Record<string, unknown>): Promise<ToolResult> {
  const res = await fetch(`${OPENCLAW_AUTOMATION_URL}/deep-scrape`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: params.url,
      item_selector: params.item_selector,
      fields: params.fields,
      pagination: params.next_selector
        ? { next_selector: params.next_selector, max_pages: params.max_pages || 5 }
        : undefined,
      timeout: params.timeout || 45000,
    }),
    signal: AbortSignal.timeout(120000),
  });
  const data = await res.json();
  return { success: res.ok, data, durationMs: 0 };
}

// ── Memory Tools ──

async function executeMemoryRead(params: Record<string, unknown>, agentId: string): Promise<ToolResult> {
  const query = String(params.query);
  const limit = Number(params.limit) || 5;
  const context = await getMemoryContext(agentId, query, { limit });
  return { success: true, data: { memories: context }, durationMs: 0 };
}

async function executeMemoryWrite(params: Record<string, unknown>, agentId: string): Promise<ToolResult> {
  await storeMemory({
    agentId,
    agentName: agentId,
    content: String(params.content),
    memoryType: (params.memory_type as "FACT" | "INSIGHT" | "STRATEGY" | "LEAD" | "SUPPLIER_PROFILE") || "FACT",
    category: (params.category as string) || "general",
  });
  return { success: true, data: { stored: true }, durationMs: 0 };
}

// ── Database Query (Read-Only) ──

async function executeDatabaseQuery(params: Record<string, unknown>): Promise<ToolResult> {
  const entity = String(params.entity);
  const filters = (params.filters as Record<string, unknown>) || {};
  const limit = Number(params.limit) || 20;

  let data: unknown;
  switch (entity) {
    case "hotel":
      data = await prisma.hotel.findMany({ where: filters, take: limit });
      break;
    case "supplier":
      data = await prisma.supplier.findMany({ where: filters, take: limit });
      break;
    case "order":
      data = await prisma.order.findMany({ where: filters, take: limit, orderBy: { createdAt: "desc" } });
      break;
    case "lead":
      data = await prisma.lead.findMany({ where: filters, take: limit, orderBy: { createdAt: "desc" } });
      break;
    case "product":
      data = await prisma.product.findMany({ where: filters, take: limit });
      break;
    default:
      return { success: false, data: null, error: `Unknown entity: ${entity}` };
  }

  return { success: true, data, durationMs: 0 };
}

// ── Job Assignment ──

async function executeJobAssign(params: Record<string, unknown>): Promise<ToolResult> {
  const agentId = String(params.agent_id);
  const jobType = String(params.job_type);
  const instructions = String(params.instructions);
  const priority = Number(params.priority) || 5;

  // Find agent definition
  const { getAgentById } = await import("./agents");
  const agent = getAgentById(agentId);
  if (!agent) {
    return { success: false, data: null, error: `Agent not found: ${agentId}` };
  }

  const job = await addSwarmJob(
    {
      jobType: jobType as any,
      agentId: agent.id,
      agentName: agent.name,
      squad: agent.squad,
      systemPrompt: agent.systemPrompt,
      userPrompt: instructions,
      requiresApproval: agent.requiresApproval,
      memoryCategory: agent.memoryCategory,
    },
    { priority }
  );

  return { success: true, data: { jobId: job.id, assignedTo: agentId }, durationMs: 0 };
}

// ── Event Logging ──

async function executeEventLog(params: Record<string, unknown>): Promise<ToolResult> {
  await recordSwarmEvent(
    String(params.event),
    (params.level as "INFO" | "WARNING" | "ERROR") || "INFO",
    (params.details as Record<string, unknown>) || {}
  );
  return { success: true, data: { logged: true }, durationMs: 0 };
}

// ── Communications ──

async function executeEmailSend(params: Record<string, unknown>): Promise<ToolResult> {
  const { sendEmail } = await import("@/lib/notifications/email");
  await sendEmail({
    to: [String(params.to)],
    subject: String(params.subject),
    html: String(params.body),
  });
  return { success: true, data: { sent: true }, durationMs: 0 };
}

async function executeWhatsAppSend(params: Record<string, unknown>): Promise<ToolResult> {
  const { sendWhatsApp } = await import("@/lib/integrations/whatsapp");
  await sendWhatsApp(
    { to: String(params.to), body: String(params.message) },
    { agentId: "swarm", agentName: "Swarm Agent" }
  );
  return { success: true, data: { sent: true }, durationMs: 0 };
}

// ── Tool Call Parser ──

export function parseToolCalls(content: string): { text: string; calls: ToolCall[] } {
  const calls: ToolCall[] = [];
  const toolBlockRegex = /```tool_call\s*\n([\s\S]*?)\n```/g;
  let match;
  let cleaned = content;

  while ((match = toolBlockRegex.exec(content)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (parsed.tool && typeof parsed.tool === "string") {
        calls.push({ tool: parsed.tool, params: parsed.params || {} });
        cleaned = cleaned.replace(match[0], "");
      }
    } catch {
      // Invalid JSON in tool block — ignore
    }
  }

  return { text: cleaned.trim(), calls };
}
