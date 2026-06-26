"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Store,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Bell,
  FileText,
  Activity,
  TrendingUp,
  Clock,
  XCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { DashboardCard } from "../DashboardCard";

interface KPI {
  totalUsers: number;
  activeHotels: number;
  activeSuppliers: number;
  monthlyGMV: string;
}

interface PlatformHealth {
  apiUptime: string;
  avgResponseTime: string;
  errorRate: string;
  activeConnections: number;
}

interface PendingVerification {
  id: string;
  type: "supplier" | "hotel";
  name: string;
  submittedAt: string;
}

interface SystemAlert {
  id: string;
  type: "fraud" | "error" | "sla" | "security";
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
}

/**
 * Admin Dashboard — platform operators.
 * Shows system-wide metrics, verifications, and platform health.
 */
export function AdminDashboard() {
  const [kpis, setKpis] = useState<KPI>({
    totalUsers: 0,
    activeHotels: 0,
    activeSuppliers: 0,
    monthlyGMV: "0",
  });
  const [health, setHealth] = useState<PlatformHealth>({
    apiUptime: "99.9%",
    avgResponseTime: "0ms",
    errorRate: "0%",
    activeConnections: 0,
  });
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [gmvData, setGmvData] = useState<{ day: string; gmv: number }[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<{ month: string; users: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/v1/dashboard/admin");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setKpis(data.kpis || kpis);
        setHealth(data.health || health);
        setVerifications(data.verifications || []);
        setAlerts(data.alerts || []);
        setGmvData(data.gmvData || []);
        setUserGrowthData(data.userGrowthData || []);
      } catch (err) {
        if (!cancelled) setError("Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text-muted)] text-sm">Loading platform data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Platform Command Center
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            System health, verifications, and platform-wide metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium bg-[var(--accent-base)] text-white hover:opacity-90 transition-opacity">
            <ShieldCheck size={14} />
            Verify Supplier
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
            <FileText size={14} />
            Audit Logs
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
            <Bell size={14} />
            Send Notification
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total Users" value={kpis.totalUsers.toLocaleString()} accent="var(--accent-base)" />
        <KPICard icon={Building2} label="Active Hotels" value={kpis.activeHotels.toString()} accent="var(--info)" />
        <KPICard icon={Store} label="Active Suppliers" value={kpis.activeSuppliers.toString()} accent="var(--success)" />
        <KPICard icon={DollarSign} label="Monthly GMV" value={`${kpis.monthlyGMV} EGP`} accent="var(--warning)" />
      </div>

      {/* Platform Health */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-[var(--accent-base)]" />
          <span className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Platform Health
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthMetric label="API Uptime" value={health.apiUptime} status="good" />
          <HealthMetric label="Avg Response" value={health.avgResponseTime} status="good" />
          <HealthMetric
            label="Error Rate"
            value={health.errorRate}
            status={parseFloat(health.errorRate) > 1 ? "warning" : "good"}
          />
          <HealthMetric
            label="Active Connections"
            value={health.activeConnections.toString()}
            status="good"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="GMV Trend (Last 30 Days)">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} EGP`, "GMV"]}
                />
                <Area
                  type="monotone"
                  dataKey="gmv"
                  stroke="var(--accent-base)"
                  fill="var(--accent-base)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="User Growth (Last 6 Months)">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="var(--success)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red-400" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-red-400">
              System Alerts
            </span>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-invisible)]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      alert.severity === "critical"
                        ? "bg-red-400 animate-pulse"
                        : alert.severity === "high"
                        ? "bg-orange-400"
                        : alert.severity === "medium"
                        ? "bg-amber-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] font-medium text-[var(--text-primary)]">
                        {alert.type.toUpperCase()}
                      </p>
                      <span className="text-[9px] text-[var(--text-muted)]">{alert.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">
                      {alert.message}
                    </p>
                  </div>
                </div>
                <span
                  className={`ml-3 px-1.5 py-0.5 rounded text-[9px] font-medium uppercase shrink-0 ${
                    alert.severity === "critical"
                      ? "text-red-400 bg-red-500/10"
                      : alert.severity === "high"
                      ? "text-orange-400 bg-orange-500/10"
                      : alert.severity === "medium"
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-blue-400 bg-blue-500/10"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Verifications */}
      <DashboardCard title="Pending Verifications">
        <div className="space-y-3">
          {verifications.length === 0 && (
            <p className="text-[12px] text-[var(--text-muted)]">No pending verifications</p>
          )}
          {verifications.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between py-2 border-b border-[var(--border-invisible)] last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    v.type === "supplier" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {v.type === "supplier" ? <Store size={14} /> : <Building2 size={14} />}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                    {v.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {v.type} · Submitted {v.submittedAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <button className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                  <CheckCircle2 size={14} />
                </button>
                <button className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                  <XCircle size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${accent}15` }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-[11px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function HealthMetric({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "good" | "warning" | "critical";
}) {
  const color =
    status === "good"
      ? "text-emerald-400"
      : status === "warning"
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
