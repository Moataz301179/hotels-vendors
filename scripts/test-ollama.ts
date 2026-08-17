#!/usr/bin/env tsx
/**
 * Test script: Verify Ollama integration locally
 * Usage: npx tsx scripts/test-ollama.ts
 */

import { executeLLM } from "../lib/ai/llm";

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  🧠 Ollama Integration Test");
  console.log("═══════════════════════════════════════════════════\n");

  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";

  // 1. Connectivity check
  console.log("[1/4] Checking Ollama connectivity...");
  try {
    const res = await fetch(`${ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      const models = data.models || [];
      console.log(`  🟢 Ollama reachable at ${ollamaUrl}`);
      console.log(`  📦 ${models.length} model(s) available:`);
      models.forEach((m: { name: string; size?: number }) => {
        const sizeGB = m.size ? ` (${(m.size / 1e9).toFixed(1)} GB)` : "";
        console.log(`     - ${m.name}${sizeGB}`);
      });
    } else {
      console.log(`  🔴 Ollama responded with status ${res.status}`);
    }
  } catch (e) {
    console.log(`  🔴 Ollama not reachable at ${ollamaUrl}`);
    console.log(`     Error: ${(e as Error).message}`);
    console.log(`\n  To start Ollama:`);
    console.log(`    Docker: docker compose -f docker-compose.swarm.yml up -d ollama`);
    console.log(`    Local:  ollama serve`);
    console.log(`    VPS:    ssh vps && sudo systemctl start ollama`);
  }

  // 2. Test simple prompt
  console.log("\n[2/3] Testing simple prompt via executeLLM...");
  try {
    const result = await executeLLM(
      "You are a helpful assistant. Respond in 1 sentence.",
      "What is the capital of Egypt?",
      { temperature: 0.3, maxTokens: 100 }
    );
    console.log(`  ✅ Provider: ${result.provider ?? "unknown"} (${result.model ?? "unknown"})`);
    console.log(`  ⏱️  Latency: ${result.latencyMs}ms`);
    console.log(`  📝 Response: ${result.content.trim()}`);
  } catch (e) {
    console.error("  ❌ Failed:", (e as Error).message);
  }

  // 3. Test complex prompt
  console.log("\n[3/3] Testing strategic prompt...");
  try {
    const result = await executeLLM(
      `You are The Director — the supreme orchestrator of Hotels Vendors, a B2B procurement platform for Egyptian hospitality.
Your job is to analyze platform state and output ONE high-impact initiative as JSON.
Output format: {"initiative": "...", "squad": "growth|operations|intelligence|execution", "priority": 1-10}`,
      `Platform state: 3 hotels, 2 suppliers, 0 orders today. Goal: acquire 10 hotels in 30 days.
What is the single most impactful initiative?`,
      { temperature: 0.5, maxTokens: 500 }
    );
    console.log(`  ✅ Provider: ${result.provider ?? "unknown"} (${result.model ?? "unknown"})`);
    console.log(`  ⏱️  Latency: ${result.latencyMs}ms`);
    console.log(`  📝 Response: ${result.content.trim()}`);
  } catch (e) {
    console.error("  ❌ Failed:", (e as Error).message);
  }

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  Test Complete");
  console.log("═══════════════════════════════════════════════════");
}

main().catch(console.error);
