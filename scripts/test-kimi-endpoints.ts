/**
 * Test multiple Kimi endpoints to find the right one for the user's key
 */
import "dotenv/config";

const key = process.env.KIMI_API_KEY;
if (!key) throw new Error("KIMI_API_KEY missing");

const endpoints = [
  { name: "Moonshot CN", url: "https://api.moonshot.cn/v1/chat/completions" },
  { name: "Moonshot AI (Intl)", url: "https://api.moonshot.ai/v1/chat/completions" },
  { name: "Kimi Platform", url: "https://platform.kimi.com/v1/chat/completions" },
  { name: "Kimi API", url: "https://api.kimi.com/v1/chat/completions" },
];

async function testEndpoint(name: string, url: string) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "kimi-k2-6",
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 10,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✅ ${name}: WORKING`);
      console.log(`   URL: ${url}`);
      console.log(`   Response: ${data.choices?.[0]?.message?.content?.substring(0, 50)}`);
      return true;
    } else {
      const text = await res.text();
      console.log(`❌ ${name}: HTTP ${res.status} — ${text.substring(0, 100)}`);
      return false;
    }
  } catch (e) {
    console.log(`❌ ${name}: Network error — ${e instanceof Error ? e.message : e}`);
    return false;
  }
}

async function main() {
  console.log("Testing Kimi key against all known endpoints...\n");
  let working = false;
  for (const ep of endpoints) {
    const ok = await testEndpoint(ep.name, ep.url);
    if (ok) working = true;
    console.log("");
  }

  if (!working) {
    console.log("\n⚠️  None of the standard endpoints worked.");
    console.log("   Your key may be for Kimi Code CLI only (not the API).");
    console.log("   Solution: Get a Moonshot API key from platform.moonshot.ai");
  }
}

main();
