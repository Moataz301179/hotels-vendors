"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileCheck, Send, Clock, CheckCircle2, AlertTriangle, Search,
  ArrowUpRight, ArrowDownRight, ExternalLink, RefreshCw,
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  etaUuid: string | null;
  etaStatus: string | null;
  issuedAt: string;
  amount: number;
  hotel: { name: string } | null;
  supplier: { name: string } | null;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    ACCEPTED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Accepted" },
    VALIDATED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Validated" },
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
    SUBMITTED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Submitted" },
    DRAFT: { bg: "bg-white/5", text: "text-white/40", dot: "bg-white/40", label: "Draft" },
  };
  const c = config[status] || config.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export default function EtaInvoicingPage() {
  const { data: invoicesData, loading, refetch } = useApi<{ invoices: Invoice[]; pagination: { total: number } }>(
    "/api/v1/invoices?page=1&limit=50"
  );

  const invoices = invoicesData?.invoices ?? [];

  const metrics = {
    total: invoices.length,
    submitted: invoices.filter((i) => i.etaStatus === "SUBMITTED" || i.etaStatus === "ACCEPTED").length,
    accepted: invoices.filter((i) => i.etaStatus === "ACCEPTED" || i.etaStatus === "VALIDATED").length,
    rejected: invoices.filter((i) => i.etaStatus === "REJECTED").length,
  };

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">ETA E-Invoicing Center</h1>
          <p className="text-sm text-white/40 mt-0.5">Egyptian Tax Authority compliance — submit, validate, and track invoices</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-white/80 transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Invoices", value: metrics.total.toString(), icon: FileCheck, change: "All time" },
          { label: "Submitted to ETA", value: metrics.submitted.toString(), icon: Send, change: "Pending response" },
          { label: "ETA Accepted", value: metrics.accepted.toString(), icon: CheckCircle2, change: "Compliant" },
          { label: "ETA Rejected", value: metrics.rejected.toString(), icon: AlertTriangle, change: metrics.rejected > 0 ? "Action needed" : "None" },
        ].map((m) => (
          <motion.div key={m.label} variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{m.label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <m.icon size={15} className="text-white/40" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{m.value}</p>
            <p className="text-[11px] text-white/25 mt-1">{m.change}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Info Banner */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex items-start gap-3">
          <FileCheck size={16} className="text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-blue-400">ETA Compliance Engine</p>
            <p className="text-[11px] text-white/40 mt-1">
              Invoices are automatically submitted to the Egyptian Tax Authority upon issuance. Each submission receives a UUID for audit trail. Failed submissions land in a dead-letter queue with automatic retry.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Invoice Table */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-[#39ff7e] rounded-full animate-spin mx-auto" />
            <p className="text-xs text-white/30 mt-3">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center">
            <FileCheck size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">No invoices yet.</p>
            <p className="text-xs text-white/20 mt-1">Invoices will appear here once orders are placed.</p>
          </div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Invoice #</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Supplier</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">ETA Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">ETA UUID</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-white/60">{inv.invoiceNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white">{inv.hotel?.name || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/40">{inv.supplier?.name || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-white">EGP {inv.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.etaStatus || "DRAFT"} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono text-white/25">
                      {inv.etaUuid ? `${inv.etaUuid.slice(0, 8)}...` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/30">
                      {inv.issuedAt ? new Date(inv.issuedAt).toLocaleDateString() : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
}
