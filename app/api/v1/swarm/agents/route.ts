/**
 * GET /api/v1/swarm/agents
 * Returns the list of available AI agents for the swarm dashboard.
 */

import { NextRequest, NextResponse } from "next/server";
import { authenticate, success, ApiError } from "@/lib/api-utils";

const AGENTS = [
  {
    id: "director",
    name: "Director",
    squad: "orchestration",
    avatar: "🎯",
    role: "Mission decomposition & agent dispatch",
    capabilities: ["task_decomposition", "agent_dispatch", "priority_queue", "approval_routing"],
    requiresApproval: false,
  },
  {
    id: "lead-scout",
    name: "Lead Scout",
    squad: "growth",
    avatar: "🔍",
    role: "Hotel & supplier lead discovery",
    capabilities: ["lead_discovery", "contact_enrichment", "intent_scoring", "outreach_drafting"],
    requiresApproval: true,
  },
  {
    id: "content-engine",
    name: "Content Engine",
    squad: "growth",
    avatar: "✍️",
    role: "SEO blog posts, social content, email campaigns",
    capabilities: ["blog_generation", "social_posts", "email_campaigns", "seo_optimization"],
    requiresApproval: true,
  },
  {
    id: "market-analyst",
    name: "Market Analyst",
    squad: "intelligence",
    avatar: "📊",
    role: "Price trends, demand signals, competitive intel",
    capabilities: ["price_monitoring", "demand_analysis", "competitor_tracking", "trend_reporting"],
    requiresApproval: false,
  },
  {
    id: "compliance-checker",
    name: "Compliance Checker",
    squad: "risk",
    avatar: "🛡️",
    role: "ETA invoice validation, anomaly detection",
    capabilities: ["invoice_validation", "anomaly_detection", "eta_compliance", "fraud_scoring"],
    requiresApproval: false,
  },
  {
    id: "support-agent",
    name: "Support Agent",
    squad: "operations",
    avatar: "💬",
    role: "Hotel & supplier onboarding assistance",
    capabilities: ["onboarding_help", "faq_answers", "issue_triage", "escalation_routing"],
    requiresApproval: false,
  },
];

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!auth) throw new ApiError("Unauthorized", 401);

    return success({ agents: AGENTS });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}
