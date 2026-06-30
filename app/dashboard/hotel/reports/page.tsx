"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Wallet,
  ShoppingCart,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  FileText,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingPage } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";

interface Order {
  id: string;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
  supplier: { name: string };
  items: { quantity: number; total: number; product: { name: string } }[];
}

interface ReportData {
  totalSpend: number;
  totalOrders: number;
  averageOrderValue: number;
  spendBySupplier: Record<string, number>;
  spendByCategory: Record<string, number>;
  monthlyTrend: { month: string; amount: number; count: number }[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

function formatCurrencyShort(amount: number) {
  if (amount >= 1000000) return `EGP ${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `EGP ${(amount / 1000).toFixed(1)}K`;
  return `EGP ${amount}`;
}

export default function HotelReportsPage() {
  const { data: ordersData, loading: ordersLoading, error } = useApi<{ orders: Order[]; pagination: { total: number } }>(
    "/api/v1/hotel/orders?page=1&limit=100&sortOrder=desc"
  );
  const orders = ordersData?.orders ?? [];

  const report: ReportData = useMemo(() => {
    const totalSpend = orders.reduce((s, o) => s + (o.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSpend / totalOrders : 0;

    const spendBySupplier: Record<string, number> = {};
    const spendByCategory: Record<string, number> = {};
    for (const o of orders) {
      if (o.supplier?.name) spendBySupplier[o.supplier.name] = (spendBySupplier[o.supplier.name] || 0) + (o.total || 0);
      for (const item of o.items || []) {
        if (item.product?.name) {
          const cat = item.product.name.split(" ")[0] || "Other";
          spendByCategory[cat] = (spendByCategory[cat] || 0) + (item.total || 0);
        }
      }
    }

    const monthlyMap: Record<string, { amount: number; count: number }> = {};
    for (const o of orders) {
      const key = o.createdAt ? o.createdAt.slice(0, 7) : "Unknown";
      if (!monthlyMap[key]) monthlyMap[key] = { amount: 0, count: 0 };
      monthlyMap[key].amount += o.total || 0;
      monthlyMap[key].count += 1;
    }
    const monthlyTrend = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    return { totalSpend, totalOrders, averageOrderValue, spendBySupplier, spendByCategory, monthlyTrend };
  }, [orders]);

  const topSuppliers = useMemo(() =>
    Object.entries(report.spendBySupplier)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5),
    [report.spendBySupplier]
  );

  const topCategories = useMemo(() =>
    Object.entries(report.spendByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5),
    [report.spendByCategory]
  );

  if (ordersLoading) return <LoadingPage />;

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-foreground-tertiary mt-0.5">Procurement spend analysis and performance metrics</p>
        </div>
      </motion.div>

      {error ? (
        <EmptyState title="Error loading data" description={error} />
      ) : orders.length === 0 ? (
        <EmptyState title="No data yet" description="Reports will populate as orders are created." />
      ) : (
        <>
          {/* KPI Cards */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Total Spend", value: formatCurrency(report.totalSpend), icon: Wallet, color: "#f59e0b", change: `${report.totalOrders} orders` },
              { label: "Total Orders", value: report.totalOrders.toString(), icon: ShoppingCart, color: "#3b82f6", change: "All time" },
              { label: "Avg Order Value", value: formatCurrency(report.averageOrderValue), icon: DollarSign, color: "#10b981", change: "Per order" },
              { label: "Active Suppliers", value: topSuppliers.length.toString(), icon: Package, color: "#8b5cf6", change: "With orders" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="rounded-xl border border-subtle bg-surface-raised p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-medium text-foreground-muted uppercase tracking-wider">{stat.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center">
                    <stat.icon size={15} style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight size={12} className="text-emerald-400" />
                  <span className="text-[11px] font-medium text-emerald-400">{stat.change}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Monthly Trend */}
            <div className="p-5 rounded-xl bg-surface-raised border border-subtle">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-foreground-muted" /> Monthly Spend Trend
              </h3>
              {report.monthlyTrend.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-8">No monthly data</p>
              ) : (
                <div className="space-y-2">
                  {report.monthlyTrend.slice(-6).map((m) => {
                    const max = Math.max(...report.monthlyTrend.map((x) => x.amount), 1);
                    return (
                      <div key={m.month} className="flex items-center gap-3">
                        <span className="text-[10px] text-foreground-muted w-16">{m.month}</span>
                        <div className="flex-1 h-3 rounded-full bg-surface-raised overflow-hidden">
                          <div className="h-full rounded-full bg-accent-base/50" style={{ width: `${(m.amount / max) * 100}%` }} />
                        </div>
                        <span className="text-[11px] text-foreground-muted w-20 text-right">{formatCurrencyShort(m.amount)}</span>
                        <span className="text-[10px] text-foreground-muted w-8 text-right">{m.count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Suppliers */}
            <div className="p-5 rounded-xl bg-surface-raised border border-subtle">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package size={14} className="text-foreground-muted" /> Top Suppliers by Spend
              </h3>
              {topSuppliers.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-8">No supplier data</p>
              ) : (
                <div className="space-y-2">
                  {topSuppliers.map(([name, amount], i) => (
                    <div key={name} className="flex items-center gap-3 p-2 rounded-lg bg-surface-raised">
                      <span className="text-[10px] font-bold text-foreground-muted w-4">{i + 1}</span>
                      <span className="text-xs text-foreground flex-1 truncate">{name}</span>
                      <span className="text-xs font-semibold text-emerald-400">{formatCurrencyShort(amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="p-5 rounded-xl bg-surface-raised border border-subtle">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <PieChart size={14} className="text-foreground-muted" /> Spend by Category
              </h3>
              {topCategories.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-8">No category data</p>
              ) : (
                <div className="space-y-3">
                  {topCategories.map(([name, amount]) => {
                    const total = report.totalSpend || 1;
                    return (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-xs text-foreground-tertiary flex-1 truncate">{name}</span>
                        <div className="w-20 h-2 rounded-full bg-surface-raised overflow-hidden">
                          <div className="h-full rounded-full bg-accent-base/60" style={{ width: `${(amount / total) * 100}%` }} />
                        </div>
                        <span className="text-[11px] text-foreground-muted w-16 text-right">{((amount / total) * 100).toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Status Breakdown */}
            <div className="p-5 rounded-xl bg-surface-raised border border-subtle">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText size={14} className="text-foreground-muted" /> Order Status Breakdown
              </h3>
              {(() => {
                const byStatus: Record<string, number> = {};
                for (const o of orders) {
                  byStatus[o.status] = (byStatus[o.status] || 0) + 1;
                }
                const entries = Object.entries(byStatus);
                return entries.length === 0 ? (
                  <p className="text-xs text-foreground-muted text-center py-8">No data</p>
                ) : (
                  <div className="space-y-2">
                    {entries.map(([status, count]) => {
                      const pct = (count / orders.length) * 100;
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <span className="text-xs text-foreground-tertiary w-28 capitalize truncate">{status.toLowerCase().replace(/_/g, " ")}</span>
                          <div className="flex-1 h-2 rounded-full bg-surface-raised overflow-hidden">
                            <div className="h-full rounded-full bg-accent-base/50" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-foreground w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
