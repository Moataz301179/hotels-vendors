"use client";

import { PackageOpen, Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "package" | "inbox";
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No data yet",
  description = "Data will appear here once available.",
  icon = "inbox",
  action,
}: EmptyStateProps) {
  const Icon = icon === "package" ? PackageOpen : Inbox;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
      <Icon size={32} className="text-white/10 mx-auto mb-3" />
      <p className="text-sm font-medium text-white/40">{title}</p>
      <p className="text-xs text-white/20 mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
