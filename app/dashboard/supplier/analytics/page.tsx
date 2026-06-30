"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  Package,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingPage } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { StatusPill } from "@/components/dashboards/shared/status-pill";
import { MetricTile } from "@/components/dashboards/shared/metric-tile";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface RecentOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

interface MonthlyDatum {
  month: string;
  revenue: number;
  orders: number;
}

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  activeListings: number;
  pendingOrders: number;
  etaComplianceRate: number;
  recentActivity: RecentOrder[];
  monthlyData: MonthlyDatum[];
}

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-[11px] text-foreground-tertiary w-20 truncate">{item.label}</span>
          <div className="flex-1 h-5 bg-surface-raised rounded-md overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / max) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-md"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            />
          </div>
          <span className="text-[11px] font-medium text-foreground w-6 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function RevenueComparison({ current, previous, currency }: { current: number; previous: number; currency?: string }) {
  const diff = current - previous;
  const pct = previous > 0 ? ((diff / previous) * 100).toFixed(1) : "0";
  const isUp = diff >= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-foreground-muted uppercase tracking-wider">This Month</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(current, currency)}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(Number(pct))}%
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-foreground-muted uppercase tracking-wider">Last Month</p>
          <p className="text-lg font-semibold text-foreground-tertiary mt-1">{formatCurrency(previous, currency)}</p>
        </div>
      </div>
      <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((current / Math.max(previous, 1)) * 50, 100)}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-emerald-500/40 rounded-full"
        />
      </div>
    </div>
  );
}

function OrderNumber({ orderNumber }: { orderNumber: string }) {
  return <span className="text-xs font-mono text-foreground-tertiary">{orderNumber}</span>;
}

export default function SupplierAnalyticsPage() {
  const { data, loading, error } = useApi<AnalyticsData>("/api/v1/supplier/analytics");

  const analytics = data;

  const months = analytics?.monthlyData ?? [];
  const currentMonthRevenue = months[months.length - 1]?.revenue ?? 0;
  const prevMonthRevenue = months[months.length - 2]?.revenue ?? 0;

  const revenueCurrency = "EGP";

  const stats = useMemo(() => {
    if (!analytics) return [];
    return [
      { label: "Total Revenue", value: formatCurrency(analytics.totalRevenue, revenueCurrency), icon: TrendingUp },
      { label: "Total Orders", value: analytics.totalOrders.toString(), icon: BarChart3 },
      { label: "Active Listings", value: analytics.activeListings.toString(), icon: Package },
      { label: "Pending Orders", value: analytics.pendingOrders.toString(), icon: Clock },
    ];
  }, [analytics, revenueCurrency]);

  const monthlyOrderCounts = useMemo(() => {
    return months.map((m) => ({ label: m.month.slice(5), value: m.orders }));
  }, [months]);

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto">
        <LoadingPage />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto">
        <EmptyState title="Error loading analytics" description={error} />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-[1600px] mx-auto">
        <EmptyState title="No analytics data" description="Analytics will appear once you start receiving orders." />
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-sm text-foreground-tertiary mt-0.5">Performance insights and sales trends</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeInUp}>
            <MetricTile
              label={s.label}
              value={s.value}
              icon={s.icon}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Top Row */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Trend */}
        <div className="lg:col-span-2 rounded-xl border border-subtle bg-surface-raised p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp size={14} className="text-foreground-tertiary" />
              Sales Trend
            </h3>
            <span className="text-[10px] text-foreground-muted flex items-center gap-1">
              <Calendar size={10} />
              Last 6 months
            </span>
          </div>
          {months.length > 0 ? (
            <div className="flex items-end gap-1 h-40">
              {months.map((m, i) => {
                const max = Math.max(...months.map((x) => x.revenue), 1);
                const height = (m.revenue / max) * 100;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: i * 0.02 }}
                      className="w-full bg-surface-raised hover:bg-white/[0.12] rounded-t-sm transition-colors relative group"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-raised border border-subtle px-1.5 py-0.5 rounded text-[9px] text-foreground whitespace-nowrap">
                        {formatCurrency(m.revenue, revenueCurrency)}
                      </div>
                    </motion.div>
                    <span className="text-[9px] text-foreground-muted">{m.month.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No trend data" description="Sales data will appear here once orders start flowing." />
          )}
        </div>

        {/* Revenue */}
        <div className="rounded-xl border border-subtle bg-surface-raised p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={14} className="text-foreground-tertiary" />
            Revenue
          </h3>
          <RevenueComparison
            current={currentMonthRevenue}
            previous={prevMonthRevenue}
            currency={revenueCurrency}
          />
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="rounded-xl border border-subtle bg-surface-raised p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock size={14} className="text-foreground-tertiary" />
            Recent Activity
          </h3>
          {analytics.recentActivity.length > 0 ? (
            <div className="space-y-2">
              {analytics.recentActivity.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-raised border border-subtle">
                  <div className="flex items-center gap-3">
                    <OrderNumber orderNumber={order.orderNumber} />
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill status={order.status} />
                    <span className="text-xs font-semibold text-foreground">{formatCurrency(Number(order.total), revenueCurrency)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No activity yet" description="Recent orders will appear here." />
          )}
        </div>

        {/* Orders per Month */}
        <div className="rounded-xl border border-subtle bg-surface-raised p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={14} className="text-foreground-tertiary" />
            Orders per Month
          </h3>
          {monthlyOrderCounts.length > 0 && monthlyOrderCounts.some((d) => d.value > 0) ? (
            <SimpleBarChart data={monthlyOrderCounts} />
          ) : (
            <EmptyState title="No order data" description="Monthly order data will appear here." />
          )}
        </div>

        {/* ETA Compliance */}
        <div className="rounded-xl border border-subtle bg-surface-raised p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-foreground-tertiary" />
            ETA Compliance
          </h3>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke={analytics.etaComplianceRate >= 80 ? "#22c55e" : analytics.etaComplianceRate >= 50 ? "#eab308" : "#ef4444"}
                  strokeWidth="3"
                  strokeDasharray={`${(analytics.etaComplianceRate / 100) * 100.53} 100.53`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{analytics.etaComplianceRate}%</span>
              </div>
            </div>
            <p className="text-xs text-foreground-tertiary text-center">
              {analytics.etaComplianceRate >= 80
                ? "Excellent compliance rate"
                : analytics.etaComplianceRate >= 50
                  ? "Moderate compliance — improvement needed"
                  : "Low compliance — review ETA submissions"}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
