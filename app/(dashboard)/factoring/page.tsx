"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Landmark, FileText, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, XCircle, AlertCircle, Star, Shield, Wallet,
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

interface FactoringRequest {
  id: string;
  status: string;
  requestedAmount: number;
  discountRate: number;
  createdAt: string;
  invoice: {
    total: number;
    hotel: { name: string; riskTier: string | null };
    supplier: { name: string };
  };
  factoringCompany: { name: string };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  factoringStatus: string;
  hotel: { name: string; riskTier: string | null };
  supplier: { name: string };
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING_REVIEW: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending Review" },
    PROCESSING: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Processing" },
    APPROVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Approved" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
    COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Completed" },
    SCHEDULED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Scheduled" },
    PENDING: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "Pending" },
    FUNDED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Funded" },
  };
  const c = config[status] || config.PENDING_REVIEW;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function CreditScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#022349" : "#EF4444";
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="22" cy="22" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[9px] font-bold text-white">{score}</span>
    </div>
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

export default function FinancePortalPage() {
  const { data: requestsData, loading: requestsLoading } = useApi<{ requests: FactoringRequest[]; pagination: { total: number } }>(
    "/api/v1/factoring/requests?page=1&limit=20"
  );

  const { data: invoicesData, loading: invoicesLoading } = useApi<{ invoices: Invoice[] }>(
    "/api/v1/factoring/invoices"
  );

  const requests = requestsData?.requests ?? [];
  const invoices = invoicesData?.invoices ?? [];

  const metrics = useMemo(() => {
    const totalFactored = requests.filter((r) => r.status === "FUNDED" || r.status === "APPROVED").reduce((s, r) => s + r.requestedAmount, 0);
    const activeRequests = requests.filter((r) => !["REJECTED", "COMPLETED"].includes(r.status)).length;
    const pendingReview = requests.filter((r) => r.status === "PENDING_REVIEW").length;
    const avgDiscount = requests.length > 0
      ? requests.reduce((s, r) => s + (r.discountRate || 0), 0) / requests.length
      : 0;

    return [
      { label: "Total Factored", value: `EGP ${(totalFactored / 1_000_000).toFixed(1)}M`, change: `${requests.length} total requests`, up: true, icon: Wallet },
      { label: "Active Requests", value: activeRequests.toString(), change: pendingReview > 0 ? `${pendingReview} pending review` : "All clear", up: pendingReview === 0, icon: FileText },
      { label: "Avg. Discount Rate", value: `${avgDiscount.toFixed(1)}%`, change: "Portfolio average", up: true, icon: Clock },
      { label: "Factorable Invoices", value: invoices.length.toString(), change: "ETA-compliant", up: true, icon: TrendingUp },
    ];
  }, [requests, invoices]);

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
          <h1 className="text-2xl font-bold tracking-tight text-white">Finance & Factoring Hub</h1>
          <p className="text-sm text-white/40 mt-0.5">Manage factoring requests, credit scores, and payment flows</p>
        </div>
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
        {/* Factoring Requests */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText size={14} className="text-white/40" />
            Factoring Requests
          </h3>
          {requestsLoading ? (
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-white/[0.02] rounded-xl border border-white/[0.04]" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
              <p className="text-sm text-white/30">No factoring requests yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((fr) => {
                const riskTier = fr.invoice.hotel.riskTier || "MEDIUM";
                const riskColor = riskTier === "LOW" ? "text-emerald-400 bg-emerald-500/10" : riskTier === "MEDIUM" ? "text-amber-400 bg-amber-500/10" : "text-red-400 bg-red-500/10";
                const creditScore = riskTier === "LOW" ? 85 : riskTier === "MEDIUM" ? 70 : 55;
                return (
                  <div key={fr.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.025] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <CreditScoreRing score={creditScore} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono text-white/40">{fr.id.slice(0, 12)}</span>
                            <StatusBadge status={fr.status} />
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${riskColor}`}>
                              {riskTier} RISK
                            </span>
                          </div>
                          <p className="text-xs font-medium text-white">{fr.invoice.supplier.name}</p>
                          <p className="text-[11px] text-white/30">Invoice: EGP {fr.invoice.total.toLocaleString()} · Requested: EGP {fr.requestedAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/20">Submitted</p>
                        <p className="text-[11px] text-white/40">{new Date(fr.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-white/20">Discount: {(fr.discountRate || 0).toFixed(1)}%</span>
                      <span className="text-white/10">·</span>
                      <span className="text-[10px] text-white/20">Hotel: {fr.invoice.hotel.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Factorable Invoices */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Shield size={14} className="text-white/40" />
              Factorable Invoices
            </h3>
            {invoicesLoading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-white/[0.02] rounded-lg" />
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <p className="text-xs text-white/30 py-4 text-center">No factorable invoices.</p>
            ) : (
              <div className="space-y-3">
                {invoices.slice(0, 5).map((inv) => (
                  <div key={inv.id} className="p-3 rounded-lg border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-white/40">{inv.invoiceNumber}</span>
                      <StatusBadge status={inv.factoringStatus} />
                    </div>
                    <p className="text-xs font-medium text-white">{inv.supplier.name}</p>
                    <p className="text-[10px] text-white/30">{inv.hotel.name} · EGP {inv.total.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-white/40" />
              Portfolio Health
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/40">Approval Rate</span>
                <span className="text-xs font-semibold text-white">
                  {requests.length > 0
                    ? `${Math.round((requests.filter((r) => ["APPROVED", "FUNDED", "COMPLETED"].includes(r.status)).length / requests.length) * 100)}%`
                    : "—"}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04]">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: requests.length > 0 ? `${Math.round((requests.filter((r) => ["APPROVED", "FUNDED", "COMPLETED"].includes(r.status)).length / requests.length) * 100)}%` : "0%" }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-white/40">Avg. Processing Time</span>
                <span className="text-xs font-semibold text-white">24h</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04]">
                <div className="h-full w-[70%] rounded-full bg-[#022349]" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
