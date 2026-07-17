/**
 * Test LLM API connectivity for Kimi and Grok
 * Run: npx tsx scripts/test-llm-apis.ts
 */

import "dotenv/config";

async function testKimi() {
  console.log("🧪 Testing Kimi API...");
  const key = process.env.KIMI_API_KEY;
  if (!key) throw new Error("KIMI_API_KEY missing");

  const res = await fetch("https://api.moonshot.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "kimi-k2-6",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'Kimi is online' in 5 words or less." },
      ],
      temperature: 0.3,
      max_tokens: 50,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kimi HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  console.log("✅ Kimi response:", content);
  console.log("   Tokens used:", data.usage?.total_tokens);
  return true;
}

async function testGrok() {
  console.log("\n🧪 Testing Grok API...");
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("XAI_API_KEY missing");

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4-1-fast",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'Grok is online' in 5 words or less." },
      ],
      temperature: 0.3,
      max_tokens: 50,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Grok HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  console.log("✅ Grok response:", content);
  console.log("   Tokens used:", data.usage?.total_tokens);
  return true;
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  LLM API Connectivity Test");
  console.log("═══════════════════════════════════════════════════\n");

  try {
    await testKimi();
  } catch (e) {
    console.error("❌ Kimi failed:", e instanceof Error ? e.message : e);
  }

  try {
    await testGrok();
  } catch (e) {
    console.error("❌ Grok failed:", e instanceof Error ? e.message : e);
  }

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  Test complete");
  console.log("═══════════════════════════════════════════════════");
}

main();
