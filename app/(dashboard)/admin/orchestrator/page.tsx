"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  RefreshCw,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Building2,
  Store,
  Package,
  Users,
  Wallet,
  FileCheck,
  ShieldCheck,
  X,
  ChevronRight,
  Loader2,
  Activity,
  Bot,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useApi, usePost } from "@/lib/hooks/use-api";

interface OrchestratorData {
  battlePlan: {
    date: string;
    content: string;
    confidence: number;
  } | null;
  squadHealth: Record<string, { total: number; completed: number; failed: number; avgDurationMs: number }>;
  recentJobs: Array<{
    id: string;
    jobType: string;
    squad: string;
    status: string;
    priority: number;
    result: string | null;
    createdAt: string;
    completedAt: string | null;
  }>;
  pendingApprovals: Array<{
    id: string;
    jobType: string;
    squad: string;
    status: string;
    priority: number;
    result: string | null;
    createdAt: string;
  }>;
  recentEvents: Array<{
    id: string;
    eventType: string;
    severity: string;
    message: string;
    metadata: unknown;
    createdAt: string;
    acknowledgedAt: Date | null;
  }>;
  metrics: {
    hotels: number;
    suppliers: number;
    orders: number;
    products: number;
    users: number;
    monthlyGmv: number;
    etaCompliantInvoices: number;
    factoringRequests: number;
  };
}

const SQUAD_COLORS: Record<string, string> = {
  director: "#8B0000",
  platform: "#6366f1",
  fintech: "#f59e0b",
  supplier: "#10b981",
  hotel: "#3b82f6",
  logistics: "#06b6d4",
  intelligence: "#8b5cf6",
  growth: "#ec4899",
};

const SEVERITY_ICONS: Record<string, React.ReactNode> = {
  CRITICAL: <AlertTriangle className="w-4 h-4 text-red-400" />,
  ERROR: <AlertTriangle className="w-4 h-4 text-orange-400" />,
  WARNING: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  INFO: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
};

const SEVERITY_BG: Record<string, string> = {
  CRITICAL: "bg-red-500/10 border-red-500/20",
  ERROR: "bg-orange-500/10 border-orange-500/20",
  WARNING: "bg-amber-500/10 border-amber-500/20",
  INFO: "bg-emerald-500/10 border-emerald-500/20",
};

