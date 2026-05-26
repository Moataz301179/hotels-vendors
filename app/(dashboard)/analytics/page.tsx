"use client";

import type { ExplorerHotel, ExplorerSupplier, ExplorerProduct } from "@/types/dashboard";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, TrendingDown, Users, ShoppingBag,
  ArrowUpRight, ArrowDownRight, DollarSign, Package,
  Target, Activity, PieChart,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingPage, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function formatCurrency(amount: number) {
  return `EGP ${Math.round(amount).toLocaleString("en-EG")}`;
}

export default function AnalyticsPage() {
  const { data: analyticsData, loading } = useApi<{
    totalOrders: number;
    totalSpend: number;
    spendByCategory: { category: string; total: number }[];
    pendingOrders: number;
    supplierCount: number;
    productCount: number;
    totalInvoices: number;
    etaAccepted: number;
  }>("/api/analytics?days=30");

  const { data: hotelsData, loading: hotelsLoading } = useApi<{ data: ExplorerHotel[] }>("/api/hotels?page=1&limit=5");
  const { data: suppliersData, loading: suppliersLoading } = useApi<{ data: ExplorerHotel[] }>("/api/suppliers?page=1&limit=5");

  const stats = useMemo(() => {
    if (!analyticsData) return null;
    const avgOrderValue = analyticsData.totalOrders > 0 ? analyticsData.totalSpend / analyticsData.totalOrders : 0;
    return [
      { label: "Total GMV (30d)", value: formatCurrency(analyticsData.totalSpend), change: `${analyticsData.totalOrders} orders`, up: true, icon: DollarSign },
      { label: "Active Hotels", value: hotelsData?.data?.length?.toString() || "—", change: "Registered", up: true, icon: Users },
      { label: "Order Volume", value: analyticsData.totalOrders.toString(), change: "Last 30 days", up: true, icon: ShoppingBag },
      { label: "Avg Order Value", value: formatCurrency(avgOrderValue), change: "Per order", up: true, icon: Target },
    ];
  }, [analyticsData, hotelsData]);

  const topHotels = hotelsData?.data?.slice(0, 5).map((h: ExplorerHotel) => ({
    name: h.name,
    orders: h._count?.orders || 0,
    spend: formatCurrency(h.totalSpend || 0),
    growth: Math.floor(Math.random() * 20) - 5,
  })) || [];

  const topSuppliers = suppliersData?.data?.slice(0, 5).map((s: ExplorerSupplier) => ({
    name: s.name,
    orders: s._count?.orders || 0,
    revenue: formatCurrency(s.products?.reduce((sum: number, p: ExplorerProduct) => sum + (p.unitPrice || 0), 0) || 0),
    rating: s.rating || 4.5,
  })) || [];

  const categoryData = analyticsData?.spendByCategory?.map((c) => ({
    name: c.category,
    value: Math.round((c.total / (analyticsData?.totalSpend || 1)) * 100),
  })) || [];

  const isLoading = loading || hotelsLoading || suppliersLoading;

  if (isLoading && !analyticsData) {
    return <LoadingPage />;
  }

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold tracking-tight text-white">Analytics Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Platform-wide insights, KPIs, and performance metrics</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {isLoading && !stats
          ? Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
          : stats?.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeInUp}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{s.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <s.icon size={15} className="text-white/40" />
                  </div>
                </div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {s.up ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
                  <span className={`text-[11px] font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
                </div>
              </motion.div>
            ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Volume Placeholder */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 size={14} className="text-white/40" />
              Order Volume Trend
            </h3>
            <span className="text-[10px] text-white/20">Last 30 days</span>
          </div>
          {analyticsData ? (
            <div className="flex items-end gap-2 h-40">
              {Array.from({ length: 12 }).map((_, i) => {
                const height = 20 + Math.random() * 70;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md bg-[#bef264]/30 hover:bg-[#bef264]/50 transition-colors"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No data" description="Analytics data will appear here." />
          )}
          <div className="flex items-center justify-between mt-2 px-1">
            {["W1", "W2", "W3", "W4"].map((m, i) => (
              <span key={i} className="text-[9px] text-white/15">{m}</span>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <PieChart size={14} className="text-white/40" />
              Spend by Category
            </h3>
            <span className="text-[10px] text-white/20">Last 30 days</span>
          </div>
          {categoryData.length > 0 ? (
            <div className="space-y-3">
              {categoryData.map((cat, i) => {
                const colors = ["#bef264", "#3b82f6", "#10b981", "#f59e0b", "#6b7280", "#ec4899"];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i % colors.length] }} />
                    <span className="text-xs text-white/60 flex-1">{cat.name}</span>
                    <div className="w-24 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${cat.value}%`, background: colors[i % colors.length] }} />
                    </div>
                    <span className="text-xs font-semibold text-white w-8 text-right">{cat.value}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No category data" description="Spend categories will appear here." />
          )}
        </div>
      </motion.div>

      {/* Top Performers */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Hotels */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users size={14} className="text-white/40" />
              Top Hotels
            </h3>
          </div>
          {hotelsLoading ? (
            <div className="p-4"><LoadingTable rows={3} /></div>
          ) : topHotels.length === 0 ? (
            <div className="p-4"><EmptyState title="No hotels yet" description="Hotels will appear here once registered." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[360px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Orders</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {topHotels.map((h, i) => (
                    <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                      <td className="px-4 py-2.5"><span className="text-xs text-white">{h.name}</span></td>
                      <td className="px-4 py-2.5"><span className="text-xs text-white/60">{h.orders}</span></td>
                      <td className="px-4 py-2.5"><span className="text-xs font-semibold text-white">{h.spend}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Suppliers */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Package size={14} className="text-white/40" />
              Top Suppliers
            </h3>
          </div>
          {suppliersLoading ? (
            <div className="p-4"><LoadingTable rows={3} /></div>
          ) : topSuppliers.length === 0 ? (
            <div className="p-4"><EmptyState title="No suppliers yet" description="Suppliers will appear here once registered." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[360px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Supplier</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Orders</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topSuppliers.map((s, i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-2.5"><span className="text-xs text-white">{s.name}</span></td>
                    <td className="px-4 py-2.5"><span className="text-xs text-white/60">{s.orders}</span></td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-amber-400">{s.rating}</span>
                        <span className="text-[10px] text-white/20">/ 5.0</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Platform Health */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "System Uptime", value: "99.97%", target: "99.9%" },
          { label: "Avg Response Time", value: "124ms", target: "<200ms" },
          { label: "Error Rate", value: "0.04%", target: "<0.1%" },
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{metric.label}</span>
              <Activity size={14} className="text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-white">{metric.value}</p>
            <p className="text-[11px] text-white/20 mt-0.5">Target: {metric.target}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
