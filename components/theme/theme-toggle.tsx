"use client";

import { useState, useRef, useEffect } from "react";
import { Sun, Moon, ChevronUp } from "lucide-react";
import { useTheme } from "./theme-provider";
import type { ThemeMode } from "./theme-provider";

const OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = OPTIONS.find((o) => o.mode === mode)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle theme"
        aria-expanded={open}
        className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-[11px] font-medium transition-colors"
        style={{
          borderColor: "var(--border-subtle)",
          background: "var(--bg-surface-2)",
          color: "var(--text-secondary)",
        }}
      >
        <current.icon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronUp
          className="w-3 h-3 transition-transform"
          style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}
        />
      </button>

      {open && (
        <div
          className="absolute bottom-full right-0 mb-1.5 rounded-lg border overflow-hidden min-w-[120px] z-50"
          style={{
            borderColor: "var(--border-subtle)",
            background: "var(--bg-surface-1)",
            boxShadow: "0 8px 24px -8px rgba(0,0,0,0.12)",
          }}
        >
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = mode === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => {
                  setMode(opt.mode);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-left transition-colors"
                style={{
                  background: active ? "var(--accent-muted)" : "transparent",
                  color: active ? "var(--accent-base)" : "var(--text-secondary)",
                  fontWeight: active ? 500 : 400,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
