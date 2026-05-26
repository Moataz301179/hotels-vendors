"use client";

import { useState, useEffect, useCallback } from "react";

interface SystemStatus {
  database: { status: string; latencyMs: number };
  redis: { status: string; latencyMs: number };
}

interface HealthData {
  status: string;
  timestamp: string;
  version: string;
  latencyMs: number;
  checks: SystemStatus;
}

interface PM2Process {
  name: string;
  status: string;
  uptime: string;
  cpu: string;
  mem: string;
}

interface BullQueue {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

interface BusinessCounts {
  hotels: number;
  suppliers: number;
  orders: number;
  pendingOrders: number;
  spendRequests: number;
  pendingSpendRequests: number;
  approvedSpendRequests: number;
  rejectedSpendRequests: number;
  budgetGates: number;
  activeBudgetGates: number;
  users: number;
  products: number;
  factoringRequests: number;
  creditFacilities: number;
  invoices: number;
}

interface PaymentTx {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  gatewayRef: string | null;
  method: string | null;
  time: string;
}

interface FactoringReq {
  id: string;
  status: string;
  invoiceNumber: string;
  partner: string;
  amount: number;
  advanceRate: number;
  time: string;
}

interface ActivityLog {
  id: string;
  type: string;
  action: string;
  actor: string;
  role: string;
  time: string;
}

interface MissionData {
  health: HealthData | null;
  pm2: PM2Process[];
  queues: BullQueue[];
  counts: BusinessCounts | null;
  payments: PaymentTx[];
  factoring: FactoringReq[];
  activity: ActivityLog[];
  lastBuild: string;
  hermesContainer: string;
  syncTime: string;
}

const THEME = {
  bg: "#000000",
  surface: "#0a0a0a",
  border: "rgba(255,255,255,0.06)",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.3)",
  accent: "#a3e635",
  accentLight: "#a3e635",
  accentGlow: "rgba(124,58,237,0.2)",
};

function StatusDot({ color }: { color: string }) {
  return <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }} />;
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
    return <span className="text-xs opacity-40">{label}</span>;
  } catch {
    return <span className="text-xs opacity-30">—</span>;
  }
}

function StageBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "#f59e0b20", text: "#f59e0b", label: "PENDING" },
    running: { bg: "#3b82f620", text: "#3b82f6", label: "RUNNING" },
    completed: { bg: "#22c55e20", text: "#22c55e", label: "DONE" },
    failed: { bg: "#ef444420", text: "#ef4444", label: "FAILED" },
    active: { bg: "#22c55e20", text: "#22c55e", label: "ACTIVE" },
    online: { bg: "#22c55e20", text: "#22c55e", label: "ONLINE" },
    down: { bg: "#ef444420", text: "#ef4444", label: "DOWN" },
    healthy: { bg: "#22c55e20", text: "#22c55e", label: "HEALTHY" },
    warning: { bg: "#f59e0b20", text: "#f59e0b", label: "WARN" },
  };
  const s = map[status] || map.pending;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

