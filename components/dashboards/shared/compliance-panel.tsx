"use client";

import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  FileText,
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

/* ── Invoice Status Pills ── */

export function InvoiceStatusPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const color =
    s === "VALIDATED"
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : s === "DISPUTED"
      ? "text-red-400 bg-red-400/10 border-red-400/20"
      : s === "ISSUED" || s === "SUBMITTED"
      ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
      : s === "CREDIT_NOTE"
      ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
      : "text-white/35 bg-white/[0.04] border-white/[0.08]";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${color}`}
    >
      {status?.replace(/_/g, " ") || "DRAFT"}
    </span>
  );
}

export function EtaStatusPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const config: Record<string, { icon: React.ElementType; color: string }> = {
    ACCEPTED: { icon: CheckCircle2, color: "text-emerald-400" },
    SUBMITTING: { icon: Loader2, color: "text-blue-400" },
    PENDING: { icon: Clock, color: "text-white/30" },
    REJECTED: { icon: XCircle, color: "text-red-400" },
    RETRYING: { icon: AlertTriangle, color: "text-amber-400" },
    MANUAL_RESOLUTION: { icon: ShieldAlert, color: "text-amber-400" },
  };
  const c = config[s] || config.PENDING;
  const Icon = c.color.includes("blue") ? c.icon : c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${
        s === "ACCEPTED"
          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
          : s === "REJECTED"
          ? "text-red-400 bg-red-400/10 border-red-400/20"
          : s === "SUBMITTING"
          ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
          : "text-amber-400 bg-amber-400/10 border-amber-400/20"
      }`}
    >
      <Icon size={10} className={s === "SUBMITTING" ? "animate-spin" : ""} />
      {status?.replace(/_/g, " ") || "PENDING"}
    </span>
  );
}

export function PaymentStatusPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const color =
    s === "PAID"
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : s === "FACTORED"
      ? "text-[#D4A843] bg-[rgba(212,168,67,0.1)] border-[rgba(212,168,67,0.2)]"
      : s === "OVERDUE"
      ? "text-red-400 bg-red-400/10 border-red-400/20"
      : s === "PARTIALLY_PAID"
      ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
      : "text-white/35 bg-white/[0.04] border-white/[0.08]";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${color}`}
    >
      {status?.replace(/_/g, " ") || "PENDING"}
    </span>
  );
}

export function FactoringStatusPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const color =
    s === "PAID"
      ? "text-[#D4A843] bg-[rgba(212,168,67,0.1)] border-[rgba(212,168,67,0.2)]"
      : s === "ACCEPTED"
      ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
      : s === "OFFERED"
      ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
      : s === "AVAILABLE"
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : s === "LOCKED_BY_MASTER"
      ? "text-red-400 bg-red-400/10 border-red-400/20"
      : "text-white/35 bg-white/[0.04] border-white/[0.08]";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${color}`}
    >
      {status?.replace(/_/g, " ") || "NOT FACTORABLE"}
    </span>
  );
}

export function DocProcessingPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const color =
    s === "ACCEPTED" || s === "PAID"
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : s === "REJECTED"
      ? "text-red-400 bg-red-400/10 border-red-400/20"
      : s === "SUBMITTED"
      ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
      : "text-white/35 bg-white/[0.04] border-white/[0.08]";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${color}`}
    >
      {status?.replace(/_/g, " ") || "PENDING"}
    </span>
  );
}

/* ── Compliance Workflow Panel ── */

interface ComplianceItem {
  label: string;
  status: "passed" | "failed" | "pending" | "warning";
  detail?: string;
}

export function CompliancePanel({ items }: { items: ComplianceItem[] }) {
  const allPassed = items.every((i) => i.status === "passed");
  const hasFailed = items.some((i) => i.status === "failed");

  return (
    <div
      className={`rounded-xl border p-4 ${
        allPassed
          ? "border-emerald-400/15 bg-emerald-400/[0.03]"
          : hasFailed
          ? "border-red-400/15 bg-red-400/[0.03]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        {allPassed ? (
          <ShieldCheck size={18} className="text-emerald-400" />
        ) : hasFailed ? (
          <ShieldX size={18} className="text-red-400" />
        ) : (
          <Shield size={18} className="text-white/25" />
        )}
        <span
          className={`text-[14px] font-medium ${
            allPassed
              ? "text-emerald-400"
              : hasFailed
              ? "text-red-400"
              : "text-white/50"
          }`}
        >
          Compliance Check
        </span>
        <span className="text-[11px] text-white/20 ml-auto">
          {items.filter((i) => i.status === "passed").length}/{items.length}{" "}
          passed
        </span>
      </div>

      {/* Items */}
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  item.status === "passed"
                    ? "bg-emerald-400/15"
                    : item.status === "failed"
                    ? "bg-red-400/15"
                    : item.status === "warning"
                    ? "bg-amber-400/15"
                    : "bg-white/[0.04]"
                }`}
              >
                {item.status === "passed" && (
                  <CheckCircle2 size={11} className="text-emerald-400" />
                )}
                {item.status === "failed" && (
                  <XCircle size={11} className="text-red-400" />
                )}
                {item.status === "warning" && (
                  <AlertTriangle size={11} className="text-amber-400" />
                )}
                {item.status === "pending" && (
                  <Clock size={11} className="text-white/20" />
                )}
              </div>
              <span
                className={`text-[13px] truncate ${
                  item.status === "passed"
                    ? "text-white/50"
                    : item.status === "failed"
                    ? "text-red-400/70"
                    : item.status === "warning"
                    ? "text-amber-400/60"
                    : "text-white/25"
                }`}
              >
                {item.label}
              </span>
            </div>
            {item.detail && (
              <span className="text-[11px] text-white/20 whitespace-nowrap shrink-0">
                {item.detail}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Order Pipeline Step Status ── */

interface PipelineStep {
  label: string;
  status: "done" | "current" | "upcoming" | "skipped";
  date?: string;
  actor?: string;
}

export function PipelineSteps({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          {/* Left rail */}
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                step.status === "done"
                  ? "bg-emerald-400/15 border-emerald-400/30"
                  : step.status === "current"
                  ? "bg-accent-base/15 border-accent-base/40 animate-pulse"
                  : "bg-white/[0.03] border-white/[0.08]"
              }`}
            >
              {step.status === "done" && (
                <CheckCircle2 size={12} className="text-emerald-400" />
              )}
              {step.status === "current" && (
                <div className="w-2 h-2 rounded-full bg-accent-base" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-[1px] flex-1 my-1 ${
                  step.status === "done" ? "bg-emerald-400/20" : "bg-white/[0.06]"
                }`}
              />
            )}
          </div>

          {/* Content */}
          <div className="pb-5 -mt-0.5">
            <p
              className={`text-[13px] font-medium ${
                step.status === "done"
                  ? "text-white/50"
                  : step.status === "current"
                  ? "text-accent-base"
                  : "text-white/20"
              }`}
            >
              {step.label}
            </p>
            {(step.date || step.actor) && (
              <p className="text-[10px] text-white/15 mt-0.5">
                {step.date}
                {step.date && step.actor && " · "}
                {step.actor}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
