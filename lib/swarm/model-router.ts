/**
 * Swarm Model Router v3 — Ollama Primary Architecture
 * Ollama (local/VPS) → Groq (free tier) → OpenRouter (universal) → Kimi/xAI (if funded)
 * Circuit breaker pattern for resilience
 */

import { prisma } from "@/lib/prisma";

interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ModelConfig {
  provider: string;
  model: string;
  apiKey: string | undefined;
  baseUrl: string;
  isPrimary: boolean;
  isFallback: boolean;
  headers?: Record<string, string>;
  // Ollama uses different response shape
  isOllama?: boolean;
}

function buildModelConfigs(): ModelConfig[] {
  const configs: ModelConfig[] = [];
  const appUrl = process.env.APP_URL || "https://hotelsvendors.com";

  // ── 1. OLLAMA (Primary — local/VPS, zero cost) ──
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "phi4:latest";
  configs.push({
    provider: "ollama",
    model: ollamaModel,
    apiKey: undefined, // Ollama requires no API key
    baseUrl: `${ollamaUrl}/api/chat`,
    isPrimary: true,
    isFallback: false,
    isOllama: true,
  });

  // ── 2. GROQ (Free tier fallback — 20 req/min, 1M tok/day) ──
  if (process.env.GROQ_API_KEY) {
    configs.push({
      provider: "groq",
      model: "llama-3.3-70b-versatile",
      apiKey: process.env.GROQ_API_KEY,
      baseUrl: "https://api.groq.com/openai/v1/chat/completions",
      isPrimary: false,
      isFallback: true,
    });
  }

  // ── 3. OPENROUTER (Universal fallback, accepts $5-10 credits) ──
  if (process.env.OPENROUTER_API_KEY) {
    configs.push({
      provider: "openrouter",
      model: "meta-llama/llama-3.3-70b-instruct",
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: "https://openrouter.ai/api/v1/chat/completions",
      isPrimary: false,
      isFallback: true,
      headers: {
        "HTTP-Referer": appUrl,
        "X-Title": "Hotels Vendors Swarm",
      },
    });
  }

  // ── 4. KIMI (Funded fallback only) ──
  if (process.env.KIMI_API_KEY) {
    configs.push({
      provider: "kimi",
      model: "kimi-k2-6",
      apiKey: process.env.KIMI_API_KEY,
      baseUrl: "https://api.moonshot.ai/v1/chat/completions",
      isPrimary: false,
      isFallback: true,
    });
  }

  // ── 5. XAI/GROK (Funded fallback only) ──
  if (process.env.XAI_API_KEY) {
    configs.push({
      provider: "xai",
      model: "grok-4-1-fast",
      apiKey: process.env.XAI_API_KEY,
      baseUrl: "https://api.x.ai/v1/chat/completions",
      isPrimary: false,
      isFallback: true,
    });
  }

  return configs;
}

const MODELS = buildModelConfigs();

// Circuit breaker state (in-memory, per-process)
const circuitState = new Map<string, { failCount: number; lastFailAt: number; open: boolean }>();
const CIRCUIT_THRESHOLD = 3;
const CIRCUIT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

async function checkCircuit(provider: string): Promise<boolean> {
  const state = circuitState.get(provider);
  if (!state) return true;
  if (!state.open) return true;
  if (Date.now() - state.lastFailAt > CIRCUIT_TIMEOUT_MS) {
    state.open = false;
    state.failCount = 0;
    return true;
  }
  return false;
}

function recordFailure(provider: string) {
  const state = circuitState.get(provider) || { failCount: 0, lastFailAt: 0, open: false };
  state.failCount++;
  state.lastFailAt = Date.now();
  if (state.failCount >= CIRCUIT_THRESHOLD) {
    state.open = true;
    console.error(`[CircuitBreaker] ${provider} OPENED after ${state.failCount} failures`);
  }
  circuitState.set(provider, state);
}

function recordSuccess(provider: string) {
  const state = circuitState.get(provider);
  if (state) {
    state.failCount = 0;
    state.open = false;
  }
}

async function updateModelHealth(provider: string, model: string, success: boolean, latencyMs: number) {
  try {
    await prisma.modelHealth.upsert({
      where: { provider_model: { provider, model } },
      update: {
        status: success ? "HEALTHY" : "DEGRADED",
        lastSuccessAt: success ? new Date() : undefined,
        lastFailureAt: success ? undefined : new Date(),
        failCount: success ? 0 : { increment: 1 },
        totalCalls: { increment: 1 },
        avgLatencyMs: latencyMs, // Simplified — could average with existing
      },
      create: {
        provider,
        model,
        status: success ? "HEALTHY" : "DEGRADED",
        lastSuccessAt: success ? new Date() : undefined,
        lastFailureAt: success ? undefined : new Date(),
        isPrimary: provider === "ollama",
        isFallback: provider !== "ollama",
      },
    });
  } catch (e) {
    // Silently ignore DB errors — LLM call must not fail because of metrics
  }
}

