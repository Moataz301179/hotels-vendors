"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot, Brain, Zap, Activity, Sparkles, Play, Settings,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface AgentRun {
  id: string;
  agentName: string;
  status: string;
  taskDescription: string;
  startedAt: string;
  completedAt: string | null;
  result: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    completed: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Completed" },
    running: { bg: "bg-[#bef264]/10", text: "text-[#bef264]", dot: "bg-[#bef264]", label: "Running" },
    failed: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Failed" },
    queued: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Queued" },
  };
  const c = config[status] || config.queued;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export default function AIAgentsPage() {
  const [selectedSquad, setSelectedSquad] = useState("all");

  const { data: runsData, loading: runsLoading, error: runsError } = useApi<{ data: AgentRun[] }>(
    "/api/intelligence/agent-runs?page=1&limit=20"
  );

  const runs = runsData?.data ?? [];

  const stats = [
    { label: "Active Agents", value: "15", change: "All squads online", up: true, icon: Bot },
    { label: "Tasks Today", value: runs.filter((r) => new Date(r.startedAt).toDateString() === new Date().toDateString()).length.toString(), change: "+28 from yesterday", up: true, icon: Zap },
    { label: "Success Rate", value: runs.length > 0 ? `${Math.round((runs.filter((r) => r.status === "completed").length / runs.length) * 100)}%` : "—", change: "Avg completion", up: true, icon: CheckCircle2 },
    { label: "Queue Depth", value: runs.filter((r) => r.status === "queued").length.toString(), change: "Low backlog", up: true, icon: Activity },
  ];

  const AGENTS = [
    { id: "growth-01", name: "Lead Harvester", squad: "Growth", status: "active", tasks: 45, success: 98, description: "Auto-enrich and qualify inbound leads", icon: "Target" },
    { id: "growth-02", name: "SEO Strategist", squad: "Growth", status: "active", tasks: 32, success: 94, description: "Optimize content and keyword targeting", icon: "TrendingUp" },
    { id: "ops-01", name: "Inventory Sync", squad: "Operations", status: "active", tasks: 128, success: 99, description: "Real-time supplier inventory updates", icon: "Zap" },
    { id: "ops-02", name: "Route Optimizer", squad: "Operations", status: "idle", tasks: 0, success: 100, description: "AI-powered delivery route planning", icon: "Activity" },
    { id: "intel-01", name: "Price Watcher", squad: "Intelligence", status: "active", tasks: 67, success: 97, description: "Market price monitoring and alerts", icon: "TrendingUp" },
    { id: "intel-02", name: "Trust Scorer", squad: "Intelligence", status: "active", tasks: 23, success: 92, description: "Supplier risk assessment engine", icon: "Brain" },
    { id: "exec-01", name: "Order Processor", squad: "Execution", status: "active", tasks: 89, success: 96, description: "Automated order approval workflow", icon: "CheckCircle2" },
    { id: "exec-02", name: "ETA Validator", squad: "Execution", status: "active", tasks: 47, success: 99, description: "Invoice compliance verification", icon: "Activity" },
  ];

  const filteredAgents = AGENTS.filter((a) => selectedSquad === "all" || a.squad === selectedSquad);
  const squads = ["all", "Growth", "Operations", "Intelligence", "Execution"];

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">AI Agent Swarm</h1>
            <Sparkles size={18} className="text-[#bef264]" />
          </div>
          <p className="text-sm text-white/40 mt-0.5">Autonomous agent orchestration, task execution, and swarm intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-white/80 transition-all">
            <Settings size={14} />
            Configure
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#bef264] hover:bg-[#bef264]/80 text-xs text-white font-medium transition-all">
            <Play size={14} />
            Run All
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeInUp}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{s.label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <s.icon size={15} className="text-white/40" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {s.up ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
              <span className={`text-[11px] font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Squad Filter */}
      <motion.div variants={fadeInUp} className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04] w-fit">
        {squads.map((squad) => (
          <button
            key={squad}
            onClick={() => setSelectedSquad(squad)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedSquad === squad ? "bg-white/[0.06] text-white border border-white/[0.08]" : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
            }`}
          >
            {squad === "all" ? "All Squads" : squad}
          </button>
        ))}
      </motion.div>

      {/* Agents Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.025] transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Bot size={16} className="text-white/40" />
              </div>
              <StatusBadge status={agent.status} />
            </div>
            <h3 className="text-sm font-semibold text-white mb-0.5">{agent.name}</h3>
            <p className="text-[11px] text-white/25 mb-3">{agent.description}</p>
            <div className="flex items-center justify-between text-[10px] text-white/20 mb-2">
              <span>Squad: {agent.squad}</span>
              <span>{agent.tasks} tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${agent.success}%` }} />
              </div>
              <span className="text-[10px] text-white/30">{agent.success}%</span>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] text-[10px] text-white/40 hover:text-white/60 transition-colors">
                <Play size={11} /> Run
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] text-[10px] text-white/40 hover:text-white/60 transition-colors">
                <Settings size={11} /> Config
              </button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Recent Runs */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock size={14} className="text-white/40" />
            Recent Agent Runs
          </h3>
        </div>
        {runsLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-white/[0.02] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : runsError ? (
          <div className="p-4"><EmptyState title="Error loading runs" description={runsError} /></div>
        ) : runs.length === 0 ? (
          <div className="p-4"><EmptyState title="No runs yet" description="Agent runs will appear here once executed." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Agent</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Task</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">When</th>
                </tr>
              </thead>
              <tbody>
                {runs.slice(0, 8).map((run) => (
                  <tr key={run.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-2.5"><span className="text-xs font-medium text-white">{run.agentName}</span></td>
                    <td className="px-4 py-2.5"><span className="text-[11px] text-white/40">{run.taskDescription?.slice(0, 40)}...</span></td>
                    <td className="px-4 py-2.5"><StatusBadge status={run.status} /></td>
                    <td className="px-4 py-2.5"><span className="text-[11px] text-white/30">{new Date(run.startedAt).toLocaleDateString()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
