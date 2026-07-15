import { NextRequest, NextResponse } from "next/server";
import { executeLLM } from "@/lib/ai/llm";

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    const systemPrompt = `You are the AI Assistant for HotelsVendors — a Digital Procurement Hub for Egyptian hospitality.

Your role is to help the admin improve the platform by suggesting actionable improvements.

Current Platform Metrics:
- Total Users: ${context?.currentMetrics?.totalUsers || 0}
- Total Orders: ${context?.currentMetrics?.totalOrders || 0}
- Platform Fees (2%): EGP ${context?.currentMetrics?.platformFees || 0}
- Factoring Volume: EGP ${context?.currentMetrics?.factoringVolume || 0}

You are running on Ollama (local LLM) — you are free, private, and data stays on-premise.

Respond in a helpful, concise manner. Use bullet points and markdown formatting.
Always provide actionable next steps.
Always respond in English.`;

    const result = await executeLLM(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      { temperature: 0.7, maxTokens: 1024 }
    );

    return NextResponse.json({
      success: true,
      response: result.content,
      provider: result.provider,
      model: result.model,
      latencyMs: result.latencyMs,
      suggestions: generateFollowUpSuggestions(message),
    });
  } catch (error) {
    console.error("[AI-Assistant]", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

function generateFollowUpSuggestions(message: string): string[] {
  const lower = message.toLowerCase();
  if (lower.includes("revenue")) return ["How to increase platform fees?", "Show me fee breakdown", "Factoring revenue trends"];
  if (lower.includes("grow")) return ["Supplier acquisition strategy", "Hotel onboarding plan", "Referral program design"];
  if (lower.includes("feature")) return ["Mobile app roadmap", "Priority feature list", "Technical debt assessment"];
  if (lower.includes("compliance")) return ["ETA integration steps", "FRA requirements", "Audit trail setup"];
  return ["Show revenue insights", "How can we grow faster?", "What features are missing?", "Analyze user behavior"];
}
