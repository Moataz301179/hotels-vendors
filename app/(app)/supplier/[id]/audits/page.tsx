"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Thermometer,
  FlaskConical,
  MapPin,
  Plus,
  X,
  Check,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  status: string;
  tier: string;
}

interface Audit {
  id: string;
  auditorName: string;
  auditDate: string;
  score: number | null;
  status: string;
  coldChainCompliant: boolean | null;
  haccpCertified: boolean | null;
  onSiteVisited: boolean | null;
  labTested: boolean | null;
  notes: string | null;
  createdAt: string;
}

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  PASSED: "bg-emerald-500/10 text-emerald-400",
  FAILED: "bg-red-500/10 text-red-400",
  CONDITIONAL: "bg-blue-500/10 text-blue-400",
};

const SUPPLIER_STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  ACTIVE: "bg-emerald-500/10 text-emerald-400",
  SUSPENDED: "bg-red-500/10 text-red-400",
  REJECTED: "bg-slate-500/10 text-slate-400",
};

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[11px] text-foreground-muted">—</span>;
  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
      ? "text-amber-400"
      : "text-red-400";
  return (
    <span className={`text-sm font-bold ${color}`}>
      {score}
      <span className="text-[10px] font-normal text-foreground-muted ml-0.5">/100</span>
    </span>
  );
}

function ComplianceBadges({ audit }: { audit: Audit }) {
  return (
    <div className="flex items-center gap-1.5">
      {audit.coldChainCompliant === true && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full bg-cyan-500/10 text-cyan-400 text-[9px] font-medium">
          <Thermometer className="w-2.5 h-2.5" /> Cold
        </span>
      )}
      {audit.haccpCertified === true && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-medium">
          <ShieldCheck className="w-2.5 h-2.5" /> HACCP
        </span>
      )}
      {audit.onSiteVisited === true && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full bg-blue-500/10 text-blue-400 text-[9px] font-medium">
          <MapPin className="w-2.5 h-2.5" /> Site
        </span>
      )}
      {audit.labTested === true && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-full bg-violet-500/10 text-violet-400 text-[9px] font-medium">
          <FlaskConical className="w-2.5 h-2.5" /> Lab
        </span>
      )}
      {audit.coldChainCompliant === null &&
        audit.haccpCertified === null &&
        audit.onSiteVisited === null &&
        audit.labTested === null && (
          <span className="text-[10px] text-foreground-muted">—</span>
        )}
    </div>
  );
}

