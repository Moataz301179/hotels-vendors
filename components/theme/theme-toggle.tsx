"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const isNotion = mode === "notion";

  return (
    <div
      className="flex items-center gap-1.5 p-1 rounded-full border"
      style={{
        borderColor: "var(--border-subtle)",
        background: "var(--bg-surface-2)",
      }}
      title={`Theme: ${mode}`}
    >
      {/* Notion (dark) */}
      <button
        onClick={() => setMode("notion")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: isNotion ? "var(--accent-base)" : "transparent",
          boxShadow: isNotion ? "0 0 8px var(--accent-glow)" : "none",
        }}
        aria-label="Notion dark theme"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: isNotion ? "var(--accent-text)" : "var(--accent-base)",
            opacity: isNotion ? 1 : 0.5,
          }}
        />
      </button>

      {/* Coinbase (light) */}
      <button
        onClick={() => setMode("coinbase")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: !isNotion ? "var(--accent-base)" : "transparent",
          boxShadow: !isNotion ? "0 0 8px var(--accent-glow)" : "none",
        }}
        aria-label="Coinbase light theme"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: !isNotion ? "var(--accent-text)" : "var(--accent-base)",
            opacity: !isNotion ? 1 : 0.5,
          }}
        />
      </button>
    </div>
  );
}
