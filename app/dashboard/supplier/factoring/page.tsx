"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Landmark, FileCheck, AlertTriangle, TrendingUp,
  ArrowUpRight, ArrowDownRight, Search, Eye,
  Wallet, Receipt, CheckCircle2, Clock, Loader2,
  ArrowRight, X, Check, AlertCircle, DollarSign,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface FactoringOffer {
  invoiceId: string;
  invoiceNumber: string;
  hotelName: string;
  hotelRiskScore: number;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  etaStatus: string;
  factoringStatus: string;
  advanceRate: number;
  advanceAmount: number;
  fee: number;
  netAmount: number;
  repaymentDays: number;
}

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    AVAILABLE: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Available" },
    OFFERED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Offered" },
    ACCEPTED: { bg: "bg-accent-base/10", text: "text-accent-base", dot: "bg-accent-base", label: "Accepted" },
    PAID: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Paid" },
    LOCKED_BY_MASTER: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400", label: "Locked" },
  };
  const c = config[status] || { bg: "bg-surface-raised", text: "text-foreground-tertiary", dot: "bg-foreground-muted", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export default function SupplierFactoringPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<FactoringOffer | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  const { data, loading, refetch } = useApi<{ offers: FactoringOffer[]; count: number }>(
    "/api/v1/supplier/factoring"
  );

  const offers = data?.offers ?? [];

  const stats = useMemo(() => {
    const totalAvailable = offers.reduce((sum, o) => sum + o.total, 0);
    const totalAdvance = offers.reduce((sum, o) => sum + o.advanceAmount, 0);
    const totalFee = offers.reduce((sum, o) => sum + o.fee, 0);
    return [
      { label: "Eligible Invoices", value: offers.length.toString(), change: "Available to factor", up: offers.length > 0, icon: Receipt },
      { label: "Total Invoice Value", value: formatCurrency(totalAvailable), change: "Across eligible invoices", up: true, icon: DollarSign },
      { label: "Potential Advance", value: formatCurrency(totalAdvance), change: "Estimated funding", up: true, icon: Wallet },
      { label: "Total Fees", value: formatCurrency(totalFee), change: "Factoring cost", up: false, icon: TrendingUp },
    ];
  }, [offers]);

  const filteredOffers = offers.filter(
    (o) =>
      o.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleRequestFactoring() {
    if (!selectedOffer) return;
    setConfirming(true);
    setConfirmError("");
    try {
      const res = await fetch("/api/v1/supplier/factoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: selectedOffer.invoiceId }),
      });
      const json = await res.json();
      if (json.success) {
        setConfirmSuccess(true);
        refetch();
      } else {
        setConfirmError(json.error || "Request failed");
      }
    } catch {
      setConfirmError("Network error");
    } finally {
      setConfirming(false);
    }
  }

  function closeConfirm() {
    setConfirmOpen(false);
    setConfirmSuccess(false);
    setConfirmError("");
    setSelectedOffer(null);
  }

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Invoice Factoring</h1>
          <p className="text-sm text-foreground-tertiary mt-0.5">Get early payment on your invoices through factoring partners</p>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
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
        <div className="p-4 border-b border-subtle flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Landmark size={14} className="text-foreground-tertiary" />
            Eligible Invoices
          </h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-base/50 w-56"
            />
          </div>
        </div>

        {loading ? (
          <LoadingTable rows={5} />
        ) : filteredOffers.length === 0 ? (
          <EmptyState
            title="No eligible invoices"
            description="Invoices must have ACCEPTED or VALIDATED ETA status and not already be paid or factored."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-subtle">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Hotel</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Amount</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Advance</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Fee</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Net</th>
                  <th className="text-center px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => (
                  <tr key={offer.invoiceId} className="border-b border-subtle hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-foreground-tertiary">{offer.invoiceNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-foreground">{offer.hotelName}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold text-foreground">{formatCurrency(offer.total, offer.currency)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-emerald-400">{formatCurrency(offer.advanceAmount, offer.currency)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-amber-400">{formatCurrency(offer.fee, offer.currency)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-bold text-foreground">{formatCurrency(offer.netAmount, offer.currency)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={offer.factoringStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedOffer(offer);
                          setConfirmOpen(true);
                          setConfirmSuccess(false);
                          setConfirmError("");
                        }}
                        disabled={offer.factoringStatus !== "AVAILABLE"}
                        className="px-3 py-1.5 rounded-lg bg-accent-base hover:bg-accent-base/80 disabled:opacity-30 disabled:cursor-not-allowed text-[10px] text-foreground font-semibold transition-colors"
                      >
                        Request Factoring
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={confirmOpen}
        onClose={closeConfirm}
        title={confirmSuccess ? "Request Submitted" : "Confirm Factoring Request"}
        size="lg"
      >
        {confirmSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">Factoring Requested</h4>
              <p className="text-sm text-foreground-tertiary mt-1">Your factoring request has been submitted and is pending review.</p>
            </div>
            <button onClick={closeConfirm} className="px-5 py-2 rounded-xl bg-accent-base hover:bg-accent-base/80 text-foreground text-sm font-medium transition-colors">
              Done
            </button>
          </div>
        ) : selectedOffer ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
              <h4 className="text-xs font-semibold text-foreground-tertiary uppercase tracking-wider mb-3">Invoice Summary</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Number</span>
                  <span className="text-foreground">{selectedOffer.invoiceNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Hotel</span>
                  <span className="text-foreground">{selectedOffer.hotelName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Amount</span>
                  <span className="text-foreground">{formatCurrency(selectedOffer.total, selectedOffer.currency)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
              <h4 className="text-xs font-semibold text-foreground-tertiary uppercase tracking-wider mb-3">Estimated Terms</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Advance Rate</span>
                  <span className="text-foreground">{(selectedOffer.advanceRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Advance Amount</span>
                  <span className="text-emerald-400 font-medium">{formatCurrency(selectedOffer.advanceAmount, selectedOffer.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Fee</span>
                  <span className="text-amber-400 font-medium">{formatCurrency(selectedOffer.fee, selectedOffer.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Net Amount</span>
                  <span className="text-foreground font-bold">{formatCurrency(selectedOffer.netAmount, selectedOffer.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Repayment Term</span>
                  <span className="text-foreground">{selectedOffer.repaymentDays} days</span>
                </div>
              </div>
            </div>

            {confirmError && (
              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {confirmError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 rounded-xl bg-surface-raised border border-subtle text-foreground-muted hover:text-foreground text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestFactoring}
                disabled={confirming}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-accent-base hover:bg-accent-base/80 disabled:opacity-50 text-foreground text-sm font-medium transition-colors"
              >
                {confirming ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {confirming ? "Submitting..." : "Confirm Request"}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </motion.div>
  );
}
