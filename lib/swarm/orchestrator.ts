/**
 * Multi-Agent Task Orchestrator — VPS Architecture Compatible
 * Takes a single development task, analyzes it, and dispatches to
 * multiple specialized agents in PARALLEL via ExecutionQueue & IntelligenceQueue.
 */

import { ExecutionQueue, IntelligenceQueue, addSwarmJob, type SwarmJobPayload } from "./scheduler";
import { SWARM_AGENTS, getAgentById, type SwarmAgentDef } from "./agents";
import { storeMemory } from "./memory";
import { recordSwarmEvent } from "./monitoring";
import { executeLLM } from "./model-router";

// ── Task Analysis ──

interface TaskAnalysis {
  taskType: "feature" | "bugfix" | "refactor" | "audit" | "research" | "design";
  domains: string[];
  complexity: "low" | "medium" | "high" | "critical";
  description: string;
  deliverables: string[];
}

interface AgentAssignment {
  agent: SwarmAgentDef;
  role: "lead" | "contributor" | "reviewer";
  taskFragment: string;
  priority: number;
  queue: "execution" | "intelligence";
}

interface SwarmMissionResult {
  missionId: string;
  task: string;
  analysis: TaskAnalysis;
  assignments: AgentAssignment[];
  jobIds: string[];
  summary: string;
}

const DOMAIN_AGENT_MAP: Record<string, string[]> = {
  fintech: ["fintech-lead", "fee-engineer", "credit-risk", "authority-enforcer"],
  security: ["api-security", "authority-enforcer", "the-auditor"],
  eta: ["eta-officer", "fintech-lead"],
  supplier: ["supplier-lead", "onboarding-specialist", "catalog-curator", "trust-assessor"],
  hotel: ["hotel-lead", "procurement-designer", "order-engineer", "hotel-analyst"],
  logistics: ["logistics-lead", "route-optimizer", "delivery-tracker"],
  intelligence: ["ai-architect", "price-analyst", "demand-forecaster", "matchmaker"],
  growth: ["growth-lead", "lead-scout", "outreach-specialist", "seo-strategist"],
  platform: ["db-architect", "api-security", "devops-engineer", "qa-automator"],
  ui: ["procurement-designer", "hotel-lead", "supplier-lead"],
  auth: ["api-security", "authority-enforcer"],
  database: ["db-architect", "fintech-lead"],
};

// ── Task Analyzer ──

export async function analyzeTask(taskDescription: string): Promise<TaskAnalysis> {
  const prompt = `Analyze this development task for a B2B hotel procurement platform:

"""${taskDescription}"""

Classify into EXACTLY this JSON format:
{
  "taskType": "feature|bugfix|refactor|audit|research|design",
  "domains": ["fintech","security","ui","database","auth","eta","supplier","hotel","logistics","intelligence","growth","platform"],
  "complexity": "low|medium|high|critical",
  "description": "One-sentence summary",
  "deliverables": ["specific deliverable 1", "specific deliverable 2"]
}

Rules:
- Pick 1-4 domains that are MOST relevant
- Complexity: low = <2h, medium = 2-8h, high = 1-3d, critical = 3d+ or blocks release
- Deliverables must be concrete and testable`;

  const result = await executeLLM(
    `You are a technical project manager. You analyze tasks and route them to the right specialists. Be precise.`,
    prompt,
    { temperature: 0.2, maxTokens: 1024 }
  );

  try {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as TaskAnalysis;
    }
  } catch {
    // fallback
  }

  // Manual fallback analysis
  const t = taskDescription.toLowerCase();
  const domains: string[] = [];
  if (t.includes("auth") || t.includes("login") || t.includes("rbac")) domains.push("auth", "security");
  if (t.includes("payment") || t.includes("fee") || t.includes("invoice") || t.includes("factoring")) domains.push("fintech");
  if (t.includes("supplier") || t.includes("catalog") || t.includes("onboard")) domains.push("supplier");
  if (t.includes("hotel") || t.includes("procurement") || t.includes("order")) domains.push("hotel");
  if (t.includes("ui") || t.includes("page") || t.includes("component") || t.includes("design")) domains.push("ui");
  if (t.includes("database") || t.includes("schema") || t.includes("prisma")) domains.push("database");
  if (t.includes("eta") || t.includes("tax") || t.includes("e-invoice")) domains.push("eta");
  if (t.includes("deploy") || t.includes("docker") || t.includes("ci/cd")) domains.push("platform");
  if (domains.length === 0) domains.push("platform");

  return {
    taskType: t.includes("fix") || t.includes("bug") ? "bugfix" : "feature",
    domains: [...new Set(domains)],
    complexity: t.includes("refactor") || t.includes("redesign") ? "high" : "medium",
    description: taskDescription.substring(0, 120),
    deliverables: ["Implementation", "Tests", "Documentation"],
  };
}

// ── Agent Assignment ──

