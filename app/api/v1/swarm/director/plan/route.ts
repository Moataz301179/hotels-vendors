/**
 * POST /api/v1/swarm/director/plan
 * Trigger the Director agent to create a strategic plan.
 * This is the "Run Director Cycle" button in the swarm dashboard.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, success, ApiError } from "@/lib/api-utils";
import { executeLLM } from "@/lib/ai/llm";

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!auth) throw new ApiError("Unauthorized", 401);

    // Gather platform context for the director
    const [hotelCount, supplierCount, orderCount, recentOrders] = await Promise.all([
      prisma.hotel.count({ where: { tenantId: auth.tenantId } }),
      prisma.supplier.count({ where: { tenantId: auth.tenantId } }),
      prisma.order.count({ where: { tenantId: auth.tenantId } }),
      prisma.order.findMany({
        where: { tenantId: auth.tenantId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          hotel: { select: { name: true } },
          supplier: { select: { name: true } },
        },
      }),
    ]);

    // Ask the LLM to create a strategic plan
    const plan = await executeLLM(
      `You are the Director agent for HotelsVendors, Egypt's B2B hospitality procurement platform. You orchestrate autonomous agents to grow the marketplace.`,
      `Create a strategic growth plan based on current platform state:
- Hotels: ${hotelCount}
- Suppliers: ${supplierCount}
- Total Orders: ${orderCount}
- Recent activity: ${recentOrders.map((o) => `${o.hotel?.name} ordered from ${o.supplier?.name}`).join("; ") || "No recent orders"}

Generate a prioritized list of 3-5 actions the swarm should take this week. Focus on:
1. Lead generation (hotels & suppliers to target)
2. Content opportunities (blog topics, social posts)
3. Market intelligence (price trends to monitor)
4. Compliance checks (invoices to validate)

Respond in JSON:
{
  "actions": [
    {
      "agentId": "lead-scout|content-engine|market-analyst|compliance-checker|support-agent",
      "prompt": "specific actionable prompt",
      "priority": 1-10,
      "reason": "why this matters now"
    }
  ],
  "summary": "executive summary of the plan"
}`,
      { jsonMode: true, maxTokens: 2048 }
    );

    let parsed: { actions: Array<{ agentId: string; prompt: string; priority: number; reason: string }>; summary: string };
    try {
      parsed = JSON.parse(plan.content);
    } catch {
      parsed = {
        actions: [{
          agentId: "lead-scout",
          prompt: "Identify 10 hotels in Sharm El-Sheikh and Hurghada that are not yet on HotelsVendors and would benefit from B2B procurement automation.",
          priority: 8,
          reason: "Core growth target — coastal hotel acquisition",
        }],
        summary: "Default growth plan (LLM decomposition unavailable)",
      };
    }

    // Create jobs for each action
    const createdJobs = [];
    for (const action of parsed.actions.slice(0, 5)) {
      const job = await prisma.swarmJob.create({
        data: {
          queueName: "director",
          assignedAgent: action.agentId,
          squad: "general",
          jobType: "director-planned",
          jobName: `${action.agentId} — ${action.reason.slice(0, 60)}`,
          status: "WAITING_APPROVAL",
          payload: action.prompt,
          priority: action.priority || 5,
          tenantId: auth.tenantId,
        },
      });

      createdJobs.push(job);
    }

    return success({
      plan: parsed.summary,
      actions: parsed.actions,
      jobs: createdJobs,
      jobsCreated: createdJobs.length,
      context: { hotelCount, supplierCount, orderCount },
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Director planning failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
