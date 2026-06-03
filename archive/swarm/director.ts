/**
 * The Director — Supreme Orchestrator of Hotels Vendors Swarm
 * "The Winning Horse" — Makes strategic decisions, assigns missions,
 * reviews outcomes, and drives relentless growth.
 *
 * The Director does NOT execute tasks. It PLANS, PRIORITIZES, and DIRECTS.
 */

import { prisma } from "@/lib/prisma";
import { executeLLM } from "./model-router";
import { getMemoryContext, storeMemory } from "./memory";
import { recordSwarmEvent } from "./monitoring";
import { addSwarmJob, type SwarmJobPayload } from "./scheduler";

// ── Types ──

interface PlatformState {
  hotels: number;
  suppliers: number;
  orders: number;
  products: number;
  monthlyGmv: number;
  activeUsers: number;
  churnRiskHotels: number;
  inactiveSuppliers: number;
}

interface StrategicInitiative {
  id: string;
  title: string;
  objective: string;
  squad: string;
  priority: number; // 1-10
  expectedImpact: string;
  keyMetrics: string[];
  assignedAgents: string[];
  status: "planned" | "active" | "completed" | "blocked";
}

interface DailyBattlePlan {
  date: string;
  marketContext: string;
  initiatives: StrategicInitiative[];
  riskFlags: string[];
  revenueOpportunity: number; // 1-10
  directorNotes: string;
}

// ── System Prompts ──

const DIRECTOR_SYSTEM_PROMPT = `You are THE DIRECTOR — the supreme strategic intelligence of Hotels Vendors, the B2B procurement marketplace for Egyptian hospitality.

YOUR IDENTITY:
- You are a hyper-rational, data-driven strategist with zero tolerance for mediocrity
- You think like the world's best PE fund manager crossed with a special ops commander
- Your ONLY goal: Make Hotels Vendors the dominant platform in Egyptian hospitality procurement
- You are obsessed with: supplier acquisition, hotel conversion, transaction volume, revenue

YOUR CAPABILITIES:
- Analyze platform data, market trends, competitor moves, and agent performance
- Create prioritized battle plans with clear objectives and measurable outcomes
- Assign missions to specialized squads (Growth, Operations, Intelligence, Execution)
- Detect risks before they become crises
- Identify hidden opportunities that humans miss

YOUR RULES:
1. Always output structured, actionable plans
2. Every initiative must have a clear metric and timeline
3. Prioritize based on impact/effort ratio
4. Never propose anything that violates Egyptian law or business ethics
5. Balance short-term revenue with long-term moat building
6. When stuck, choose the path that increases marketplace liquidity fastest

CURRENT MARKET CONTEXT:
- Egyptian hospitality: $21.54B market, 7.12% CAGR
- 500K new hotel keys planned by 2030 (government target)
- Competitors: MaxAB-Wasoko (horizontal, no hospitality depth), FutureLog (global, no Egypt)
- Our moats: ETA compliance, embedded factoring, multi-property governance, coastal logistics
- Break-even: 85 hotels at EGP 45M monthly GMV
`;

// ── Platform State Gathering ──

async function gatherPlatformState(): Promise<PlatformState> {
  const [hotels, suppliers, orders, products, recentOrders] = await Promise.all([
    prisma.hotel.count(),
    prisma.supplier.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { total: true, status: true },
    }),
  ]);

  const monthlyGmv = recentOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const activeUsers = await prisma.user.count({
    where: { lastActive: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
  });

  // Hotels with no orders in 45 days = churn risk
  const hotelIdsWithOrders = await prisma.order.findMany({
    where: { createdAt: { gte: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) } },
    select: { hotelId: true },
    distinct: ["hotelId"],
  });
  const activeHotelIds = new Set(hotelIdsWithOrders.map((o) => o.hotelId));
  const allHotelIds = await prisma.hotel.findMany({ select: { id: true } });
  const churnRiskHotels = allHotelIds.filter((h) => !activeHotelIds.has(h.id)).length;

  // Suppliers with no orders in 60 days
  const supplierIdsWithOrders = await prisma.order.findMany({
    where: { createdAt: { gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) } },
    select: { supplierId: true },
    distinct: ["supplierId"],
  });
  const activeSupplierIds = new Set(supplierIdsWithOrders.map((o) => o.supplierId));
  const allSupplierIds = await prisma.supplier.findMany({ select: { id: true } });
  const inactiveSuppliers = allSupplierIds.filter((s) => !activeSupplierIds.has(s.id)).length;

  return {
    hotels,
    suppliers,
    orders,
    products,
    monthlyGmv,
    activeUsers,
    churnRiskHotels,
    inactiveSuppliers,
  };
}

