/**
 * Admin Subscription Manager — AI credit balance, usage history, tier upgrades.
 *
 * SECURITY (architecture-review-2026-07.md, S4):
 * Previously read `userId`/`tenantId` from `x-user-id`/`x-tenant-id` client
 * headers with `"anonymous"`/`"default"` fallbacks — allowing a caller to read
 * any tenant's usage and create subscriptions billed to any tenant. Now derives
 * identity from the authenticated session and requires `admin:manage_platform`.
 * The GET/POST response shapes and the createSubscription call are unchanged.
 */
import { NextRequest } from "next/server";
import {
  getAICreditsBalance,
  createSubscription,
  getUsageHistory,
  SUBSCRIPTION_TIERS,
} from "@/lib/ai/credits";
import {
  apiRoute,
  authenticate,
  requirePermission,
} from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");
  const { userId, tenantId } = auth;

  const balance = await getAICreditsBalance(userId, tenantId);
  const history = await getUsageHistory(userId, tenantId, 30);

  return Response.json({
    success: true,
    data: {
      balance,
      tiers: SUBSCRIPTION_TIERS,
      recentUsage: history.slice(0, 20),
      usageSummary: {
        totalCreditsUsed: history.reduce((a, u) => a + u.creditsCost, 0),
        featureBreakdown: history.reduce((acc, u) => {
          acc[u.feature] = (acc[u.feature] || 0) + u.creditsCost;
          return acc;
        }, {} as Record<string, number>),
      },
    },
  });
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");
  const { userId, tenantId } = auth;

  const { tier, paymentReference } = await request.json();

  if (!tier || !SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS]) {
    return Response.json({ error: "Invalid tier" }, { status: 400 });
  }

  if (tier === "FREE") {
    return Response.json({ error: "Cannot subscribe to FREE tier" }, { status: 400 });
  }

  const result = await createSubscription({
    userId,
    tenantId,
    tier: tier as keyof typeof SUBSCRIPTION_TIERS,
    paymentReference,
  });

  return Response.json({
    success: true,
    data: result,
    message: `Successfully subscribed to ${tier} tier`,
  });
});
