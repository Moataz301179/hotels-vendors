"use client";

import { useState, useEffect, useCallback } from "react";
import { AgentGrid } from "@/components/swarm/agent-grid";
import { JobQueue } from "@/components/swarm/job-queue";
import { HealthMetrics } from "@/components/swarm/health-metrics";

interface SwarmData {
  agents: Array<{
    id: string;
    name: string;
    squad: string;
    avatar: string;
    role: string;
    capabilities: string[];
    requiresApproval: boolean;
  }>;
  jobs: Array<{
    id: string;
    jobType: string;
    jobName: string;
    status: string;
    squad: string;
    assignedAgent: string | null;
    startedAt: string | null;
    completedAt: string | null;
    durationMs: number | null;
    error: string | null;
    requiresApproval: boolean;
  }>;
  health: {
    summary: {
      totalJobs: number;
      completedJobs: number;
      failedJobs: number;
      pendingJobs: number;
      waitingApproval: number;
      successRate: number;
    };
    eventsBySeverity: Record<string, number>;
    modelHealth: Array<{
      provider: string;
      model: string;
      status: string;
    }>;
  };
}

export default function SwarmDashboard() {
  const [data, setData] = useState<SwarmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"agents" | "jobs" | "health">("agents");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [agentsRes, jobsRes, healthRes] = await Promise.all([
        fetch("/api/v1/swarm/agents"),
        fetch("/api/v1/swarm/jobs?limit=50"),
        fetch("/api/v1/swarm/health"),
      ]);

      const agents = await agentsRes.json();
      const jobs = await jobsRes.json();
      const health = await healthRes.json();

      setData({
        agents: agents.data?.agents || [],
        jobs: jobs.data?.jobs || [],
        health: health.data?.health || {
          summary: { totalJobs: 0, completedJobs: 0, failedJobs: 0, pendingJobs: 0, waitingApproval: 0, successRate: 0 },
          eventsBySeverity: {},
          modelHealth: [],
        },
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch swarm data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const triggerDirector = async () => {
    try {
      setTriggering(true);
      const res = await fetch("/api/v1/swarm/director/plan", { method: "POST" });
      if (!res.ok) throw new Error("Failed to trigger director");
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to trigger director");
    } finally {
      setTriggering(false);
    }
  };

  const approveJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/v1/swarm/jobs/${jobId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Approved via dashboard" }),
      });
      if (!res.ok) throw new Error("Failed to approve job");
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to approve job");
    }
  };

  const triggerAgent = async (agentId: string) => {
    try {
      const res = await fetch("/api/v1/swarm/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          jobType: "lead_scout",
          prompt: `Manual trigger for ${agentId}`,
          priority: 8,
        }),
      });
      if (!res.ok) throw new Error("Failed to trigger agent");
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to trigger agent");
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/50 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>🐎</span>
            Swarm Command Center
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Autonomous agent orchestration & marketplace growth engine
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="px-3 py-1.5 rounded-md border border-white/10 text-xs text-white/80 hover:bg-white/10 transition-colors"
          >
            ↻ Refresh
          </button>
          <button
            onClick={triggerDirector}
            disabled={triggering}
            className="px-3 py-1.5 rounded-md bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-xs transition-colors disabled:opacity-50"
          >
            {triggering ? "⏳ Running..." : "▶ Run Director Cycle"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-1">
          {[
            { key: "agents" as const, label: `Agents (${data?.agents.length || 0})` },
            { key: "jobs" as const, label: `Jobs (${data?.jobs.length || 0})` },
            { key: "health" as const, label: "Health" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-white/40 text-white"
                  : "border-transparent text-white/40 hover:text-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {data && (
        <div className="space-y-6">
          {activeTab === "agents" && (
            <AgentGrid agents={data.agents} onTriggerAgent={triggerAgent} />
          )}
          {activeTab === "jobs" && (
            <JobQueue jobs={data.jobs} onApprove={approveJob} onRefresh={fetchData} />
          )}
          {activeTab === "health" && (
            <HealthMetrics health={data.health} />
          )}
        </div>
      )}
    </div>
  );
}
