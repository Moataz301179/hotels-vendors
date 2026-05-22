"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, TrendingUp, AlertTriangle, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownRight, Search, Eye, FileText,
  CreditCard, BarChart3, PieChart, Activity, Zap, Plus,
  Building2, Calendar, DollarSign, Percent, Filter, XCircle,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboards/shared/stat-card";
import { SectionCard } from "@/components/dashboards/shared/section-card";

/* ─── ANIMATIONS ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const cardEnter = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ─── TYPES ─── */
interface CreditApplication {
  id: string; hotelId: string; hotelName: string;
  amount: number;
  status: "PENDING_REVIEW" | "UNDER_ANALYSIS" | "APPROVED" | "REJECTED" | "DISBURSED";
  requestedAt: string; riskScore?: number;
  tradeHistory?: { months: number; volume: number };
}
interface HotelProfile {
  id: string; name: string; taxId: string;
  creditScore: number; totalExposure: number; activeFacilities: number;
  paymentHistory: { onTime: number; late: number; defaulted: number };
}
interface Invoice {
  id: string; supplierId: string; supplierName: string;
  hotelId: string; hotelName: string;
  amount: number; dueDate: string; status: string; advanceRate: number;
}
interface Disbursement {
  id: string; applicationId: string;
  amount: number; fee: number; disbursedAt: string; roi: number;
}
interface PortfolioMetricsData {
  totalFacilities: number; totalExposure: number;
  averageFacilitySize: number; defaultRate: number;
  concentrationRisk: number;
  monthlyRoi: Array<{ month: string; roi: number; amount: number }>;
}

/* ─── STATUS CONFIG ─── */
const APP_STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING_REVIEW: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
  UNDER_ANALYSIS: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Analysis" },
  APPROVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Approved" },
  REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
  DISBURSED: { bg: "bg-[#8b5cf6]/10", text: "text-[#8b5cf6]", dot: "bg-[#8b5cf6]", label: "Disbursed" },
};
function StatusBadge({ status }: { status: string }) {
  const c = APP_STATUS_CONFIG[status] || APP_STATUS_CONFIG.PENDING_REVIEW;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{c.label}
    </span>
  );
}

function formatCurrency(amount: number, currency = "EGP") { return `${currency} ${amount.toLocaleString("en-EG")}`; }
function riskColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}
function riskBg(score: number): string {
  if (score >= 80) return "bg-emerald-500/10";
  if (score >= 60) return "bg-amber-500/10";
  if (score >= 40) return "bg-orange-500/10";
  return "bg-red-500/10";
}

/* ─── RISK SCORE RING ─── */
function RiskRing({ score, size = 36 }: { score: number; size?: number }) {
  const circumference = 2 * Math.PI * ((size - 4) / 2);
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={(size-4)/2} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
        <circle cx={size/2} cy={size/2} r={(size-4)/2} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[10px] font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

/* ─── CREDIT PIPELINE ─── */
function CreditPipeline({ applications, onSelect }: { applications: CreditApplication[]; onSelect: (a: CreditApplication) => void }) {
  return (
    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
      {applications.map((app) => (
        <motion.div key={app.id} variants={cardEnter} initial="hidden" animate="visible"
          whileHover={{ scale: 1.01 }} onClick={() => onSelect(app)}
          className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] hover:bg-white/[0.02] cursor-pointer transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                <Building2 size={14} className="text-[#8b5cf6]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors">{app.hotelName}</p>
                <p className="text-[10px] text-white/25">{new Date(app.requestedAt).toLocaleDateString("en-EG")}</p>
              </div>
            </div>
            <StatusBadge status={app.status} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-bold text-white font-mono">{formatCurrency(app.amount)}</span>
              {app.riskScore !== undefined && (
                <div className="flex items-center gap-2">
                  <RiskRing score={app.riskScore} size={28} />
                  <span className={`text-[11px] font-medium ${riskColor(app.riskScore)}`}>Risk {app.riskScore}</span>
                </div>
              )}
            </div>
            {app.tradeHistory && (
              <span className="text-[10px] text-white/20">{app.tradeHistory.months}mo · {formatCurrency(app.tradeHistory.volume)}</span>
            )}
          </div>
        </motion.div>
      ))}
      {applications.length === 0 && <EmptyState title="No applications" description="Credit applications will appear here." />}
    </div>
  );
}