export function assignAgents(analysis: TaskAnalysis): AgentAssignment[] {
  const assigned = new Set<string>();
  const assignments: AgentAssignment[] = [];

  // Pick lead agent from first domain
  const primaryDomain = analysis.domains[0] || "platform";
  const candidates = DOMAIN_AGENT_MAP[primaryDomain] || ["the-auditor"];
  const leadId = candidates[0];
  const lead = getAgentById(leadId);

  if (lead) {
    assignments.push({
      agent: lead,
      role: "lead",
      taskFragment: `Lead this ${analysis.taskType}. Own the architecture and integration. Ensure all deliverables: ${analysis.deliverables.join(", ")}`,
      priority: analysis.complexity === "critical" ? 10 : analysis.complexity === "high" ? 8 : 5,
      queue: "execution",
    });
    assigned.add(leadId);
  }

  // Pick contributors from other domains
  for (let i = 1; i < analysis.domains.length; i++) {
    const domain = analysis.domains[i];
    const domainAgents = DOMAIN_AGENT_MAP[domain] || [];
    for (const agentId of domainAgents) {
      if (assigned.has(agentId)) continue;
      const agent = getAgentById(agentId);
      if (!agent) continue;

      assignments.push({
        agent,
        role: "contributor",
        taskFragment: `Contribute ${domain} expertise to: ${analysis.description}. Focus on your specialty area.`,
        priority: analysis.complexity === "critical" ? 8 : analysis.complexity === "high" ? 6 : 4,
        queue: domain === "intelligence" || domain === "growth" ? "intelligence" : "execution",
      });
      assigned.add(agentId);
      break;
    }
  }

  // Always add Auditor for critical/high complexity
  if (analysis.complexity === "critical" || analysis.complexity === "high") {
    const auditor = getAgentById("the-auditor");
    if (auditor && !assigned.has("the-auditor")) {
      assignments.push({
        agent: auditor,
        role: "reviewer",
        taskFragment: `Review the ${analysis.taskType} for: TypeScript strictness, Zod validation, tenant isolation, RBAC enforcement, and Authority Matrix compliance.`,
        priority: 7,
        queue: "intelligence",
      });
    }
  }

  return assignments;
}

// ── Mission Dispatch ──

export async function dispatchSwarmMission(
  taskDescription: string,
  options: {
    dryRun?: boolean;
    skipApproval?: boolean;
  } = {}
): Promise<SwarmMissionResult> {
  const missionId = `M-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  console.log(`[Orchestrator] 🎯 Mission ${missionId}: ${taskDescription.substring(0, 80)}...`);

  // 1. Analyze task
  const analysis = await analyzeTask(taskDescription);
  console.log(`[Orchestrator] 📊 Domains: ${analysis.domains.join(", ")} | Complexity: ${analysis.complexity}`);

  // 2. Assign agents
  const assignments = assignAgents(analysis);
  console.log(`[Orchestrator] 👥 Agents: ${assignments.map((a) => `${a.agent.name} (${a.role})`).join(", ")}`);

  // 3. Dispatch jobs in PARALLEL
  const jobIds: string[] = [];

  if (!options.dryRun) {
    const dispatchPromises = assignments.map(async (assignment) => {
      const payload: SwarmJobPayload = {
        jobType: "agent_task",
        agentId: assignment.agent.id,
        agentName: assignment.agent.name,
        squad: assignment.agent.squad,
        systemPrompt: assignment.agent.systemPrompt,
        userPrompt: `[MISSION ${missionId}] ${assignment.taskFragment}\n\nOriginal task: ${taskDescription}\n\nYour role: ${assignment.role.toUpperCase()}\nComplexity: ${analysis.complexity}\nDeliverables: ${analysis.deliverables.join(", ")}`,
        requiresApproval: options.skipApproval ? false : assignment.agent.requiresApproval,
        memoryCategory: assignment.agent.memoryCategory,
      };

      // Use appropriate queue based on assignment
      const queue = assignment.queue === "intelligence" ? IntelligenceQueue : ExecutionQueue;
      const job = await queue.add(payload.jobType, payload, {
        priority: assignment.priority,
        jobId: `${missionId}-${assignment.agent.id}`,
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
      });

      return job.id || `${missionId}-${assignment.agent.id}-fallback`;
    });

    jobIds.push(...(await Promise.all(dispatchPromises)));

    // Store mission memory
    await storeMemory({
      agentId: "orchestrator",
      agentName: "Task Orchestrator",
      content: `Mission ${missionId}: ${analysis.description} | Agents: ${assignments.length} | Domains: ${analysis.domains.join(", ")}`,
      memoryType: "MISSION",
      category: "orchestration",
      jobId: missionId,
    });

    await recordSwarmEvent("mission_dispatched", "INFO", {
      missionId,
      agentCount: assignments.length,
      domains: analysis.domains,
      complexity: analysis.complexity,
    });
  }

  // 4. Generate summary
  const summary = `# Mission ${missionId}
**Task:** ${analysis.description}
**Type:** ${analysis.taskType} | **Complexity:** ${analysis.complexity}
**Domains:** ${analysis.domains.join(", ")}
**Agents Dispatched:** ${assignments.length}
${assignments.map((a) => `- **${a.agent.avatar} ${a.agent.name}** (${a.role}) — ${a.agent.role}`).join("\n")}
${options.dryRun ? "\n⚠️ DRY RUN — no jobs queued" : `\n✅ ${jobIds.length} jobs queued`}`;

  return {
    missionId,
    task: taskDescription,
    analysis,
    assignments,
    jobIds,
    summary,
  };
}

// ── Batch Mission: Run multiple tasks ──

export async function dispatchBatchMissions(
  tasks: string[]
): Promise<SwarmMissionResult[]> {
  console.log(`[Orchestrator] 📦 Batch dispatch: ${tasks.length} tasks`);

  const results = await Promise.all(
    tasks.map((task) => dispatchSwarmMission(task))
  );

  await recordSwarmEvent("batch_dispatched", "INFO", {
    taskCount: tasks.length,
    missionIds: results.map((r) => r.missionId),
  });

  return results;
}
