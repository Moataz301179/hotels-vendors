/**
 * Simplified LLM Wrapper — Extracted from lib/swarm/model-router.ts
 * Provides executeLLM for critical path modules without swarm dependency.
 * 
 * NOTE: This is a reduced version. The full swarm model-router with
 * circuit breaker, health tracking, and multi-provider orchestration
 * is archived in archive/swarm/ for future reference.
 */

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

/**
 * Execute LLM call via Groq (primary) or xAI fallback.
 * Stripped of swarm-specific circuit breaker and health tracking.
 */
export async function executeLLM(
  arg1: LLMMessage[] | string,
  arg2?: RouterOptions | string,
  arg3?: RouterOptions
): Promise<RouterResult> {
  const startTime = Date.now();

  // Detect signature: executeLLM(systemPrompt, userPrompt, options) vs executeLLM(messages, options)
  let messages: LLMMessage[];
  let options: RouterOptions;

  if (typeof arg1 === "string" && typeof arg2 === "string") {
    // Old signature: executeLLM(systemPrompt, userPrompt, options)
    messages = [
      { role: "system", content: arg1 },
      { role: "user", content: arg2 },
    ];
    options = arg3 || {};
  } else if (Array.isArray(arg1)) {
    // New signature: executeLLM(messages, options)
    messages = arg1;
    options = (arg2 as RouterOptions) || {};
  } else {
    throw new Error("Invalid executeLLM arguments");
  }

  const { temperature = 0.7, maxTokens = 2048, jsonMode = false } = options;

  const ollamaUrl = process.env.OLLAMA_URL || process.env.NEXT_PUBLIC_VPS_API_URL || process.env.VPS_API_URL;
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2:latest";

  // Primary: Ollama (Local/VPS - Zero Cost)
  if (ollamaUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(`${ollamaUrl.replace(/\/$/, "")}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ollamaModel,
          messages,
          options: {
            temperature,
            num_predict: maxTokens,
          },
          stream: false,
          format: jsonMode ? "json" : undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const content = data.message?.content || data.response || "";
        if (content.trim()) {
          return {
            content: content.trim(),
            provider: "ollama",
            model: ollamaModel,
            latencyMs: Date.now() - startTime,
          };
        }
      }
      console.error("[LLM Router] Ollama response not ok:", res.status);
    } catch (e) {
      console.error("[LLM Router] Ollama Error:", e);
    }
  }

  // Fallback: xAI Grok
  const xaiKey = process.env.XAI_API_KEY;
  if (xaiKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${xaiKey}`,
        },
        body: JSON.stringify({
          model: "grok-3-mini",
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";
        if (content.trim()) {
          return {
            content: content.trim(),
            provider: "xai",
            model: "grok-3-mini",
            latencyMs: Date.now() - startTime,
          };
        }
      }
    } catch (e) {
      console.error("[LLM Router] xAI Error:", e);
    }
  }

  // Ultimate fallback: return empty but structured
  return {
    content: jsonMode ? "{}" : "Service unavailable.",
    provider: "none",
    model: "none",
    latencyMs: Date.now() - startTime,
  };
}
