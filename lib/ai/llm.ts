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

  const groqKey = process.env.GROQ_API_KEY;
  const xaiKey = process.env.XAI_API_KEY;

  // Try Groq first (free tier, fast)
  if (groqKey) {
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
      });
      if (res.ok) {
        const data = await res.json();
        return {
          content: data.choices?.[0]?.message?.content || "",
          provider: "groq",
          model: "llama-3.3-70b-versatile",
          latencyMs: Date.now() - startTime,
          tokensUsed: data.usage?.total_tokens,
        };
      }
    } catch {
      // fall through to fallback
    }
  }

  // Fallback to xAI Grok
  if (xaiKey) {
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
      });
      if (res.ok) {
        const data = await res.json();
        return {
          content: data.choices?.[0]?.message?.content || "",
          provider: "xai",
          model: "grok-4-1-fast",
          latencyMs: Date.now() - startTime,
          tokensUsed: data.usage?.total_tokens,
        };
      }
    } catch {
      // fall through
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