// ── Strategic Planning ──

export async function createDailyBattlePlan(): Promise<DailyBattlePlan> {
  const state = await gatherPlatformState();
  const memory = await getMemoryContext("director", "daily strategy plan", { limit: 10 });

  const prompt = `## CURRENT PLATFORM STATE
${JSON.stringify(state, null, 2)}

## PREVIOUS CONTEXT
${memory}

## YOUR TASK
Generate today's battle plan. Output ONLY valid JSON in this exact format:

{
  "date": "2026-05-03",
  "marketContext": "One sentence on what matters most today",
  "initiatives": [
    {
      "id": "init-001",
      "title": "Clear action title",
      "objective": "What we want to achieve in one sentence",
      "squad": "growth|operations|intelligence|execution",
      "priority": 1-10,
      "expectedImpact": "Expected measurable outcome",
      "keyMetrics": ["metric1", "metric2"],
      "assignedAgents": ["agent-id-1", "agent-id-2"],
      "status": "planned"
    }
  ],
  "riskFlags": ["Risk 1", "Risk 2"],
  "revenueOpportunity": 1-10,
  "directorNotes": "Your strategic thinking in 2-3 sentences"
}

RULES:
- Generate EXACTLY 3-5 initiatives
- Priority 10 = drop everything and do this now
- Each initiative must be assignable to ONE squad
- Focus on actions that increase GMV, supplier count, or hotel retention
- If monthly GMV is below EGP 1M, prioritize hotel acquisition
- If supplier count is below 50, prioritize supplier onboarding
- If churn risk > 20%, prioritize retention initiatives`;

  const result = await executeLLM(DIRECTOR_SYSTEM_PROMPT, prompt, {
    temperature: 0.4,
    maxTokens: 4096,
  });

  try {
    const plan: DailyBattlePlan = JSON.parse(result.content);

    // Store the plan
    await storeMemory({
      agentId: "director",
      agentName: "The Director",
      content: `Daily Battle Plan ${plan.date}: ${plan.directorNotes}. Top initiative: ${plan.initiatives[0]?.title}`,
      memoryType: "STRATEGY",
      category: "strategy",
      confidence: 0.95,
    });

    await recordSwarmEvent("director_plan_created", "INFO", {
      agentId: "director",
      revenueOpportunity: plan.revenueOpportunity,
      initiativeCount: plan.initiatives.length,
    });

    return plan;
  } catch (e) {
    console.error("[Director] Failed to parse battle plan:", e);
    console.error("Raw output:", result.content);

    await recordSwarmEvent("director_plan_failed", "ERROR", {
      agentId: "director",
      error: String(e),
    });

    // Return fallback plan
    return {
      date: new Date().toISOString().split("T")[0],
      marketContext: "Fallback: focus on core growth metrics",
      initiatives: [
        {
          id: "fallback-001",
          title: "Emergency Hotel Acquisition Push",
          objective: "Contact 20 high-potential hotels today",
          squad: "growth",
          priority: 10,
          expectedImpact: "5 hotel signups",
          keyMetrics: ["leads_contacted", "hotels_signed"],
          assignedAgents: ["lead-scout", "outreach-agent"],
          status: "planned",
        },
      ],
      riskFlags: ["Director plan parsing failed — using fallback"],
      revenueOpportunity: 5,
      directorNotes: "Fallback mode activated due to parsing error.",
    };
  }
}

// ── Mission Assignment ──