/* ─── HOTEL RISK PROFILES ─── */
function HotelRiskProfiles({ profiles }: { profiles: HotelProfile[] }) {
  return (
    <div className="space-y-2">
      {profiles.map((profile) => {
        const totalPayments = profile.paymentHistory.onTime + profile.paymentHistory.late + profile.paymentHistory.defaulted;
        const onTimeRate = totalPayments > 0 ? Math.round((profile.paymentHistory.onTime / totalPayments) * 100) : 0;
        return (
          <div key={profile.id} className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.03] hover:border-white/[0.06] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 size={13} className="text-white/25" />
                <span className="text-[12px] font-medium text-white/70">{profile.name}</span>
              </div>
              <span className="text-[10px] text-white/20 font-mono">{profile.taxId}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <RiskRing score={profile.creditScore} size={24} />
                <span className={`text-[10px] font-semibold ${riskColor(profile.creditScore)}`}>{profile.creditScore}</span>
              </div>
              <div className="flex-1 h-1 rounded-full bg-white/[0.03] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500/50 to-emerald-400" style={{ width: `${onTimeRate}%` }} />
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">{onTimeRate}% on time</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-white/20">
              <span>Exposure: {formatCurrency(profile.totalExposure)}</span>
              <span>{profile.activeFacilities} facilities</span>
            </div>
          </div>
        );
      })}
      {profiles.length === 0 && <EmptyState title="No profiles" description="Hotel risk profiles will appear here." />}
    </div>
  );
}

