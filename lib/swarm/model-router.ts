/**
 * Swarm Model Router
 * Kimi 2.6 primary, Grok 4.1 Fast fallback, OpenRouter universal fallback
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
  apiKey: string;
  baseUrl: string;
  isPrimary: boolean;
  isFallback: boolean;
  headers?: Record<string, string>;
}

function buildModelConfigs(): ModelConfig[] {
  const configs: ModelConfig[] = [];

  // Kimi via Moonshot
  if (process.env.KIMI_API_KEY) {
    configs.push({
      provider: "kimi",
      model: "kimi-k2-6",
      apiKey: process.env.KIMI_API_KEY,
      baseUrl: "https://api.moonshot.cn/v1/chat/completions",
      isPrimary: true,
      isFallback: false,
    });
  }

  // Grok via xAI
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

  // OpenRouter — universal fallback (supports Kimi, Grok, Claude, GPT, etc.)
  if (process.env.OPENROUTER_API_KEY) {
    configs.push({
      provider: "openrouter",
      model: "moonshotai/kimi-k2-6",
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: "https://openrouter.ai/api/v1/chat/completions",
      isPrimary: false,
      isFallback: true,
      headers: {
        "HTTP-Referer": process.env.APP_URL || "https://hotelsvendors.com",
        "X-Title": "Hotels Vendors Swarm",
      },
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
        avgLatencyMs: latencyMs,
      },
      create: {
        provider,
        model,
        status: success ? "HEALTHY" : "DEGRADED",
        lastSuccessAt: success ? new Date() : undefined,
        lastFailureAt: success ? undefined : new Date(),
        isPrimary: provider === "kimi",
        isFallback: provider === "xai" || provider === "openrouter",
      },
    });
  } catch (e) {
    console.error("[ModelHealth] Failed to update:", e);
  }
}

async function callProvider(config: ModelConfig, messages: LLMMessage[], temperature: number, maxTokens: number): Promise<{ content: string; tokensUsed?: number; provider: string }> {
  const start = Date.now();
  const body = {
    model: config.model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
    ...config.headers,
  };

  const res = await fetch(config.baseUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${config.provider} HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  const latency = Date.now() - start;

  recordSuccess(config.provider);
  await updateModelHealth(config.provider, config.model, true, latency);

  return {
    content: data.choices?.[0]?.message?.content || "",
    tokensUsed: data.usage?.total_tokens,
    provider: config.provider,
  };
}

export interface RouterOptions {
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  preferredModel?: "kimi" | "xai" | "openrouter" | "auto";
}

export interface RouterResult {
  content: string;
  tokensUsed?: number;
  provider: string;
  model: string;
  latencyMs: number;
  fallbackUsed: boolean;
}

/**
 * Execute an LLM call with automatic fallback
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
  if (preferredModel === "kimi") {
    order = currentModels.filter((m) => m.provider === "kimi").concat(currentModels.filter((m) => m.provider !== "kimi"));
  } else if (preferredModel === "xai") {
    order = currentModels.filter((m) => m.provider === "xai").concat(currentModels.filter((m) => m.provider !== "xai"));
  } else if (preferredModel === "openrouter") {
    order = currentModels.filter((m) => m.provider === "openrouter").concat(currentModels.filter((m) => m.provider !== "openrouter"));
  } else {
    order = currentModels.filter((m) => m.isPrimary).concat(currentModels.filter((m) => m.isFallback));
  }

  let lastError: Error | null = null;

  for (const model of order) {
    if (!model.apiKey) {
      console.warn(`[ModelRouter] ${model.provider} API key missing, skipping`);
      continue;
    }

    const circuitOpen = !(await checkCircuit(model.provider));
    if (circuitOpen) {
      console.warn(`[ModelRouter] ${model.provider} circuit open, skipping`);
      continue;
    }

    try {
      const result = await callProvider(model, messages, temperature, maxTokens);
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

  throw lastError || new Error("All LLM providers failed. Please configure at least one API key: KIMI_API_KEY, XAI_API_KEY, or OPENROUTER_API_KEY.");
}

/**
 * Quick health check for all models
 */
export async function checkModelHealth(): Promise<Array<{ provider: string; model: string; healthy: boolean; circuitOpen: boolean }>> {
  const currentModels = buildModelConfigs();
  return currentModels.map((m) => ({
    provider: m.provider,
    model: m.model,
    healthy: !circuitState.get(m.provider)?.open,
    circuitOpen: !!circuitState.get(m.provider)?.open,
  }));
}
