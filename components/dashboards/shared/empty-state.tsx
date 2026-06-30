"use client";

import React from "react";
import { PackageOpen, Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "package" | "inbox" | React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No data yet",
  description = "Data will appear here once available.",
  icon = "inbox",
  action,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: "var(--accent-muted, rgba(0,0,0,0.2))" }}>
        {icon}
      </div>;
    }
    const IconComponent = icon === "inbox" ? Inbox : PackageOpen;
    return (
      <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: "var(--accent-muted, rgba(0,0,0,0.2))" }}
      >
        <IconComponent size={24} style={{ color: "var(--accent-base, rgba(255,255,255,0.1))" }} />
      </div>
    );
  };
  return (
    <div
      className="rounded-xl p-8 text-center flex flex-col items-center"
      style={{
        backgroundColor: "var(--surface-raised, rgba(255,255,255,0.02))",
        border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
      }}
    >
      {renderIcon()}
      <p className="text-sm font-medium" style={{ color: "var(--foreground-secondary, rgba(255,255,255,0.4))" }}>
        {title}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--foreground-muted, rgba(255,255,255,0.2))" }}>
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
