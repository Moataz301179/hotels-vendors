"use client";

import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Banknote,
  FileCheck,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";

interface AuditEntry {
  id: string;
  action: string;
  actorName?: string | null;
  actorRole?: string | null;
  beforeState?: string | null;
  afterState?: string | null;
  createdAt: string | Date;
  ipAddress?: string | null;
  hash?: string | null;
}

const ACTION_CONFIG: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  CREATE: { icon: FileText, color: "text-info", label: "Created" },
  APPROVE: { icon: CheckCircle2, color: "text-success", label: "Approved" },
  REJECT: { icon: XCircle, color: "text-error", label: "Rejected" },
  DISPUTE: { icon: AlertTriangle, color: "text-warning", label: "Disputed" },
  SUBMIT_GRN: { icon: FileCheck, color: "text-accent-base", label: "GRN Submitted" },
  CONFIRM_DELIVERY: { icon: Package, color: "text-success", label: "Delivery Confirmed" },
  SHIP: { icon: Truck, color: "text-info", label: "Shipped" },
  SUBMIT_INVOICE: { icon: FileText, color: "text-accent-base", label: "Invoice Submitted" },
  QUALIFY_INVOICE: { icon: Shield, color: "text-success", label: "Invoice Qualified" },
  FACTOR: { icon: Banknote, color: "text-accent-base", label: "Factored" },
  PAY: { icon: Banknote, color: "text-success", label: "Paid" },
};

function getActionConfig(action: string) {
  const upper = action.toUpperCase();
  return (
    ACTION_CONFIG[upper] || {
      icon: Clock,
      color: "text-foreground-muted",
      label: action.replace(/_/g, " "),
    }
  );
}

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  if (!entries.length) {
    return (
      <div className="text-center py-12">
        <Clock className="w-5 h-5 text-foreground-muted mx-auto mb-3" />
        <p className="text-sm text-foreground-muted">No audit entries yet</p>
        <p className="text-xs text-foreground-muted/60 mt-1">Entries will appear here as actions are taken on this order.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border-subtle" />

      <div className="space-y-0">
        {entries.map((entry, i) => {
          const config = getActionConfig(entry.action);
          const Icon = config.icon;
          const time =
            typeof entry.createdAt === "string"
              ? new Date(entry.createdAt)
              : entry.createdAt;
          const isFirst = i === 0;

          return (
            <div key={entry.id} className="relative flex gap-4 py-3 group">
              <div className="relative z-10 shrink-0 w-[31px] flex items-start justify-center pt-0.5">
                <div
                  className={`w-[18px] h-[18px] rounded-sm border flex items-center justify-center bg-surface ${
                    isFirst ? "border-accent-base" : "border-border-subtle"
                  }`}
                >
                  <Icon
                    size={8}
                    className={isFirst ? "text-accent-base" : "text-foreground-muted"}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`text-sm ${isFirst ? "text-foreground font-medium" : "text-foreground-secondary"}`}>
                      {config.label}
                    </p>
                    {entry.actorName && (
                      <p className="text-xs text-foreground-muted mt-0.5">
                        by {entry.actorName}
                        {entry.actorRole && (
                          <span className="text-foreground-muted/60"> · {entry.actorRole}</span>
                        )}
                      </p>
                    )}
                    {entry.beforeState && entry.afterState && (
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="status-pill text-foreground-muted border-border-subtle bg-surface">
                          {entry.beforeState.replace(/_/g, " ")}
                        </span>
                        <span className="text-foreground-muted text-xs">→</span>
                        <span className="status-pill text-accent-base border-accent-base/20 bg-accent-muted">
                          {entry.afterState.replace(/_/g, " ")}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="label-upper text-foreground-muted whitespace-nowrap shrink-0">
                    {time.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {", "}
                    {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
