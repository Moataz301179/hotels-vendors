"use client";

import { useEffect, useState } from "react";

interface AgentStatus {
  name: string;
  status: "running" | "idle" | "error" | "completed";
  task: string;
  lastUpdate: string;
  workspace: string;
}

interface MissionState {
  kimi: {
    agents: AgentStatus[];
    pm2: { name: string; status: string; uptime: string; cpu: string; mem: string }[];
    queues: { name: string; waiting: number; active: number; completed: number; failed: number }[];
    lastBuild: string;
  };
  hermes: {
    agents: AgentStatus[];
    containerStatus: string;
    lastSync: string;
  };
  syncTime: string;
}

export default function MissionControlPage() {
  const [data, setData] = useState<MissionState | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/mission-control/status");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-white/30 text-sm">Initializing Mission Control...</div>
      </div>
    );
  }

  const kimi = data?.kimi;
  const hermes = data?.hermes;

  return (
    <div className="min-h-screen bg-[#050508] text-white" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <header className="border-b border-white/[0.04] bg-[#050508]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" />
            <span className="text-[14px] font-semibold tracking-tight">Mission Control</span>
            <span className="text-[10px] text-white/20 uppercase tracking-wider ml-2">Live Monitor</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-white/20">
            <span>Sync: {data?.syncTime || "—"}</span>
            <button onClick={fetchStatus} className="px-3 py-1 rounded-full border border-white/[0.04] bg-[#0a0a12] hover:border-[#7c3aed]/20 transition-all text-white/40 hover:text-white/70">
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Kimi Agents" value={kimi?.agents.length || 0} color="#7c3aed" />
          <StatCard label="Hermes Agents" value={hermes?.agents.length || 0} color="#34d399" />
          <StatCard label="PM2 Processes" value={kimi?.pm2.length || 0} color="#60a5fa" />
          <StatCard label="Queue Jobs" value={kimi?.queues.reduce((s, q) => s + q.waiting + q.active, 0) || 0} color="#fbbf24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkspacePanel
            title="Kimi Workspace"
            subtitle="CLI Agent — Direct SSH Execution"
            accent="#7c3aed"
            agents={kimi?.agents || []}
          >
            <div className="space-y-4">
              <SectionTitle>PM2 Processes</SectionTitle>
              {(kimi?.pm2 || []).map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-[#0a0a12] p-4">
                  <div>
                    <div className="text-[13px] font-semibold text-white">{p.name}</div>
                    <div className="text-[10px] text-white/20 mt-0.5">{p.uptime}</div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-white/30">
                    <span className={p.status === "online" ? "text-[#34d399]" : "text-red-400"}>{p.status}</span>
                    <span>{p.cpu}</span>
                    <span>{p.mem}</span>
                  </div>
                </div>
              ))}

              <SectionTitle>Swarm Queues</SectionTitle>
              {(kimi?.queues || []).map((q) => (
                <div key={q.name} className="rounded-xl border border-white/[0.04] bg-[#0a0a12] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-white">{q.name}</span>
                    <span className="text-[10px] text-white/20">{q.completed} completed</span>
                  </div>
                  <div className="flex gap-3 text-[11px]">
                    <Badge color="#fbbf24">{q.waiting} waiting</Badge>
                    <Badge color="#60a5fa">{q.active} active</Badge>
                    <Badge color="red">{q.failed} failed</Badge>
                  </div>
                </div>
              ))}

              <SectionTitle>Last Build</SectionTitle>
              <div className="text-[12px] text-white/30">{kimi?.lastBuild || "No build recorded"}</div>
            </div>
          </WorkspacePanel>

          <WorkspacePanel
            title="Hermes Workspace"
            subtitle="CTO Agent — Container Execution"
            accent="#34d399"
            agents={hermes?.agents || []}
          >
            <div className="space-y-4">
              <SectionTitle>Container Status</SectionTitle>
              <div className="rounded-xl border border-white/[0.04] bg-[#0a0a12] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${hermes?.containerStatus === "running" ? "bg-[#34d399]" : "bg-red-400"}`} />
                  <span className="text-[13px] font-semibold text-white">{hermes?.containerStatus || "unknown"}</span>
                </div>
                <div className="text-[11px] text-white/20">Last sync: {hermes?.lastSync || "never"}</div>
              </div>

              <SectionTitle>Sync Endpoint</SectionTitle>
              <div className="rounded-xl border border-white/[0.04] bg-[#0a0a12] p-4">
                <code className="text-[11px] text-[#a78bfa] font-mono">POST /api/mission-control/sync</code>
                <div className="text-[10px] text-white/20 mt-2">Hermes reports here every 30s</div>
              </div>

              <SectionTitle>Hermes Instructions</SectionTitle>
              <div className="rounded-xl border border-white/[0.04] bg-[#0a0a12] p-4 text-[11px] text-white/30 leading-relaxed space-y-2">
                <p>1. Your workspace is <code className="text-[#a78bfa]">/opt/data/workspace-hermes</code></p>
                <p>2. Docker socket is mounted — you can run docker commands</p>
                <p>3. SSH keys are mounted — you can SSH to the VPS</p>
                <p>4. Report status every 30s to the sync endpoint</p>
              </div>
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-[#0a0a12] p-6 hover:border-white/[0.06] transition-all">
      <div className="text-[28px] font-bold tracking-tight" style={{ color }}>{value}</div>
      <div className="text-[11px] text-white/20 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function WorkspacePanel({ title, subtitle, accent, agents, children }: { title: string; subtitle: string; accent: string; agents: AgentStatus[]; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-[#0a0a12] overflow-hidden">
      <div className="p-6 border-b border-white/[0.04]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
          <h2 className="text-[18px] font-semibold text-white">{title}</h2>
        </div>
        <p className="text-[11px] text-white/20">{subtitle}</p>
      </div>
      <div className="p-6 space-y-4">
        {agents.length > 0 && (
          <>
            <SectionTitle>Active Agents</SectionTitle>
            {agents.map((a) => (
              <div key={a.name} className="rounded-xl border border-white/[0.04] bg-[#050508] p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold text-white">{a.name}</span>
                  <StatusBadge status={a.status} />
                </div>
                <div className="text-[11px] text-white/30">{a.task}</div>
                <div className="text-[10px] text-white/15 mt-1">{a.lastUpdate}</div>
              </div>
            ))}
          </>
        )}
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mt-2 mb-3">{children}</h3>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    running: "#34d399",
    idle: "#fbbf24",
    error: "red",
    completed: "#60a5fa",
  };
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/[0.04]" style={{ color: colors[status] || "#fff" }}>
      {status}
    </span>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className="text-[10px] font-medium" style={{ color }}>{children}</span>;
}
