import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function callXAI(text: string, instruction: string) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI key missing");

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-2-latest",
      messages: [
        { role: "system", content: "You are a copywriting assistant for a B2B hospitality procurement platform. Rewrite text based on user instructions. Return ONLY the rewritten text, no explanations or quotes." },
        { role: "user", content: `Instruction: ${instruction}\n\nText to rewrite: "${text}"\n\nRewritten text:` },
      ],
      temperature: 0.6,
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`xAI error: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || text;
}

async function callOllama(text: string, instruction: string) {
  const url = process.env.OLLAMA_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

  const res = await fetch(`${url}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "Rewrite text based on instructions. Return ONLY the rewritten text, no explanations or quotes." },
        { role: "user", content: `Instruction: ${instruction}\n\nText to rewrite: "${text}"\n\nRewritten text:` },
      ],
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama error: ${err}`);
  }

  const data = await res.json();
  return data.message?.content?.trim() || text;
}

function generateLocalImprovement(text: string, instruction: string): string {
  const inst = instruction.toLowerCase();
  let improved = text.trim();

  if (inst.includes("concise") || inst.includes("short") || inst.includes("brief")) {
    improved = improved.replace(/\s+/g, " ").trim();
    if (improved.length > 50) {
      const sentences = improved.split(/[.!?]+/).filter(Boolean);
      improved = sentences.slice(0, 1).join(". ") + ".";
    }
  } else if (inst.includes("professional") || inst.includes("formal") || inst.includes("business")) {
    improved = improved.replace(/\b(hey|hi|yo|what's up)\b/gi, "Welcome");
    improved = improved.replace(/\b(get|grab|snag)\b/gi, "obtain");
    improved = improved.replace(/\b(cool|awesome|great|nice)\b/gi, "excellent");
    improved = improved.replace(/\b(stuff|things)\b/gi, "resources");
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);
    if (!/[.!?]$/.test(improved)) improved += ".";
  } else if (inst.includes("exciting") || inst.includes("engaging") || inst.includes("catchy")) {
    improved = improved.replace(/\b(check out|look at)\b/gi, "discover");
    improved = improved.replace(/\b(try|use)\b/gi, "experience");
    if (!improved.match(/^(Discover|Unlock|Experience|Transform|Elevate)/i)) {
      improved = "Discover " + improved.charAt(0).toLowerCase() + improved.slice(1);
    }
  } else if (inst.includes("simple") || inst.includes("clear") || inst.includes("plain")) {
    improved = improved.replace(/\b(utilize|leverage|capitalize on)\b/gi, "use");
    improved = improved.replace(/\b(subsequently|therefore|furthermore)\b/gi, "so");
    improved = improved.replace(/\b(in order to)\b/gi, "to");
  } else {
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);
    if (!/[.!?]$/.test(improved)) improved += ".";
  }

  return improved;
}

export async function POST(req: NextRequest) {
  try {
    const { text, prompt, style } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const instruction = prompt || style || "Make it more professional and concise";
    let improved = "";
    let source = "xai";

    try {
      improved = await callXAI(text, instruction);
    } catch (xaiErr: any) {
      console.warn("xAI failed:", xaiErr.message);
      try {
        improved = await callOllama(text, instruction);
        source = "ollama";
      } catch (ollamaErr: any) {
        console.warn("Ollama failed:", ollamaErr.message);
        improved = generateLocalImprovement(text, instruction);
        source = "local";
      }
    }

    return NextResponse.json({ improved, original: text, source });
  } catch (e: any) {
    console.error("Improve text error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
