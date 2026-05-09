"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, CheckCircle2, Clock, AlertTriangle, ShoppingCart,
  ArrowUpRight, ArrowDownRight, Plus, Search, ChevronRight,
  FileText, User,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const PROC_STATS = [
  { label: "Active Requests", value: "34", change: "+5 this week", up: true, icon: ClipboardList },
  { label: "Approved", value: "128", change: "94% approval rate", up: true, icon: CheckCircle2 },
  { label: "Pending Review", value: "12", change: "Awaiting approval", up: true, icon: Clock },
  { label: "Urgent", value: "3", change: "High priority", up: false, icon: AlertTriangle },
];

const REQUESTS = [
  { id: "PR-2026-0089", hotel: "Pickalbatros Palace", department: "Housekeeping", items: 12, amount: "EGP 45,200", status: "APPROVED", requester: "Ahmed Hassan", date: "2026-05-08", priority: "Normal" },
  { id: "PR-2026-0088", hotel: "Hilton Cairo", department: "F&B", items: 8, amount: "EGP 78,500", status: "PENDING", requester: "Sara Mohamed", date: "2026-05-08", priority: "High" },
  { id: "PR-2026-0087", hotel: "Marriott Mena", department: "Engineering", items: 5, amount: "EGP 23,400", status: "REJECTED", requester: "Khaled Ali", date: "2026-05-07", priority: "Normal" },
  { id: "PR-2026-0086", hotel: "Four Seasons", department: "Housekeeping", items: 15, amount: "EGP 92,100", status: "APPROVED", requester: "Laila Ibrahim", date: "2026-05-07", priority: "Normal" },
  { id: "PR-2026-0085", hotel: "Steigenberger", department: "F&B", items: 20, amount: "EGP 134,000", status: "PENDING", requester: "Omar Farouk", date: "2026-05-06", priority: "Urgent" },
  { id: "PR-2026-0084", hotel: "InterContinental", department: "Spa", items: 6, amount: "EGP 18,900", status: "APPROVED", requester: "Nadia Samir", date: "2026-05-06", priority: "Normal" },
  { id: "PR-2026-0083", hotel: "Sunrise Alex", department: "Front Desk", items: 4, amount: "EGP 12,500", status: "PENDING", requester: "Hassan Tarek", date: "2026-05-05", priority: "High" },
  { id: "PR-2026-0082", hotel: "Sofitel Cairo", department: "F&B", items: 10, amount: "EGP 56,800", status: "APPROVED", requester: "Mona Adel", date: "2026-05-05", priority: "Normal" },
];

const WORKFLOW_STEPS = [
  { name: "Submitted", icon: FileText, count: 34 },
  { name: "Dept. Review", icon: User, count: 12 },
  { name: "Finance Check", icon: ClipboardList, count: 8 },
  { name: "Authority", icon: CheckCircle2, count: 5 },
  { name: "Ordered", icon: ShoppingCart, count: 128 },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    APPROVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Approved" },
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
    DRAFT: { bg: "bg-white/10", text: "text-white/40", dot: "bg-white/40", label: "Draft" },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    Urgent: "bg-red-500/10 text-red-400",
    High: "bg-amber-500/10 text-amber-400",
    Normal: "bg-white/10 text-white/40",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors[priority] || colors.Normal}`}>
      {priority}
    </span>
  );
}

export default function ProcurementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredRequests = REQUESTS.filter(
    (r) =>
      (filterStatus === "all" || r.status === filterStatus) &&
      (r.hotel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Procurement Hub</h1>
          <p className="text-sm text-white/40 mt-0.5">Purchase requests, approvals, and order management across all properties</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#022349] hover:bg-[#022349]/80 text-xs text-white font-medium transition-all">
          <Plus size={14} />
          New Request
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PROC_STATS.map((s) => (
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

      {/* Workflow Pipeline */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Approval Workflow</h3>
        <div className="flex items-center justify-between">
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-2">
                  <step.icon size={16} className="text-white/40" />
                </div>
                <span className="text-[10px] text-white/30 font-medium">{step.name}</span>
                <span className="text-xs font-bold text-white mt-0.5">{step.count}</span>
              </div>
              {i < WORKFLOW_STEPS.length - 1 && (
                <ChevronRight size={16} className="text-white/10 -mt-6" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search + Filter + Table */}
      <motion.div variants={fadeInUp} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Search by ID or hotel..."
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
            <option value="APPROVED" className="bg-[#0a0a0a]">Approved</option>
            <option value="PENDING" className="bg-[#0a0a0a]">Pending</option>
            <option value="REJECTED" className="bg-[#0a0a0a]">Rejected</option>
          </select>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Request ID</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Department</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Priority</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-white/60">{req.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white">{req.hotel}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/40">{req.department}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white">{req.items}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-white">{req.amount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={req.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/30">{req.date}</span>
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
