"use client";

import { useState, useEffect } from "react";
import {
  Landmark,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  TrendingUp,
  FileText,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
} from "lucide-react";
import {
  BarChart,
  Bar,
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
  pendingRequests: number;
  totalExposure: string;
  disbursedThisMonth: string;
  averageDiscountRate: string;
}

interface FactoringRequest {
  id: string;
  requestId: string;
  hotelName: string;
  amount: string;
  discountRate: string;
  riskTier: string;
  requestedAt: string;
  status: string;
}

interface RiskAlert {
  id: string;
  type: string;
  message: string;
  severity: "high" | "medium" | "low";
}

interface SettlementItem {
  id: string;
  date: string;
  amount: string;
  hotelName: string;
}

/**
 * Factoring Company Dashboard — financial institutions buying receivables.
 * Shows exposure, requests, risk, and settlement calendar.
 */
export function FactoringDashboard() {
  const [kpis, setKpis] = useState<KPI>({
    pendingRequests: 0,
    totalExposure: "0",
    disbursedThisMonth: "0",
    averageDiscountRate: "0",
  });
  const [requests, setRequests] = useState<FactoringRequest[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [settlements, setSettlements] = useState<SettlementItem[]>([]);
  const [exposureData, setExposureData] = useState<{ month: string; exposure: number; disbursed: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/v1/dashboard/factoring");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setKpis(data.kpis || kpis);
        setRequests(data.requests || []);
        setRiskAlerts(data.riskAlerts || []);
        setSettlements(data.settlements || []);
        setExposureData(data.exposureData || []);
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
        <div className="text-[var(--text-muted)] text-sm">Loading factoring data...</div>
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
            Factoring Command Center
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Manage receivables portfolio, review requests, and track settlements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium bg-[var(--accent-base)] text-white hover:opacity-90 transition-opacity">
            <Search size={14} />
            Review Requests
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
            <FileText size={14} />
            View Portfolio
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
            <CheckCircle2 size={14} />
            Mark Disbursed
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={TrendingUp}
          label="Pending Requests"
          value={kpis.pendingRequests.toString()}
          accent="var(--warning)"
        />
        <KPICard
          icon={Landmark}
          label="Total Exposure"
          value={`${kpis.totalExposure} EGP`}
          accent="var(--accent-base)"
        />
        <KPICard
          icon={DollarSign}
          label="Disbursed This Month"
          value={`${kpis.disbursedThisMonth} EGP`}
          accent="var(--success)"
        />
        <KPICard
          icon={Shield}
          label="Avg Discount Rate"
          value={`${kpis.averageDiscountRate}%`}
          accent="var(--info)"
        />
      </div>

      {/* Exposure Chart */}
      <DashboardCard title="Exposure & Disbursement Trend">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={exposureData}>
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
                formatter={(value: number) => [`${value.toLocaleString()} EGP`]}
              />
              <Line type="monotone" dataKey="exposure" stroke="var(--accent-base)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="disbursed" stroke="var(--success)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Risk Alerts */}
      {riskAlerts.length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red-400" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-red-400">
              Risk Alerts
            </span>
          </div>
          <div className="space-y-2">
            {riskAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-invisible)]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      alert.severity === "high"
                        ? "bg-red-400"
                        : alert.severity === "medium"
                        ? "bg-amber-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[var(--text-primary)]">
                      {alert.type}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">
                      {alert.message}
                    </p>
                  </div>
                </div>
                <span
                  className={`ml-3 px-1.5 py-0.5 rounded text-[9px] font-medium uppercase shrink-0 ${
                    alert.severity === "high"
                      ? "text-red-400 bg-red-500/10"
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

      {/* Pending Requests + Settlement Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="Pending Factoring Requests">
          <div className="space-y-3">
            {requests.length === 0 && (
              <p className="text-[12px] text-[var(--text-muted)]">No pending requests</p>
            )}
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between py-2 border-b border-[var(--border-invisible)] last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[var(--text-primary)]">
                    {req.requestId}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {req.hotelName} · {req.requestedAt}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-3 shrink-0">
                  <span className="text-[12px] font-medium text-[var(--text-primary)]">
                    {req.amount} EGP
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {req.discountRate}%
                  </span>
                  <RiskBadge tier={req.riskTier} />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Settlement Calendar">
          <div className="space-y-3">
            {settlements.length === 0 && (
              <p className="text-[12px] text-[var(--text-muted)]">No upcoming settlements</p>
            )}
            {settlements.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between py-2 border-b border-[var(--border-invisible)] last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Calendar size={14} className="text-[var(--text-muted)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[var(--text-primary)]">
                      {s.hotelName}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">{s.date}</p>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-[var(--text-primary)] ml-3 shrink-0">
                  {s.amount} EGP
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
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

function RiskBadge({ tier }: { tier: string }) {
  const t = tier?.toUpperCase();
  const color =
    t === "CRITICAL"
      ? "text-red-400 bg-red-500/10"
      : t === "HIGH"
      ? "text-orange-400 bg-orange-500/10"
      : t === "MEDIUM"
      ? "text-amber-400 bg-amber-500/10"
      : "text-emerald-400 bg-emerald-500/10";

  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium uppercase ${color}`}>
      {tier?.toLowerCase() || "unknown"}
    </span>
  );
}
