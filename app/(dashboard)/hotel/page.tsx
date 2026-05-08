"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart, TrendingUp, Wallet, Package, ArrowUpRight, ArrowDownRight,
  Search, Filter, AlertCircle, Target,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface Order {
  id: string;
  orderNumber: string;
  supplier: { name: string };
  items: { quantity: number; product: { name: string } }[];
  total: number;
  status: string;
  createdAt: string;
  estimatedDelivery?: string | null;
}

interface SpendData {
  totalSpend: number;
  totalOrders: number;
  records: { month: number; amount: number; category: string }[];
  byCategory: Record<string, { amount: number; orderCount: number }>;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
    IN_TRANSIT: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "In Transit" },
    APPROVED: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "Approved" },
    PENDING_APPROVAL: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
    CONFIRMED: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "Confirmed" },
    DRAFT: { bg: "bg-white/5", text: "text-white/40", dot: "bg-white/30", label: "Draft" },
  };
  const c = config[status] || config.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 animate-pulse">
      <div className="h-3 w-20 bg-white/10 rounded mb-3" />
      <div className="h-6 w-24 bg-white/10 rounded mb-2" />
      <div className="h-3 w-16 bg-white/10 rounded" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-white/[0.02] rounded" />
      ))}
    </div>
  );
}

export default function HotelPortalPage() {
  const [search, setSearch] = useState("");

  const { data: ordersData, loading: ordersLoading, error: ordersError } = useApi<{ orders: Order[]; pagination: { total: number } }>(
    "/api/v1/hotel/orders?page=1&limit=10"
  );

  const { data: spendData, loading: spendLoading } = useApi<SpendData>(
    `/api/v1/hotel/spend?year=${new Date().getFullYear()}`
  );

  const filteredOrders = useMemo(() => {
    if (!ordersData?.orders) return [];
    const q = search.toLowerCase();
    return ordersData.orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.supplier.name.toLowerCase().includes(q)
    );
  }, [ordersData, search]);

  const metrics = useMemo(() => {
    if (!spendData) return null;
    const total = spendData.totalSpend;
    const orders = ordersData?.orders ?? [];
    const activeOrders = orders.filter((o) => !["DELIVERED", "REJECTED", "CANCELLED"].includes(o.status)).length;
    const pendingApproval = orders.filter((o) => o.status === "PENDING_APPROVAL").length;

    return [
      { label: "Total Spend (YTD)", value: `EGP ${(total / 1_000_000).toFixed(1)}M`, change: "+12.5% vs last year", up: true, icon: Wallet },
      { label: "Active Orders", value: activeOrders.toString(), change: `${orders.length} total orders`, up: true, icon: ShoppingCart },
      { label: "Pending Approval", value: pendingApproval.toString(), change: pendingApproval > 0 ? `${pendingApproval} require action` : "All clear", up: pendingApproval === 0, icon: AlertCircle },
      { label: "Total Orders (YTD)", value: spendData.totalOrders.toString(), change: "On track", up: true, icon: Target },
    ];
  }, [spendData, ordersData]);

  const budgetBreakdown = useMemo(() => {
    if (!spendData?.byCategory) return [];
    const colors = ["#022349", "#60a5fa", "#a78bfa", "#34d399", "#fbbf24", "#f87171"];
    return Object.entries(spendData.byCategory).map(([category, data], i) => ({
      category,
      spent: data.amount,
      color: colors[i % colors.length],
    }));
  }, [spendData]);

  const sparkline = useMemo(() => {
    if (!spendData?.records) return [];
    const monthly = Array.from({ length: 12 }, (_, i) => {
      const rec = spendData.records.filter((r) => r.month === i + 1);
      return rec.reduce((s, r) => s + r.amount, 0);
    });
    const max = Math.max(...monthly, 1);
    return monthly.map((v) => Math.round((v / max) * 100));
  }, [spendData]);

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
          <h1 className="text-2xl font-bold tracking-tight text-white">Hotel Procurement Portal</h1>
          <p className="text-sm text-white/40 mt-0.5">Track orders, manage budgets, and optimize spend across properties</p>
        </div>
        <Link
          href="/hotel/catalog"
          className="px-4 py-2 text-xs font-semibold bg-[#022349] hover:bg-[#b91c1c] text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <ShoppingCart size={14} />
          New Purchase Order
        </Link>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics ? (
          metrics.map((m) => (
            <motion.div
              key={m.label}
              variants={fadeInUp}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{m.label}</span>
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <m.icon size={15} className="text-white/40" />
                </div>
              </div>
              <p className="text-xl font-bold text-white">{m.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {m.up ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
                <span className={`text-[11px] font-medium ${m.up ? "text-emerald-400" : "text-red-400"}`}>{m.change}</span>
              </div>
            </motion.div>
          ))
        ) : (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        )}
      </motion.div>

      {/* Main Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orders Table */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Package size={14} className="text-white/40" />
              Recent Orders
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 pr-3 rounded-lg text-xs text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#022349]/40 transition-all w-48"
                />
              </div>
              <button className="h-8 px-2.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-colors">
                <Filter size={12} />
              </button>
            </div>
          </div>

          {ordersLoading ? (
            <div className="p-4"><SkeletonTable /></div>
          ) : ordersError ? (
            <div className="p-8 text-center text-sm text-red-400">{ordersError}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    {["Order ID", "Supplier", "Items", "Total", "Status", "Date", "ETA"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-[10px] font-medium text-white/25 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-white/30">
                        No orders found. <Link href="/hotel/catalog" className="text-[#022349] hover:underline">Browse the catalog</Link> to place your first order.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                        <td className="px-4 py-3 text-xs font-medium text-white">{o.orderNumber}</td>
                        <td className="px-4 py-3 text-xs text-white/60">{o.supplier.name}</td>
                        <td className="px-4 py-3 text-xs text-white/40">{o.items.reduce((s, it) => s + it.quantity, 0)}</td>
                        <td className="px-4 py-3 text-xs text-white/60">EGP {o.total.toLocaleString()}</td>
                        <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                        <td className="px-4 py-3 text-xs text-white/30">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs text-white/30">{o.estimatedDelivery ? new Date(o.estimatedDelivery).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Budget Panel */}
        <div className="space-y-4">
          {/* Budget Breakdown */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Wallet size={14} className="text-white/40" />
              Spend by Category
            </h3>
            {spendLoading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 bg-white/[0.02] rounded" />
                ))}
              </div>
            ) : budgetBreakdown.length === 0 ? (
              <p className="text-xs text-white/30 py-4 text-center">No spend data yet.</p>
            ) : (
              <div className="space-y-3">
                {budgetBreakdown.map((b) => {
                  const max = Math.max(...budgetBreakdown.map((x) => x.spent), 1);
                  const pct = Math.round((b.spent / max) * 100);
                  return (
                    <div key={b.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-white/60">{b.category}</span>
                        <span className="text-[10px] text-white/30">EGP {(b.spent / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: b.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Spend Trend */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-white/40" />
              Monthly Spend Trend
            </h3>
            {spendLoading ? (
              <div className="h-24 bg-white/[0.02] rounded animate-pulse" />
            ) : sparkline.length === 0 ? (
              <p className="text-xs text-white/30 py-4 text-center">No trend data available.</p>
            ) : (
              <>
                <div className="flex items-end gap-1 h-24">
                  {sparkline.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-[#022349]/30 hover:bg-[#022349]/50 transition-colors"
                      style={{ height: `${Math.max(v, 4)}%` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[9px] text-white/20">Jan</span>
                  <span className="text-[9px] text-white/20">Dec</span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
