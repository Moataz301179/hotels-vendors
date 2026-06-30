import { Metadata } from "next";
import {
  Activity, Globe, Bot, Camera, Workflow, Settings,
  CheckCircle2, XCircle, ArrowUpRight, Zap, Clock,
  Shield, Terminal, ImageIcon, Play, Pause, RefreshCw,
  Link2, ExternalLink, AlertTriangle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { checkOpenClawHealth } from "@/lib/integrations/openclaw";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OpenClaw Integration Hub",
};

async function getOpenClawData() {
  const [recentJobs, jobCounts, health] = await Promise.all([
    prisma.swarmJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
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

  // Mock workflow data (replace with real data when available)
  const workflows = [
    { id: "wf-1", name: "Landing Page Screenshot", status: "active", lastRun: "2m ago", frequency: "On push", type: "visual-test" },
    { id: "wf-2", name: "Catalog Visual Regression", status: "active", lastRun: "15m ago", frequency: "Hourly", type: "visual-test" },
    { id: "wf-3", name: "Auth Flow Automation", status: "paused", lastRun: "2h ago", frequency: "Daily", type: "e2e-test" },
    { id: "wf-4", name: "Supplier Onboarding Check", status: "active", lastRun: "5m ago", frequency: "Real-time", type: "validation" },
  ];

  const screenshots = [
    { id: "ss-1", name: "Landing Page — Desktop", status: "passed", timestamp: "2m ago", size: "1920×1080" },
    { id: "ss-2", name: "Landing Page — Mobile", status: "passed", timestamp: "2m ago", size: "375×812" },
    { id: "ss-3", name: "Catalog — Grid View", status: "failed", timestamp: "15m ago", size: "1920×1080" },
    { id: "ss-4", name: "Login Page", status: "passed", timestamp: "1h ago", size: "1920×1080" },
  ];

  return { recentJobs, statusCounts, health, workflows, screenshots };
}

export default async function OpenClawHubPage() {
  const data = await getOpenClawData();

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "#34d399";
      case "paused": return "#fbbf24";
      case "failed": return "#ef4444";
      case "passed": return "#34d399";
      case "COMPLETED": return "#34d399";
      case "RUNNING": return "#60a5fa";
      case "PENDING": return "#fbbf24";
      case "FAILED": return "#ef4444";
      default: return "rgba(255,255,255,0.30)";
    }
  };

  const statusBg = (status: string) => {
    switch (status) {
      case "active":
      case "passed":
      case "COMPLETED": return "rgba(52,211,153,0.08)";
      case "paused":
      case "PENDING": return "rgba(251,191,36,0.08)";
      case "failed":
      case "FAILED": return "rgba(239,68,68,0.08)";
      case "RUNNING": return "rgba(96,165,250,0.08)";
      default: return "rgba(255,255,255,0.03)";
    }
  };

  const statusBorder = (status: string) => {
    switch (status) {
      case "active":
      case "passed":
      case "COMPLETED": return "rgba(52,211,153,0.20)";
      case "paused":
      case "PENDING": return "rgba(251,191,36,0.20)";
      case "failed":
      case "FAILED": return "rgba(239,68,68,0.20)";
      case "RUNNING": return "rgba(96,165,250,0.20)";
      default: return "rgba(255,255,255,0.06)";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Globe size={22} className="text-accent-base" />
            <span className="gradient-text-animated">OpenClaw Integration Hub</span>
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.40)] mt-0.5">
            Visual testing, automation workflows, and gateway orchestration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/swarm"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-subtle10 text-foreground/70 hover:bg-surface-raised hover:text-foreground transition-colors"
          >
            <Bot size={12} />
            Swarm Center
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              data.health.gateway && data.health.automation
                ? "bg-[rgba(52,211,153,0.08)] text-[#34d399] border-[rgba(52,211,153,0.20)]"
                : "bg-[rgba(239,68,68,0.08)] text-[#ef4444] border-[rgba(239,68,68,0.20)]"
            }`}
          >
            <Activity size={12} />
            {data.health.gateway && data.health.automation ? "All Online" : "Degraded"}
          </span>
        </div>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 animate-fade-in-up">
        {/* Gateway */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data.health.gateway ? "bg-[rgba(52,211,153,0.10)]" : "bg-[rgba(239,68,68,0.10)]"}`}>
                <Zap size={16} className={data.health.gateway ? "text-[#34d399]" : "text-[#ef4444]"} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Gateway</p>
                <p className="text-[10px] text-foreground-muted">UI & Chat Interface</p>
              </div>
            </div>
            {data.health.gateway ? (
              <CheckCircle2 size={16} className="text-[#34d399]" />
            ) : (
              <XCircle size={16} className="text-[#ef4444]" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-muted">URL</span>
              <span className="text-foreground-tertiary font-mono truncate max-w-[180px]">{data.health.gatewayUrl}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-muted">Status</span>
              <span className={data.health.gateway ? "text-[#34d399]" : "text-[#ef4444]"}>
                {data.health.gateway ? "Operational" : "Unreachable"}
              </span>
            </div>
          </div>
        </div>

        {/* Automation */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data.health.automation ? "bg-[rgba(52,211,153,0.10)]" : "bg-[rgba(239,68,68,0.10)]"}`}>
                <Terminal size={16} className={data.health.automation ? "text-[#34d399]" : "text-[#ef4444]"} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Automation</p>
                <p className="text-[10px] text-foreground-muted">Browser & API Engine</p>
              </div>
            </div>
            {data.health.automation ? (
              <CheckCircle2 size={16} className="text-[#34d399]" />
            ) : (
              <XCircle size={16} className="text-[#ef4444]" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-muted">URL</span>
              <span className="text-foreground-tertiary font-mono truncate max-w-[180px]">{data.health.automationUrl}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-muted">Status</span>
              <span className={data.health.automation ? "text-[#34d399]" : "text-[#ef4444]"}>
                {data.health.automation ? "Operational" : "Unreachable"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[rgba(2,35,73,0.15)] flex items-center justify-center">
                <Camera size={16} className="text-accent-base" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Visual Tests</p>
                <p className="text-[10px] text-foreground-muted">Today</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-[rgba(52,211,153,0.06)] border border-[rgba(52,211,153,0.12)]">
              <p className="text-lg font-bold text-[#34d399]">{data.screenshots.filter(s => s.status === "passed").length}</p>
              <p className="text-[9px] text-foreground-muted uppercase">Passed</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.12)]">
              <p className="text-lg font-bold text-[#ef4444]">{data.screenshots.filter(s => s.status === "failed").length}</p>
              <p className="text-[9px] text-foreground-muted uppercase">Failed</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-surface-raised border border-subtle">
              <p className="text-lg font-bold text-foreground">{data.statusCounts["RUNNING"] || 0}</p>
              <p className="text-[9px] text-foreground-muted uppercase">Running</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workflows + Screenshots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6 animate-fade-in-up">
        {/* Workflows */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Workflow size={14} className="text-foreground-tertiary" />
              Automation Workflows
            </h2>
            <button className="text-[10px] text-foreground-muted hover:text-foreground-tertiary transition-colors flex items-center gap-1">
              <RefreshCw size={10} /> Refresh
            </button>
          </div>
          <div className="space-y-2">
            {data.workflows.map((wf) => (
              <div key={wf.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-surface-raised transition-colors group">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: statusColor(wf.status) }}
                  />
                  <div>
                    <p className="text-sm text-foreground">{wf.name}</p>
                    <p className="text-[10px] text-foreground-muted">{wf.frequency} · {wf.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-foreground-muted">{wf.lastRun}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {wf.status === "paused" ? (
                      <Play size={14} className="text-[#34d399]" />
                    ) : (
                      <Pause size={14} className="text-[#fbbf24]" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Screenshots */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ImageIcon size={14} className="text-foreground-tertiary" />
              Recent Screenshots
            </h2>
            <Link href="#" className="text-[10px] text-foreground-muted hover:text-foreground-tertiary transition-colors flex items-center gap-1">
              View All <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="space-y-2">
            {data.screenshots.map((ss) => (
              <div key={ss.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-surface-raised transition-colors group">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: statusBg(ss.status), border: `1px solid ${statusBorder(ss.status)}` }}
                  >
                    <Camera size={14} style={{ color: statusColor(ss.status) }} />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{ss.name}</p>
                    <p className="text-[10px] text-foreground-muted">{ss.size} · {ss.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: statusBg(ss.status),
                      color: statusColor(ss.status),
                      border: `1px solid ${statusBorder(ss.status)}`,
                    }}
                  >
                    {ss.status}
                  </span>
                  <ExternalLink size={12} className="text-foreground/15 group-hover:text-foreground-tertiary transition-opacity cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Jobs + Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 animate-fade-in-up">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Terminal size={14} className="text-foreground-tertiary" />
              Recent Agent Jobs
            </h2>
            <Link
              href="/admin/swarm"
              className="text-[10px] text-foreground-muted hover:text-foreground-tertiary transition-colors flex items-center gap-1"
            >
              Swarm Center <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="space-y-1">
            {data.recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-raised transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: statusColor(job.status) }}
                  />
                  <div>
                    <p className="text-sm text-foreground">{job.jobName}</p>
                    <p className="text-[10px] text-foreground-muted">{job.squad} · {job.assignedAgent}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-foreground-muted">
                    {job.durationMs ? `${(job.durationMs / 1000).toFixed(1)}s` : "—"}
                  </span>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: statusBg(job.status),
                      color: statusColor(job.status),
                      border: `1px solid ${statusBorder(job.status)}`,
                    }}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings size={14} className="text-foreground-tertiary" />
            Configuration
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-subtle">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-foreground-muted" />
                <span className="text-xs text-foreground-muted">Auto-screenshot on deploy</span>
              </div>
              <div className="w-8 h-4 rounded-full bg-[#34d399]/20 relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-[#34d399]" />
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-subtle">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-foreground-muted" />
                <span className="text-xs text-foreground-muted">Schedule interval</span>
              </div>
              <span className="text-[10px] text-foreground-tertiary font-mono">15 min</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-subtle">
              <div className="flex items-center gap-2">
                <Link2 size={14} className="text-foreground-muted" />
                <span className="text-xs text-foreground-muted">Webhook URL</span>
              </div>
              <span className="text-[9px] text-foreground-muted font-mono truncate max-w-[80px]">
                /api/v1/webhooks/openclaw
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-foreground-muted" />
                <span className="text-xs text-foreground-muted">Fail alerts</span>
              </div>
              <div className="w-8 h-4 rounded-full bg-[#34d399]/20 relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-[#34d399]" />
              </div>
            </div>
          </div>
          <button className="mt-4 w-full py-2 text-[11px] font-medium border border-subtle10 text-foreground-tertiary hover:bg-surface-raised hover:text-foreground transition-colors rounded-lg">
            Edit Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
