/**
 * Public AI Endpoint — HotelsVendors
 * No auth required. Rate-limited by IP (5 messages/hour via Redis).
 * Non-streaming JSON response. Uses Ollama with fallback chain.
 */

import { NextRequest } from "next/server";
import { executeLLM } from "@/lib/swarm/model-router";
import { checkRateLimit } from "@/lib/redis";
import { PUBLIC_SYSTEM_PROMPT } from "@/components/ai-assistant/prompts/public-prompt";
import { z } from "zod";

const PublicAskSchema = z.object({
  question: z.string().min(1).max(1000),
  source: z.enum(["homepage", "pricing", "about", "marketplace", "solutions"]).optional(),
});

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = PublicAskSchema.parse(body);

    // Rate limit by IP: 5 messages per hour
    const ip = getClientIP(request);
    const rateLimit = await checkRateLimit(`ai:public:${ip}`, 3600, 5);

    if (!rateLimit.allowed) {
      return Response.json(
        {
          success: false,
          error: "You've reached the free question limit. Sign up for unlimited AI access.",
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    // Build system prompt
    const systemPrompt = PUBLIC_SYSTEM_PROMPT;

    // Call LLM with fallback chain
    const result = await executeLLM(systemPrompt, data.question, {
      maxTokens: 600,
      temperature: 0.5,
      preferredModel: "auto",
    });

    return Response.json({
      success: true,
      data: {
        answer: result.content,
        model: result.model,
        provider: result.provider,
        remainingQuestions: rateLimit.remaining,
      },
    });
  } catch (error) {
    console.error("[Public AI] Error:", error);

    // Graceful fallback
    const question = (await request.json().catch(() => ({}))).question || "";
    const q = question.toLowerCase();
    let answer =
      "I'm the HotelsVendors Public Guide. I can help you learn about our platform, discover suppliers, understand pricing, and get started. What would you like to know?";

    if (q.includes("price") || q.includes("cost") || q.includes("how much")) {
      answer =
        "HotelsVendors offers tiered plans starting with a free tier (2 AI questions/day). Our paid plans unlock unlimited AI access, advanced analytics, and premium supplier connections. Contact our team for custom enterprise pricing.";
    } else if (q.includes("supplier") || q.includes("vendor") || q.includes("product")) {
      answer =
        "We connect Egyptian hotels with 1,200+ verified suppliers across F&B, housekeeping, engineering, amenities, and capital equipment. Browse our marketplace to discover suppliers by category and location.";
    } else if (q.includes("factoring") || q.includes("payment")) {
      answer =
        "Our embedded non-recourse factoring ensures suppliers get paid early while hotels maintain standard payment terms. The platform fee is always deducted first. Would you like to understand how it works for your business?";
    } else if (q.includes("delivery") || q.includes("shipping") || q.includes("logistics")) {
      answer =
        "We offer shared-route logistics with a 48-hour delivery guarantee across Egypt's key industrial and coastal clusters. Standard delivery is 3-5 business days. Supplier self-shipping is also available.";
    } else if (q.includes("eta") || q.includes("tax") || q.includes("invoice")) {
      answer =
        "All invoices issued through HotelsVendors are automatically submitted to the Egyptian Tax Authority (ETA) e-invoicing system in real time. Each invoice receives a UUID and digital signature for full compliance.";
    }

    return Response.json({
      success: true,
      data: {
        answer,
        source: "rule-based-fallback",
      },
    });
  }
}
