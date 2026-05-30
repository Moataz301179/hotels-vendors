"use client";

import { useState, useEffect, useCallback } from "react";

interface AgentTask {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  priority: "low" | "medium" | "high";
}

interface Agent {
  name: string;
  status: "active" | "idle" | "error";
  lastActivity: string;
  currentTask: string;
  taskProgress: number;
  deliverables: string[];
}

interface Workspace {
  agents: Agent[];
  taskQueue: AgentTask[];
}

interface BuildStage {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  time: string;
  agent?: string;
}

interface MissionState {
  kimi: Workspace;
  hermes: Workspace;
  buildPipeline: BuildStage[];
  syncTime: string;
}

type NavItem = "agents" | "pipeline" | "workshop";
type ThemeName = "violet" | "cyan" | "amber";
type Mode = "dark" | "light";

interface ThemeConfig {
  name: string;
  accent: string;
  accentLight: string;
  accentGlow: string;
}

const THEMES: Record<ThemeName, ThemeConfig> = {
  violet: { name: "Violet", accent: "#7c3aed", accentLight: "#8b5cf6", accentGlow: "rgba(124,58,237,0.2)" },
  cyan: { name: "Cyan", accent: "#06b6d4", accentLight: "#22d3ee", accentGlow: "rgba(6,182,212,0.2)" },
  amber: { name: "Amber", accent: "#f59e0b", accentLight: "#fbbf24", accentGlow: "rgba(245,158,11,0.2)" },
};

const MODE_COLORS = {
  dark: { bg: "#050508", surface: "#0a0a12", border: "rgba(255,255,255,0.06)", text: "#ffffff", muted: "rgba(255,255,255,0.3)", subtext: "rgba(255,255,255,0.2)", hover: "rgba(255,255,255,0.02)" },
  light: { bg: "#f8fafc", surface: "#ffffff", border: "rgba(0,0,0,0.06)", text: "#0f172a", muted: "rgba(0,0,0,0.4)", subtext: "rgba(0,0,0,0.3)", hover: "rgba(0,0,0,0.02)" },
};

function StatusDot({ color }: { color: string }) {
  return <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }} />;
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: MODE_COLORS.dark.surface }}>
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }} />
    </div>
  );
}

function StageBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "#f59e0b20", text: "#f59e0b", label: "PENDING" },
    running: { bg: "#3b82f620", text: "#3b82f6", label: "RUNNING" },
    completed: { bg: "#22c55e20", text: "#22c55e", label: "DONE" },
    failed: { bg: "#ef444420", text: "#ef4444", label: "FAILED" },
  };
  const s = map[status] || map.pending;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

function TimeAgo({ time }: { time: string }) {
  if (!time) return <span className="text-xs opacity-30">—</span>;
  try {
    const diff = Date.now() - new Date(time).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    let label = "";
    if (d > 0) label = `${d}d ago`;
    else if (h > 0) label = `${h}h ago`;
    else if (m > 0) label = `${m}m ago`;
    else label = "just now";
    return <span className="text-xs opacity-20">{label}</span>;
  } catch {
    return <span className="text-xs opacity-20">—</span>;
  }
}

