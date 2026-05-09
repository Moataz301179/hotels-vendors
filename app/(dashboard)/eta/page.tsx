"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileCheck, AlertTriangle, CheckCircle2, Clock, XCircle,
  RefreshCw, Shield, FileText, Search, ArrowUpRight, ArrowDownRight,
  QrCode, Printer, Download,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const ETA_STATS = [
  { label: "Submitted Today", value: "47", change: "+12%", up: true, icon: FileCheck },
  { label: "Validated", value: "1,284", change: "98.2%", up: true, icon: CheckCircle2 },
  { label: "Pending", value: "23", change: "Under review", up: true, icon: Clock },
  { label: "Rejected", value: "3", change: "-2 from yesterday", up: true, icon: XCircle },
];

const INVOICES = [
  { id: "ETA-2026-0047", uuid: "abc123def456", hotel: "Pickalbatros Palace", amount: "EGP 125,000", status: "ACCEPTED", date: "2026-05-08", type: "Standard" },
  { id: "ETA-2026-0046", uuid: "xyz789uvw012", hotel: "Hilton Cairo", amount: "EGP 89,500", status: "PENDING", date: "2026-05-08", type: "Standard" },
  { id: "ETA-2026-0045", uuid: "def456ghi789", hotel: "Marriott Mena", amount: "EGP 234,000", status: "ACCEPTED", date: "2026-05-07", type: "Standard" },
  { id: "ETA-2026-0044", uuid: "ghi789jkl012", hotel: "Four Seasons", amount: "EGP 67,800", status: "REJECTED", date: "2026-05-07", type: "Simplified" },
  { id: "ETA-2026-0043", uuid: "jkl012mno345", hotel: "Steigenberger", amount: "EGP 156,400", status: "ACCEPTED", date: "2026-05-06", type: "Standard" },
  { id: "ETA-2026-0042", uuid: "mno345pqr678", hotel: "InterContinental", amount: "EGP 98,200", status: "PENDING", date: "2026-05-06", type: "Standard" },
  { id: "ETA-2026-0041", uuid: "pqr678stu901", hotel: "Sunrise Alex", amount: "EGP 45,600", status: "ACCEPTED", date: "2026-05-05", type: "Simplified" },
  { id: "ETA-2026-0040", uuid: "stu901vwx234", hotel: "Sofitel Cairo", amount: "EGP 178,900", status: "ACCEPTED", date: "2026-05-05", type: "Standard" },
];

const VALIDATION_RULES = [
  { id: 1, name: "Tax ID Verification", status: "active", passRate: 100, description: "Validate supplier tax registration" },
  { id: 2, name: "UUID Format Check", status: "active", passRate: 100, description: "ETA UUID v4 format validation" },
  { id: 3, name: "Digital Signature", status: "active", passRate: 99.2, description: "Invoice signature verification" },
  { id: 4, name: "Amount Threshold", status: "active", passRate: 100, description: "High-value order dual-check" },
  { id: 5, name: "Schema Compliance", status: "active", passRate: 98.8, description: "ETA JSON schema validation" },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    ACCEPTED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Accepted" },
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
    VALIDATED: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "Validated" },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? "bg-white/[0.06] text-white border border-white/[0.08]"
          : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
      }`}
    >
      {children}
    </button>
  );
}

export default function ETACenterPage() {
  const [activeTab, setActiveTab] = useState("invoices");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = INVOICES.filter(
    (inv) =>
      inv.hotel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">ETA E-Invoicing Center</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
              Live
            </span>
          </div>
          <p className="text-sm text-white/40 mt-0.5">Egyptian Tax Authority compliance, submission tracking, and digital signature management</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-white/80 transition-all">
            <RefreshCw size={14} />
            Sync with ETA
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#022349] hover:bg-[#022349]/80 text-xs text-white font-medium transition-all">
            <FileCheck size={14} />
            Submit Invoice
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ETA_STATS.map((s) => (
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

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04] w-fit">
        <TabButton active={activeTab === "invoices"} onClick={() => setActiveTab("invoices")}>Invoices</TabButton>
        <TabButton active={activeTab === "validation"} onClick={() => setActiveTab("validation")}>Validation</TabButton>
        <TabButton active={activeTab === "rules"} onClick={() => setActiveTab("rules")}>Rules Engine</TabButton>
      </motion.div>

      {activeTab === "invoices" && (
        <motion.div variants={fadeInUp} className="space-y-4">
          {/* Search + Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                placeholder="Search by invoice ID or hotel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#022349]/50"
              />
            </div>
          </div>

          {/* Invoices Table */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Invoice ID</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Date</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-white/20" />
                        <span className="text-xs font-mono text-white/60">{inv.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-white">{inv.hotel}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-white">{inv.amount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] text-white/40">{inv.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-white/30">{inv.date}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors" title="View QR">
                          <QrCode size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors" title="Print">
                          <Printer size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors" title="Download">
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === "validation" && (
        <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Validation Pipeline */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Shield size={14} className="text-white/40" />
              Validation Pipeline
            </h3>
            <div className="space-y-4">
              {[
                { step: "1", name: "Schema Check", desc: "Validate ETA JSON structure", status: "passed", time: "12ms" },
                { step: "2", name: "Tax ID Lookup", desc: "Verify supplier VAT registration", status: "passed", time: "45ms" },
                { step: "3", name: "Digital Sign", desc: "Cryptographic signature verification", status: "passed", time: "23ms" },
                { step: "4", name: "UUID Check", desc: "ETA UUID format and uniqueness", status: "passed", time: "8ms" },
                { step: "5", name: "Authority Matrix", desc: "Approval chain verification", status: "passed", time: "34ms" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">{step.name}</p>
                    <p className="text-[10px] text-white/25">{step.desc}</p>
                  </div>
                  <span className="text-[10px] text-white/20 font-mono">{step.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Score */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-white/40" />
              Compliance Health
            </h3>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="#022349" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42 * 0.988} ${2 * Math.PI * 42 * 0.012}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">98.8%</span>
                  <span className="text-[10px] text-white/30">Compliance</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Acceptance Rate</span>
                <span className="text-white font-medium">99.2%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: "99.2%" }} />
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-white/40">Avg. Validation Time</span>
                <span className="text-white font-medium">124ms</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <div className="h-full rounded-full bg-[#022349]" style={{ width: "85%" }} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "rules" && (
        <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Rule</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Description</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {VALIDATION_RULES.map((rule) => (
                <tr key={rule.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-white">{rule.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/40">{rule.description}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${rule.passRate}%` }} />
                      </div>
                      <span className="text-[11px] text-white/40">{rule.passRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}
