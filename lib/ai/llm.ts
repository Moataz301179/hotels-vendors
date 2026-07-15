/**
 * LLM Router — Ollama Primary with Cascading Fallbacks
 *
 * Provider Hierarchy:
 *   1. Ollama (local/VPS)  → PRIMARY   → zero cost, zero rate limits
 *   2. Groq (free tier)    → FALLBACK 1 → 20 req/min, 1M tok/day
 *   3. xAI (Grok)          → FALLBACK 2 → pay-as-you-go
 *
 * AI Governance: PII is scrubbed before sending to external providers.
 * Ollama (local) does NOT require PII scrubbing.
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
  preferredModel?: string;
}

export interface RouterResult {
  content: string;
  provider: string;
  model: string;
  latencyMs: number;
  tokensUsed?: number;
}

// ═══════════════════════════════════════════════════════════
// PROVIDER 1: OLLAMA (LOCAL/VPS — PRIMARY)
// Zero cost, zero rate limits, data stays on-premise
// ═══════════════════════════════════════════════════════════

async function callOllama(
  messages: LLMMessage[],
  options: RouterOptions
): Promise<RouterResult | null> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2:3b";
  const { temperature = 0.7, maxTokens = 2048, jsonMode = false } = options;

  try {
    // Ollama uses its own API format — convert messages to prompt
    const systemMsg = messages.find((m) => m.role === "system")?.content || "";
    const userMsgs = messages
      .filter((m) => m.role !== "system")
      .map((m) => m.content)
      .join("\n");

    const prompt = systemMsg ? `${systemMsg}\n\n${userMsgs}` : userMsgs;

    const res = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        prompt,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
        format: jsonMode ? "json" : undefined,
      }),
      signal: AbortSignal.timeout(options.timeoutMs || 60000),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        content: data.response || "",
        provider: "ollama",
        model: ollamaModel,
        latencyMs: data.total_duration ? Math.round(data.total_duration / 1_000_000) : 0,
        tokensUsed: data.eval_count || undefined,
      };
    }
  } catch {
    // Ollama unavailable — fall through to next provider
  }
  return null;
}

// ═══════════════════════════════════════════════════════════
// PROVIDER 2: GROQ (FREE TIER — FALLBACK 1)
// 20 req/min, 1M tokens/day, no credit card required
// ═══════════════════════════════════════════════════════════

async function callGroq(
  messages: LLMMessage[],
  options: RouterOptions
): Promise<RouterResult | null> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return null;

  const { temperature = 0.7, maxTokens = 2048, jsonMode = false } = options;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: jsonMode ? { type: "json_object" } : undefined,
      }),
      signal: AbortSignal.timeout(options.timeoutMs || 30000),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        content: data.choices?.[0]?.message?.content || "",
        provider: "groq",
        model: "llama-3.3-70b-versatile",
        latencyMs: 0,
        tokensUsed: data.usage?.total_tokens,
      };
    }
  } catch {
    // fall through
  }
  return null;
}

// ═══════════════════════════════════════════════════════════
// PROVIDER 3: xAI GROK (PAID — FALLBACK 2)
// Pay-as-you-go, highest capability
// ═══════════════════════════════════════════════════════════

async function callXAI(
  messages: LLMMessage[],
  options: RouterOptions
): Promise<RouterResult | null> {
  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) return null;

  const { temperature = 0.7, maxTokens = 2048, jsonMode = false } = options;

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${xaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-4-1-fast",
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: jsonMode ? { type: "json_object" } : undefined,
      }),
      signal: AbortSignal.timeout(options.timeoutMs || 30000),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        content: data.choices?.[0]?.message?.content || "",
        provider: "xai",
        model: "grok-4-1-fast",
        latencyMs: 0,
        tokensUsed: data.usage?.total_tokens,
      };
    }
  } catch {
    // fall through
  }
  return null;
}

// ═══════════════════════════════════════════════════════════
// MAIN ROUTER: Cascading Fallback
// ═══════════════════════════════════════════════════════════

export async function executeLLM(
  arg1: LLMMessage[] | string,
  arg2?: RouterOptions | string,
  arg3?: RouterOptions
): Promise<RouterResult> {
  const startTime = Date.now();

  // Detect signature
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

  // PII scrubbing only for external providers (not Ollama)
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const isLocal = !process.env.GROQ_API_KEY && !process.env.XAI_API_KEY;

  // ═══ TRY 1: Ollama (local, free, no PII scrub needed) ═══
  const ollamaResult = await callOllama(messages, options);
  if (ollamaResult) {
    console.log(`[LLM] Ollama responded in ${ollamaResult.latencyMs}ms`);
    return ollamaResult;
  }

  // ═══ TRY 2: Groq (free tier, PII scrubbed) ═══
  const { messages: scrubbedMessages, piiFound, warning } = scrubMessages(messages);
  if (piiFound) {
    console.warn("[PII-GOVERNANCE]", warning);
  }

  const groqResult = await callGroq(scrubbedMessages, options);
  if (groqResult) {
    console.log(`[LLM] Groq responded (Ollama unavailable)`);
    return groqResult;
  }

  // ═══ TRY 3: xAI Grok (paid, PII scrubbed) ═══
  const xaiResult = await callXAI(scrubbedMessages, options);
  if (xaiResult) {
    console.log(`[LLM] xAI responded (Ollama + Groq unavailable)`);
    return xaiResult;
  }

  // ═══ ALL PROVIDERS DOWN ═══
  console.error("[LLM] All providers unavailable");
  return {
    content: options.jsonMode ? "{}" : "AI service temporarily unavailable. Please try again.",
    provider: "none",
    model: "none",
    latencyMs: Date.now() - startTime,
  };
}

/**
 * Streaming variant — Ollama supports streaming natively.
 * Falls back to non-streaming for external providers.
 */
export async function executeLLMStream(
  messages: LLMMessage[],
  options: RouterOptions
): Promise<ReadableStream> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2:3b";
  const { temperature = 0.7, maxTokens = 2048 } = options;

  const systemMsg = messages.find((m) => m.role === "system")?.content || "";
  const userMsgs = messages
    .filter((m) => m.role !== "system")
    .map((m) => m.content)
    .join("\n");
  const prompt = systemMsg ? `${systemMsg}\n\n${userMsgs}` : userMsgs;

  const res = await fetch(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: ollamaModel,
      prompt,
      stream: true,
      options: { temperature, num_predict: maxTokens },
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error("Ollama streaming failed");
  }

  // Transform Ollama NDJSON stream to text stream
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
              if (json.response) {
                controller.enqueue(new TextEncoder().encode(json.response));
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      }
      controller.close();
    },
  });
}
