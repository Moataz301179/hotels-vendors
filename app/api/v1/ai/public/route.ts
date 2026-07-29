/**
 * Public AI Endpoint — HotelsVendors
 * No auth required. Unlimited questions. Uses Ollama (local, free).
 */

import { NextRequest } from "next/server";
import { executeLLM } from "@/lib/swarm/model-router";
import { PUBLIC_SYSTEM_PROMPT } from "@/components/ai-assistant/prompts/public-prompt";
import { z } from "zod";

const PublicAskSchema = z.object({
  question: z.string().min(1).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = PublicAskSchema.parse(body);

    const result = await executeLLM(PUBLIC_SYSTEM_PROMPT, data.question, {
      maxTokens: 800,
      temperature: 0.5,
    });

    return Response.json({
      success: true,
      data: {
        answer: result.content,
        model: result.model,
        provider: result.provider,
      },
    });
  } catch (error) {
    console.error("[Public AI] Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
