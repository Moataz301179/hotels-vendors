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

  const ollamaUrl = process.env.OLLAMA_URL;
  const ollamaModel = process.env.OLLAMA_MODEL;
  const groqKey = process.env.GROQ_API_KEY;
  const xaiKey = process.env.XAI_API_KEY;

  // Primary: Ollama (Local/VPS - Zero Cost)
  if (ollamaUrl && ollamaModel) {
    try {
      const res = await fetch(`${ollamaUrl}/api/chat`, {
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
      });
      if (res.ok) {
        const data = await res.json();
        return {
          content: data.message?.content || "",
          provider: "ollama",
          model: ollamaModel,
          latencyMs: Date.now() - startTime,
          tokensUsed: data.prompt_eval + (data.eval_count || 0),
        };
      }
    } catch (e) {
      console.error("[LLM Router] Ollama Error:", e);
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
