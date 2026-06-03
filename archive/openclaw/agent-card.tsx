"use client";

import { useState } from "react";
import { Bot, Play, Pause, Clock, Loader2 } from "lucide-react";
import type { SwarmAgentDef } from "@/lib/swarm/agents";

interface OpenClawAgentCardProps {
  agent: SwarmAgentDef;
  recentJob?: {
    status: string;
    createdAt: Date;
    durationMs: number | null;
  } | null;
}

const SQUAD_COLORS: Record<string, string> = {
  director: "#f59e0b",
  growth: "#34d399",
  operations: "#06b6d4",
  intelligence: "#a78bfa",
  execution: "#f472b6",
};

const STATUS_DOT: Record<string, string> = {
  RUNNING: "#34d399",
  COMPLETED: "#34d399",
  PENDING: "#fbbf24",
  FAILED: "#ef4444",
  WAITING_APPROVAL: "#f59e0b",
};

export function OpenClawAgentCard({ agent, recentJob }: OpenClawAgentCardProps) {
  const [running, setRunning] = useState(false);
  const squadColor = SQUAD_COLORS[agent.squad] || "rgba(255,255,255,0.20)";
  const statusColor = recentJob ? STATUS_DOT[recentJob.status] || "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.10)";

  async function handleRun() {
    setRunning(true);
    try {
      const res = await fetch("/api/v1/swarm/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          jobType: agent.id,
          prompt: `Execute ${agent.name}'s primary function: ${agent.role}.`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        window.location.reload();
      } else {
        alert(json.error || "Failed to queue job");
      }
    } catch {
      alert("Network error");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="glass-card p-3 hover:bg-white/[0.02] transition-colors group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{agent.avatar}</span>
          <div>
            <p className="text-xs font-semibold text-white">{agent.name}</p>
            <p className="text-[9px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">{agent.squad}</p>
          </div>
        </div>
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: statusColor }}
          title={recentJob?.status || "idle"}
        />
      </div>

      <p className="text-[10px] text-[rgba(255,255,255,0.35)] leading-relaxed mb-2 line-clamp-2">
        {agent.role}
      </p>

      <div className="flex items-center gap-1.5 mb-2">
        {agent.tools.slice(0, 4).map((tool) => (
          <span
            key={tool}
            className="px-1 py-0.5 text-[8px] font-mono text-[rgba(255,255,255,0.25)] bg-white/[0.03] rounded"
          >
            {tool.replace("openclaw_", "")}
          </span>
        ))}
        {agent.tools.length > 4 && (
          <span className="text-[8px] text-[rgba(255,255,255,0.15)]">+{agent.tools.length - 4}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
        <div className="flex items-center gap-1">
          <Clock size={9} className="text-[rgba(255,255,255,0.20)]" />
          <span className="text-[9px] text-[rgba(255,255,255,0.25)]">
            {recentJob
              ? new Date(recentJob.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "No recent jobs"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {agent.requiresApproval && (
            <span className="text-[8px] text-[#f59e0b] bg-[rgba(245,158,11,0.08)] px-1 py-0.5 rounded">
              Approval
            </span>
          )}
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-0.5 text-[8px] text-[#34d399] bg-[rgba(52,211,153,0.08)] hover:bg-[rgba(52,211,153,0.14)] px-1.5 py-0.5 rounded transition-colors disabled:opacity-50"
          >
            {running ? <Loader2 size={9} className="animate-spin" /> : <Play size={9} />}
            Run
          </button>
        </div>
      </div>
    </div>
  );
}
