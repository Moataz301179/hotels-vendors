"use client";

import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  return (
    <button
      disabled
      aria-label="Language switching coming soon"
      title="Arabic support coming soon"
      className="relative flex items-center gap-1.5 h-7 px-2 rounded-lg text-[11px] font-medium transition-all duration-200 opacity-50 cursor-not-allowed"
      style={{
        background: "var(--bg-surface-2)",
        color: "var(--text-muted)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <Globe className="w-3.5 h-3.5 shrink-0" />
      <span>EN</span>
    </button>
  );
}
