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
  CREATE: { icon: FileText, color: "text-blue-400", label: "Created" },
  APPROVE: { icon: CheckCircle2, color: "text-emerald-400", label: "Approved" },
  REJECT: { icon: XCircle, color: "text-red-400", label: "Rejected" },
  DISPUTE: { icon: AlertTriangle, color: "text-amber-400", label: "Disputed" },
  SUBMIT_GRN: { icon: FileCheck, color: "text-[#0a1628]", label: "GRN Submitted" },
  CONFIRM_DELIVERY: { icon: Package, color: "text-emerald-400", label: "Delivery Confirmed" },
  SHIP: { icon: Truck, color: "text-blue-400", label: "Shipped" },
  SUBMIT_INVOICE: { icon: FileText, color: "text-[#D4A843]", label: "Invoice Submitted" },
  QUALIFY_INVOICE: { icon: Shield, color: "text-emerald-400", label: "Invoice Qualified" },
  FACTOR: { icon: Banknote, color: "text-[#D4A843]", label: "Factored" },
  PAY: { icon: Banknote, color: "text-emerald-400", label: "Paid" },
};

function getActionConfig(action: string) {
  const upper = action.toUpperCase();
  return (
    ACTION_CONFIG[upper] || {
      icon: Clock,
      color: "text-white/30",
      label: action.replace(/_/g, " "),
    }
  );
}

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  if (!entries.length) {
    return (
      <div className="text-center py-8">
        <Clock className="w-6 h-6 text-white/10 mx-auto mb-2" />
        <p className="text-[13px] text-white/25">No audit entries yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-white/[0.06]" />

      <div className="space-y-0">
        {entries.map((entry, i) => {
          const config = getActionConfig(entry.action);
          const Icon = config.icon;
          const time =
            typeof entry.createdAt === "string"
              ? new Date(entry.createdAt)
              : entry.createdAt;

          return (
            <div
              key={entry.id}
              className="relative flex gap-4 py-3 group"
            >
              {/* Dot */}
              <div className="relative z-10 shrink-0 w-[31px] flex items-start justify-center pt-0.5">
                <div
                  className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center bg-black ${
                    i === 0
                      ? "border-accent-base"
                      : "border-white/[0.12]"
                  }`}
                >
                  <Icon
                    size={8}
                    className={i === 0 ? "text-accent-base" : "text-white/20"}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`text-[13px] font-medium ${
                        i === 0 ? "text-white/80" : "text-white/50"
                      }`}
                    >
                      {config.label}
                    </p>
                    {entry.actorName && (
                      <p className="text-[11px] text-white/25 mt-0.5">
                        by {entry.actorName}
                        {entry.actorRole && (
                          <span className="text-white/15">
                            {" "}
                            · {entry.actorRole}
                          </span>
                        )}
                      </p>
                    )}
                    {entry.beforeState && entry.afterState && (
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25 border border-white/[0.06]">
                          {entry.beforeState.replace(/_/g, " ")}
                        </span>
                        <span className="text-white/15 text-[10px]">→</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-base/10 text-accent-base/70 border border-accent-base/15">
                          {entry.afterState.replace(/_/g, " ")}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-white/15 whitespace-nowrap shrink-0">
                    {time.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    {", "}
                    {time.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Hash chain indicator */}
                {entry.hash && (
                  <p className="text-[9px] text-white/10 font-mono mt-1 truncate max-w-[200px]">
                    🔗 {entry.hash.slice(0, 16)}…
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