export default function MissionControlPage() {
  const [data, setData] = useState<MissionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [nav, setNav] = useState<NavItem>("agents");
  const [theme, setTheme] = useState<ThemeName>("violet");
  const [mode, setMode] = useState<Mode>("dark");
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const c = THEMES[theme];
  const m = MODE_COLORS[mode];

  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/mission-control/status", { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    if (!autoRefresh) return;
    const id = setInterval(fetchStatus, 5000);
    return () => clearInterval(id);
  }, [fetchStatus, autoRefresh]);

  const kimi = data?.kimi;
  const hermes = data?.hermes;
  const buildPipeline = Array.isArray(data?.buildPipeline) ? data.buildPipeline : [];

  const kimiAgents = Array.isArray(kimi?.agents) ? kimi.agents : [];
  const hermesAgents = Array.isArray(hermes?.agents) ? hermes.agents : [];
  const kimiTasks = Array.isArray(kimi?.taskQueue) ? kimi.taskQueue : [];
  const hermesTasks = Array.isArray(hermes?.taskQueue) ? hermes.taskQueue : [];

  const allAgents = [...kimiAgents, ...hermesAgents];
  const allTasks = [...kimiTasks, ...hermesTasks];

  const activeKimi = kimiAgents.filter((a) => a?.status === "active").length;
  const activeHermes = hermesAgents.filter((a) => a?.status === "active").length;
  const pendingTasks = allTasks.filter((t) => t?.status === "pending").length;
  const inProgressTasks = allTasks.filter((t) => t?.status === "in_progress").length;

  const navItems: { id: NavItem; label: string; count?: number }[] = [
    { id: "agents", label: "Agents", count: allAgents.length },
    { id: "pipeline", label: "Pipeline", count: buildPipeline.length },
    { id: "workshop", label: "Workshop" },
  ];

  const isDark = mode === "dark";

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: m.bg, color: m.text }}>
      {/* Sidebar */}
      <aside className="w-56 fixed left-0 top-0 bottom-0 border-r flex flex-col" style={{ backgroundColor: m.surface, borderColor: m.border }}>
        <div className="h-14 flex items-center gap-3 px-4 border-b" style={{ borderColor: m.border }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: c.accent }}>HV</div>
          <div>
            <div className="text-sm font-semibold">HotelsVendors</div>
            <div className="text-[10px] opacity-30">Agent Swarm</div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                nav === item.id ? "font-medium" : "opacity-40 hover:opacity-70"
              }`}
              style={nav === item.id ? { backgroundColor: c.accentGlow, borderRight: `3px solid ${c.accent}` } : {}}
            >
              <span>{item.label}</span>
              {typeof item.count === "number" && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: m.bg }}>{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: m.border }}>
          <label className="flex items-center gap-2 text-xs opacity-30 cursor-pointer">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} style={{ accentColor: c.accent }} />
            Auto-refresh
          </label>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b" style={{ backgroundColor: m.bg, borderColor: m.border }}>
          <div>
            <h1 className="text-lg font-bold">Agent Swarm Control</h1>
            <p className="text-[11px] opacity-30">Build pipeline &amp; task monitor</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border flex items-center gap-2"
                style={{ borderColor: m.border, color: m.text }}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.accent }} />
                {c.name}
                <span className="text-[10px] opacity-40">▼</span>
              </button>
              {showThemeMenu && (
                <div className="absolute right-0 mt-1 w-40 rounded-lg border py-1 z-50" style={{ backgroundColor: m.surface, borderColor: m.border }}>
                  {(Object.keys(THEMES) as ThemeName[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTheme(t); setShowThemeMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:opacity-80 transition-colors"
                      style={{ color: m.text }}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: THEMES[t].accent }} />
                      {THEMES[t].name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setMode(mode === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors border"
              style={{ borderColor: m.border, color: m.text }}
              title={mode === "dark" ? "Switch to Light" : "Switch to Dark"}
            >
              {mode === "dark" ? "☀️" : "🌙"}
            </button>

            <a href="/workshop" className="px-3 py-1.5 rounded-lg text-xs font-medium opacity-70 hover:opacity-100 transition-colors border" style={{ borderColor: m.border }}>
              🛠️ Workshop
            </a>
            <button onClick={fetchStatus} disabled={loading} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50" style={{ backgroundColor: c.accent }}>
              {loading ? "Syncing..." : "Refresh"}
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: c.accentGlow, color: c.accent }}>MA</div>
          </div>
        </header>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg border bg-red-500/10 text-red-300 text-sm" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Kimi Active", value: activeKimi, badge: "+2", badgeColor: "#22c55e", sub: "Backend + DevOps agents" },
              { label: "Hermes Active", value: activeHermes, badge: "+1", badgeColor: "#22c55e", sub: "Frontend + Content agents" },
              { label: "Pending Tasks", value: pendingTasks, badge: `${pendingTasks}`, badgeColor: "#f59e0b", sub: "Awaiting assignment" },
              { label: "In Progress", value: inProgressTasks, badge: `${inProgressTasks}`, badgeColor: "#3b82f6", sub: "Currently executing" },
            ].map((card, i) => (
              <div key={i} className="p-4 rounded-xl border transition-all hover:-translate-y-0.5" style={{ backgroundColor: m.surface, borderColor: m.border }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium opacity-30 uppercase tracking-wider">{card.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${card.badgeColor}20`, color: card.badgeColor }}>{card.badge}</span>
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-[11px] opacity-20 mt-1">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* AGENTS VIEW */}
          {nav === "agents" && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Active Agents</h2>
                </div>

                {allAgents.map((agent, i) => {
                  const isKimi = i < kimiAgents.length;
                  const color = isKimi ? c.accent : "#22c55e";
                  return (
                    <div key={i} className="p-4 rounded-xl border transition-all hover:-translate-y-0.5" style={{ backgroundColor: m.surface, borderColor: m.border }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StatusDot color={agent?.status === "active" ? "#22c55e" : agent?.status === "error" ? "#ef4444" : "#f59e0b"} />
                          <div>
                            <div className="text-sm font-medium">{agent?.name || "Unknown"}</div>
                            <div className="text-[11px] opacity-30">{isKimi ? "Kimi Workspace" : "Hermes Workspace"}</div>
                          </div>
                        </div>
                        <TimeAgo time={agent?.lastActivity} />
                      </div>
                      <div className="mt-2 text-xs opacity-50">{agent?.currentTask || "No active task"}</div>
                      <ProgressBar value={agent?.taskProgress || 0} color={color} />
                      {Array.isArray(agent?.deliverables) && agent.deliverables.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {agent.deliverables.map((d, j) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", color: m.muted }}>{d}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Task Queue */}
                <div className="mt-6">
                  <h2 className="text-sm font-semibold mb-3">Task Queue</h2>
                  <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: m.surface, borderColor: m.border }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[10px] opacity-30 uppercase tracking-wider border-b" style={{ borderColor: m.border }}>
                          <th className="px-4 py-3 font-medium">Task</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTasks.length === 0 && (
                          <tr><td colSpan={3} className="px-4 py-4 opacity-20 text-xs">No tasks in queue</td></tr>
                        )}
                        {allTasks.map((t, i) => (
                          <tr key={i} className="border-b transition-colors" style={{ borderColor: m.border }}>
                            <td className="px-4 py-3 opacity-70 text-xs">{t?.title || "—"}</td>
                            <td className="px-4 py-3"><StageBadge status={t?.status || "pending"} /></td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                t?.priority === "high" ? "bg-red-500/10 text-red-400" : t?.priority === "medium" ? "bg-amber-500/10 text-amber-400" : "opacity-20"
                              }`}>{t?.priority || "low"}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold">Build Pipeline</h2>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: m.surface, borderColor: m.border }}>
                  <div className="space-y-3">
                    {buildPipeline.map((stage, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                          style={{
                            backgroundColor: stage.status === "completed" ? "#22c55e20" : stage.status === "failed" ? "#ef444420" : "#3b82f620",
                            color: stage.status === "completed" ? "#22c55e" : stage.status === "failed" ? "#ef4444" : "#3b82f6",
                          }}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs opacity-70">{stage.name}</span>
                            <StageBadge status={stage.status} />
                          </div>
                          {stage.agent && <div className="text-[10px] opacity-20 mt-0.5">{stage.agent}</div>}
                          <TimeAgo time={stage.time} />
                        </div>
                      </div>
                    ))}
                    {buildPipeline.length === 0 && <div className="opacity-20 text-xs">No stages</div>}
                  </div>
                </div>

                <div className="p-4 rounded-xl border" style={{ backgroundColor: m.surface, borderColor: m.border }}>
                  <h3 className="text-xs font-medium opacity-30 uppercase tracking-wider mb-3">Swarm Health</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Total Agents", value: allAgents.length, color: m.text },
                      { label: "Active", value: allAgents.filter((a) => a?.status === "active").length, color: "#22c55e" },
                      { label: "Idle", value: allAgents.filter((a) => a?.status === "idle").length, color: "#f59e0b" },
                      { label: "Total Tasks", value: allTasks.length, color: m.text },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="opacity-40">{s.label}</span>
                        <span style={{ color: s.color }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PIPELINE VIEW */}
          {nav === "pipeline" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold">Full Build &amp; Deploy Pipeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {buildPipeline.map((stage, i) => (
                  <div key={i} className="p-4 rounded-xl border" style={{ backgroundColor: m.surface, borderColor: m.border }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium opacity-70">{stage.name}</span>
                      <StageBadge status={stage.status} />
                    </div>
                    {stage.agent && <div className="text-[10px] opacity-20 mb-2">Agent: {stage.agent}</div>}
                    <TimeAgo time={stage.time} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORKSHOP VIEW */}
          {nav === "workshop" && (
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: m.surface, borderColor: m.border, height: "calc(100vh - 180px)" }}>
              <iframe src="/workshop" className="w-full h-full border-0" title="Design Workshop" />
            </div>
          )}

          <div className="mt-6 text-center text-[10px] opacity-10">
            Synced: {data?.syncTime || "—"}
          </div>
        </div>
      </main>
    </div>
  );
}
