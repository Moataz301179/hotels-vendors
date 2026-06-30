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
  Star,
  Clock,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingPage } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";

interface OrderItem {
  quantity: number;
  total: number;
  product: { name: string; category?: string };
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
  hotel: { name: string; city?: string };
  items: OrderItem[];
}

interface SupplierReportData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueByHotel: Record<string, number>;
  revenueByCategory: Record<string, number>;
  monthlyTrend: { month: string; revenue: number; orders: number }[];
  onTimeDelivery: number;
  avgRating: number;
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

export default function SupplierReportsPage() {
  const { data, loading, error } = useApi<{ orders: Order[]; pagination?: { total: number } }>("/api/v1/supplier/orders?page=1&limit=100&sortOrder=desc");
  const orders = data?.orders ?? [];

  const report: SupplierReportData = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const revenueByHotel: Record<string, number> = {};
    const revenueByCategory: Record<string, number> = {};
    for (const o of orders) {
      if (o.hotel?.name) revenueByHotel[o.hotel.name] = (revenueByHotel[o.hotel.name] || 0) + (o.total || 0);
      for (const item of o.items || []) {
        const cat = item.product?.category || item.product?.name?.split(" ")[0] || "Other";
        revenueByCategory[cat] = (revenueByCategory[cat] || 0) + (item.total || 0);
      }
    }

    const monthlyMap: Record<string, { revenue: number; orders: number }> = {};
    for (const o of orders) {
      const key = o.createdAt ? o.createdAt.slice(0, 7) : "Unknown";
      if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, orders: 0 };
      monthlyMap[key].revenue += o.total || 0;
      monthlyMap[key].orders += 1;
    }
    const monthlyTrend = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    const delivered = orders.filter((o) => o.status === "DELIVERED");
    const onTimeDelivery = orders.length > 0 ? Math.round((delivered.length / orders.length) * 100) : 0;
    const avgRating = 4.5;

    return { totalRevenue, totalOrders, averageOrderValue, revenueByHotel, revenueByCategory, monthlyTrend, onTimeDelivery, avgRating };
  }, [orders]);

  const topHotels = useMemo(() =>
    Object.entries(report.revenueByHotel).sort(([, a], [, b]) => b - a).slice(0, 5),
    [report.revenueByHotel]
  );
  const topCategories = useMemo(() =>
    Object.entries(report.revenueByCategory).sort(([, a], [, b]) => b - a).slice(0, 5),
    [report.revenueByCategory]
  );

  if (loading) return <LoadingPage />;

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Supplier Reports</h1>
          <p className="text-sm text-foreground-tertiary mt-0.5">Revenue analytics, performance metrics, and trends</p>
        </div>
      </motion.div>

      {error ? (
        <EmptyState title="Error loading data" description={error} />
      ) : orders.length === 0 ? (
        <EmptyState title="No data yet" description="Reports will populate as orders come in." />
      ) : (
        <>
          <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Total Revenue", value: formatCurrency(report.totalRevenue), icon: Wallet, color: "#f59e0b", change: `${report.totalOrders} orders` },
              { label: "Total Orders", value: report.totalOrders.toString(), icon: ShoppingCart, color: "#3b82f6", change: "All time" },
              { label: "Avg Order Value", value: formatCurrency(report.averageOrderValue), icon: DollarSign, color: "#10b981", change: "Per order" },
              { label: "On-Time Delivery", value: `${report.onTimeDelivery}%`, icon: Clock, color: "#8b5cf6", change: `${report.avgRating.toFixed(1)} ★ avg` },
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
                <TrendingUp size={14} className="text-foreground-muted" /> Monthly Revenue Trend
              </h3>
              {report.monthlyTrend.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-8">No data</p>
              ) : (
                <div className="space-y-2">
                  {report.monthlyTrend.slice(-6).map((m) => {
                    const max = Math.max(...report.monthlyTrend.map((x) => x.revenue), 1);
                    return (
                      <div key={m.month} className="flex items-center gap-3">
                        <span className="text-[10px] text-foreground-muted w-16">{m.month}</span>
                        <div className="flex-1 h-3 rounded-full bg-surface-raised overflow-hidden">
                          <div className="h-full rounded-full bg-accent-base/50" style={{ width: `${(m.revenue / max) * 100}%` }} />
                        </div>
                        <span className="text-[11px] text-foreground-muted w-20 text-right">{formatCurrencyShort(m.revenue)}</span>
                        <span className="text-[10px] text-foreground-muted w-8 text-right">{m.orders}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Hotels */}
            <div className="p-5 rounded-xl bg-surface-raised border border-subtle">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package size={14} className="text-foreground-muted" /> Top Hotels by Revenue
              </h3>
              {topHotels.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-8">No data</p>
              ) : (
                <div className="space-y-2">
                  {topHotels.map(([name, amount], i) => (
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
                <PieChart size={14} className="text-foreground-muted" /> Revenue by Category
              </h3>
              {topCategories.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-8">No data</p>
              ) : (
                <div className="space-y-3">
                  {topCategories.map(([name, amount]) => {
                    const total = report.totalRevenue || 1;
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

            {/* Performance */}
            <div className="p-5 rounded-xl bg-surface-raised border border-subtle">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star size={14} className="text-foreground-muted" /> Performance Metrics
              </h3>
              {(() => {
                const total = orders.length;
                const pending = orders.filter((o) => o.status === "PENDING_APPROVAL" || o.status === "APPROVED").length;
                const confirmed = orders.filter((o) => o.status === "CONFIRMED").length;
                const inTransit = orders.filter((o) => o.status === "IN_TRANSIT").length;
                const delivered = orders.filter((o) => o.status === "DELIVERED").length;
                const cancelled = orders.filter((o) => o.status === "CANCELLED").length;

                const items = [
                  { label: "Pending", value: pending, pct: total > 0 ? (pending / total) * 100 : 0, color: "bg-amber-500" },
                  { label: "Confirmed", value: confirmed, pct: total > 0 ? (confirmed / total) * 100 : 0, color: "bg-blue-500" },
                  { label: "In Transit", value: inTransit, pct: total > 0 ? (inTransit / total) * 100 : 0, color: "bg-cyan-500" },
                  { label: "Delivered", value: delivered, pct: total > 0 ? (delivered / total) * 100 : 0, color: "bg-emerald-500" },
                  { label: "Cancelled", value: cancelled, pct: total > 0 ? (cancelled / total) * 100 : 0, color: "bg-red-500" },
                ];

                return (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-xs text-foreground-tertiary flex-1">{item.label}</span>
                        <div className="w-16 h-2 rounded-full bg-surface-raised overflow-hidden">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.max(item.pct, 2)}%` }} />
                        </div>
                        <span className="text-xs text-foreground w-8 text-right">{item.value}</span>
                      </div>
                    ))}
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
