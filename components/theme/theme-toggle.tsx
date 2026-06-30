"use client";

import { Moon } from "lucide-react";

export function ThemeToggle() {
  return (
    <div
      className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-[11px] font-medium"
      style={{
        borderColor: "var(--border-subtle)",
        background: "var(--bg-surface-2)",
        color: "var(--text-secondary)",
      }}
    >
      <Moon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Dark</span>
    </div>
  );
}