export default function SupplierAuditsPage() {
  const params = useParams();
  const id = params.id as string;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    auditorName: "",
    auditDate: new Date().toISOString().split("T")[0],
    score: "",
    status: "PENDING",
    coldChainCompliant: false,
    haccpCertified: false,
    onSiteVisited: false,
    labTested: false,
    notes: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch(`/api/suppliers/${id}`),
          fetch(`/api/suppliers/${id}/audits`),
        ]);
        const sData = await sRes.json();
        const aData = await aRes.json();
        if (sData.success) setSupplier(sData.data);
        if (aData.success) setAudits(aData.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleCreateAudit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        score: form.score ? parseInt(form.score, 10) : undefined,
        auditDate: new Date(form.auditDate).toISOString(),
      };
      const res = await fetch(`/api/suppliers/${id}/audits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setAudits((prev) => [data.data, ...prev]);
        setModalOpen(false);
        setForm({
          auditorName: "",
          auditDate: new Date().toISOString().split("T")[0],
          score: "",
          status: "PENDING",
          coldChainCompliant: false,
          haccpCertified: false,
          onSiteVisited: false,
          labTested: false,
          notes: "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading audits...
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-center py-20 text-foreground-muted text-sm">
        Supplier not found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/supplier"
            className="flex items-center gap-1 text-[11px] text-foreground-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Suppliers
          </Link>
          <div className="h-4 w-px bg-border-subtle" />
          <div>
            <h1 className="text-base font-semibold">{supplier.name}</h1>
          </div>
          <span className={`text-[10px] px-1.5 py-[1px] rounded-full font-medium ${SUPPLIER_STATUS_BADGE[supplier.status] || ""}`}>
            {supplier.status}
          </span>
          <span className="text-[10px] px-1.5 py-[1px] rounded-full bg-accent-gold-dim text-accent-gold font-medium">
            {supplier.tier}
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-medium bg-brand-700 text-white hover:bg-brand-600 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Audit
        </button>
      </div>

      {/* Audit History */}
      <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border-subtle text-foreground-muted bg-surface-raised/50">
              <th className="text-left px-3 py-2 font-medium">Date</th>
              <th className="text-left px-3 py-2 font-medium">Auditor</th>
              <th className="text-left px-3 py-2 font-medium">Score</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Compliance</th>
              <th className="text-left px-3 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((audit) => (
              <tr
                key={audit.id}
                className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors"
              >
                <td className="px-3 py-2 text-foreground-muted">
                  {new Date(audit.auditDate).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 font-medium">{audit.auditorName}</td>
                <td className="px-3 py-2">
                  <ScoreBadge score={audit.score} />
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[9px] font-medium ${
                      STATUS_BADGE[audit.status] || "bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {audit.status === "PENDING" && <Clock className="w-2.5 h-2.5" />}
                    {audit.status === "PASSED" && <Check className="w-2.5 h-2.5" />}
                    {audit.status === "FAILED" && <AlertTriangle className="w-2.5 h-2.5" />}
                    {audit.status === "CONDITIONAL" && <AlertTriangle className="w-2.5 h-2.5" />}
                    {audit.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <ComplianceBadges audit={audit} />
                </td>
                <td className="px-3 py-2 text-foreground-muted max-w-[200px] truncate">
                  {audit.notes || "—"}
                </td>
              </tr>
            ))}
            {audits.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-foreground-muted text-[11px]">
                  No audits recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Audit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-[#13161c] border border-white/10 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold">New Audit</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-md text-foreground-muted hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateAudit} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-foreground-muted">Auditor Name *</label>
                  <input
                    required
                    value={form.auditorName}
                    onChange={(e) => setForm((f) => ({ ...f, auditorName: e.target.value }))}
                    placeholder="Auditor name"
                    className="w-full px-2.5 py-1.5 text-[11px] bg-white/5 border border-white/10 rounded-md text-white placeholder:text-foreground-faint focus:border-brand-500/50 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-foreground-muted">Audit Date *</label>
                  <input
                    required
                    type="date"
                    value={form.auditDate}
                    onChange={(e) => setForm((f) => ({ ...f, auditDate: e.target.value }))}
                    className="w-full px-2.5 py-1.5 text-[11px] bg-white/5 border border-white/10 rounded-md text-white placeholder:text-foreground-faint focus:border-brand-500/50 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-foreground-muted">Score (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.score}
                    onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
                    placeholder="e.g. 85"
                    className="w-full px-2.5 py-1.5 text-[11px] bg-white/5 border border-white/10 rounded-md text-white placeholder:text-foreground-faint focus:border-brand-500/50 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-foreground-muted">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-2.5 py-1.5 text-[11px] bg-white/5 border border-white/10 rounded-md text-white focus:border-brand-500/50 focus:outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PASSED">Passed</option>
                    <option value="FAILED">Failed</option>
                    <option value="CONDITIONAL">Conditional</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] text-foreground-muted">Compliance Checks</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "coldChainCompliant" as const, label: "Cold Chain", icon: Thermometer },
                    { key: "haccpCertified" as const, label: "HACCP", icon: ShieldCheck },
                    { key: "onSiteVisited" as const, label: "On-site Visit", icon: MapPin },
                    { key: "labTested" as const, label: "Lab Tested", icon: FlaskConical },
                  ].map((item) => {
                    const Icon = item.icon;
                    const checked = form[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, [item.key]: !f[item.key] }))
                        }
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border text-[11px] font-medium transition-colors ${
                          checked
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-white/5 border-white/10 text-foreground-muted hover:bg-white/[0.07]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {item.label}
                        {checked && <Check className="w-3 h-3 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-foreground-muted">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Observations and recommendations..."
                  rows={3}
                  className="w-full px-2.5 py-1.5 text-[11px] bg-white/5 border border-white/10 rounded-md text-white placeholder:text-foreground-faint focus:border-brand-500/50 focus:outline-none resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-md text-[11px] font-medium border border-border-subtle bg-surface text-foreground-muted hover:bg-surface-raised transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-md text-[11px] font-medium bg-brand-700 text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Save Audit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
