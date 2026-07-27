#!/usr/bin/env tsx
/**
 * Ollama connectivity diagnostic script
 * Run on VPS or locally to verify Ollama is reachable.
 * Usage: npx tsx scripts/check-ollama.ts
 */

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  🔍 Ollama Connectivity Check");
  console.log(`  URL: ${OLLAMA_URL}`);
  console.log("═══════════════════════════════════════════════════\n");

  // 1. Health check
  console.log("[1/2] Checking /api/tags...");
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) {
      console.log(`  🔴 HTTP ${res.status}: ${res.statusText}`);
      printInstructions();
      return;
    }
    const data = await res.json();
    const models = data.models || [];
    console.log(`  🟢 Ollama is reachable`);
    console.log(`  📦 ${models.length} model(s) available:\n`);
    if (models.length === 0) {
      console.log("  ⚠️  No models installed. Pull one:");
      console.log(`     ollama pull llama3.2:3b`);
    } else {
      console.log("  Model                          Size");
      console.log("  ────────────────────────────── ────────");
      for (const m of models) {
        const sizeGB = m.size ? `${(m.size / 1e9).toFixed(1)} GB` : "unknown";
        console.log(`  ${m.name.padEnd(30)} ${sizeGB}`);
      }
    }
  } catch (e) {
    console.log(`  🔴 Cannot connect to Ollama at ${OLLAMA_URL}`);
    console.log(`     Error: ${(e as Error).message}\n`);
    printInstructions();
    return;
  }

  // 2. Quick generate test
  console.log("\n[2/2] Running quick generate test...");
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";
  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: "Say 'hello' in one word.", stream: false, options: { num_predict: 10 } }),
      signal: AbortSignal.timeout(30000),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`  🟢 Model "${model}" responded: ${data.response?.trim()}`);
    } else {
      console.log(`  🔴 Generate failed: HTTP ${res.status}`);
    }
  } catch (e) {
    console.log(`  🔴 Generate failed: ${(e as Error).message}`);
    console.log(`     Model "${model}" may not be installed. Run: ollama pull ${model}`);
  }

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  Diagnostic Complete");
  console.log("═══════════════════════════════════════════════════");
}

function printInstructions() {
  console.log("\n  How to start Ollama:");
  console.log("  ─────────────────────");
  console.log("  Docker Compose:  docker compose -f docker-compose.swarm.yml up -d ollama");
  console.log("  Local install:   ollama serve");
  console.log("  VPS (systemd):   sudo systemctl start ollama");
  console.log("  VPS (manual):    OLLAMA_HOST=0.0.0.0:11434 ollama serve");
  console.log(`\n  Once running, verify: curl ${OLLAMA_URL}/api/tags`);
}

main().catch(console.error);
