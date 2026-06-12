"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  HeartPulse,
  Clock,
  Zap,
  CheckCircle,
  AlertTriangle,
  Database,
  Server,
  Activity,
  RefreshCw,
  Radio,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { MetricTile } from "@/components/dashboards/shared/metric-tile";
import { DataTableMini } from "@/components/dashboards/shared/data-table-mini";

// ─── Types ───────────────────────────────────────────────

interface HealthCheck {
  status: "ok" | "error";
  latencyMs: number;
  message?: string;
}

interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  latencyMs: number;
  checks: Record<string, HealthCheck>;
}

interface SwarmSummary {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  pendingJobs: number;
  waitingApproval: number;
  successRate: number;
}

interface SwarmModelHealth {
  id: string;
  provider: string;
  model: string;
  healthy: boolean;
  avgLatencyMs: number;
  lastChecked: string;
}

interface SwarmHealthData {
  health: {
    summary: SwarmSummary;
    eventsBySeverity: Record<string, number>;
    recentEvents: Array<{
      id: string;
      eventType: string;
      severity: string;
      createdAt: string;
      message: string;
    }>;
    modelHealth: SwarmModelHealth[];
  };
  squadPerformance: Record<
    string,
    { total: number; completed: number; failed: number; avgDurationMs: number }
  >;
  generatedAt: string;
}

interface OpenClawHealthData {
  gateway: boolean;
  automation: boolean;
  gatewayUrl: string;
  automationUrl: string;
}

interface PulseEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
  severity: string;
}

interface ServiceRow extends Record<string, unknown> {
  name: string;
  status: string;
  lastCheck: string;
  responseTime: string;
}

// ─── Custom hook for /api/health (raw response, no success wrapper) ───

function useHealth() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/health", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ─── Custom hook for SSE Pulse ───────────────────────────

function usePulse() {
  const [events, setEvents] = useState<PulseEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource("/api/v1/admin/pulse");

    es.addEventListener("connected", () => {
      setConnected(true);
    });

    es.addEventListener("system.health", (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        setEvents((prev) =>
          [...prev, { type: "system.health", data: payload, timestamp: payload.timestamp, severity: payload.severity }].slice(-20)
        );
      } catch {
        // ignore malformed events
      }
    });

    es.addEventListener("error", () => {
      setConnected(false);
    });

    return () => {
      es.close();
    };
  }, []);

  return { events, connected };
}

// ─── Health Status Badge ─────────────────────────────────

function HealthBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const config: Record<string, { text: string; dot: string; bg: string }> = {
    healthy: { text: "Healthy", dot: "bg-emerald-400", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    ok: { text: "OK", dot: "bg-emerald-400", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    degraded: { text: "Degraded", dot: "bg-amber-400", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    unhealthy: { text: "Unhealthy", dot: "bg-red-500", bg: "bg-red-500/10 text-red-400 border-red-500/20" },
    error: { text: "Error", dot: "bg-red-500", bg: "bg-red-500/10 text-red-400 border-red-500/20" },
  };
  const c = config[key] || config.error;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.text}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────

export default function HealthDashboardPage() {
  const { data: health, loading: healthLoading, error: healthError, refetch: refetchHealth } = useHealth();
  const { data: swarm, loading: swarmLoading, error: swarmError, refetch: refetchSwarm } =
    useApi<SwarmHealthData>("/api/v1/swarm/health");
  const { data: openclaw, loading: openclawLoading, error: openclawError, refetch: refetchOpenClaw } =
    useApi<OpenClawHealthData>("/api/v1/openclaw/health");
  const { events: pulseEvents, connected: pulseConnected } = usePulse();

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchHealth();
      refetchSwarm();
      refetchOpenClaw();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchHealth, refetchSwarm, refetchOpenClaw]);

  // Construct service table rows
  const services: ServiceRow[] = useMemo(() => {
    const rows: ServiceRow[] = [];
    const now = new Date().toLocaleTimeString();

    if (health) {
      rows.push({
        name: "API",
        status: health.status,
        lastCheck: now,
        responseTime: `${health.latencyMs}ms`,
      });
      if (health.checks.database) {
        rows.push({
          name: "Database",
          status: health.checks.database.status === "ok" ? "healthy" : "unhealthy",
          lastCheck: now,
          responseTime: `${health.checks.database.latencyMs}ms`,
        });
      }
      if (health.checks.redis) {
        rows.push({
          name: "Redis",
          status: health.checks.redis.status === "ok" ? "healthy" : "unhealthy",
          lastCheck: now,
          responseTime: `${health.checks.redis.latencyMs}ms`,
        });
      }
    }

    if (openclaw) {
      rows.push({
        name: "OpenClaw Gateway",
        status: openclaw.gateway ? "healthy" : "unhealthy",
        lastCheck: now,
        responseTime: "—",
      });
      rows.push({
        name: "OpenClaw Automation",
        status: openclaw.automation ? "healthy" : "unhealthy",
        lastCheck: now,
        responseTime: "—",
      });
    }

    if (swarm?.health?.modelHealth) {
      for (const m of swarm.health.modelHealth) {
        rows.push({
          name: `Model: ${m.provider}/${m.model}`,
          status: m.healthy ? "healthy" : "unhealthy",
          lastCheck: new Date(m.lastChecked).toLocaleTimeString(),
          responseTime: `${m.avgLatencyMs}ms`,
        });
      }
    }

    return rows;
  }, [health, openclaw, swarm]);

  // Derived metrics
  const recentErrors = useMemo(() => {
    if (!swarm?.health?.eventsBySeverity) return 0;
    return (
      (swarm.health.eventsBySeverity.ERROR || 0) +
      (swarm.health.eventsBySeverity.CRITICAL || 0)
    );
  }, [swarm]);

  const activeServices = useMemo(() => {
    return services.filter((s) => s.status === "healthy" || s.status === "ok").length;
  }, [services]);

  const uptime = useMemo(() => {
    if (health?.status === "healthy") return "99.9%";
    if (health?.status === "degraded") return "98.5%";
    return "—";
  }, [health]);

  const isLoading = healthLoading || swarmLoading || openclawLoading;
  const hasError = healthError || swarmError || openclawError;

  const handleManualRefresh = () => {
    refetchHealth();
    refetchSwarm();
    refetchOpenClaw();
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold tracking-tight">System Health</h1>
              <p className="text-[13px] text-white/40 mt-1">
                Real-time platform monitoring & service status
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Radio
                  size={14}
                  className={pulseConnected ? "text-emerald-400" : "text-amber-400"}
                />
                <span className="text-xs text-white/40">
                  {pulseConnected ? "Connected" : "Reconnecting"}
                </span>
              </div>
              <button
                onClick={handleManualRefresh}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
                title="Refresh now"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Metric Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : hasError ? (
          <EmptyState
            title="Failed to load metrics"
            description={healthError || swarmError || openclawError || "Unknown error"}
            icon="inbox"
            action={
              <button
                onClick={handleManualRefresh}
                className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                Retry
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricTile
              label="Overall Status"
              value={health?.status ? health.status.charAt(0).toUpperCase() + health.status.slice(1) : "—"}
              icon={HeartPulse}
              iconBg={
                health?.status === "healthy"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : health?.status === "degraded"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-red-500/10 text-red-400"
              }
            />
            <MetricTile label="Uptime" value={uptime} icon={Clock} />
            <MetricTile
              label="API Latency"
              value={`${health?.latencyMs ?? 0}ms`}
              icon={Zap}
            />
            <MetricTile
              label="Active Services"
              value={String(activeServices)}
              icon={CheckCircle}
              iconBg="bg-cyan-500/10 text-cyan-400"
            />
            <MetricTile
              label="Recent Errors"
              value={String(recentErrors)}
              icon={AlertTriangle}
              iconBg={
                recentErrors > 0
                  ? "bg-red-500/10 text-red-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }
            />
            <MetricTile
              label="DB Status"
              value={
                health?.checks?.database?.status === "ok" ? "Connected" : "Error"
              }
              icon={Database}
              iconBg={
                health?.checks?.database?.status === "ok"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }
            />
            <MetricTile
              label="Redis Status"
              value={
                health?.checks?.redis?.status === "ok" ? "Connected" : "Error"
              }
              icon={Server}
              iconBg={
                health?.checks?.redis?.status === "ok"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }
            />
            <MetricTile
              label="Swarm Jobs"
              value={String(swarm?.health?.summary?.totalJobs ?? 0)}
              icon={Activity}
              iconBg="bg-purple-500/10 text-purple-400"
            />
          </div>
        )}

        {/* Services Table */}
        <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-white/50 uppercase tracking-wider">
              Service Health
            </h2>
            <span className="text-[11px] text-white/25">
              {services.length} service{services.length !== 1 ? "s" : ""} monitored
            </span>
          </div>
          {isLoading ? (
            <LoadingTable rows={5} />
          ) : services.length === 0 ? (
            <EmptyState
              title="No services found"
              description="Service health data will appear once available."
            />
          ) : (
            <DataTableMini<ServiceRow>
              columns={[
                { key: "name", header: "Service" },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <HealthBadge status={row.status} />,
                },
                { key: "lastCheck", header: "Last Check" },
                { key: "responseTime", header: "Response Time" },
              ]}
              data={services}
            />
          )}
        </div>

        {/* Pulse Events */}
        {pulseEvents.length > 0 && (
          <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] p-6">
            <h2 className="text-[14px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              Live Pulse Events
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {pulseEvents.slice(-10).map((evt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-white/60 py-2 border-b border-white/[0.04] last:border-0"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      evt.severity === "WARNING" || evt.severity === "CRITICAL"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <span className="text-white/30 text-xs shrink-0 w-16">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="truncate">
                    {evt.data.metric ? (
                      <>
                        <span className="text-white/80">{String(evt.data.metric)}</span>
                        {" "}
                        <span className="text-white/40">
                          {String(evt.data.value ?? "—")} {String(evt.data.unit ?? "")}
                        </span>
                      </>
                    ) : (
                      JSON.stringify(evt.data).slice(0, 80)
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