/* ─── PORTFOLIO METRICS ─── */
function PortfolioSummary({ metrics, loading }: { metrics: PortfolioMetricsData | null; loading: boolean }) {
  if (loading) return <LoadingCard rows={3} />;
  if (!metrics) return <EmptyState title="No data" description="Portfolio metrics will appear once facilities are active." />;

  const maxRoi = Math.max(...metrics.monthlyRoi.map((m) => m.roi), 1);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Exposure", value: formatCurrency(metrics.totalExposure), icon: DollarSign, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
          { label: "Default Rate", value: `${(metrics.defaultRate * 100).toFixed(1)}%`, icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Avg Facility", value: formatCurrency(metrics.averageFacilitySize), icon: CreditCard, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Concentration", value: `${(metrics.concentrationRisk * 100).toFixed(0)}%`, icon: PieChart, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((m) => (
          <div key={m.label} className="p-3 rounded-xl border border-white/[0.05] bg-[#0a0a0a]">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`p-1 rounded-md ${m.bg}`}><m.icon size={11} className={m.color} /></div>
              <span className="text-[9px] text-white/25 uppercase tracking-wider">{m.label}</span>
            </div>
            <p className="text-[16px] font-bold text-white metric-value">{m.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-[11px] font-semibold text-white/25 uppercase tracking-wider mb-3">Monthly ROI</h4>
        <div className="flex items-end gap-1.5 h-24">
          {metrics.monthlyRoi.map((m) => {
            const h = Math.max((m.roi / maxRoi) * 100, 4);
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full flex justify-center">
                  <div className="w-full max-w-[20px] rounded-t bg-gradient-to-t from-emerald-500/40 to-emerald-400/70" style={{ height: `${h}%` }} />
                  <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1a1a1a] border border-white/[0.06] rounded px-2 py-0.5 text-[9px] text-white/60 whitespace-nowrap z-10">
                    {(m.roi * 100).toFixed(1)}%
                  </div>
                </div>
                <span className="text-[8px] text-white/15">{m.month.slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function FactoringDashboardPage() {
  const { data: appData, loading: appLoading } = useApi<{ applications: CreditApplication[] }>("/api/v1/factoring/applications");
  const { data: profilesData } = useApi<{ profiles: HotelProfile[] }>("/api/v1/factoring/credit-lines");
  const { data: metricsData, loading: metricsLoading } = useApi<PortfolioMetricsData>("/api/v1/factoring/invoices");

  const applications = appData?.applications || [];
  const profiles = profilesData?.profiles || [];
  const metrics = metricsData || null;

  const [selectedApp, setSelectedApp] = useState<CreditApplication | null>(null);
  const [filter, setFilter] = useState("ALL");

  const filteredApps = useMemo(() => {
    if (filter === "ALL") return applications;
    return applications.filter((a) => a.status === filter);
  }, [applications, filter]);

  const stats = useMemo(() => {
    const pending = applications.filter((a) => ["PENDING_REVIEW", "UNDER_ANALYSIS"].includes(a.status)).length;
    const approved = applications.filter((a) => a.status === "APPROVED").length;
    const disbursed = applications.filter((a) => a.status === "DISBURSED").length;
    const totalValue = applications.reduce((s, a) => s + a.amount, 0);
    return [
      { label: "Pending Review", value: pending.toString(), change: "+2", up: true, icon: Clock, color: "amber" as const },
      { label: "Approved", value: approved.toString(), change: "+5", up: true, icon: CheckCircle2, color: "emerald" as const },
      { label: "Disbursed", value: disbursed.toString(), change: "+3", up: true, icon: DollarSign, color: "crimson" as const },
      { label: "Total Value", value: formatCurrency(totalValue), change: "+15%", up: true, icon: TrendingUp, color: "blue" as const },
    ];
  }, [applications]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 pb-10">
      <motion.div variants={fadeInUp}>
        <PageHeader title="NBFI Credit Center" description="Portfolio management, risk assessment, and disbursement tracking."
          breadcrumbs={[{ label: "Dashboard" }]}
          actions={
            <div className="flex items-center gap-2">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[12px] text-white focus:outline-none focus:border-[#8b5cf6]/30">
                <option value="ALL">All Status</option>
                <option value="PENDING_REVIEW">Pending</option>
                <option value="UNDER_ANALYSIS">Analysis</option>
                <option value="APPROVED">Approved</option>
                <option value="DISBURSED">Disbursed</option>
              </select>
              <button className="btn-crimson text-[12px] py-1.5 px-3"><Plus size={14} /> New Application</button>
            </div>
          }
        />
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i} />)}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <SectionCard title="Credit Pipeline" icon={Activity}
            action={<span className="text-[11px] text-white/20">{filteredApps.length} applications</span>}>
            {appLoading ? <LoadingTable rows={4} /> : <CreditPipeline applications={filteredApps} onSelect={setSelectedApp} />}
          </SectionCard>

          <SectionCard title="Hotel Risk Profiles" icon={Shield}>
            <HotelRiskProfiles profiles={profiles} />
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Portfolio Metrics" icon={PieChart}>
            <PortfolioSummary metrics={metrics} loading={metricsLoading} />
          </SectionCard>

          <div className="p-5 rounded-xl border border-white/[0.05] bg-[#0a0a0a] relative overflow-hidden group/card hover:border-white/[0.08] transition-all">
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(139, 92, 246,0.02) 0%, transparent 50%)" }} />
            <div className="relative">
              <h4 className="text-[12px] font-semibold text-white/60 mb-3 flex items-center gap-2">
                <Zap size={13} className="text-amber-400" /> Quick Actions
              </h4>
              <div className="space-y-2">
                {["Review Application", "Process Disbursement", "Run Risk Model", "Generate Report"].map((action) => (
                  <button key={action} className="w-full text-left px-3 py-2 rounded-lg text-[12px] text-white/45 hover:text-white/80 hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/[0.04]">
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title={selectedApp?.hotelName || "Application"}>
        {selectedApp && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Amount</p>
                <p className="text-[16px] font-bold text-white mt-0.5">{formatCurrency(selectedApp.amount)}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedApp.status} /></div>
              </div>
              {selectedApp.riskScore !== undefined && (
                <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                  <p className="text-[10px] text-white/25 uppercase tracking-wider">Risk Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <RiskRing score={selectedApp.riskScore} size={28} />
                    <span className={`text-[13px] font-bold ${riskColor(selectedApp.riskScore)}`}>{selectedApp.riskScore}</span>
                  </div>
                </div>
              )}
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Requested</p>
                <p className="text-[13px] text-white/70 mt-0.5">{new Date(selectedApp.requestedAt).toLocaleDateString("en-EG")}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
