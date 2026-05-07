"use client";

import {
  Landmark, FileText, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, XCircle, AlertCircle, Star, Shield, Wallet,
} from "lucide-react";

/* ─── MOCK DATA ─── */
const METRICS = [
  { label: "Total Factored", value: "EGP 8.2M", change: "+18%", up: true, icon: Wallet },
  { label: "Active Requests", value: "12", change: "3 pending", up: false, icon: FileText },
  { label: "Avg. Approval Time", value: "28h", change: "−6h", up: true, icon: Clock },
  { label: "Portfolio Yield", value: "14.2%", change: "+0.8%", up: true, icon: TrendingUp },
];

const FACTORING_REQUESTS = [
  {
    id: "FR-2026-0012",
    supplier: "Cairo Star Trading",
    hotel: "Pickalbatros Palace Resort",
    invoiceAmount: 48500,
    requestedAmount: 43650,
    status: "PROCESSING",
    progress: 60,
    submittedAt: "2026-05-02 09:00",
    eta: "2026-05-03 14:00",
    creditScore: 82,
    riskLevel: "LOW",
  },
  {
    id: "FR-2026-0011",
    supplier: "CleanMax Professional",
    hotel: "Sunrise Royal Makadi",
    invoiceAmount: 22400,
    requestedAmount: 20160,
    status: "APPROVED",
    progress: 100,
    submittedAt: "2026-05-01 11:30",
    eta: "Payout initiated",
    creditScore: 76,
    riskLevel: "MEDIUM",
  },
  {
    id: "FR-2026-0010",
    supplier: "Nile Fresh Co.",
    hotel: "Baron Resort Sharm",
    invoiceAmount: 15800,
    requestedAmount: 14220,
    status: "PENDING_REVIEW",
    progress: 25,
    submittedAt: "2026-04-30 16:00",
    eta: "2026-05-04 10:00",
    creditScore: 68,
    riskLevel: "MEDIUM",
  },
  {
    id: "FR-2026-0009",
    supplier: "Al-Gomhouria Food",
    hotel: "Orascom El Gouna",
    invoiceAmount: 67200,
    requestedAmount: 60480,
    status: "REJECTED",
    progress: 0,
    submittedAt: "2026-04-28 08:00",
    eta: "—",
    creditScore: 54,
    riskLevel: "HIGH",
  },
  {
    id: "FR-2026-0008",
    supplier: "Cotton House Egypt",
    hotel: "Sunrise Garden Beach",
    invoiceAmount: 34100,
    requestedAmount: 30690,
    status: "APPROVED",
    progress: 100,
    submittedAt: "2026-04-25 10:00",
    eta: "Paid 2026-04-26",
    creditScore: 88,
    riskLevel: "LOW",
  },
];

const CREDIT_PROFILES = [
  { supplier: "Cairo Star Trading", score: 82, limit: 500000, utilized: 324000, tier: "GOLD", onTime: 96 },
  { supplier: "CleanMax Professional", score: 76, limit: 300000, utilized: 198000, tier: "SILVER", onTime: 91 },
  { supplier: "Nile Fresh Co.", score: 68, limit: 200000, utilized: 156000, tier: "SILVER", onTime: 84 },
  { supplier: "Al-Gomhouria Food", score: 54, limit: 150000, utilized: 142000, tier: "BRONZE", onTime: 72 },
  { supplier: "Cotton House Egypt", score: 88, limit: 600000, utilized: 245000, tier: "GOLD", onTime: 98 },
];

const PAYMENTS = [
  { id: "PY-2026-0045", supplier: "Cairo Star Trading", amount: 43650, status: "SCHEDULED", date: "2026-05-03", method: "Bank Transfer" },
  { id: "PY-2026-0044", supplier: "CleanMax Professional", amount: 20160, status: "COMPLETED", date: "2026-05-02", method: "Bank Transfer" },
  { id: "PY-2026-0043", supplier: "Cotton House Egypt", amount: 30690, status: "COMPLETED", date: "2026-04-26", method: "Bank Transfer" },
  { id: "PY-2026-0042", supplier: "Nile Fresh Co.", amount: 14220, status: "PENDING", date: "2026-05-04", method: "Bank Transfer" },
];

