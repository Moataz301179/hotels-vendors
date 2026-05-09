"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, CheckCircle2, Clock, Truck,
  ArrowUpRight, ArrowDownRight, Search, Eye,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const ORDER_STATS = [
  { label: "Total Orders", value: "1,247", change: "+89 this month", up: true, icon: ShoppingBag },
  { label: "Processing", value: "86", change: "In progress", up: true, icon: Clock },
  { label: "Shipped", value: "234", change: "In transit", up: true, icon: Truck },
  { label: "Delivered", value: "927", change: "74.3% completion", up: true, icon: CheckCircle2 },
];

const ORDERS = [
  { id: "ORD-2026-0156", hotel: "Pickalbatros Palace", supplier: "El Araby Group", items: 24, amount: "EGP 67,500", status: "SHIPPED", date: "2026-05-08", deliveryDate: "2026-05-10", payment: "Factored" },
  { id: "ORD-2026-0155", hotel: "Hilton Cairo", supplier: "Cairo Kitchen Supply", items: 12, amount: "EGP 34,200", status: "PROCESSING", date: "2026-05-08", deliveryDate: "2026-05-11", payment: "Credit" },
  { id: "ORD-2026-0154", hotel: "Marriott Mena", supplier: "Delta Textiles", items: 45, amount: "EGP 128,000", status: "DELIVERED", date: "2026-05-07", deliveryDate: "2026-05-07", payment: "Paid" },
  { id: "ORD-2026-0153", hotel: "Four Seasons", supplier: "Nile Fresh", items: 18, amount: "EGP 52,400", status: "PENDING", date: "2026-05-07", deliveryDate: "2026-05-12", payment: "Pending" },
  { id: "ORD-2026-0152", hotel: "Steigenberger", supplier: "Alexandria Imports", items: 30, amount: "EGP 89,700", status: "SHIPPED", date: "2026-05-06", deliveryDate: "2026-05-09", payment: "Factored" },
  { id: "ORD-2026-0151", hotel: "InterContinental", supplier: "El Araby Group", items: 15, amount: "EGP 41,300", status: "DELIVERED", date: "2026-05-06", deliveryDate: "2026-05-06", payment: "Paid" },
  { id: "ORD-2026-0150", hotel: "Sunrise Alex", supplier: "Red Sea Logistics", items: 8, amount: "EGP 23,800", status: "PROCESSING", date: "2026-05-05", deliveryDate: "2026-05-10", payment: "Credit" },
  { id: "ORD-2026-0149", hotel: "Sofitel Cairo", supplier: "Cairo Kitchen Supply", items: 22, amount: "EGP 56,100", status: "DELIVERED", date: "2026-05-05", deliveryDate: "2026-05-05", payment: "Paid" },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    PROCESSING: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Processing" },
    SHIPPED: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "Shipped" },
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
    CANCELLED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Cancelled" },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrders = ORDERS.filter(
    (o) =>
      (filterStatus === "all" || o.status === filterStatus) &&
      (o.hotel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Order Management</h1>
          <p className="text-sm text-white/40 mt-0.5">Track, manage, and fulfill orders across the entire supply chain</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ORDER_STATS.map((s) => (
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

      {/* Search + Filters */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search orders, hotels, suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#022349]/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white/60 focus:outline-none"
        >
          <option value="all" className="bg-[#0a0a0a]">All Status</option>
          <option value="PENDING" className="bg-[#0a0a0a]">Pending</option>
          <option value="PROCESSING" className="bg-[#0a0a0a]">Processing</option>
          <option value="SHIPPED" className="bg-[#0a0a0a]">Shipped</option>
          <option value="DELIVERED" className="bg-[#0a0a0a]">Delivered</option>
        </select>
      </motion.div>

      {/* Orders Table */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Order ID</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Supplier</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Items</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Delivery</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Payment</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                <td className="px-4 py-3">
                  <span className="text-xs font-mono text-white/60">{order.id}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-white">{order.hotel}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] text-white/40">{order.supplier}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-white">{order.items}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold text-white">{order.amount}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] text-white/30">{order.deliveryDate}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    order.payment === "Factored" ? "bg-[#022349]/10 text-[#022349]" :
                    order.payment === "Paid" ? "bg-emerald-500/10 text-emerald-400" :
                    "bg-amber-500/10 text-amber-400"
                  }`}>
                    {order.payment}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
