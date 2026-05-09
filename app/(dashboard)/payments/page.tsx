"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard, CheckCircle2, Clock, AlertTriangle, Wallet,
  ArrowUpRight, ArrowDownRight, Search, Download, TrendingUp,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const PAYMENT_STATS = [
  { label: "Total Processed", value: "EGP 24.8M", change: "+18% this month", up: true, icon: Wallet },
  { label: "Pending", value: "EGP 1.2M", change: "47 invoices", up: true, icon: Clock },
  { label: "Completed", value: "EGP 23.6M", change: "95.2% success", up: true, icon: CheckCircle2 },
  { label: "Failed", value: "EGP 0.04M", change: "0.8% error rate", up: true, icon: AlertTriangle },
];

const TRANSACTIONS = [
  { id: "TXN-2026-0089", orderId: "ORD-2026-0156", hotel: "Pickalbatros Palace", supplier: "El Araby Group", amount: "EGP 67,500", method: "Factoring", status: "COMPLETED", date: "2026-05-08" },
  { id: "TXN-2026-0088", orderId: "ORD-2026-0155", hotel: "Hilton Cairo", supplier: "Cairo Kitchen Supply", amount: "EGP 34,200", method: "Credit", status: "PENDING", date: "2026-05-08" },
  { id: "TXN-2026-0087", orderId: "ORD-2026-0154", hotel: "Marriott Mena", supplier: "Delta Textiles", amount: "EGP 128,000", method: "Bank Transfer", status: "COMPLETED", date: "2026-05-07" },
  { id: "TXN-2026-0086", orderId: "ORD-2026-0153", hotel: "Four Seasons", supplier: "Nile Fresh", amount: "EGP 52,400", method: "Factoring", status: "PENDING", date: "2026-05-07" },
  { id: "TXN-2026-0085", orderId: "ORD-2026-0152", hotel: "Steigenberger", supplier: "Alexandria Imports", amount: "EGP 89,700", method: "Factoring", status: "COMPLETED", date: "2026-05-06" },
  { id: "TXN-2026-0084", orderId: "ORD-2026-0151", hotel: "InterContinental", supplier: "El Araby Group", amount: "EGP 41,300", method: "Bank Transfer", status: "COMPLETED", date: "2026-05-06" },
  { id: "TXN-2026-0083", orderId: "ORD-2026-0150", hotel: "Sunrise Alex", supplier: "Red Sea Logistics", amount: "EGP 23,800", method: "Credit", status: "FAILED", date: "2026-05-05" },
  { id: "TXN-2026-0082", orderId: "ORD-2026-0149", hotel: "Sofitel Cairo", supplier: "Cairo Kitchen Supply", amount: "EGP 56,100", method: "Bank Transfer", status: "COMPLETED", date: "2026-05-05" },
];

const METHOD_COLORS: Record<string, string> = {
  Factoring: "bg-[#022349]/10 text-[#022349]",
  Credit: "bg-amber-500/10 text-amber-400",
  "Bank Transfer": "bg-blue-500/10 text-blue-400",
};

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Completed" },
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    FAILED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Failed" },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTxns = TRANSACTIONS.filter(
    (t) =>
      (filterStatus === "all" || t.status === filterStatus) &&
      (t.hotel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Payments & Transactions</h1>
          <p className="text-sm text-white/40 mt-0.5">Monitor payment flows, factoring settlements, and transaction history</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-white/80 transition-all">
          <Download size={14} />
          Export Report
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PAYMENT_STATS.map((s) => (
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

      {/* Volume Chart Placeholder */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp size={14} className="text-white/40" />
            Payment Volume
          </h3>
          <span className="text-[10px] text-white/20">Last 30 days</span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {[45, 62, 38, 55, 78, 42, 68, 85, 50, 72, 90, 65].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-[#022349]/30 hover:bg-[#022349]/50 transition-colors"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          {["May 1", "May 5", "May 10", "May 15", "May 20", "May 25", "May 30"].map((d, i) => (
            <span key={i} className="text-[9px] text-white/15">{d}</span>
          ))}
        </div>
      </motion.div>

      {/* Search + Table */}
      <motion.div variants={fadeInUp} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Search transactions..."
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
            <option value="COMPLETED" className="bg-[#0a0a0a]">Completed</option>
            <option value="PENDING" className="bg-[#0a0a0a]">Pending</option>
            <option value="FAILED" className="bg-[#0a0a0a]">Failed</option>
          </select>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Transaction ID</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Supplier</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Method</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t) => (
                <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-white/60">{t.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white">{t.hotel}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/40">{t.supplier}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-white">{t.amount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${METHOD_COLORS[t.method] || "bg-white/10 text-white/40"}`}>
                      {t.method}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/30">{t.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
