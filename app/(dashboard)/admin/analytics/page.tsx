"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, Users, ShoppingCart, FileText, Landmark,
  ArrowUpRight, ArrowDownRight, Calendar, Filter, Download, RefreshCw, AlertCircle
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalSuppliers: number;
  totalHotels: number;
  platformFees: number;
  factoringVolume: number;
  avgOrderValue: number;
  monthlyGrowth: number;
  activeUsers: number;
  pendingOrders: number;
  completedOrders: number;
  rejectedOrders: number;
  topSuppliers: Array<{ name: string; orders: number; revenue: number }>;
  topHotels: Array<{ name: string; orders: number; spend: number }>;
  revenueByMonth: Array<{ month: string; revenue: number; fees: number }>;
  ordersByStatus: Array<{ status: string; count: number; color: string }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/analytics?period=${period}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatEGP = (amount: number) => `EGP ${amount.toLocaleString()}`;

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-border-subtle mb-8">
          <div className="py-6">
            <h1 className="text-[24px] font-bold tracking-tight text-white flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-accent-base" />
              Analytics & Insights
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-surface-1 border border-border-subtle animate-pulse">
              <div className="h-8 bg-surface-2 rounded w-20 mb-2" />
              <div className="h-3 bg-surface-2 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border-subtle mb-8">
        <div className="py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-white flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-accent-base" />
              Analytics & Insights
            </h1>
            <p className="text-[13px] text-foreground-muted mt-1">Platform performance, revenue metrics, and user analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 p-1 bg-surface-1 rounded-lg border border-border-subtle">
              {(["7d", "30d", "90d", "1y"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    period === p ? "bg-accent-base/10 text-accent-base" : "text-foreground-muted hover:text-foreground-tertiary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="p-2 rounded-lg bg-surface-2 border border-border-subtle text-foreground-muted hover:text-foreground-secondary transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={fetchAnalytics} className="p-2 rounded-lg bg-surface-2 border border-border-subtle text-foreground-muted hover:text-foreground-secondary transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {data === null && !loading && (
        <div className="p-8 rounded-2xl bg-surface-1 border border-error/20 text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-error mb-2">Failed to load analytics</h3>
          <p className="text-foreground-muted mb-4">Unable to fetch analytics data from the server.</p>
          <button onClick={fetchAnalytics} className="px-4 py-2 rounded-xl bg-accent-base text-white text-sm font-medium hover:bg-accent-base/90 transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards */}
      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: formatEGP(data.totalRevenue), change: `+${data.monthlyGrowth}%`, up: true, color: "var(--accent-base)" },
              { label: "Platform Fees", value: formatEGP(data.platformFees), change: "+18.2%", up: true, color: "#f59e0b" },
              { label: "Factoring Volume", value: formatEGP(data.factoringVolume), change: "+24.5%", up: true, color: "#8b5cf6" },
              { label: "Avg Order Value", value: formatEGP(data.avgOrderValue), change: "+5.3%", up: true, color: "var(--info)" },
              { label: "Total Orders", value: data.totalOrders.toLocaleString(), change: "+12.8%", up: true, color: "#10b981" },
              { label: "Active Users", value: data.activeUsers.toLocaleString(), change: "+8.4%", up: true, color: "#ec4899" },
              { label: "Suppliers", value: data.totalSuppliers.toLocaleString(), change: "+15.2%", up: true, color: "#06b6d4" },
              { label: "Hotels", value: data.totalHotels.toLocaleString(), change: "+9.7%", up: true, color: "var(--purple-base)" },
            ].map((kpi) => (
              <div key={kpi.label} className="p-5 rounded-2xl bg-surface-1 border border-border-subtle">
                <div className="text-[24px] font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="text-[11px] text-foreground-muted mt-1">{kpi.label}</div>
                <div className="flex items-center gap-1 mt-2">
                  {kpi.up ? <ArrowUpRight className="w-3 h-3 text-emerald-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
                  <span className="text-[11px] text-emerald-400">{kpi.change}</span>
                  <span className="text-[10px] text-foreground-muted">vs last period</span>
                </div>
              </div>
            ))}
          </div>

          {/* Orders by Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
              <h3 className="text-sm font-semibold text-foreground-secondary mb-4">Orders by Status</h3>
              <div className="space-y-3">
                {data.ordersByStatus.map((s) => (
                  <div key={s.status} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-foreground-secondary flex-1">{s.status}</span>
                    <span className="text-sm font-medium text-foreground-secondary">{s.count}</span>
                    <div className="w-24 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ backgroundColor: s.color, width: `${(s.count / data.totalOrders) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by Month */}
            <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
              <h3 className="text-sm font-semibold text-foreground-secondary mb-4">Revenue by Month</h3>
              <div className="flex items-end gap-2 h-40">
                {data.revenueByMonth.map((m) => {
                  const maxRevenue = Math.max(...data.revenueByMonth.map(x => x.revenue));
                  const height = (m.revenue / maxRevenue) * 100;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-foreground-muted">{formatEGP(m.fees)}</span>
                      <div className="w-full rounded-t bg-accent-base/20 relative" style={{ height: `${height}%` }}>
                        <div className="absolute bottom-0 w-full rounded-t bg-accent-base/60" style={{ height: "60%" }} />
                      </div>
                      <span className="text-[10px] text-foreground-muted">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Suppliers & Hotels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border-subtle bg-surface-1">
              <div className="p-4 border-b border-border-invisible">
                <h3 className="text-sm font-semibold text-foreground-secondary">Top Suppliers</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {data.topSuppliers.map((s, i) => (
                  <div key={s.name} className="p-4 flex items-center gap-3">
                    <span className="text-[11px] text-foreground-muted w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground-secondary truncate">{s.name}</p>
                      <p className="text-[11px] text-foreground-muted">{s.orders} orders</p>
                    </div>
                    <span className="text-sm font-medium text-foreground-secondary">{formatEGP(s.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-1">
              <div className="p-4 border-b border-border-invisible">
                <h3 className="text-sm font-semibold text-foreground-secondary">Top Hotels (by Spend)</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {data.topHotels.map((h, i) => (
                  <div key={h.name} className="p-4 flex items-center gap-3">
                    <span className="text-[11px] text-foreground-muted w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground-secondary truncate">{h.name}</p>
                      <p className="text-[11px] text-foreground-muted">{h.orders} orders</p>
                    </div>
                    <span className="text-sm font-medium text-foreground-secondary">{formatEGP(h.spend)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
