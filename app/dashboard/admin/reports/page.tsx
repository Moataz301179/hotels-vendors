"use client";

import { BarChart3, TrendingUp, Wallet, Package, Users, FileCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/lib/hooks/use-api";

interface ReportData {
  gmv: { total: number; monthly: number; weekly: number };
  orders: Array<{ status: string; count: number; value: number }>;
  topHotels: Array<{ id: string; name: string; orderCount: number; gmv: number }>;
  topSuppliers: Array<{ id: string; name: string; orderCount: number; gmv: number }>;
  categories: Array<{ category: string; count: number }>;
  factoring: { totalDisbursed: number; totalPlatformFees: number; requestCount: number };
  eta: Array<{ status: string; count: number }>;
  userGrowth: { newUsers30d: number; totalUsers: number };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  APPROVED: "#3b82f6",
  CONFIRMED: "#10b981",
  IN_TRANSIT: "#06b6d4",
  DELIVERED: "#8b5cf6",
  CANCELLED: "#ef4444",
  DISPUTED: "#f97316",
};

export default function AdminReportsPage() {
  const { data, loading, error } = useApi<ReportData>("/api/v1/admin/reports");

  const formatEgp = (v: number) => `EGP ${(v / 1000000).toFixed(2)}M`;
  const formatEgpK = (v: number) => `EGP ${(v / 1000).toFixed(0)}K`;

  const kpiCards = [
    { label: "Total GMV", value: data ? formatEgp(data.gmv.total) : "—", icon: Wallet, color: "var(--accent-base)" },
    { label: "Monthly GMV", value: data ? formatEgp(data.gmv.monthly) : "—", icon: TrendingUp, color: "#10b981" },
    { label: "Weekly GMV", value: data ? formatEgp(data.gmv.weekly) : "—", icon: TrendingUp, color: "#3b82f6" },
    { label: "Platform Fees", value: data ? formatEgp(data.factoring.totalPlatformFees) : "—", icon: BarChart3, color: "#f59e0b" },
    { label: "New Users (30d)", value: data ? String(data.userGrowth.newUsers30d) : "—", icon: Users, color: "#8b5cf6" },
    { label: "ETA Compliant", value: data ? `${data.eta.filter((e) => ["ACCEPTED", "VALIDATED"].includes(e.status)).reduce((s, e) => s + e.count, 0)} invoices` : "—", icon: FileCheck, color: "#06b6d4" },
  ];

  return (
    <div className="min-h-screen">
      <div className="border-b border-subtle">
        <div className="px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-base/15 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-accent-base" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-foreground">Platform Reports</h1>
              <p className="text-[13px] text-foreground-tertiary">Cross-tenant analytics, revenue, and operational intelligence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">{error}</div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiCards.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-[#0f0f0f] border border-subtle"
            >
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                <span className="text-[10px] text-foreground-muted uppercase tracking-wider">{kpi.label}</span>
              </div>
              <div className="text-[18px] font-bold text-foreground">{loading ? "—" : kpi.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Order Status Breakdown */}
          <div className="p-5 rounded-xl bg-[#0f0f0f] border border-subtle">
            <h3 className="text-[14px] font-semibold text-foreground mb-4">Orders by Status (30d)</h3>
            <div className="space-y-3">
              {data?.orders?.map((o) => (
                <div key={o.status} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[o.status] || "#8B5CF6" }} />
                  <span className="text-[12px] text-foreground-tertiary w-28 capitalize">{o.status.toLowerCase()}</span>
                  <div className="flex-1 h-2 rounded-full bg-surface-raised overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(2, (o.count / (data.orders.reduce((s, x) => s + x.count, 0) || 1)) * 100)}%`,
                        backgroundColor: STATUS_COLORS[o.status] || "#8B5CF6",
                      }}
                    />
                  </div>
                  <span className="text-[12px] font-medium text-foreground w-12 text-right">{o.count}</span>
                  <span className="text-[11px] text-foreground-muted w-20 text-right">{formatEgpK(o.value)}</span>
                </div>
              )) || <p className="text-[12px] text-foreground-muted py-4 text-center">No data</p>}
            </div>
          </div>

          {/* Top Hotels */}
          <div className="p-5 rounded-xl bg-[#0f0f0f] border border-subtle">
            <h3 className="text-[14px] font-semibold text-foreground mb-4">Top Hotels by GMV (30d)</h3>
            <div className="space-y-2.5">
              {data?.topHotels?.map((h, i) => (
                <div key={h.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-raised">
                  <span className="text-[11px] font-bold text-foreground-muted w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">{h.name}</p>
                    <p className="text-[11px] text-foreground-muted">{h.orderCount} orders</p>
                  </div>
                  <span className="text-[12px] font-semibold text-emerald-400">{formatEgpK(h.gmv)}</span>
                </div>
              )) || <p className="text-[12px] text-foreground-muted py-4 text-center">No data</p>}
            </div>
          </div>

          {/* Top Suppliers */}
          <div className="p-5 rounded-xl bg-[#0f0f0f] border border-subtle">
            <h3 className="text-[14px] font-semibold text-foreground mb-4">Top Suppliers by GMV (30d)</h3>
            <div className="space-y-2.5">
              {data?.topSuppliers?.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-raised">
                  <span className="text-[11px] font-bold text-foreground-muted w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">{s.name}</p>
                    <p className="text-[11px] text-foreground-muted">{s.orderCount} orders</p>
                  </div>
                  <span className="text-[12px] font-semibold text-emerald-400">{formatEgpK(s.gmv)}</span>
                </div>
              )) || <p className="text-[12px] text-foreground-muted py-4 text-center">No data</p>}
            </div>
          </div>

          {/* Categories */}
          <div className="p-5 rounded-xl bg-[#0f0f0f] border border-subtle">
            <h3 className="text-[14px] font-semibold text-foreground mb-4">Product Categories</h3>
            <div className="space-y-3">
              {data?.categories?.map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="text-[12px] text-foreground-tertiary flex-1">{c.category}</span>
                  <div className="w-24 h-2 rounded-full bg-surface-raised overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent-base/60 transition-all"
                      style={{
                        width: `${Math.max(2, (c.count / (data.categories.reduce((s, x) => s + x.count, 0) || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[12px] font-medium text-foreground w-8 text-right">{c.count}</span>
                </div>
              )) || <p className="text-[12px] text-foreground-muted py-4 text-center">No data</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
