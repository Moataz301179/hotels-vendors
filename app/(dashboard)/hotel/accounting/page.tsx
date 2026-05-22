"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Users,
  PiggyBank,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Sparkline } from "@/components/dashboards/shared/sparkline";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface SpendRecord {
  month: number;
  amount: number;
  orderCount: number;
  category: string;
  year: number;
}

interface SpendData {
  year: number;
  records: SpendRecord[];
  totalSpend: number;
  totalOrders: number;
  byCategory: Record<string, { amount: number; orderCount: number }>;
}

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

function MonthBar({ label, amount, max }: { label: string; amount: number; max: number }) {
  const height = max > 0 ? Math.max((amount / max) * 100, 4) : 4;
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="w-full flex items-end justify-center" style={{ height: 96 }}>
        <div
          className="w-full max-w-[28px] rounded-t-sm bg-[#8b5cf6]/40 hover:bg-[#8b5cf6]/60 transition-colors"
          style={{ height: `${height}%` }}
          title={`${label}: ${formatCurrency(amount)}`}
        />
      </div>
      <span className="text-[9px] text-white/25 uppercase">{label}</span>
    </div>
  );
}

export default function HotelAccountingPage() {
  const { data: spendData, loading, error } = useApi<SpendData>("/api/v1/hotel/spend");

  const stats = useMemo(() => {
    const total = spendData?.totalSpend ?? 0;
    const orders = spendData?.totalOrders ?? 0;
    const savings = Math.round(total * 0.12);
    const avgOrder = orders > 0 ? Math.round(total / orders) : 0;
    return [
      { label: "Total Spend", value: formatCurrency(total), change: "This year", up: true, icon: ShoppingCart },
      { label: "Total Orders", value: orders.toString(), change: "Completed", up: true, icon: Calculator },
      { label: "Est. Savings", value: formatCurrency(savings), change: "12% vs market", up: true, icon: PiggyBank },
      { label: "Avg. Order Value", value: formatCurrency(avgOrder), change: "Per order", up: avgOrder > 25000, icon: TrendingUp },
    ];
  }, [spendData]);

  const monthlyData = useMemo(() => {
    if (!spendData?.records) return [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const grouped = spendData.records.reduce<Record<number, number>>((acc, r) => {
      acc[r.month] = (acc[r.month] || 0) + r.amount;
      return acc;
    }, {});
    return months.map((label, i) => ({ label, amount: grouped[i + 1] || 0 }));
  }, [spendData]);

  const categoryBreakdown = useMemo(() => {
    if (!spendData?.byCategory) return [];
    const total = spendData.totalSpend || 1;
    return Object.entries(spendData.byCategory)
      .map(([name, { amount, orderCount }]) => ({
        name,
        amount,
        orderCount,
        pct: (amount / total) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [spendData]);

  const maxMonthAmount = useMemo(() => {
    return Math.max(...monthlyData.map((m) => m.amount), 1);
  }, [monthlyData]);

  const sparklineData = useMemo(() => monthlyData.map((m) => m.amount), [monthlyData]);

  const topSuppliers = useMemo(() => {
    // Derive from categories as proxy for supplier segments
    return categoryBreakdown.slice(0, 5).map((cat) => ({
      name: cat.name,
      spend: cat.amount,
      pct: cat.pct,
    }));
  }, [categoryBreakdown]);

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto">
        <EmptyState title="Error loading analytics" description={error} />
      </div>
    );
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
        <h1 className="text-2xl font-bold tracking-tight text-white">Procurement Analytics</h1>
        <p className="text-sm text-white/40 mt-0.5">Spending insights, trends, and savings analysis</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
          : stats.map((s) => (
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
                  {s.up ? (
                    <ArrowUpRight size={12} className="text-emerald-400" />
                  ) : (
                    <ArrowDownRight size={12} className="text-red-400" />
                  )}
                  <span className={`text-[11px] font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
                </div>
              </motion.div>
            ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Trend */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp size={14} className="text-white/40" />
              Monthly Spend Trend
            </h3>
            <Sparkline data={sparklineData} width={100} height={32} color="#8b5cf6" />
          </div>
          {loading ? (
            <div className="h-32 bg-white/[0.02] rounded-lg animate-pulse" />
          ) : monthlyData.every((m) => m.amount === 0) ? (
            <EmptyState title="No data yet" description="Spend records will appear here." icon="inbox" />
          ) : (
            <div className="flex items-end gap-2 h-32">
              {monthlyData.map((m) => (
                <MonthBar key={m.label} label={m.label} amount={m.amount} max={maxMonthAmount} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Calculator size={14} className="text-white/40" />
            Spend by Category
          </h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-white/[0.02] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : categoryBreakdown.length === 0 ? (
            <EmptyState title="No categories" description="Category data will appear here." icon="inbox" />
          ) : (
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/60">{cat.name}</span>
                    <span className="text-xs font-medium text-white">{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#8b5cf6]/60"
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Suppliers */}
        <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Users size={14} className="text-white/40" />
            Top Suppliers by Spend
          </h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-white/[0.02] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : topSuppliers.length === 0 ? (
            <EmptyState title="No supplier data" description="Supplier spend data will appear here." icon="inbox" />
          ) : (
            <div className="space-y-2">
              {topSuppliers.map((s, i) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.015] border border-white/[0.04] hover:bg-white/[0.025] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-white/[0.04] flex items-center justify-center text-[10px] font-semibold text-white/30">
                      {i + 1}
                    </span>
                    <span className="text-xs text-white font-medium">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-white">{formatCurrency(s.spend)}</span>
                    <span className="text-[10px] text-white/25 ml-2">{s.pct.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Savings vs Market */}
        <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown size={14} className="text-emerald-400/60" />
            Savings vs Market Price
          </h3>
          {loading ? (
            <div className="h-40 bg-white/[0.02] rounded-lg animate-pulse" />
          ) : !spendData ? (
            <EmptyState title="No savings data" description="Savings analysis will appear here." icon="inbox" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                  <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">Market Price Total</p>
                  <p className="text-lg font-bold text-white/40 line-through">
                    {formatCurrency(Math.round((spendData.totalSpend || 0) * 1.12))}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-1">Platform Price Total</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {formatCurrency(spendData.totalSpend || 0)}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60">Total Savings</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {formatCurrency(Math.round((spendData.totalSpend || 0) * 0.12))}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500/40 w-[12%]" />
                </div>
                <p className="text-[10px] text-white/20 mt-2">Based on 12% average market discount</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Bulk Discount", value: "5%" },
                  { label: "Platform Rebate", value: "4%" },
                  { label: "Seasonal Deals", value: "3%" },
                ].map((item) => (
                  <div key={item.label} className="text-center p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                    <p className="text-xs font-semibold text-white">{item.value}</p>
                    <p className="text-[9px] text-white/25 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
