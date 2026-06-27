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

const STATUS_COLORS: Record<string, { fg: string; border: string }> = {
  DELIVERED: { fg: "text-success", border: "border-success/30" },
  IN_TRANSIT: { fg: "text-info", border: "border-info/30" },
  CONFIRMED: { fg: "text-accent-base", border: "border-accent-base/30" },
  APPROVED: { fg: "text-accent-base", border: "border-accent-base/30" },
  DISPUTED: { fg: "text-warning", border: "border-warning/30" },
  REJECTED: { fg: "text-error", border: "border-error/30" },
  CANCELLED: { fg: "text-foreground-muted", border: "border-foreground-muted/20" },
};

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
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-sm flex items-center justify-center border transition-colors shrink-0 ${
                    isComplete
                      ? "bg-accent-muted border-accent-base/40 text-accent-base"
                      : isCurrent
                      ? "bg-accent-muted border-accent-base text-accent-base"
                      : "bg-surface border-border-subtle text-foreground-muted"
                  }`}
                >
                  <Icon size={14} />
                </div>
                <span
                  className={`mt-1.5 label-upper whitespace-nowrap ${
                    isComplete
                      ? "text-accent-base"
                      : isCurrent
                      ? "text-foreground"
                      : "text-foreground-muted"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {i < PIPELINE_STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 mx-1 mb-5 transition-colors ${
                    isComplete ? "bg-accent-base/40" : "bg-border-subtle"
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
  const config: Record<string, { icon: React.ElementType; fg: string; border: string; label: string }> = {
    REJECTED: { icon: XCircle, fg: "text-error", border: "border-error/20", label: "Rejected" },
    CANCELLED: { icon: XCircle, fg: "text-foreground-muted", border: "border-foreground-muted/15", label: "Cancelled" },
    DISPUTED: { icon: AlertCircle, fg: "text-warning", border: "border-warning/20", label: "Disputed" },
  };
  const c = config[status] || config.CANCELLED;
  const Icon = c.icon;

  return (
    <div className={`status-pill ${c.fg} ${c.border}`}>
      <Icon size={12} />
      <span>{c.label}</span>
    </div>
  );
}

export function OrderStatusPill({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const colors = STATUS_COLORS[s] || STATUS_COLORS.CANCELLED;

  return (
    <span className={`status-pill ${colors.fg} ${colors.border}`}>
      {status?.replace(/_/g, " ") || "DRAFT"}
    </span>
  );
}
