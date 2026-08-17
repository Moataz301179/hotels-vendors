/**
 * LLM Router — Transparent Multi-Provider with Subscription Gating
 *
 * Users NEVER see which model/provider is used.
 * The backend selects the best model based on:
 *   1. Task complexity (simple → cheap model, complex → powerful model)
 *   2. Available credits (subscription balance)
 *   3. Provider health (cascade on failure)
 *
 * Provider Hierarchy:
 *   1. Ollama (local)        → Simple tasks, zero cost
 *   2. OpenRouter (paid)     → Complex tasks, pay-per-token
 *   3. Groq (free tier)      → Fallback
 *   4. xAI (paid)            → Ultimate fallback
 *
 * Subscription Model:
 *   - User pays EGP 2,500/month → gets AI credits
 *   - Each AI action costs credits (token-based)
 *   - Backend deducts credits transparently
 */

import { scrubMessages } from "@/lib/ai/pii-scrubber";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface RouterOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  timeoutMs?: number;
  taskComplexity?: "simple" | "medium" | "complex";
}

export interface RouterResult {
  content: string;
  latencyMs: number;
  tokensUsed?: number;
  creditsCost: number;
  model?: string;
  provider?: string;
}

// ═══════════════════════════════════════════════════════════
// CREDIT COST PER TASK (in tokens, not money)
// ═══════════════════════════════════════════════════════════

const CREDIT_COSTS = {
  simple: 1,    // Quick questions, suggestions
  medium: 3,    // Analysis, summaries
  complex: 5,   // Full reports, code generation, strategy
} as const;

function estimateComplexity(messages: LLMMessage[]): "simple" | "medium" | "complex" {
  const totalChars = messages.reduce((a, m) => a + m.content.length, 0);
  const hasSystemPrompt = messages.some((m) => m.role === "system");
  if (totalChars > 2000 || hasSystemPrompt) return "complex";
  if (totalChars > 500) return "medium";
  return "simple";
}

// ═══════════════════════════════════════════════════════════
// PROVIDER 1: OLLAMA (LOCAL — SIMPLE TASKS)
// ═══════════════════════════════════════════════════════════

async function callOllama(
  messages: LLMMessage[],
  options: RouterOptions
): Promise<RouterResult | null> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2:3b";
  const { temperature = 0.7, maxTokens = 1024, jsonMode = false } = options;

  try {
    const systemMsg = messages.find((m) => m.role === "system")?.content || "";
    const userMsgs = messages.filter((m) => m.role !== "system").map((m) => m.content).join("\n");
    const prompt = systemMsg ? `${systemMsg}\n\n${userMsgs}` : userMsgs;

    const res = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        prompt,
        stream: false,
        options: { temperature, num_predict: maxTokens },
        format: jsonMode ? "json" : undefined,
      }),
      signal: AbortSignal.timeout(options.timeoutMs || 60000),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        content: data.response || "",
        latencyMs: data.total_duration ? Math.round(data.total_duration / 1_000_000) : 0,
        tokensUsed: data.eval_count || undefined,
        creditsCost: CREDIT_COSTS[options.taskComplexity || "simple"],
      };
    }
  } catch { /* fall through */ }
  return null;
}

// ═══════════════════════════════════════════════════════════
// PROVIDER 2: OPENROUTER (PAID — COMPLEX TASKS)
// Pay-per-token, 200+ models, transparent routing
// ═══════════════════════════════════════════════════════════

async function callOpenRouter(
  messages: LLMMessage[],
  options: RouterOptions
): Promise<RouterResult | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const { temperature = 0.7, maxTokens = 2048, jsonMode = false } = options;

  // Select model based on complexity
  const model = options.taskComplexity === "complex"
    ? "anthropic/claude-3-haiku"        // Best quality for complex
    : options.taskComplexity === "medium"
    ? "meta-llama/llama-3.1-8b-instruct" // Good balance
    : "meta-llama/llama-3.2-3b-instruct"; // Cheap for simple

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://hotelsvendors.com",
        "X-Title": "HotelsVendors AI",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: jsonMode ? { type: "json_object" } : undefined,
      }),
      signal: AbortSignal.timeout(options.timeoutMs || 30000),
    });

    if (res.ok) {
      const data = await res.json();
      const tokensUsed = data.usage?.total_tokens || 0;
      return {
        content: data.choices?.[0]?.message?.content || "",
        latencyMs: 0,
        tokensUsed,
        creditsCost: Math.max(1, Math.ceil(tokensUsed / 1000)), // 1 credit per 1K tokens
      };
    }
  } catch { /* fall through */ }
  return null;
}

