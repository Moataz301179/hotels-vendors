"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Landmark, FileCheck, AlertTriangle, Clock,
  ArrowUpRight, ArrowDownRight, Plus, Eye,
  CreditCard, CheckCircle2, Loader2, ArrowRight,
  X, AlertCircle, Wallet,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { useSessionInfo } from "@/lib/hooks/use-session-info";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";
import { FactoringCalculator } from "@/components/fintech/factoring-calculator";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface CreditApplication {
  id: string;
  status: string;
  hotelName: string;
  creditScore: number | null;
  recommendedLimit: number | null;
  approvedLimit: number | null;
  approvedInterestRate: number | null;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING_REVIEW: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending Review" },
    AI_ANALYZING: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "AI Analyzing" },
    FACTORING_REVIEW: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400", label: "Under Review" },
    APPROVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Approved" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
  };
  const c = config[status] || { bg: "bg-surface-raised", text: "text-foreground-tertiary", dot: "bg-foreground-muted", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function formatCurrency(amount: number | null | undefined, currency = "EGP") {
  if (amount == null) return "—";
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

export default function HotelFactoringPage() {
  const session = useSessionInfo();
  const [selectedApp, setSelectedApp] = useState<CreditApplication | null>(null);
  const [calcOpen, setCalcOpen] = useState(false);

  const { data: appsData, loading: appsLoading } = useApi<CreditApplication[]>(
    "/api/v1/factoring/credit-lines"
  );
  const { data: requestsData, loading: requestsLoading } = useApi<{ requests: unknown[]; pagination: unknown }>(
    "/api/v1/factoring/requests?page=1&limit=10"
  );

  const applications = appsData ?? [];
  const requests = requestsData?.requests ?? [];

  const stats = useMemo(() => {
    const approved = applications.filter((a) => a.status === "APPROVED");
    const totalLimit = approved.reduce((sum, a) => sum + Number(a.approvedLimit || 0), 0);
    return [
      { label: "Applications", value: applications.length.toString(), change: "Total submitted", up: true, icon: FileCheck },
      { label: "Approved", value: approved.length.toString(), change: "Ready to use", up: approved.length > 0, icon: CheckCircle2 },
      { label: "Total Credit Limit", value: formatCurrency(totalLimit), change: "Across all facilities", up: true, icon: CreditCard },
      { label: "Pending Review", value: applications.filter((a) => a.status === "PENDING_REVIEW" || a.status === "AI_ANALYZING" || a.status === "FACTORING_REVIEW").length.toString(), change: "Awaiting decision", up: false, icon: Clock },
    ];
  }, [applications]);

  const isLoading = appsLoading || requestsLoading;

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Credit &amp; Factoring</h1>
          <p className="text-sm text-foreground-tertiary mt-0.5">Manage credit line applications and view financing options</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCalcOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-subtle text-foreground-tertiary hover:text-foreground text-xs font-medium transition-all"
          >
            <Wallet size={14} />
            Calculator
          </button>
          <a
            href="/dashboard/factoring/credit-lines"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-base hover:bg-accent-base/80 text-xs text-foreground font-medium transition-all"
          >
            <Plus size={14} />
            Apply for Credit Line
          </a>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
          : stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeInUp}
                className="rounded-xl border border-subtle bg-surface-raised p-4 hover:bg-surface-raised transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-medium text-foreground-muted uppercase tracking-wider">{s.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center">
                    <s.icon size={15} className="text-foreground-tertiary" />
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {s.up ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
                  <span className={`text-[11px] font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
                </div>
              </motion.div>
            ))}
      </motion.div>

      <motion.div variants={fadeInUp} className="rounded-xl border border-subtle bg-surface-raised overflow-hidden">
        <div className="p-4 border-b border-subtle">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Landmark size={14} className="text-foreground-tertiary" />
            Credit Line Applications
          </h3>
        </div>

        {appsLoading ? (
          <LoadingTable rows={5} />
        ) : applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Apply for a credit line to start financing your procurement."
            action={
              <a
                href="/dashboard/factoring/credit-lines"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-base text-xs text-foreground font-medium"
              >
                Apply Now <ArrowRight size={14} />
              </a>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-subtle">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Hotel</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Score</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Recommended</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Approved Limit</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-subtle hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs text-foreground">{app.hotelName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold text-foreground">{app.creditScore ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-foreground-tertiary">{formatCurrency(app.recommendedLimit)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold text-emerald-400">{formatCurrency(app.approvedLimit)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="p-1.5 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground-tertiary transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title="Application Details">
        {selectedApp && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Status</p>
                <div className="mt-1"><StatusBadge status={selectedApp.status} /></div>
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Credit Score</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{selectedApp.creditScore ?? "—"}<span className="text-[10px] text-foreground-muted">/100</span></p>
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Recommended Limit</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(selectedApp.recommendedLimit)}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Approved Limit</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">{formatCurrency(selectedApp.approvedLimit)}</p>
              </div>
            </div>
            {selectedApp.approvedInterestRate && (
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Interest Rate</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{Number(selectedApp.approvedInterestRate).toFixed(2)}%</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={calcOpen} onClose={() => setCalcOpen(false)} title="Factoring Calculator" size="lg">
        <FactoringCalculator />
      </Modal>
    </motion.div>
  );
}
