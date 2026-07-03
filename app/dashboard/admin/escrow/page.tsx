"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, ShieldCheck, DollarSign, CheckCircle2, XCircle,
  Loader2, ExternalLink, Copy, ArrowUpRight, Landmark,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function EscrowAdminPage() {
  const [invoiceId, setInvoiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [escrowStatus, setEscrowStatus] = useState<{ funded: boolean; released: boolean; amount: number; paymentUrl?: string } | null>(null);
  const [escrowResult, setEscrowResult] = useState<{ paymobOrderId: number; paymentUrl: string; escrowReference: string } | null>(null);
  const [releaseResult, setReleaseResult] = useState<{ released: boolean; message: string } | null>(null);
  const [releaseType, setReleaseType] = useState<string>("DUE_DATE");
  const [coApproverId, setCoApproverId] = useState("");
  const [copied, setCopied] = useState("");

  const checkInvoice = async () => {
    if (!invoiceId.trim()) return;
    setLoading(true);
    setError("");
    setEscrowStatus(null);
    setEscrowResult(null);
    setReleaseResult(null);
    try {
      const res = await fetch(`/api/v1/payments/escrow?invoiceId=${encodeURIComponent(invoiceId)}`);
      const json = await res.json();
      if (json.success) setEscrowStatus(json.data);
      else setError(json.error || "Failed to check invoice");
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  const createEscrow = async () => {
    setCreating(true);
    setError("");
    setEscrowResult(null);
    try {
      const res = await fetch("/api/v1/payments/escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      const json = await res.json();
      if (json.success) {
        setEscrowResult(json.data);
        setEscrowStatus((prev) => prev ? { ...prev, funded: true } : prev);
      } else setError(json.error || "Failed to create escrow");
    } catch { setError("Network error"); }
    finally { setCreating(false); }
  };

  const releaseEscrow = async () => {
    if (!coApproverId.trim()) { setError("Co-approver ID is required"); return; }
    setReleasing(true);
    setError("");
    setReleaseResult(null);
    try {
      const res = await fetch("/api/v1/payments/escrow", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, releaseType, coApproverId }),
      });
      const json = await res.json();
      if (json.success) setReleaseResult(json.data);
      else setError(json.error || "Failed to release escrow");
    } catch { setError("Network error"); }
    finally { setReleasing(false); }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <motion.div className="max-w-3xl mx-auto space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Escrow Management</h1>
        <p className="text-sm text-foreground-tertiary mt-0.5">Create, manage, and release escrow deposits for invoices</p>
      </motion.div>

      <motion.div variants={fadeInUp} className="rounded-xl border border-subtle bg-surface-raised p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Search size={14} className="text-foreground-muted" />
          Invoice Lookup
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            placeholder="Enter invoice ID"
            className="flex-1 px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-base/50"
          />
          <button
            onClick={checkInvoice}
            disabled={loading || !invoiceId.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-base/10 border border-accent-base/20 text-accent-base text-sm font-medium hover:bg-accent-base/20 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Check
          </button>
        </div>
      </motion.div>

      {error && (
        <motion.div variants={fadeInUp} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <XCircle size={14} /> {error}
        </motion.div>
      )}

      {escrowStatus && (
        <>
          <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
              <div className="flex items-center gap-2 mb-2"><DollarSign size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Amount</span></div>
              <p className="text-lg font-bold text-foreground">EGP {escrowStatus.amount.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
              <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Funded</span></div>
              <p className={`text-lg font-bold ${escrowStatus.funded ? "text-emerald-400" : "text-amber-400"}`}>{escrowStatus.funded ? "Yes" : "No"}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
              <div className="flex items-center gap-2 mb-2"><ShieldCheck size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Released</span></div>
              <p className={`text-lg font-bold ${escrowStatus.released ? "text-emerald-400" : "text-foreground-tertiary"}`}>{escrowStatus.released ? "Yes" : "No"}</p>
            </div>
          </motion.div>

          {!escrowStatus.funded && (
            <motion.div variants={fadeInUp} className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Create Escrow Deposit</h2>
              <button
                onClick={createEscrow}
                disabled={creating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-base/10 border border-accent-base/20 text-accent-base text-sm font-medium hover:bg-accent-base/20 transition-colors disabled:opacity-50"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <Landmark size={14} />}
                {creating ? "Creating..." : "Create Escrow"}
              </button>
            </motion.div>
          )}

          {escrowResult && (
            <motion.div variants={fadeInUp} className="rounded-xl border border-subtle bg-surface-raised p-5 space-y-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Escrow Created
              </h2>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-raised border border-subtle">
                <span className="text-xs text-foreground-muted">Payment URL</span>
                <div className="flex items-center gap-2">
                  <a href={escrowResult.paymentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-base hover:underline">{escrowResult.paymentUrl.slice(0, 40)}...</a>
                  <button onClick={() => copyToClipboard(escrowResult.paymentUrl, "url")} className="p-1 hover:bg-surface-raised rounded"><Copy size={12} className="text-foreground-muted" /></button>
                  <a href={escrowResult.paymentUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-surface-raised rounded"><ExternalLink size={12} className="text-foreground-muted" /></a>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-raised border border-subtle">
                <span className="text-xs text-foreground-muted">Escrow Reference</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-foreground-tertiary">{escrowResult.escrowReference}</span>
                  <button onClick={() => copyToClipboard(escrowResult.escrowReference, "ref")} className="p-1 hover:bg-surface-raised rounded"><Copy size={12} className="text-foreground-muted" /></button>
                </div>
              </div>
              <a
                href={escrowResult.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
              >
                <ExternalLink size={14} /> Proceed to Payment
              </a>
            </motion.div>
          )}

          {escrowStatus.funded && !escrowStatus.released && (
            <motion.div variants={fadeInUp} className="rounded-xl border border-subtle bg-surface-raised p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck size={14} className="text-foreground-muted" />
                Release Escrow
              </h2>
              <div>
                <label className="text-xs text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Release Type</label>
                <select
                  value={releaseType}
                  onChange={(e) => setReleaseType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground focus:outline-none"
                >
                  <option value="DUE_DATE">Due Date</option>
                  <option value="EARLY_PAYMENT">Early Payment</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Co-Approver ID</label>
                <input
                  type="text"
                  value={coApproverId}
                  onChange={(e) => setCoApproverId(e.target.value)}
                  placeholder="User ID of co-approver"
                  className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-base/50"
                />
              </div>
              {releaseResult && (
                <div className={`p-3 rounded-lg flex items-center gap-2 text-xs ${
                  releaseResult.released
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                }`}>
                  {releaseResult.released ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {releaseResult.message}
                </div>
              )}
              <button
                onClick={releaseEscrow}
                disabled={releasing}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
              >
                {releasing ? <Loader2 size={14} className="animate-spin" /> : <ArrowUpRight size={14} />}
                {releasing ? "Releasing..." : "Release Escrow"}
              </button>
            </motion.div>
          )}

          {escrowStatus.funded && escrowStatus.released && (
            <motion.div variants={fadeInUp} className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} /> Funds have been fully released for this invoice.
            </motion.div>
          )}
        </>
      )}

      {!escrowStatus && !loading && !error && (
        <motion.div variants={fadeInUp} className="text-center py-12 text-foreground-muted text-sm">
          Enter an invoice ID above to check its escrow status
        </motion.div>
      )}
    </motion.div>
  );
}