export default function MissionControlPage() {
  const [data, setData] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "system" | "business" | "payments">("overview");

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      // Fetch both APIs in parallel
      const [statusRes, v1Res, healthRes] = await Promise.all([
        fetch("/api/mission-control/status", { headers: { Accept: "application/json" } }),
        fetch("/api/mission-control/business", { headers: { Accept: "application/json" } }),
        fetch("/api/health", { headers: { Accept: "application/json" } }),
      ]);

      let statusData: any = {};
      let v1Data: any = {};
      let healthData: HealthData | null = null;

      if (statusRes.ok) statusData = await statusRes.json();
      if (v1Res.ok) v1Data = await v1Res.json();
      if (healthRes.ok) healthData = await healthRes.json();

      const merged: MissionData = {
        health: healthData,
        pm2: statusData.kimi?.pm2 || [],
        queues: statusData.kimi?.queues || [],
        counts: v1Data.data?.counts || null,
        payments: statusData.paymentPipeline || [],
        factoring: statusData.factoringPipeline || [],
        activity: statusData.recentActivity || [],
        lastBuild: statusData.kimi?.lastBuild || "No build recorded",
        hermesContainer: statusData.hermes?.containerStatus || "unknown",
        syncTime: statusData.syncTime || new Date().toISOString(),
      };

      setData(merged);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (!autoRefresh) return;
    const id = setInterval(fetchData, 5000);
    return () => clearInterval(id);
  }, [fetchData, autoRefresh]);

  const counts = data?.counts;
  const health = data?.health;

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "system" as const, label: "System" },
    { id: "business" as const, label: "Business" },
    { id: "payments" as const, label: "Payments" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.bg, color: THEME.text }}>
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b" style={{ backgroundColor: THEME.bg, borderColor: THEME.border }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: THEME.accent }}>HV</div>
          <div>
            <h1 className="text-lg font-bold">Mission Control</h1>
            <p className="text-[11px] opacity-30">Live system monitor — HotelsVendors</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs opacity-30 cursor-pointer">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} style={{ accentColor: THEME.accent }} />
            Auto-refresh (5s)
          </label>
          <button onClick={fetchData} disabled={loading} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50" style={{ backgroundColor: THEME.accent }}>
            {loading ? "Syncing..." : "Refresh"}
          </button>
          <StageBadge status={health?.status || "unknown"} />
        </div>
      </header>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border bg-red-500/10 text-red-300 text-sm" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
            {error}
          </div>
        )}

        {/* Top Stats */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[
            { label: "Hotels", value: counts?.hotels || 0, color: THEME.accent },
            { label: "Suppliers", value: counts?.suppliers || 0, color: "#22c55e" },
            { label: "Orders", value: counts?.orders || 0, color: "#3b82f6" },
            { label: "Spend Requests", value: counts?.spendRequests || 0, color: "#f59e0b" },
            { label: "Factoring", value: counts?.factoringRequests || 0, color: "#06b6d4" },
            { label: "Products", value: counts?.products || 0, color: "#a3e635" },
          ].map((card, i) => (
            <div key={i} className="p-4 rounded-xl border" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <div className="text-[10px] font-medium opacity-30 uppercase tracking-wider">{card.label}</div>
              <div className="text-2xl font-bold mt-1" style={{ color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b pb-1" style={{ borderColor: THEME.border }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id ? "text-white" : "opacity-40 hover:opacity-70"
              }`}
              style={activeTab === tab.id ? { backgroundColor: THEME.accentGlow, borderBottom: `2px solid ${THEME.accent}` } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-3 gap-6">
            {/* System Health */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <h3 className="text-xs font-medium opacity-30 uppercase tracking-wider mb-3">System Health</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">App Status</span>
                  <StageBadge status={health?.status || "unknown"} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Database</span>
                  <div className="flex items-center">
                    <StatusDot color={health?.checks?.database?.status === "ok" ? "#22c55e" : "#ef4444"} />
                    <span>{health?.checks?.database?.latencyMs || 0}ms</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Redis</span>
                  <div className="flex items-center">
                    <StatusDot color={health?.checks?.redis?.status === "ok" ? "#22c55e" : "#ef4444"} />
                    <span>{health?.checks?.redis?.latencyMs || 0}ms</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Hermes Container</span>
                  <StageBadge status={data?.hermesContainer || "unknown"} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Last Build</span>
                  <TimeAgo time={data?.lastBuild} />
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <h3 className="text-xs font-medium opacity-30 uppercase tracking-wider mb-3">Pending Actions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Pending Orders</span>
                  <span className="font-medium" style={{ color: "#f59e0b" }}>{counts?.pendingOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Pending Spend Requests</span>
                  <span className="font-medium" style={{ color: "#f59e0b" }}>{counts?.pendingSpendRequests || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Approved Spend</span>
                  <span className="font-medium" style={{ color: "#22c55e" }}>{counts?.approvedSpendRequests || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Rejected Spend</span>
                  <span className="font-medium" style={{ color: "#ef4444" }}>{counts?.rejectedSpendRequests || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Active Budget Gates</span>
                  <span className="font-medium" style={{ color: "#3b82f6" }}>{counts?.activeBudgetGates || 0}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <h3 className="text-xs font-medium opacity-30 uppercase tracking-wider mb-3">Recent Activity</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data?.activity?.length === 0 && <div className="opacity-20 text-xs">No recent activity</div>}
                {data?.activity?.slice(0, 10).map((a, i) => (
                  <div key={i} className="text-xs py-1 border-b" style={{ borderColor: THEME.border }}>
                    <div className="flex items-center justify-between">
                      <span className="opacity-70">{a.action}</span>
                      <TimeAgo time={a.time} />
                    </div>
                    <div className="opacity-30 text-[10px]">{a.type} • {a.actor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === "system" && (
          <div className="grid grid-cols-2 gap-6">
            {/* PM2 Processes */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <h3 className="text-xs font-medium opacity-30 uppercase tracking-wider mb-3">PM2 Processes</h3>
              <div className="space-y-2">
                {data?.pm2?.length === 0 && <div className="opacity-20 text-xs">No PM2 processes</div>}
                {data?.pm2?.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: THEME.border }}>
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="opacity-30 text-[10px]">CPU: {p.cpu} • Mem: {p.mem}</div>
                    </div>
                    <StageBadge status={p.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* BullMQ Queues */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <h3 className="text-xs font-medium opacity-30 uppercase tracking-wider mb-3">BullMQ Queues</h3>
              <div className="space-y-2">
                {data?.queues?.length === 0 && <div className="opacity-20 text-xs">No queues</div>}
                {data?.queues?.map((q, i) => (
                  <div key={i} className="text-xs py-2 border-b" style={{ borderColor: THEME.border }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{q.name}</span>
                      <span className="opacity-30">{q.completed} done</span>
                    </div>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px]" style={{ color: "#f59e0b" }}>{q.waiting} waiting</span>
                      <span className="text-[10px]" style={{ color: "#3b82f6" }}>{q.active} active</span>
                      <span className="text-[10px]" style={{ color: "#ef4444" }}>{q.failed} failed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BUSINESS TAB */}
        {activeTab === "business" && (
          <div className="grid grid-cols-2 gap-6">
            {/* Orders Summary */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <h3 className="text-xs font-medium opacity-30 uppercase tracking-wider mb-3">Orders Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Total Orders</span>
                  <span className="font-medium">{counts?.orders || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Pending Approval</span>
                  <span className="font-medium" style={{ color: "#f59e0b" }}>{counts?.pendingOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Invoices</span>
                  <span className="font-medium">{counts?.invoices || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Credit Facilities</span>
                  <span className="font-medium">{counts?.creditFacilities || 0}</span>
                </div>
              </div>
            </div>

            {/* Users & Products */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <h3 className="text-xs font-medium opacity-30 uppercase tracking-wider mb-3">Platform</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Total Users</span>
                  <span className="font-medium">{counts?.users || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Products</span>
                  <span className="font-medium">{counts?.products || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">Budget Gates</span>
                  <span className="font-medium">{counts?.budgetGates || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="grid grid-cols-2 gap-6">
            {/* Payment Transactions */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <h3 className="text-xs font-medium opacity-30 uppercase tracking-wider mb-3">Payment Transactions</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {data?.payments?.length === 0 && <div className="opacity-20 text-xs">No payment transactions</div>}
                {data?.payments?.map((t, i) => (
                  <div key={i} className="text-xs py-2 border-b" style={{ borderColor: THEME.border }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t.type}</span>
                      <StageBadge status={t.status} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="opacity-50">{t.amount} {t.currency}</span>
                      <span className="opacity-30 text-[10px]">{t.method || "—"}</span>
                    </div>
                    <TimeAgo time={t.time} />
                  </div>
                ))}
              </div>
            </div>

            {/* Factoring Requests */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: THEME.surface, borderColor: THEME.border }}>
              <h3 className="text-xs font-medium opacity-30 uppercase tracking-wider mb-3">Factoring Requests</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {data?.factoring?.length === 0 && <div className="opacity-20 text-xs">No factoring requests</div>}
                {data?.factoring?.map((f, i) => (
                  <div key={i} className="text-xs py-2 border-b" style={{ borderColor: THEME.border }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{f.invoiceNumber}</span>
                      <StageBadge status={f.status} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="opacity-50">{f.amount} EGP</span>
                      <span className="opacity-30 text-[10px]">{f.partner}</span>
                    </div>
                    <div className="text-[10px] opacity-30 mt-1">Advance: {f.advanceRate}%</div>
                    <TimeAgo time={f.time} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-[10px] opacity-20">
          Last sync: {data?.syncTime ? new Date(data.syncTime).toLocaleString() : "—"} • HotelsVendors Mission Control v2
        </div>
      </div>
    </div>
  );
}