async function callProvider(
  config: ModelConfig,
  messages: LLMMessage[],
  temperature: number,
  maxTokens: number,
  timeoutMs?: number
): Promise<{ content: string; tokensUsed?: number; provider: string }> {
  const start = Date.now();
  const timeout = timeoutMs || DEFAULT_TIMEOUTS[config.provider] || 30_000;

  // Ollama uses streaming API by default; request non-streaming
  const body = config.isOllama
    ? {
        model: config.model,
        messages,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      }
    : {
        model: config.model,
        messages,
        temperature,
        max_tokens: maxTokens,
      };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(config.baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${config.provider} HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    const latency = Date.now() - start;

    recordSuccess(config.provider);
    await updateModelHealth(config.provider, config.model, true, latency);

    // Ollama response shape: { message: { role, content }, done, ... }
    // OpenAI-compatible: { choices: [{ message: { content } }], usage: { total_tokens } }
    const content = config.isOllama
      ? data.message?.content || ""
      : data.choices?.[0]?.message?.content || "";

    const tokensUsed = config.isOllama
      ? (data.prompt_eval_count || 0) + (data.eval_count || 0)
      : data.usage?.total_tokens;

    return {
      content,
      tokensUsed,
      provider: config.provider,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`${config.provider} request timed out after ${timeout}ms`);
    }
    throw error;
  }
}

export interface RouterOptions {
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  preferredModel?: "ollama" | "groq" | "openrouter" | "kimi" | "xai" | "auto";
}

// Default timeouts per provider
const DEFAULT_TIMEOUTS: Record<string, number> = {
  ollama: 120_000,   // 2 min — local models can be slow on CPU
  groq: 30_000,      // 30 sec — fast API
  openrouter: 45_000, // 45 sec
  kimi: 30_000,
  xai: 30_000,
};

export interface RouterResult {
  content: string;
  tokensUsed?: number;
  provider: string;
  model: string;
  latencyMs: number;
  fallbackUsed: boolean;
}

/**
 * Execute an LLM call with automatic fallback chain
 */
export async function executeLLM(
  systemPrompt: string,
  userPrompt: string,
  options: RouterOptions = {}
): Promise<RouterResult> {
  const { temperature = 0.3, maxTokens = 4096, preferredModel = "auto" } = options;
  const start = Date.now();

  const messages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  // Refresh configs in case env vars changed
  const currentModels = buildModelConfigs();

  // Determine order
  let order: ModelConfig[];
  if (preferredModel !== "auto") {
    order = currentModels
      .filter((m) => m.provider === preferredModel)
      .concat(currentModels.filter((m) => m.provider !== preferredModel));
  } else {
    order = currentModels.filter((m) => m.isPrimary).concat(currentModels.filter((m) => m.isFallback));
  }

  let lastError: Error | null = null;

  for (const model of order) {
    // Ollama doesn't need an API key; others do
    if (model.provider !== "ollama" && !model.apiKey) {
      console.warn(`[ModelRouter] ${model.provider} API key missing, skipping`);
      continue;
    }

    const circuitOpen = !(await checkCircuit(model.provider));
    if (circuitOpen) {
      console.warn(`[ModelRouter] ${model.provider} circuit open, skipping`);
      continue;
    }

    try {
      const result = await callProvider(model, messages, temperature, maxTokens, options.timeoutMs);
      const latency = Date.now() - start;

      return {
        content: result.content,
        tokensUsed: result.tokensUsed,
        provider: result.provider,
        model: model.model,
        latencyMs: latency,
        fallbackUsed: !model.isPrimary,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      recordFailure(model.provider);
      await updateModelHealth(model.provider, model.model, false, Date.now() - start);
      console.error(`[ModelRouter] ${model.provider} failed:`, lastError.message);
    }
  }

  throw lastError || new Error(
    "All LLM providers failed. Ensure Ollama is running (docker compose up ollama) " +
    "or configure a fallback: GROQ_API_KEY, OPENROUTER_API_KEY, KIMI_API_KEY, or XAI_API_KEY."
  );
}

/**
 * Quick health check for all models
 */
export async function checkModelHealth(): Promise<
  Array<{ provider: string; model: string; healthy: boolean; circuitOpen: boolean }>
> {
  const currentModels = buildModelConfigs();
  return currentModels.map((m) => ({
    provider: m.provider,
    model: m.model,
    healthy: !circuitState.get(m.provider)?.open,
    circuitOpen: !!circuitState.get(m.provider)?.open,
  }));
}

/**
 * Pull a model into Ollama (call this during VPS setup)
 */
export async function pullOllamaModel(model: string = process.env.OLLAMA_MODEL || "phi4:latest"): Promise<boolean> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  try {
    const res = await fetch(`${ollamaUrl}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, stream: false }),
    });
    if (!res.ok) {
      console.error(`[Ollama] Failed to pull ${model}:`, await res.text());
      return false;
    }
    console.log(`[Ollama] Successfully pulled ${model}`);
    return true;
  } catch (e) {
    console.error(`[Ollama] Pull error for ${model}:`, e);
    return false;
  }
}

/**
 * List available Ollama models
 */
export async function listOllamaModels(): Promise<Array<{ name: string; size: string }>> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  try {
    const res = await fetch(`${ollamaUrl}/api/tags`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map((m: any) => ({
      name: m.name,
      size: m.size ? `${Math.round(m.size / 1024 / 1024)}MB` : "unknown",
    }));
  } catch {
    return [];
  }
}
