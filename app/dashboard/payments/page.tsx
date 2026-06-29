"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CreditCard, CheckCircle2, Clock, AlertTriangle, Wallet,
  ArrowUpRight, ArrowDownRight, Search, Download, TrendingUp,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingPage } from "@/components/dashboards/shared/loading-card";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface Transaction {
  id: string;
  gatewayRef: string;
  transactionType: string | null;
  amount: number;
  currency: string;
  status: string;
  observedMethod: string | null;
  createdAt: string;
}

interface Stats {
  totalProcessed: number;
  totalCount: number;
  pendingCount: number;
  completedAmount: number;
  completedCount: number;
  failedCount: number;
}

const METHOD_COLORS: Record<string, string> = {
  PAYMOB: "bg-accent-base/10 text-accent-base",
  PAYMOB_B2B: "bg-accent-base/10 text-accent-base",
  CREDIT: "bg-amber-500/10 text-amber-400",
  BANK_TRANSFER: "bg-blue-500/10 text-blue-400",
  INSTAPAY: "bg-violet-500/10 text-violet-400",
  FAWRY: "bg-cyan-500/10 text-cyan-400",
};

function formatAmount(amount: number, currency = "EGP") {
  return new Intl.NumberFormat("en-EG", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount);
}

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

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data, loading } = useApi<{ transactions: Transaction[]; stats: Stats; pagination: { total: number } }>(
    "/api/v1/payments/list?limit=50"
  );

  const statsCards = useMemo(() => {
    if (!data?.stats) return null;
    const s = data.stats;
    return [
      { label: "Total Processed", value: formatAmount(s.totalProcessed), change: `${s.totalCount} transactions`, up: true, icon: Wallet },
      { label: "Pending", value: formatAmount(s.totalProcessed - s.completedAmount), change: `${s.pendingCount} pending`, up: false, icon: Clock },
      { label: "Completed", value: formatAmount(s.completedAmount), change: `${s.completedCount} transactions`, up: true, icon: CheckCircle2 },
      { label: "Failed", value: formatAmount(s.totalProcessed - s.completedAmount), change: `${s.failedCount} failed`, up: false, icon: AlertTriangle },
    ];
  }, [data]);

  const transactions = data?.transactions ?? [];

  const filteredTxns = transactions.filter(
    (t) =>
      (filterStatus === "all" || t.status === filterStatus) &&
      (t.gatewayRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <LoadingPage />;

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
      {statsCards && (
        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {statsCards.map((s) => (
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
      )}

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
                className="w-full rounded-t-md bg-accent-base/30 hover:bg-accent-base/50 transition-colors"
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
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-base/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white/60 focus:outline-none"
          >
            <option value="all" className="bg-[var(--background)]">All Status</option>
            <option value="COMPLETED" className="bg-[var(--background)]">Completed</option>
            <option value="PENDING" className="bg-[var(--background)]">Pending</option>
            <option value="FAILED" className="bg-[var(--background)]">Failed</option>
          </select>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Ref</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Type</th>
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
                    <span className="text-xs font-mono text-white/60">{t.gatewayRef}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white/80">{t.transactionType || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-white">{formatAmount(t.amount, t.currency)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${METHOD_COLORS[t.observedMethod || ""] || "bg-white/10 text-white/40"}`}>
                      {t.observedMethod || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/30">{formatDate(t.createdAt)}</span>
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
