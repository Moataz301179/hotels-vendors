// @ts-nocheck — TODO: Pre-existing type errors; tracked in docs/audit-log.md
/**
 * Public AI Endpoint — HotelsVendors
 * No auth required. Rate-limited by IP (5 messages/hour via Redis).
 * Non-streaming JSON response. Uses Ollama with fallback chain.
 */

import { NextRequest } from "next/server";
import { executeLLM } from "@/lib/swarm/model-router";
import { checkRateLimit } from "@/lib/redis";
import { PUBLIC_SYSTEM_PROMPT } from "@/components/ai-assistant/prompts/public-prompt";
import { sanitizeUserInput } from "@/lib/ai/sanitization";
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
  // Parse body once — store for fallback use
  let body: unknown;
  let question = "";
  try {
    body = await request.json();
    question = String((body as Record<string, unknown>)?.question || "").trim();
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

    // Sanitize user input (prompt injection defense)
    const sanitization = sanitizeUserInput(data.question);
    if (sanitization.injectionDetected) {
      console.warn(
        `[SECURITY] Prompt injection attempt detected from IP ${ip}:`,
        sanitization.injectionPatterns
      );
    }

    // Call LLM with fallback chain
    const result = await executeLLM(PUBLIC_SYSTEM_PROMPT, sanitization.sanitized, {
      maxTokens: 600,
      temperature: 0.5,
      preferredModel: "auto",

    });

    return Response.json({
      success: true,
      data: {
        answer: result.content,
        model: (result as any).model,
        provider: (result as any).provider,
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
      // Generic but helpful — never just "what would you like to know?"
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
