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
  const [activeTab, setActiveTab] = useState<"agents" | "jobs" | "health" | "orchestrate">("orchestrate");
  const [taskInput, setTaskInput] = useState("");
  const [orchestrateResult, setOrchestrateResult] = useState<{
    missionId: string;
    agents: Array<{ id: string; name: string; avatar: string; role: string; squad: string }>;
    summary: string;
  } | null>(null);
  const [orchestrating, setOrchestrating] = useState(false);

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

  const runOrchestrator = async () => {
    if (!taskInput.trim()) return;
    try {
      setOrchestrating(true);
      setOrchestrateResult(null);
      const res = await fetch("/api/v1/swarm/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskInput, skipApproval: true }),
      });
      if (!res.ok) throw new Error("Orchestrator failed");
      const result = await res.json();
      setOrchestrateResult(result);
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Orchestrator failed");
    } finally {
      setOrchestrating(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-subtle20 border-t-white/50 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span>🐎</span>
            Swarm Command Center
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Autonomous agent orchestration & marketplace growth engine
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="px-3 py-1.5 rounded-md border border-subtle10 text-xs text-foreground/80 hover:bg-surface-raised transition-colors"
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
      <div className="border-b border-subtle10">
        <div className="flex gap-1">
          {[
            { key: "orchestrate" as const, label: "🎯 Orchestrate" },
            { key: "agents" as const, label: `Agents (${data?.agents.length || 0})` },
            { key: "jobs" as const, label: `Jobs (${data?.jobs.length || 0})` },
            { key: "health" as const, label: "Health" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-subtle40 text-foreground"
                  : "border-transparent text-foreground-tertiary hover:text-foreground-tertiary"
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
          {activeTab === "orchestrate" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-subtle10 bg-surface-raised p-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">Multi-Agent Task Orchestrator</h2>
                <p className="text-sm text-foreground-muted mb-4">
                  Describe a development task. The swarm will analyze it, assign the right specialists,
                  and dispatch them in parallel.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runOrchestrator()}
                    placeholder="e.g., Build authentication flow with JWT, RBAC, and Authority Matrix..."
                    className="flex-1 px-4 py-2.5 rounded-lg bg-black/30 border border-subtle10 text-foreground placeholder:text-foreground-muted text-sm focus:outline-none focus:border-subtle30"
                  />
                  <button
                    onClick={runOrchestrator}
                    disabled={orchestrating || !taskInput.trim()}
                    className="px-5 py-2.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {orchestrating ? "⏳ Dispatching..." : "🚀 Dispatch Swarm"}
                  </button>
                </div>
              </div>

              {orchestrateResult && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-lg">✅</span>
                    <h3 className="text-foreground font-semibold">Mission Dispatched: {orchestrateResult.missionId}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {orchestrateResult.agents.map((agent) => (
                      <div
                        key={agent.id}
                        className="rounded-lg border border-subtle10 bg-surface-raised p-3 flex items-center gap-3"
                      >
                        <span className="text-xl">{agent.avatar}</span>
                        <div>
                          <div className="text-foreground text-sm font-medium">{agent.name}</div>
                          <div className="text-foreground-tertiary text-xs">{agent.role} • {agent.squad}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <pre className="text-xs text-foreground-tertiary bg-black/30 rounded-lg p-3 overflow-x-auto">
                    {orchestrateResult.summary}
                  </pre>
                </div>
              )}
            </div>
          )}
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
