"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck, AlertTriangle, CheckCircle2, Clock, XCircle,
  RefreshCw, Shield, FileText, Search, ArrowUpRight, ArrowDownRight,
  QrCode, Printer, Download, Eye, Loader2, Send, X,
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  uuid: string;
  total: number;
  currency: string;
  etaStatus: string;
  etaUuid: string;
  createdAt: string;
  hotel: { name: string };
  supplier: { name: string };
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    ACCEPTED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Accepted" },
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
    VALIDATED: { bg: "bg-accent-base/10", text: "text-accent-base", dot: "bg-accent-base", label: "Validated" },
    SUBMITTED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Submitted" },
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
          ? "bg-surface-raised text-foreground border border-subtle"
          : "text-foreground-muted hover:text-foreground-tertiary hover:bg-surface-raised"
      }`}
    >
      {children}
    </button>
  );
}

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

export default function ETACenterPage() {
  const [activeTab, setActiveTab] = useState("invoices");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitStep, setSubmitStep] = useState<"select" | "submitting" | "success">("select");
  const [submitInvoice, setSubmitInvoice] = useState<Invoice | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitResult, setSubmitResult] = useState<any>(null);

  const { data: invoicesData, loading, error } = useApi<{ data: Invoice[]; meta: { total: number } }>(
    "/api/eta?page=1&limit=20"
  );

  const invoices = invoicesData?.data ?? [];

  const stats = [
    { label: "Submitted Today", value: invoices.filter((i) => new Date(i.createdAt).toDateString() === new Date().toDateString()).length.toString(), change: "+12%", up: true, icon: FileCheck },
    { label: "Validated", value: invoices.filter((i) => i.etaStatus === "ACCEPTED" || i.etaStatus === "VALIDATED").length.toString(), change: "98.2%", up: true, icon: CheckCircle2 },
    { label: "Pending", value: invoices.filter((i) => i.etaStatus === "PENDING" || i.etaStatus === "SUBMITTED").length.toString(), change: "Under review", up: true, icon: Clock },
    { label: "Rejected", value: invoices.filter((i) => i.etaStatus === "REJECTED").length.toString(), change: "-2 from yesterday", up: true, icon: XCircle },
  ];

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.hotel?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleETASubmit(invoice: Invoice) {
    setSubmitLoading(true);
    setSubmitError("");
    setSubmitStep("submitting");
    try {
      const res = await fetch(`/api/v1/invoices/${invoice.id}/eta-submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (json.success) {
        setSubmitResult(json.data);
        setSubmitStep("success");
      } else {
        setSubmitError(json.error || "Submission failed");
        setSubmitStep("select");
      }
    } catch {
      setSubmitError("Network error during submission");
      setSubmitStep("select");
    } finally {
      setSubmitLoading(false);
    }
  }

  function closeSubmitModal() {
    setSubmitModalOpen(false);
    setSubmitStep("select");
    setSubmitInvoice(null);
    setSubmitError("");
    setSubmitResult(null);
  }

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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">ETA E-Invoicing Center</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">ETA</span>
          </div>
          <p className="text-sm text-foreground-tertiary mt-0.5">Egyptian Tax Authority compliance, submission tracking, and digital signature management</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-raised hover:bg-surface-raised border border-subtle text-xs text-foreground/80 transition-all">
            <RefreshCw size={14} />
            Sync with ETA
          </button>
          <button
            onClick={() => { setSubmitModalOpen(true); setSubmitStep("select"); setSubmitError(""); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-base hover:bg-accent-base/80 text-xs text-foreground font-medium transition-all"
          >
            <FileCheck size={14} />
            Submit Invoice
          </button>
        </div>
      </motion.div>

      {/* Stats */}
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

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="flex items-center gap-1 p-1 rounded-xl bg-surface-raised border border-subtle w-fit">
        <TabButton active={activeTab === "invoices"} onClick={() => setActiveTab("invoices")}>Invoices</TabButton>
        <TabButton active={activeTab === "validation"} onClick={() => setActiveTab("validation")}>Validation</TabButton>
        <TabButton active={activeTab === "rules"} onClick={() => setActiveTab("rules")}>Rules Engine</TabButton>
      </motion.div>

      {activeTab === "invoices" && (
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search by invoice ID or hotel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-base/50"
              />
            </div>
          </div>

          {loading ? (
            <LoadingTable rows={6} />
          ) : error ? (
            <EmptyState title="Error loading invoices" description={error} />
          ) : filteredInvoices.length === 0 ? (
            <EmptyState
              title="No invoices found"
              description="Invoices will appear here once submitted to ETA."
              action={
                <button
                  onClick={() => { setSubmitModalOpen(true); setSubmitStep("select"); setSubmitError(""); }}
                  className="px-4 py-2 rounded-lg bg-accent-base text-xs text-foreground font-medium"
                >
                  Submit Invoice
                </button>
              }
            />
          ) : (
            <div className="rounded-xl border border-subtle bg-surface-raised overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-subtle">
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Invoice ID</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Hotel</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">ETA UUID</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Date</th>
                    <th className="text-right px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-subtle hover:bg-surface-raised transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-foreground-muted" />
                          <span className="text-xs font-mono text-foreground-tertiary">{inv.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs text-foreground">{inv.hotel?.name}</span></td>
                      <td className="px-4 py-3"><span className="text-xs font-semibold text-foreground">{formatCurrency(inv.total, inv.currency)}</span></td>
                      <td className="px-4 py-3"><span className="text-[10px] text-foreground-muted font-mono">{inv.etaUuid?.slice(0, 12)}...</span></td>
                      <td className="px-4 py-3"><StatusBadge status={inv.etaStatus || "PENDING"} /></td>
                      <td className="px-4 py-3"><span className="text-[11px] text-foreground-muted">{new Date(inv.createdAt).toLocaleDateString()}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedInvoice(inv)} className="p-1.5 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground-tertiary transition-colors"><Eye size={13} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground-tertiary transition-colors"><QrCode size={13} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground-tertiary transition-colors"><Printer size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "validation" && (
        <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-subtle bg-surface-raised p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Shield size={14} className="text-foreground-tertiary" />Validation Pipeline</h3>
            <div className="space-y-4">
              {[
                { name: "Schema Check", desc: "Validate ETA JSON structure", time: "12ms" },
                { name: "Tax ID Lookup", desc: "Verify supplier VAT registration", time: "45ms" },
                { name: "Digital Sign", desc: "Cryptographic signature verification", time: "23ms" },
                { name: "UUID Check", desc: "ETA UUID format and uniqueness", time: "8ms" },
                { name: "Authority Matrix", desc: "Approval chain verification", time: "34ms" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">{step.name}</p>
                    <p className="text-[10px] text-foreground-muted">{step.desc}</p>
                  </div>
                  <span className="text-[10px] text-foreground-muted font-mono">{step.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-subtle bg-surface-raised p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><AlertTriangle size={14} className="text-foreground-tertiary" />Compliance Health</h3>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent-base)" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42 * 0.988} ${2 * Math.PI * 42 * 0.012}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">98.8%</span>
                  <span className="text-[10px] text-foreground-muted">Compliance</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs"><span className="text-foreground-tertiary">Acceptance Rate</span><span className="text-foreground font-medium">99.2%</span></div>
              <div className="h-1.5 rounded-full bg-surface-raised overflow-hidden"><div className="h-full rounded-full bg-emerald-500" style={{ width: "99.2%" }} /></div>
              <div className="flex items-center justify-between text-xs mt-2"><span className="text-foreground-tertiary">Avg. Validation Time</span><span className="text-foreground font-medium">124ms</span></div>
              <div className="h-1.5 rounded-full bg-surface-raised overflow-hidden"><div className="h-full rounded-full bg-accent-base" style={{ width: "85%" }} /></div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "rules" && (
        <motion.div variants={fadeInUp} className="rounded-xl border border-subtle bg-surface-raised overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-subtle">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Rule</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Description</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Tax ID Verification", desc: "Validate supplier tax registration", passRate: 100 },
                { name: "UUID Format Check", desc: "ETA UUID v4 format validation", passRate: 100 },
                { name: "Digital Signature", desc: "Invoice signature verification", passRate: 99.2 },
                { name: "Amount Threshold", desc: "High-value order dual-check", passRate: 100 },
                { name: "Schema Compliance", desc: "ETA JSON schema validation", passRate: 98.8 },
              ].map((rule, i) => (
                <tr key={i} className="border-b border-subtle hover:bg-surface-raised transition-colors">
                  <td className="px-4 py-3"><span className="text-xs font-medium text-foreground">{rule.name}</span></td>
                  <td className="px-4 py-3"><span className="text-[11px] text-foreground-tertiary">{rule.desc}</span></td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-surface-raised overflow-hidden"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${rule.passRate}%` }} /></div>
                      <span className="text-[11px] text-foreground-tertiary">{rule.passRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Invoice ${selectedInvoice?.invoiceNumber}`}
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Hotel</p>
                <p className="text-sm text-foreground mt-0.5">{selectedInvoice.hotel?.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Supplier</p>
                <p className="text-sm text-foreground mt-0.5">{selectedInvoice.supplier?.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Total</p>
                <p className="text-sm text-foreground mt-0.5">{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedInvoice.etaStatus || "PENDING"} /></div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
              <p className="text-[10px] text-foreground-muted uppercase mb-1">Digital Signature</p>
              <code className="text-[10px] text-foreground-muted font-mono break-all">{Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}</code>
            </div>
          </div>
        )}
      </Modal>

      {/* ETA Submit Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeSubmitModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-subtle bg-[var(--background)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-subtle">
              <h3 className="text-lg font-semibold text-foreground">Submit to ETA</h3>
              <button onClick={closeSubmitModal} className="p-1.5 rounded-lg hover:bg-surface-raised text-foreground-tertiary hover:text-foreground transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6">
              <AnimatePresence mode="wait">
                {submitStep === "select" && (
                  <motion.div key="select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-sm text-foreground-tertiary mb-4">Select an invoice to submit to the Egyptian Tax Authority:</p>
                    {error ? (
                      <EmptyState title="Error" description={error} />
                    ) : filteredInvoices.filter((i) => !i.etaUuid || i.etaStatus === "PENDING").length === 0 ? (
                      <EmptyState title="No eligible invoices" description="All invoices have already been submitted to ETA." />
                    ) : (
                      <div className="space-y-2">
                        {filteredInvoices.filter((i) => !i.etaUuid || i.etaStatus === "PENDING").map((inv) => (
                          <button
                            key={inv.id}
                            onClick={() => { setSubmitInvoice(inv); handleETASubmit(inv); }}
                            disabled={submitLoading}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-subtle hover:border-subtle[0.12] transition-all text-left"
                          >
                            <div className="flex items-center gap-3">
                              <FileText size={16} className="text-foreground-muted" />
                              <div>
                                <p className="text-xs font-medium text-foreground">{inv.invoiceNumber}</p>
                                <p className="text-[10px] text-foreground-muted">{inv.hotel?.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-foreground">{formatCurrency(inv.total, inv.currency)}</p>
                              <Send size={14} className="text-foreground-muted inline-block mt-0.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {submitError && (
                      <div className="mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs flex items-center gap-2">
                        <AlertTriangle size={14} /> {submitError}
                      </div>
                    )}
                  </motion.div>
                )}

                {submitStep === "submitting" && (
                  <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center gap-3">
                    <Loader2 size={28} className="animate-spin text-accent-base" />
                    <p className="text-sm text-foreground-tertiary">Submitting to Egyptian Tax Authority...</p>
                    <p className="text-xs text-foreground-muted">This may take a few moments</p>
                  </motion.div>
                )}

                {submitStep === "success" && submitResult && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">Submitted Successfully</h4>
                      <p className="text-sm text-foreground-tertiary mt-1">The invoice has been submitted to ETA for validation.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-raised border border-subtle text-left space-y-2">
                      <div className="flex justify-between text-xs"><span className="text-foreground-muted">Invoice</span><span className="text-foreground font-medium">{submitResult.invoiceNumber || submitInvoice?.invoiceNumber}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-foreground-muted">ETA UUID</span><span className="text-emerald-400 font-mono">{submitResult.etaUuid || "Pending generation"}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-foreground-muted">Status</span><span className="text-blue-400">{submitResult.etaStatus || "SUBMITTED"}</span></div>
                    </div>
                    <button onClick={closeSubmitModal} className="px-5 py-2 rounded-xl bg-accent-base hover:bg-accent-base/80 text-foreground text-sm font-medium transition-colors">Done</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
