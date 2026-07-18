/**
 * Admin AI Assistant — platform-strategy chat for admins.
 *
 * SECURITY (architecture-review-2026-07.md, S4):
 * Previously read `userId`/`tenantId` from `x-user-id`/`x-tenant-id` client
 * headers with `"anonymous"`/`"default"` fallbacks — allowing tenant
 * impersonation and AI-credit drain with no auth. Now derives identity from
 * the authenticated session via `authenticate(request)`, and requires
 * `admin:manage_platform`. LLM call, credit accounting, and response shape are
 * unchanged.
 */
import { NextRequest } from "next/server";
import { executeLLM } from "@/lib/ai/llm";
import { hasEnoughCredits, deductAICredits } from "@/lib/ai/credits";
import {
  apiRoute,
  authenticate,
  requirePermission,
} from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const { message, context } = await request.json();
  const { userId, tenantId } = auth;

  // Check AI credits
  const { allowed, balance } = await hasEnoughCredits(
    userId,
    tenantId,
    "ai_assistant"
  );

  if (!allowed) {
    return Response.json(
      {
        success: false,
        error: "AI credits exhausted",
        message: `You've used ${balance.usedCredits}/${balance.totalCredits} AI credits this month. Upgrade your plan for more.`,
        credits: {
          used: balance.usedCredits,
          total: balance.totalCredits,
          available: balance.availableCredits,
          tier: balance.subscriptionTier,
        },
        upgradeUrl: "/settings/subscription",
      },
      { status: 402 }
    );
  }

  // System prompt — no provider info exposed
  const systemPrompt = `You are an AI assistant for HotelsVendors — a Digital Procurement Hub for Egyptian hospitality.

You help admins improve the platform with actionable suggestions.

Current Platform Metrics:
- Total Users: ${context?.currentMetrics?.totalUsers || 0}
- Total Orders: ${context?.currentMetrics?.totalOrders || 0}
- Platform Fees (2%): EGP ${context?.currentMetrics?.platformFees?.toLocaleString() || 0}
- Factoring Volume: EGP ${context?.currentMetrics?.factoringVolume?.toLocaleString() || 0}

Respond concisely with bullet points and markdown. Always provide actionable next steps.`;

  // Execute LLM (provider hidden from user)
  const result = await executeLLM(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    { temperature: 0.7, maxTokens: 1024, taskComplexity: "medium" }
  );

  // Deduct credits
  const deduction = await deductAICredits({
    userId,
    tenantId,
    feature: "ai_assistant",
    tokensInput: message.length,
    tokensOutput: result.content.length,
    taskComplexity: "medium",
  });

  // Return response — NO provider/model info exposed
  return Response.json({
    success: true,
    response: result.content,
    credits: {
      used: balance.usedCredits + result.creditsCost,
      total: balance.totalCredits,
      available: deduction.remainingCredits,
      costThisQuery: result.creditsCost,
    },
    suggestions: generateFollowUpSuggestions(message),
  });
});

function generateFollowUpSuggestions(message: string): string[] {
  const lower = message.toLowerCase();
  if (lower.includes("revenue")) return ["How to increase platform fees?", "Show me fee breakdown", "Factoring revenue trends"];
  if (lower.includes("grow")) return ["Supplier acquisition strategy", "Hotel onboarding plan", "Referral program design"];
  if (lower.includes("feature")) return ["Mobile app roadmap", "Priority feature list", "Technical debt assessment"];
  if (lower.includes("compliance")) return ["ETA integration steps", "FRA requirements", "Audit trail setup"];
  return ["Show revenue insights", "How can we grow faster?", "What features are missing?", "Analyze user behavior"];
}
