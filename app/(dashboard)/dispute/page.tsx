"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Scale, AlertTriangle, CheckCircle2, Clock, MessageSquare,
  ArrowUpRight, ArrowDownRight, Plus, Search, Shield,
  FileText, User, ChevronRight,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const DISPUTE_STATS = [
  { label: "Open Disputes", value: "8", change: "+2 this week", up: false, icon: AlertTriangle },
  { label: "Resolved", value: "42", change: "94% resolution rate", up: true, icon: CheckCircle2 },
  { label: "Under Review", value: "5", change: "Avg 2.3 days", up: true, icon: Clock },
  { label: "Escalated", value: "1", change: "Authority Matrix", up: true, icon: Shield },
];

const DISPUTES = [
  { id: "DSP-2026-0012", orderId: "ORD-2026-0153", hotel: "Four Seasons", supplier: "Nile Fresh", issue: "Damaged Goods", amount: "EGP 12,400", status: "OPEN", priority: "High", opened: "2026-05-07", messages: 4 },
  { id: "DSP-2026-0011", orderId: "ORD-2026-0148", hotel: "Hilton Cairo", supplier: "Cairo Kitchen Supply", issue: "Late Delivery", amount: "EGP 8,200", status: "UNDER_REVIEW", priority: "Medium", opened: "2026-05-06", messages: 7 },
  { id: "DSP-2026-0010", orderId: "ORD-2026-0145", hotel: "Marriott Mena", supplier: "Delta Textiles", issue: "Wrong Quantity", amount: "EGP 23,000", status: "OPEN", priority: "High", opened: "2026-05-05", messages: 2 },
  { id: "DSP-2026-0009", orderId: "ORD-2026-0142", hotel: "Steigenberger", supplier: "El Araby Group", issue: "Quality Issue", amount: "EGP 15,600", status: "RESOLVED", priority: "Medium", opened: "2026-05-03", messages: 12 },
  { id: "DSP-2026-0008", orderId: "ORD-2026-0138", hotel: "Pickalbatros Palace", supplier: "Red Sea Logistics", issue: "Missing Items", amount: "EGP 5,800", status: "RESOLVED", priority: "Low", opened: "2026-05-01", messages: 5 },
  { id: "DSP-2026-0007", orderId: "ORD-2026-0135", hotel: "InterContinental", supplier: "Alexandria Imports", issue: "Price Discrepancy", amount: "EGP 9,400", status: "ESCALATED", priority: "High", opened: "2026-04-30", messages: 8 },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    OPEN: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Open" },
    UNDER_REVIEW: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Under Review" },
    RESOLVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Resolved" },
    ESCALATED: { bg: "bg-[#bef264]/10", text: "text-[#bef264]", dot: "bg-[#bef264]", label: "Escalated" },
  };
  const c = config[status] || config.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    High: "bg-red-500/10 text-red-400",
    Medium: "bg-amber-500/10 text-amber-400",
    Low: "bg-white/10 text-white/40",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors[priority] || colors.Low}`}>
      {priority}
    </span>
  );
}

export default function DisputeCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredDisputes = DISPUTES.filter(
    (d) =>
      (filterStatus === "all" || d.status === filterStatus) &&
      (d.hotel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Dispute Resolution Center</h1>
          <p className="text-sm text-white/40 mt-0.5">Manage and resolve conflicts between hotels and suppliers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#bef264] hover:bg-[#bef264]/80 text-xs text-white font-medium transition-all">
          <Plus size={14} />
          New Dispute
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DISPUTE_STATS.map((s) => (
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

      {/* Resolution Process */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Resolution Workflow</h3>
        <div className="grid grid-cols-5 gap-3">
          {[
            { step: "1", name: "File Dispute", desc: "Hotel/Supplier reports issue", icon: AlertTriangle },
            { step: "2", name: "Auto-Assign", desc: "System assigns mediator", icon: User },
            { step: "3", name: "Evidence", desc: "Both parties submit docs", icon: FileText },
            { step: "4", name: "Negotiate", desc: "Chat-based resolution", icon: MessageSquare },
            { step: "5", name: "Resolve", desc: "Settlement or escalation", icon: CheckCircle2 },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center mb-2">
                <step.icon size={14} className="text-white/40" />
              </div>
              <p className="text-xs font-medium text-white">{step.name}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{step.desc}</p>
            </div>
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
              placeholder="Search disputes, hotels, issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#bef264]/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white/60 focus:outline-none"
          >
            <option value="all" className="bg-[#0a0a0a]">All Status</option>
            <option value="OPEN" className="bg-[#0a0a0a]">Open</option>
            <option value="UNDER_REVIEW" className="bg-[#0a0a0a]">Under Review</option>
            <option value="RESOLVED" className="bg-[#0a0a0a]">Resolved</option>
            <option value="ESCALATED" className="bg-[#0a0a0a]">Escalated</option>
          </select>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Dispute ID</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Issue</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Priority</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Messages</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Opened</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisputes.map((d) => (
                <tr key={d.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-white/60">{d.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white">{d.hotel}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/40">{d.issue}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-white">{d.amount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={d.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <MessageSquare size={12} className="text-white/20" />
                      <span className="text-xs text-white/40">{d.messages}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/30">{d.opened}</span>
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