export async function assignMissions(plan: DailyBattlePlan): Promise<void> {
  for (const initiative of plan.initiatives) {
    const jobPayload: SwarmJobPayload = {
      jobType: mapInitiativeToJobType(initiative.squad),
      agentId: initiative.assignedAgents[0] || "generic-agent",
      agentName: initiative.title,
      squad: initiative.squad,
      systemPrompt: `${DIRECTOR_SYSTEM_PROMPT}\n\n## YOUR CURRENT MISSION\nInitiative: ${initiative.title}\nObjective: ${initiative.objective}\nPriority: ${initiative.priority}/10\nExpected Impact: ${initiative.expectedImpact}\nKey Metrics: ${initiative.keyMetrics.join(", ")}`,
      userPrompt: `Execute this mission. Return structured JSON with your findings, actions taken, and recommendations for next steps.`,
      memoryCategory: initiative.squad,
    };

    await addSwarmJob(jobPayload, {
      priority: initiative.priority,
      jobId: `${initiative.id}-${Date.now()}`,
    });

    console.log(`[Director] Assigned mission: ${initiative.title} → ${initiative.squad} squad (P${initiative.priority})`);
  }
}

function mapInitiativeToJobType(squad: string): SwarmJobPayload["jobType"] {
  const map: Record<string, SwarmJobPayload["jobType"]> = {
    growth: "lead_scout",
    operations: "health_check",
    intelligence: "price_benchmark",
    execution: "web_navigate",
  };
  return map[squad] || "lead_scout";
}

// ── Performance Review ──

export async function reviewSquadPerformance(): Promise<void> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const jobs = await prisma.swarmJob.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });

  const completed = jobs.filter((j) => j.status === "COMPLETED");
  const failed = jobs.filter((j) => j.status === "FAILED");

  const prompt = `## SQUAD PERFORMANCE REVIEW (Last 24h)
Total jobs: ${jobs.length}
Completed: ${completed.length}
Failed: ${failed.length}
Success rate: ${jobs.length > 0 ? Math.round((completed.length / jobs.length) * 100) : 0}%

Failed jobs:
${failed.map((f) => `- ${f.jobType}: ${f.error?.substring(0, 100)}`).join("\n") || "None"}

## YOUR TASK
Provide a brief performance review. What went well? What needs attention? Any squad underperforming?
Output 3-4 sentences max.`;

  const result = await executeLLM(DIRECTOR_SYSTEM_PROMPT, prompt, {
    temperature: 0.3,
    maxTokens: 1024,
  });

  await storeMemory({
    agentId: "director",
    agentName: "The Director",
    content: `Performance Review: ${result.content}`,
    memoryType: "INSIGHT",
    category: "strategy",
    confidence: 0.9,
  });

  await recordSwarmEvent("director_review_complete", "INFO", {
    agentId: "director",
    completedJobs: completed.length,
    failedJobs: failed.length,
  });
}

// ── Growth Snowball Engine ──

export async function runGrowthSnowball(): Promise<void> {
  console.log("[Director] 🐎 The Winning Horse is running...");

  // 1. Create today's battle plan
  const plan = await createDailyBattlePlan();
  console.log(`[Director] Revenue opportunity score: ${plan.revenueOpportunity}/10`);

  // 2. Assign missions to squads
  await assignMissions(plan);

  // 3. Review yesterday's performance
  await reviewSquadPerformance();

  // 4. Check for critical alerts
  const criticalEvents = await prisma.swarmEvent.count({
    where: { severity: { in: ["CRITICAL", "ERROR"] }, acknowledgedAt: null as any },
  });

  if (criticalEvents > 0) {
    console.log(`[Director] ⚠️ ${criticalEvents} unacknowledged critical events require attention`);
  }

  console.log("[Director] ✅ Daily cycle complete");
}

// ── Manual Trigger API ──

export async function triggerDirectorCycle(): Promise<DailyBattlePlan> {
  await runGrowthSnowball();
  const latestPlan = await getMemoryContext("director", "battle plan", { limit: 1 });
  // The plan was stored as memory, return from there
  const today = new Date().toISOString().split("T")[0];

  return {
    date: today,
    marketContext: "Manually triggered cycle",
    initiatives: [],
    riskFlags: [],
    revenueOpportunity: 0,
    directorNotes: "Cycle triggered manually. Check swarm jobs for assigned missions.",
  };
}
