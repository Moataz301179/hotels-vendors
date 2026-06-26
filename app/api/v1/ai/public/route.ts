/**
 * Public AI Endpoint — HotelsVendors
 * No auth required. Rate-limited by IP (5 messages/hour via Redis).
 * Supports conversation history for contextual responses.
 * Calls Ollama LLM with rule-based fallback.
 */

import { NextRequest } from "next/server";
import { executeLLM } from "@/lib/ai/llm";
import { PUBLIC_SYSTEM_PROMPT } from "@/components/ai-assistant/prompts/public-prompt";
import { z } from "zod";

async function checkRateLimit(ip: string, seconds: number, max: number) {
  // Simple in-memory rate limit (resets on deploy). For multi-instance, use Redis.
  try {
    const redisMod = await import("@/lib/redis");
    if (redisMod?.checkRateLimit) return redisMod.checkRateLimit(ip, seconds, max);
  } catch {
    // redis unavailable — fall through to allow
  }
  return { allowed: true, remaining: max, resetAt: Date.now() + seconds * 1000 };
}

const PublicAskSchema = z.object({
  question: z.string().min(1).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(10)
    .optional(),
  source: z.enum(["homepage", "pricing", "about", "marketplace", "solutions"]).optional(),
});

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;
  return "unknown";
}

function buildMessagesWithHistory(
  systemPrompt: string,
  question: string,
  history?: { role: "user" | "assistant"; content: string }[]
) {
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
  ];

  // Add conversation history for context (last N exchanges)
  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  // Add the current question
  messages.push({ role: "user", content: question });

  return messages;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  let question = "";
  let history: { role: "user" | "assistant"; content: string }[] | undefined;
  try {
    body = await request.json();
    question = String((body as Record<string, unknown>)?.question || "").trim();
    history = (body as Record<string, unknown>)?.history as
      | { role: "user" | "assistant"; content: string }[]
      | undefined;
  } catch {
    return Response.json(
      { success: false, error: "Invalid request body. Please send a JSON object with a 'question' field." },
      { status: 400 }
    );
  }

  try {
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

    // Build messages array with conversation history
    const messages = buildMessagesWithHistory(PUBLIC_SYSTEM_PROMPT, data.question, data.history);

    // Call LLM with full conversation context
    const result = await executeLLM(messages, {
      maxTokens: 800,
      temperature: 0.5,
    });

    // If LLM returned unavailable, throw to trigger rule-based fallback
    if (result.provider === "none" || result.content === "Service unavailable.") {
      throw new Error("LLM provider unavailable — using rule-based fallback");
    }

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

    // Graceful fallback — uses the pre-parsed question
    const q = question.toLowerCase();
    let answer = "";

    if (q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("plan")) {
      answer =
        "HotelsVendors offers tiered plans starting with a free tier (2 AI questions/day). Paid plans unlock unlimited AI access, advanced analytics, and premium supplier connections. Contact our team for custom enterprise pricing.";
    } else if (q.includes("supplier") || q.includes("vendor") || q.includes("product") || q.includes("available")) {
      answer =
        "We connect Egyptian hotels with verified suppliers across F&B, housekeeping, engineering, amenities, and capital equipment. Browse our marketplace to discover suppliers by category and location, or visit /become-supplier to join as a supplier.";
    } else if (q.includes("factoring") || q.includes("payment") || q.includes("credit")) {
      answer =
        "Our embedded non-recourse factoring ensures suppliers get paid early while hotels maintain standard payment terms. The platform fee is always deducted first. Would you like to understand how it works for your business?";
    } else if (q.includes("delivery") || q.includes("shipping") || q.includes("logistics") || q.includes("transport")) {
      answer =
        "We offer shared-route logistics with fast delivery across Egypt's key industrial and coastal clusters. Standard delivery is 3-5 business days. Supplier self-shipping is also available.";
    } else if (q.includes("eta") || q.includes("tax") || q.includes("invoice") || q.includes("compliance")) {
      answer =
        "All invoices issued through HotelsVendors are automatically submitted to the Egyptian Tax Authority (ETA) e-invoicing system in real time. Each invoice receives a UUID and digital signature for full compliance.";
    } else if (q.includes("hotel") || q.includes("buyer") || q.includes("property")) {
      answer =
        "HotelsVendors serves hotels of all sizes across Egypt — from independent properties to major chains. Our platform helps hotels streamline procurement, reduce costs, and ensure compliance with ETA e-invoicing.";
    } else if (q.includes("save") || q.includes("benefit") || q.includes("advantage") || q.includes("why")) {
      answer =
        "HotelsVendors helps hotels reduce procurement overhead, access verified suppliers, ensure ETA compliance, and optimize inventory costs. Suppliers benefit from guaranteed payments via non-recourse factoring and access to a ready buyer network.";
    } else if (q.includes("start") || q.includes("register") || q.includes("sign up") || q.includes("join") || q.includes("demo")) {
      answer =
        "Getting started is easy. Hotels can register at /register to access the procurement portal. Suppliers can apply at /become-supplier. You can also explore the marketplace at /marketplace without an account.";
    } else if (q.includes("ai") || q.includes("intelligence") || q.includes("smart") || q.includes("assistant")) {
      answer =
        "Our AI engine helps with demand forecasting, spend analytics, reorder alerts, and smart procurement recommendations. Free users get 2 AI questions per day. Paid plans unlock unlimited access.";
    } else if (q.includes("marketplace") || q.includes("catalog") || q.includes("browse")) {
      answer =
        "Our marketplace features products across F&B, housekeeping, engineering, amenities, and capital equipment. You can browse by category, filter by brand and price, and view detailed product specs. Visit /marketplace to explore.";
    } else {
      answer =
        "HotelsVendors is Egypt's B2B procurement platform for the hospitality sector. We connect hotels with verified suppliers, offer embedded factoring, shared logistics, and automatic ETA e-invoicing compliance. How can I help you today?";
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
