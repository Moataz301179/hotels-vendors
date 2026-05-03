/**
 * Swarm Model Router v4 — Grok Primary Architecture
 * xAI Grok (fast/cheap) → Ollama (local/embeddings) → OpenRouter (universal backup)
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
  isOllama?: boolean;
  isEmbedding?: boolean;
}

function buildModelConfigs(): ModelConfig[] {
  const configs: ModelConfig[] = [];
  const appUrl = process.env.APP_URL || "https://hotelsvendors.com";

  // ── 1. XAI GROK (Primary — fast, cheap reasoning, $10 credit) ──
  if (process.env.XAI_API_KEY) {
    configs.push({
      provider: "xai",
      model: "grok-4-1-fast",
      apiKey: process.env.XAI_API_KEY,
      baseUrl: "https://api.x.ai/v1/chat/completions",
      isPrimary: true,
      isFallback: false,
    });
  }

  // ── 2. OLLAMA (Local fallback + embeddings — zero cost) ──
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2:3b";
  configs.push({
    provider: "ollama",
    model: ollamaModel,
    apiKey: undefined,
    baseUrl: `${ollamaUrl}/api/chat`,
    isPrimary: false,
    isFallback: true,
    isOllama: true,
  });

  // ── 3. GROQ (Free tier backup — 20 req/min, 1M tok/day) ──
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

  // ── 4. OPENROUTER (Universal backup, accepts $5-10 credits) ──
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

  // ── 5. KIMI (Legacy fallback — retire if Grok stable) ──
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

  return configs;
}

const MODELS = buildModelConfigs();

// Embedding config (Ollama only — free, local)
function buildEmbeddingConfig(): ModelConfig | null {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const embedModel = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";
  return {
    provider: "ollama",
    model: embedModel,
    apiKey: undefined,
    baseUrl: `${ollamaUrl}/api/embeddings`,
    isPrimary: true,
    isFallback: false,
    isOllama: true,
    isEmbedding: true,
  };
}

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
        avgLatencyMs: latencyMs,
      },
      create: {
        provider,
        model,
        status: success ? "HEALTHY" : "DEGRADED",
        lastSuccessAt: success ? new Date() : undefined,
        lastFailureAt: success ? undefined : new Date(),
        isPrimary: provider === "xai",
        isFallback: provider !== "xai",
      },
    });
  } catch (e) {
    // Silently ignore DB errors
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

    const content = config.isOllama
      ? data.message?.content || ""
      : data.choices?.[0]?.message?.content || "";

    const tokensUsed = config.isOllama
      ? (data.prompt_eval_count || 0) + (data.eval_count || 0)
      : data.usage?.total_tokens;

    return { content, tokensUsed, provider: config.provider };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`${config.provider} request timed out after ${timeout}ms`);
    }
    throw error;
  }
}

// ── Embedding caller ──
export async function createEmbedding(text: string): Promise<number[]> {
  const config = buildEmbeddingConfig();
  if (!config) {
    throw new Error("No embedding config available. Set OLLAMA_URL.");
  }

  const body = { model: config.model, prompt: text };
  const res = await fetch(config.baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Embedding HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.embedding || [];
}

export interface RouterOptions {
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  preferredModel?: "xai" | "ollama" | "groq" | "openrouter" | "kimi" | "auto";
}

const DEFAULT_TIMEOUTS: Record<string, number> = {
  xai: 30_000,      // 30 sec — fast API
  ollama: 120_000,  // 2 min — local models can be slow
  groq: 30_000,
  openrouter: 45_000,
  kimi: 30_000,
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

  const currentModels = buildModelConfigs();

  let order: ModelConfig[];
  if (preferredModel !== "auto") {
    order = currentModels
      .filter((m) => m.provider === preferredModel)
      .concat(currentModels.filter((m) => m.provider !== preferredModel));
  } else {
    order = currentModels.filter((m) => m.isPrimary).concat(currentModels.filter((m) => m.isFallback));
  }

  const tried: string[] = [];

  for (const config of order) {
    if (!await checkCircuit(config.provider)) {
      tried.push(`${config.provider} (circuit open)`);
      continue;
    }

    try {
      const result = await callProvider(config, messages, temperature, maxTokens, options.timeoutMs);
      const latency = Date.now() - start;

      return {
        content: result.content,
        tokensUsed: result.tokensUsed,
        provider: result.provider,
        model: config.model,
        latencyMs: latency,
        fallbackUsed: tried.length > 0,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[ModelRouter] ${config.provider} failed: ${msg}`);
      recordFailure(config.provider);
      tried.push(`${config.provider}: ${msg}`);
    }
  }

  throw new Error(`All LLM providers failed. Tried: ${tried.join(" | ")}`);
}

/**
 * Get current provider health status
 */
export function getProviderHealth() {
  const models = buildModelConfigs();
  return models.map((m) => {
    const state = circuitState.get(m.provider);
    return {
      provider: m.provider,
      model: m.model,
      isPrimary: m.isPrimary,
      circuitOpen: state?.open || false,
      failCount: state?.failCount || 0,
    };
  });
}