// ═══════════════════════════════════════════════════════════
// PROVIDER 3: GROQ (FREE TIER — FALLBACK)
// ═══════════════════════════════════════════════════════════

async function callGroq(
  messages: LLMMessage[],
  options: RouterOptions
): Promise<RouterResult | null> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return null;

  const { temperature = 0.7, maxTokens = 1024, jsonMode = false } = options;
  const model = process.env.OPENROUTER_MODEL || "llama-3.3-70b-versatile";

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: jsonMode? { type: "json_object" } : undefined,
      }),
      signal: AbortSignal.timeout(options.timeoutMs || 15000),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        content: data.choices?.[0]?.message?.content || "",
        latencyMs: 0,
        tokensUsed: data.usage?.total_tokens,
        creditsCost: CREDIT_COSTS[options.taskComplexity || "simple"],
      };
    }
  } catch { /* fall through */ }
  return null;
}

// ═══════════════════════════════════════════════════════════
// MAIN ROUTER
// ═══════════════════════════════════════════════════════════

export async function executeLLM(
  arg1: LLMMessage[] | string,
  arg2?: RouterOptions | string,
  arg3?: RouterOptions
): Promise<RouterResult> {
  const startTime = Date.now();

  let messages: LLMMessage[];
  let options: RouterOptions;

  if (typeof arg1 === "string" && typeof arg2 === "string") {
    messages = [
      { role: "system", content: arg1 },
      { role: "user", content: arg2 },
    ];
    options = arg3 || {};
  } else if (Array.isArray(arg1)) {
    messages = arg1;
    options = (arg2 as RouterOptions) || {};
  } else {
    throw new Error("Invalid executeLLM arguments");
  }

  // Auto-detect complexity if not specified
  if (!options.taskComplexity) {
    options.taskComplexity = estimateComplexity(messages);
  }

  // PII scrubbing for external providers
  const { messages: rawScrubbed, piiFound, warning } = scrubMessages(messages);
  const scrubbed = rawScrubbed as LLMMessage[];
  if (piiFound) console.warn("[PII-GOVERNANCE]", warning);

  // ═══ TRY 1: Ollama (local, free) ═══
  const ollama = await callOllama(messages, options);
  if (ollama) {
    console.log(`[LLM] Ollama → ${options.taskComplexity} task → ${ollama.latencyMs}ms`);
    return ollama;
  }

  // ═══ TRY 2: OpenRouter (paid, complex tasks) ═══
  const openrouter = await callOpenRouter(scrubbed, options);
  if (openrouter) {
    console.log(`[LLM] OpenRouter → ${options.taskComplexity} task → ${openrouter.creditsCost} credits`);
    return openrouter;
  }

  // ═══ TRY 3: Groq (free tier) ═══
  const groq = await callGroq(scrubbed, options);
  if (groq) {
    console.log(`[LLM] Groq → ${options.taskComplexity} task → fallback`);
    return groq;
  }

  // ═══ ALL DOWN ═══
  console.error("[LLM] All providers unavailable");
  return {
    content: options.jsonMode ? "{}" : "AI service temporarily unavailable.",
    latencyMs: Date.now() - startTime,
    creditsCost: 0,
  };
}

/**
 * Streaming — Ollama only
 */
export async function executeLLMStream(
  messages: LLMMessage[],
  options: RouterOptions
): Promise<ReadableStream> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2:3b";
  const { temperature = 0.7, maxTokens = 1024 } = options;

  const systemMsg = messages.find((m) => m.role === "system")?.content || "";
  const userMsgs = messages.filter((m) => m.role !== "system").map((m) => m.content).join("\n");
  const prompt = systemMsg ? `${systemMsg}\n\n${userMsgs}` : userMsgs;

  const res = await fetch(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: ollamaModel, prompt, stream: true, options: { temperature, num_predict: maxTokens } }),
  });

  if (!res.ok || !res.body) throw new Error("Ollama streaming failed");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.trim()) {
            try {
              const json = JSON.parse(line);
              if (json.response) controller.enqueue(new TextEncoder().encode(json.response));
            } catch { /* skip */ }
          }
        }
      }
      controller.close();
    },
  });
}
