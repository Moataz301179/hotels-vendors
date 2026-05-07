"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart, TrendingUp, Wallet, Package, ArrowUpRight, ArrowDownRight,
  Search, Filter, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight,
  BarChart3, Target, Zap, Building2,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ─── MOCK DATA ─── */
const METRICS = [
  { label: "Total Spend", value: "EGP 2.4M", change: "+12.5%", up: true, icon: Wallet },
  { label: "Active Orders", value: "18", change: "+3 this week", up: true, icon: ShoppingCart },
  { label: "Pending Approval", value: "4", change: "2 urgent", up: false, icon: AlertCircle },
  { label: "Budget Utilized", value: "68%", change: "On track", up: true, icon: Target },
];

const RECENT_ORDERS = [
  { id: "PO-2026-0042", supplier: "Cairo Star Trading", items: 12, total: 48500, status: "DELIVERED", date: "2026-05-02", eta: "—" },
  { id: "PO-2026-0041", supplier: "CleanMax Professional", items: 8, total: 22400, status: "IN_TRANSIT", date: "2026-05-01", eta: "2026-05-06" },
  { id: "PO-2026-0040", supplier: "Al-Gomhouria Food", items: 24, total: 67200, status: "PENDING_APPROVAL", date: "2026-04-30", eta: "—" },
  { id: "PO-2026-0039", supplier: "Nile Fresh Co.", items: 6, total: 15800, status: "APPROVED", date: "2026-04-28", eta: "2026-05-05" },
  { id: "PO-2026-0038", supplier: "Cotton House Egypt", items: 15, total: 34100, status: "DELIVERED", date: "2026-04-25", eta: "—" },
  { id: "PO-2026-0037", supplier: "ChemSource Egypt", items: 4, total: 18900, status: "REJECTED", date: "2026-04-22", eta: "—" },
];

const BUDGET_BREAKDOWN = [
  { category: "F&B Dry Goods", allocated: 800000, spent: 624000, color: "#DC143C" },
  { category: "Housekeeping", allocated: 350000, spent: 212000, color: "#60a5fa" },
  { category: "Linens & Textiles", allocated: 280000, spent: 198000, color: "#a78bfa" },
  { category: "Engineering", allocated: 200000, spent: 134000, color: "#34d399" },
  { category: "Guest Amenities", allocated: 150000, spent: 98000, color: "#fbbf24" },
];

const SPARKLINE = [45, 52, 48, 60, 55, 68, 72, 65, 78, 82, 75, 88];

/* ─── UTILS ─── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    DELIVERED: { bg: "bg-[#10B981]/10", text: "text-[#10B981]", dot: "bg-[#10B981]", label: "Delivered" },
    IN_TRANSIT: { bg: "bg-[#60a5fa]/10", text: "text-[#60a5fa]", dot: "bg-[#60a5fa]", label: "In Transit" },
    APPROVED: { bg: "bg-[#DC143C]/10", text: "text-[#DC143C]", dot: "bg-[#DC143C]", label: "Approved" },
    PENDING_APPROVAL: { bg: "bg-[#fbbf24]/10", text: "text-[#fbbf24]", dot: "bg-[#fbbf24]", label: "Pending" },
    REJECTED: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", dot: "bg-[#EF4444]", label: "Rejected" },
  };
  const c = config[status] || config.PENDING_APPROVAL;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

/* ─── PAGE ─── */
export default function HotelPortalPage() {
  const [search, setSearch] = useState("");

  const filteredOrders = RECENT_ORDERS.filter(
    (o) => o.id.toLowerCase().includes(search.toLowerCase()) || o.supplier.toLowerCase().includes(search.toLowerCase())
  );

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
          className="px-4 py-2 text-xs font-semibold bg-[#DC143C] hover:bg-[#b91c1c] text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <ShoppingCart size={14} />
          New Purchase Order
        </Link>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map((m) => (
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
              {m.up ? <ArrowUpRight size={12} className="text-[#10B981]" /> : <ArrowDownRight size={12} className="text-[#EF4444]" />}
              <span className={`text-[11px] font-medium ${m.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>{m.change}</span>
            </div>
          </motion.div>
        ))}
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
                  className="h-8 pl-8 pr-3 rounded-lg text-xs text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#DC143C]/40 transition-all w-48"
                />
              </div>
              <button className="h-8 px-2.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-colors">
                <Filter size={12} />
              </button>
            </div>
          </div>
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
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-white">{o.id}</td>
                    <td className="px-4 py-3 text-xs text-white/60">{o.supplier}</td>
                    <td className="px-4 py-3 text-xs text-white/40">{o.items}</td>
                    <td className="px-4 py-3 text-xs text-white/60">EGP {o.total.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-xs text-white/30">{o.date}</td>
                    <td className="px-4 py-3 text-xs text-white/30">{o.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Panel */}
        <div className="space-y-4">
          {/* Budget Breakdown */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Wallet size={14} className="text-white/40" />
              Budget Breakdown
            </h3>
            <div className="space-y-3">
              {BUDGET_BREAKDOWN.map((b) => {
                const pct = Math.round((b.spent / b.allocated) * 100);
                return (
                  <div key={b.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-white/60">{b.category}</span>
                      <span className="text-[10px] text-white/30">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: b.color }} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-white/20">EGP {b.spent.toLocaleString()}</span>
                      <span className="text-[9px] text-white/20">EGP {b.allocated.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spend Trend */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-white/40" />
              Monthly Spend Trend
            </h3>
            <div className="flex items-end gap-1 h-24">
              {SPARKLINE.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-[#DC143C]/30 hover:bg-[#DC143C]/50 transition-colors"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] text-white/20">Jan</span>
              <span className="text-[9px] text-white/20">Dec</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
