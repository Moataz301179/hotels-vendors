"use client";

import { ReactNode } from "react";
import { Download } from "lucide-react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  onDownloadCsv?: () => void;
  customizeKey?: string;
  className?: string;
}

export function DashboardCard({
  title,
  children,
  onDownloadCsv,
  customizeKey,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 ${className}`}
      style={{ borderWidth: 1, borderStyle: "solid", borderColor: "var(--border-subtle)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {onDownloadCsv && (
            <button
              onClick={onDownloadCsv}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
              title={`Export ${title} as CSV`}
            >
              <Download size={12} />
              CSV
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
