import { NextResponse } from "next/server";
import { executeLLM } from "@/lib/ai/llm";

export async function GET() {
  const ollamaUrl =
    process.env.OLLAMA_URL ||
    process.env.NEXT_PUBLIC_VPS_API_URL ||
    process.env.VPS_API_URL;
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2:latest";

  if (!ollamaUrl) {
    return NextResponse.json({
      status: "no_ollama_config",
      message:
        "OLLAMA_URL not set. Set OLLAMA_URL to your VPS Ollama endpoint.",
      envs: {
        OLLAMA_URL: "(not set)",
        OLLAMA_MODEL: ollamaModel,
      },
    });
  }

  try {
    const res = await fetch(`${ollamaUrl.replace(/\/$/, "")}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return NextResponse.json({
      status: "ollama_connected",
      url: ollamaUrl,
      model: ollamaModel,
      availableModels: (data.models || []).map((m: { name: string }) => m.name),
    });
  } catch (e) {
    return NextResponse.json({
      status: "ollama_unreachable",
      url: ollamaUrl,
      model: ollamaModel,
      error: (e as Error).message,
    });
  }
}
