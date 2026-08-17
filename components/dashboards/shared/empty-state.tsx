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
    <div className="command-panel rounded-xl p-8 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-[#8dedff3b] bg-[#0a1a24a8]">
        <Icon size={28} className="text-[#8dedffb5]" />
      </div>
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-xs text-white/45">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
