"use client";

import {
  FileText,
  CheckCircle2,
  Truck,
  PackageCheck,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";

const PIPELINE_STEPS = [
  { key: "DRAFT", label: "Draft", icon: FileText },
  { key: "PENDING_APPROVAL", label: "Pending", icon: Clock },
  { key: "APPROVED", label: "Approved", icon: CheckCircle2 },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { key: "IN_TRANSIT", label: "In Transit", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: PackageCheck },
] as const;

const TERMINAL_STATES = ["REJECTED", "CANCELLED", "DISPUTED"];

export function OrderPipeline({ status }: { status: string }) {
  const isTerminal = TERMINAL_STATES.includes(status);
  const currentIndex = PIPELINE_STEPS.findIndex((s) => s.key === status);

  if (isTerminal) {
    return <TerminalStatus status={status} />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-0">
        {PIPELINE_STEPS.map((step, i) => {
          const isComplete = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              {/* Step dot */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 ${
                    isComplete
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                      : isCurrent
                      ? "bg-accent-base/15 border-accent-base/40 text-accent-base animate-pulse"
                      : "bg-white/[0.03] border-white/[0.08] text-white/20"
                  }`}
                >
                  <Icon size={14} />
                </div>
                <span
                  className={`mt-1.5 text-[10px] font-medium whitespace-nowrap ${
                    isComplete
                      ? "text-emerald-400/70"
                      : isCurrent
                      ? "text-accent-base"
                      : "text-white/20"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < PIPELINE_STEPS.length - 1 && (
                <div
                  className={`h-[2px] flex-1 mx-1 mb-5 rounded-full transition-colors ${
                    isComplete ? "bg-emerald-500/30" : "bg-white/[0.06]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TerminalStatus({ status }: { status: string }) {
  const config: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    REJECTED: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", label: "Rejected" },
    CANCELLED: { icon: XCircle, color: "text-white/30", bg: "bg-white/[0.04] border-white/[0.08]", label: "Cancelled" },
    DISPUTED: { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", label: "Disputed" },
  };
  const c = config[status] || config.CANCELLED;
  const Icon = c.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${c.bg}`}>
      <Icon size={16} className={c.color} />
      <span className={`text-[13px] font-medium ${c.color}`}>{c.label}</span>
    </div>
  );
}

export function OrderStatusPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const color =
    s === "DELIVERED"
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : s === "IN_TRANSIT"
      ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
      : s === "CONFIRMED" || s === "APPROVED"
      ? "text-[#8B0000] bg-[rgba(139,0,0,0.1)] border-[rgba(139,0,0,0.2)]"
      : s === "DISPUTED"
      ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
      : s === "REJECTED" || s === "CANCELLED"
      ? "text-red-400 bg-red-400/10 border-red-400/20"
      : "text-white/40 bg-white/[0.04] border-white/[0.08]";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${color}`}
    >
      {status?.replace(/_/g, " ") || "DRAFT"}
    </span>
  );
}
