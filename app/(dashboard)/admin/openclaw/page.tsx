import { Metadata } from "next";
import { Bot, Activity, Play, Pause, RefreshCw, Terminal, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { checkOpenClawHealth } from "@/lib/integrations/openclaw";
import { SWARM_AGENTS } from "@/lib/swarm/agents";
import { OpenClawAgentCard } from "@/components/openclaw/agent-card";
import { JobQueueMini } from "@/components/openclaw/job-queue-mini";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agent Control Center",
};

async function getDashboardData() {
  const [recentJobs, jobCounts, health] = await Promise.all([
    prisma.swarmJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        jobType: true,
        jobName: true,
        status: true,
        squad: true,
        assignedAgent: true,
        createdAt: true,
        durationMs: true,
      },
    }),
    prisma.swarmJob.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    checkOpenClawHealth(),
  ]);

  const statusCounts = Object.fromEntries(
    jobCounts.map((j) => [j.status, j._count.status])
  );

  return { recentJobs, statusCounts, health };
}

export default async function AgentControlCenterPage() {
  const data = await getDashboardData();

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Terminal size={22} className="text-[#800000]" />
            <span className="gradient-text-animated">Agent Control Center</span>
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.40)] mt-0.5">
            Orchestrate 15 autonomous agents across 5 squads — OpenClaw-powered execution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              data.health.gateway
                ? "bg-[rgba(52,211,153,0.08)] text-[#34d399] border-[rgba(52,211,153,0.20)]"
                : "bg-[rgba(239,68,68,0.08)] text-[#ef4444] border-[rgba(239,68,68,0.20)]"
            }`}
          >
            <Activity size={12} />
            {data.health.gateway ? "Gateway Online" : "Gateway Offline"}
          </span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-in-up">
        <div className="glass-card p-4">
          <p className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">Total Agents</p>
          <p className="text-2xl font-bold text-white metric-value mt-1">{SWARM_AGENTS.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">Active Jobs</p>
          <p className="text-2xl font-bold text-[#34d399] metric-value mt-1">
            {data.statusCounts["RUNNING"] || 0}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">Completed Today</p>
          <p className="text-2xl font-bold text-white metric-value mt-1">
            {data.statusCounts["COMPLETED"] || 0}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-[#fbbf24] metric-value mt-1">
            {data.statusCounts["PENDING"] || 0}
          </p>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Bot size={14} className="text-[rgba(255,255,255,0.40)]" />
            Swarm Agents
          </h2>
          <span className="text-[10px] text-[rgba(255,255,255,0.25)] uppercase tracking-wider">
            {SWARM_AGENTS.length} agents across 5 squads
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {SWARM_AGENTS.map((agent) => (
            <OpenClawAgentCard
              key={agent.id}
              agent={agent}
              recentJob={data.recentJobs.find((j) => j.assignedAgent === agent.id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Row: Job Queue + OpenClaw Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 animate-fade-in-up">
        <div className="lg:col-span-2 glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <RefreshCw size={14} className="text-[rgba(255,255,255,0.40)]" />
              Recent Jobs
            </h2>
            <Link
              href="/admin/swarm"
              className="text-[10px] text-[rgba(255,255,255,0.30)] hover:text-white transition-colors"
            >
              View All →
            </Link>
          </div>
          <JobQueueMini jobs={data.recentJobs} />
        </div>

        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Zap size={14} className="text-[rgba(255,255,255,0.40)]" />
            OpenClaw Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-xs text-[rgba(255,255,255,0.40)]">Gateway</span>
              <span className={`text-xs font-medium ${data.health.gateway ? "text-[#34d399]" : "text-[#ef4444]"}`}>
                {data.health.gateway ? "Online" : "Offline"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-xs text-[rgba(255,255,255,0.40)]">Automation</span>
              <span className={`text-xs font-medium ${data.health.automation ? "text-[#34d399]" : "text-[#ef4444]"}`}>
                {data.health.automation ? "Online" : "Offline"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <span className="text-xs text-[rgba(255,255,255,0.40)]">Gateway URL</span>
              <span className="text-[9px] text-[rgba(255,255,255,0.25)] font-mono truncate max-w-[120px]">
                {data.health.gatewayUrl}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-[rgba(255,255,255,0.40)]">Automation URL</span>
              <span className="text-[9px] text-[rgba(255,255,255,0.25)] font-mono truncate max-w-[120px]">
                {data.health.automationUrl}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
