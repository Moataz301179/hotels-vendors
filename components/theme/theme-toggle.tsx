"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const isNotion = mode === "notion";

  return (
    <div
      className="flex items-center p-0.5 rounded-full border"
      style={{
        borderColor: "var(--border-subtle)",
        background: "var(--bg-surface-2)",
      }}
      role="radiogroup"
      aria-label="Theme"
    >
      {/* Coinbase (light) */}
      <button
        onClick={() => setMode("coinbase")}
        role="radio"
        aria-checked={!isNotion}
        aria-label="Light theme"
        className="relative flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-medium transition-all duration-200"
        style={{
          background: !isNotion ? "var(--accent-base)" : "transparent",
          color: !isNotion ? "var(--accent-text)" : "var(--text-secondary)",
        }}
      >
        <Sun className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Light</span>
      </button>

      {/* Notion (dark) */}
      <button
        onClick={() => setMode("notion")}
        role="radio"
        aria-checked={isNotion}
        aria-label="Dark theme"
        className="relative flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-medium transition-all duration-200"
        style={{
          background: isNotion ? "var(--accent-base)" : "transparent",
          color: isNotion ? "var(--accent-text)" : "var(--text-secondary)",
        }}
      >
        <Moon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}