export default function OrchestratorPage() {
  const { data, loading, error, refetch } = useApi<OrchestratorData>("/api/v1/admin/orchestrator");
  const { post: triggerPlan, loading: planning } = usePost("/api/v1/swarm/director/plan");
  const [activeTab, setActiveTab] = useState<"overview" | "approvals" | "events">("overview");

  const handleTriggerPlan = async () => {
    try {
      await triggerPlan({});
      setTimeout(refetch, 2000);
    } catch {
      // Error handled by hook
    }
  };

  const platformMetrics = [
    { label: "Hotels", value: data?.metrics.hotels ?? 0, icon: Building2, color: "#3b82f6" },
    { label: "Suppliers", value: data?.metrics.suppliers ?? 0, icon: Store, color: "#10b981" },
    { label: "Products", value: data?.metrics.products ?? 0, icon: Package, color: "#8b5cf6" },
    { label: "Orders", value: data?.metrics.orders ?? 0, icon: Wallet, color: "#f59e0b" },
    { label: "Users", value: data?.metrics.users ?? 0, icon: Users, color: "#06b6d4" },
    { label: "Monthly GMV", value: `EGP ${((data?.metrics.monthlyGmv ?? 0) / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "#8B0000" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/[0.06]">
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8B0000]/15 flex items-center justify-center">
                <BrainCircuit className="w-4.5 h-4.5 text-[#8B0000]" />
              </div>
              <h1 className="text-[22px] font-bold tracking-tight text-white">AI Command Center</h1>
            </div>
            <p className="text-[13px] text-white/40 mt-1">Master Orchestrator — Real-time agent coordination & strategic oversight</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPlan}
              disabled={planning}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B0000] hover:bg-[#6B0000] disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors"
            >
              {planning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              Run Director Cycle
            </button>
            <button
              onClick={refetch}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
            {error}
          </div>
        )}

        {/* Platform Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {platformMetrics.map((m) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-[#0f0f0f] border border-white/[0.06]"
            >
              <div className="flex items-center gap-2 mb-2">
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
                <span className="text-[11px] text-white/40 uppercase tracking-wider">{m.label}</span>
              </div>
              <div className="text-[22px] font-bold text-white">{loading ? "—" : m.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Battle Plan + Squad Health */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Battle Plan */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 p-5 rounded-xl bg-[#0f0f0f] border border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#C9A227]" />
                <h2 className="text-[14px] font-semibold text-white">Current Battle Plan</h2>
              </div>
              {data?.battlePlan && (
                <span className="text-[11px] text-white/30">
                  {new Date(data.battlePlan.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
            </div>
            {data?.battlePlan ? (
              <div className="space-y-3">
                <p className="text-[13px] text-white/60 leading-relaxed">{data.battlePlan.content}</p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8B0000]/10 border border-[#8B0000]/20 text-[11px] font-medium text-[#C9A227]">
                    <Activity className="w-3 h-3" />
                    Confidence: {Math.round((data.battlePlan.confidence || 0) * 100)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-white/30 text-[13px]">
                <BrainCircuit className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No battle plan yet. Run the Director cycle to generate one.
              </div>
            )}
          </motion.div>

          {/* Squad Health */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-xl bg-[#0f0f0f] border border-white/[0.06]"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-[14px] font-semibold text-white">Squad Health</h2>
            </div>
            <div className="space-y-3">
              {data?.squadHealth && Object.entries(data.squadHealth).map(([squad, stats]) => {
                const successRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                const color = SQUAD_COLORS[squad] || "#8B5CF6";
                return (
                  <div key={squad} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-white/70 capitalize">{squad}</span>
                        <span className="text-[11px] text-white/40">{stats.total} jobs</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${successRate}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color }}>{successRate}%</span>
                  </div>
                );
              })}
              {(!data?.squadHealth || Object.keys(data.squadHealth).length === 0) && (
                <p className="text-[12px] text-white/30 text-center py-4">No squad activity in the last 7 days</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Tabs: Overview | Approvals | Events */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06] w-fit">
          {(["overview", "approvals", "events"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#8B0000] text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab === "overview" && "Agent Fleet"}
              {tab === "approvals" && (
                <span className="flex items-center gap-1.5">
                  Approvals
                  {data && data.pendingApprovals.length > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#C9A227] text-[10px] font-bold text-[#050505] flex items-center justify-center">
                      {data.pendingApprovals.length}
                    </span>
                  )}
                </span>
              )}
              {tab === "events" && "Events & Alerts"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-white">Recent Agent Jobs</h3>
              <Link href="/admin/swarm" className="text-[11px] text-[#8B0000] hover:text-[#A52A2A] flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {data?.recentJobs?.map((job) => (
                <div key={job.id} className="px-5 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${SQUAD_COLORS[job.squad] || "#8B5CF6"}15` }}
                  >
                    <Bot className="w-4 h-4" style={{ color: SQUAD_COLORS[job.squad] || "#8B5CF6" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-white truncate">{job.jobType}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 capitalize">{job.squad}</span>
                    </div>
                    {job.result && (
                      <p className="text-[11px] text-white/30 truncate mt-0.5">{job.result}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      job.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" :
                      job.status === "FAILED" ? "bg-red-500/10 text-red-400" :
                      job.status === "RUNNING" ? "bg-blue-500/10 text-blue-400" :
                      "bg-amber-500/10 text-amber-400"
                    }`}>
                      {job.status}
                    </span>
                    <span className="text-[11px] text-white/30">P{job.priority}</span>
                  </div>
                </div>
              ))}
              {(!data?.recentJobs || data.recentJobs.length === 0) && !loading && (
                <div className="px-5 py-8 text-center text-white/30 text-[13px]">No recent jobs</div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "approvals" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-white/[0.06]">
              <h3 className="text-[13px] font-semibold text-white">Pending Human Approvals</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {data?.pendingApprovals?.map((job) => (
                <div key={job.id} className="px-5 py-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-white">{job.jobType}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 capitalize">{job.squad}</span>
                    </div>
                    {job.result && (
                      <p className="text-[12px] text-white/40 mt-1 leading-relaxed">{job.result}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] text-white/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(job.createdAt).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-amber-400 font-medium">Priority {job.priority}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="px-3 py-1.5 text-[12px] font-medium bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1.5 text-[12px] font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {(!data?.pendingApprovals || data.pendingApprovals.length === 0) && !loading && (
                <div className="px-5 py-8 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-[13px] text-white/40">All caught up — no pending approvals</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "events" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-white">Recent Events & Alerts</h3>
              <Link href="/admin/health" className="text-[11px] text-[#8B0000] hover:text-[#A52A2A] flex items-center gap-1 transition-colors">
                System Health <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {data?.recentEvents?.map((event) => (
                <div key={event.id} className={`px-5 py-3 flex items-start gap-3 hover:bg-white/[0.02] transition-colors ${SEVERITY_BG[event.severity] || ""}`}>
                  <div className="mt-0.5 flex-shrink-0">{SEVERITY_ICONS[event.severity] || SEVERITY_ICONS.INFO}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-white">{event.eventType}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        event.severity === "CRITICAL" ? "bg-red-500/20 text-red-400" :
                        event.severity === "ERROR" ? "bg-orange-500/20 text-orange-400" :
                        event.severity === "WARNING" ? "bg-amber-500/20 text-amber-400" :
                        "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {event.severity}
                      </span>
                      {!event.acknowledgedAt && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
                      )}
                    </div>
                    <p className="text-[12px] text-white/50 mt-0.5">{event.message}</p>
                    <span className="text-[10px] text-white/25 mt-1 block">
                      {new Date(event.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              {(!data?.recentEvents || data.recentEvents.length === 0) && !loading && (
                <div className="px-5 py-8 text-center text-white/30 text-[13px]">No recent events</div>
              )}
            </div>
          </motion.div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Swarm Control", desc: "Agent grid, job queue, health metrics", to: "/admin/swarm", icon: Bot },
            { label: "System Health", desc: "Real-time service status & diagnostics", to: "/admin/health", icon: Activity },
            { label: "Analytics", desc: "Platform-wide GMV, orders & trends", to: "/analytics", icon: BarChart3 },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.to}
              className="group flex items-center gap-4 p-4 rounded-xl bg-[#0f0f0f] border border-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8B0000]/10 flex items-center justify-center">
                <link.icon className="w-5 h-5 text-[#8B0000]" />
              </div>
              <div className="flex-1">
                <h4 className="text-[13px] font-semibold text-white group-hover:text-[#C9A227] transition-colors">{link.label}</h4>
                <p className="text-[11px] text-white/30">{link.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