/* ─── UTILS ─── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING_REVIEW: { bg: "bg-[#fbbf24]/10", text: "text-[#fbbf24]", dot: "bg-[#fbbf24]", label: "Pending Review" },
    PROCESSING: { bg: "bg-[#60a5fa]/10", text: "text-[#60a5fa]", dot: "bg-[#60a5fa]", label: "Processing" },
    APPROVED: { bg: "bg-[#10B981]/10", text: "text-[#10B981]", dot: "bg-[#10B981]", label: "Approved" },
    REJECTED: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", dot: "bg-[#EF4444]", label: "Rejected" },
    COMPLETED: { bg: "bg-[#10B981]/10", text: "text-[#10B981]", dot: "bg-[#10B981]", label: "Completed" },
    SCHEDULED: { bg: "bg-[#60a5fa]/10", text: "text-[#60a5fa]", dot: "bg-[#60a5fa]", label: "Scheduled" },
    PENDING: { bg: "bg-[#FF5C00]/10", text: "text-[#FF5C00]", dot: "bg-[#FF5C00]", label: "Pending" },
  };
  const c = config[status] || config.PENDING_REVIEW;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function FactoringProgress({ progress, status }: { progress: number; status: string }) {
  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";
  const color = isApproved ? "#10B981" : isRejected ? "#EF4444" : "#60a5fa";
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-white/20">{progress}%</span>
        <span className="text-[10px] text-white/20">{isApproved ? "Approved" : isRejected ? "Rejected" : "Processing"}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, background: color }}
        />
      </div>
      {/* Stage dots: Blue → Green */}
      <div className="flex items-center justify-between mt-1.5 px-0.5">
        <div className={`w-2 h-2 rounded-full ${progress >= 10 ? "bg-[#60a5fa]" : "bg-white/10"}`} title="Submitted" />
        <div className={`w-2 h-2 rounded-full ${progress >= 50 ? "bg-[#60a5fa]" : "bg-white/10"}`} title="Under Review" />
        <div className={`w-2 h-2 rounded-full ${isApproved ? "bg-[#10B981]" : isRejected ? "bg-[#EF4444]" : "bg-white/10"}`} title={isApproved ? "Approved" : isRejected ? "Rejected" : "Decision"} />
      </div>
    </div>
  );
}

function CreditScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#FF5C00" : "#EF4444";
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

/* ─── PAGE ─── */
export default function FinancePortalPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Finance & Factoring Hub</h1>
          <p className="text-sm text-white/40 mt-0.5">Manage factoring requests, credit scores, and payment flows</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors">
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
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Factoring Requests */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText size={14} className="text-white/40" />
            Factoring Requests
          </h3>
          <div className="space-y-3">
            {FACTORING_REQUESTS.map((fr) => (
              <div key={fr.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.025] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CreditScoreRing score={fr.creditScore} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono text-white/40">{fr.id}</span>
                        <StatusBadge status={fr.status} />
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${fr.riskLevel === "LOW" ? "bg-[#10B981]/10 text-[#10B981]" : fr.riskLevel === "MEDIUM" ? "bg-[#FF5C00]/10 text-[#FF5C00]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>
                          {fr.riskLevel} RISK
                        </span>
                      </div>
                      <p className="text-xs font-medium text-white">{fr.supplier}</p>
                      <p className="text-[11px] text-white/30">Invoice: EGP {fr.invoiceAmount.toLocaleString()} · Requested: EGP {fr.requestedAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/20">Submitted</p>
                    <p className="text-[11px] text-white/40">{fr.submittedAt}</p>
                  </div>
                </div>
                <FactoringProgress progress={fr.progress} status={fr.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Credit Profiles */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Shield size={14} className="text-white/40" />
              Credit Profiles
            </h3>
            <div className="space-y-3">
              {CREDIT_PROFILES.map((cp) => (
                <div key={cp.supplier} className="p-3 rounded-lg border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-white">{cp.supplier}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${cp.tier === "GOLD" ? "bg-[#fbbf24]/10 text-[#fbbf24]" : cp.tier === "SILVER" ? "bg-white/10 text-white/50" : "bg-[#b45309]/10 text-[#b45309]"}`}>
                      {cp.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditScoreRing score={cp.score} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-white/25">Limit Utilization</span>
                        <span className="text-[9px] text-white/40">{Math.round((cp.utilized / cp.limit) * 100)}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.04]">
                        <div className="h-full rounded-full bg-[#FF5C00]" style={{ width: `${(cp.utilized / cp.limit) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] text-white/20">On-time: {cp.onTime}%</span>
                    <span className="text-[9px] text-white/20">Limit: EGP {cp.limit.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Wallet size={14} className="text-white/40" />
              Recent Payments
            </h3>
            <div className="space-y-2">
              {PAYMENTS.map((py) => (
                <div key={py.id} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                  <div>
                    <p className="text-xs text-white/60">{py.supplier}</p>
                    <p className="text-[9px] text-white/20">{py.id} · {py.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white">EGP {py.amount.toLocaleString()}</p>
                    <StatusBadge status={py.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
