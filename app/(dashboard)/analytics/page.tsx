"use client";

import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, TrendingDown, Users, ShoppingBag,
  ArrowUpRight, ArrowDownRight, DollarSign, Package,
  Target, Activity, PieChart,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const ANALYTICS_STATS = [
  { label: "Total GMV", value: "EGP 2.4B", change: "+24% YoY", up: true, icon: DollarSign },
  { label: "Active Users", value: "1,847", change: "+156 this month", up: true, icon: Users },
  { label: "Order Volume", value: "12.4K", change: "+18% this month", up: true, icon: ShoppingBag },
  { label: "Avg Order Value", value: "EGP 18,500", change: "-2.4% vs last", up: false, icon: Target },
];

const TOP_HOTELS = [
  { name: "Pickalbatros Palace", orders: 234, spend: "EGP 4.2M", growth: 12 },
  { name: "Hilton Cairo", orders: 189, spend: "EGP 3.8M", growth: 8 },
  { name: "Marriott Mena", orders: 156, spend: "EGP 3.1M", growth: -3 },
  { name: "Four Seasons", orders: 134, spend: "EGP 2.9M", growth: 15 },
  { name: "Steigenberger", orders: 112, spend: "EGP 2.4M", growth: 5 },
];

const TOP_SUPPLIERS = [
  { name: "El Araby Group", orders: 567, revenue: "EGP 12.4M", rating: 4.8 },
  { name: "Cairo Kitchen Supply", orders: 423, revenue: "EGP 8.9M", rating: 4.6 },
  { name: "Delta Textiles", orders: 312, revenue: "EGP 7.2M", rating: 4.7 },
  { name: "Nile Fresh", orders: 289, revenue: "EGP 6.8M", rating: 4.5 },
  { name: "Alexandria Imports", orders: 198, revenue: "EGP 4.1M", rating: 4.4 },
];

const CATEGORY_PERFORMANCE = [
  { name: "F&B", value: 42, color: "#022349" },
  { name: "Housekeeping", value: 28, color: "#3b82f6" },
  { name: "Engineering", value: 15, color: "#10b981" },
  { name: "Amenities", value: 10, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#6b7280" },
];

export default function AnalyticsPage() {
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
        {ANALYTICS_STATS.map((s) => (
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
        {/* Monthly Volume */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 size={14} className="text-white/40" />
              Monthly Order Volume
            </h3>
            <span className="text-[10px] text-white/20">Last 12 months</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {[820, 950, 1100, 890, 1200, 1350, 1180, 1420, 1600, 1380, 1750, 1890].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-[#022349]/30 hover:bg-[#022349]/50 transition-colors"
                  style={{ height: `${(h / 2000) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((m, i) => (
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
            <span className="text-[10px] text-white/20">This month</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {CATEGORY_PERFORMANCE.reduce(
                  (acc, cat, i) => {
                    const prevOffset = acc.offset;
                    const dashArray = `${2 * Math.PI * 40 * (cat.value / 100)} ${2 * Math.PI * 40 * (1 - cat.value / 100)}`;
                    const el = (
                      <circle
                        key={cat.name}
                        cx="50" cy="50" r="40" fill="none"
                        stroke={cat.color} strokeWidth="12"
                        strokeDasharray={dashArray}
                        strokeDashoffset={-prevOffset * 2 * Math.PI * 40}
                        strokeLinecap="round"
                      />
                    );
                    return { offset: prevOffset + cat.value / 100, elements: [...acc.elements, el] };
                  },
                  { offset: 0, elements: [] as React.ReactNode[] }
                ).elements}
              </svg>
            </div>
            <div className="flex-1 space-y-2">
              {CATEGORY_PERFORMANCE.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  <span className="text-xs text-white/60 flex-1">{cat.name}</span>
                  <span className="text-xs font-semibold text-white">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Performers */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Hotels */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users size={14} className="text-white/40" />
              Top Hotels by Spend
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Orders</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Spend</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Growth</th>
              </tr>
            </thead>
            <tbody>
              {TOP_HOTELS.map((h, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-2.5">
                    <span className="text-xs text-white">{h.name}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs text-white/60">{h.orders}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-semibold text-white">{h.spend}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium flex items-center gap-1 ${h.growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {h.growth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {h.growth >= 0 ? "+" : ""}{h.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Suppliers */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Package size={14} className="text-white/40" />
              Top Suppliers by Revenue
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Supplier</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Orders</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Revenue</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody>
              {TOP_SUPPLIERS.map((s, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-2.5">
                    <span className="text-xs text-white">{s.name}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs text-white/60">{s.orders}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-semibold text-white">{s.revenue}</span>
                  </td>
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
      </motion.div>

      {/* Platform Health */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "System Uptime", value: "99.97%", target: "99.9%", status: "good" },
          { label: "Avg Response Time", value: "124ms", target: "<200ms", status: "good" },
          { label: "Error Rate", value: "0.04%", target: "<0.1%", status: "good" },
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
