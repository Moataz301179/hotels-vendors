#!/usr/bin/env tsx
/**
 * Test script: Verify Ollama integration locally
 * Usage: npx tsx scripts/test-ollama.ts
 */

import { executeLLM, getProviderHealth } from "../lib/swarm/model-router";

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  🧠 Ollama Integration Test");
  console.log("═══════════════════════════════════════════════════\n");

  // 1. Health check
  console.log("[1/4] Checking provider health...");
  const health = getProviderHealth();
  health.forEach((h) => {
    const status = h.circuitOpen ? "🔴 OPEN" : "🟢 OK";
    console.log(`  ${status} ${h.provider}/${h.model}`);
  });

  // 2. Test simple prompt
  console.log("\n[2/3] Testing simple prompt...");
  try {
    const result = await executeLLM(
      "You are a helpful assistant. Respond in 1 sentence.",
      "What is the capital of Egypt?",
      { temperature: 0.3, maxTokens: 100 }
    );
    console.log(`  ✅ Provider: ${result.provider} (${result.model})`);
    console.log(`  ⏱️  Latency: ${result.latencyMs}ms`);
    console.log(`  📝 Response: ${result.content.trim()}`);
  } catch (e) {
    console.error("  ❌ Failed:", (e as Error).message);
  }

  // 3. Test complex prompt (Director-style)
  console.log("\n[3/3] Testing Director-style strategic prompt...");
  try {
    const result = await executeLLM(
      `You are The Director — the supreme orchestrator of Hotels Vendors, a B2B procurement platform for Egyptian hospitality.
Your job is to analyze platform state and output ONE high-impact initiative as JSON.
Output format: {"initiative": "...", "squad": "growth|operations|intelligence|execution", "priority": 1-10}`,
      `Platform state: 3 hotels, 2 suppliers, 0 orders today. Goal: acquire 10 hotels in 30 days.
What is the single most impactful initiative?`,
      { temperature: 0.5, maxTokens: 500 }
    );
    console.log(`  ✅ Provider: ${result.provider} (${result.model})`);
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
