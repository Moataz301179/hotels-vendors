"use client";

import { Flame, TreePine } from "lucide-react";
import { useTheme } from "./theme-provider";
import type { ThemeMode } from "./theme-provider";

const THEME_OPTIONS: {
  mode: ThemeMode;
  label: string;
  icon: typeof Flame;
  sample: string;
}[] = [
  { mode: "noir", label: "Noir", icon: Flame, sample: "#B8962E" },
  { mode: "ember", label: "Ember", icon: TreePine, sample: "#FF8A33" },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div
      className="grid grid-cols-2 gap-0.5 p-0.5 rounded-xl border"
      style={{
        borderColor: "var(--border-subtle)",
        background: "var(--bg-surface-2)",
      }}
      role="radiogroup"
      aria-label="Theme"
    >
      {THEME_OPTIONS.map((opt) => {
        const active = mode === opt.mode;
        const Icon = opt.icon;
        return (
          <button
            key={opt.mode}
            onClick={() => setMode(opt.mode)}
            role="radio"
            aria-checked={active}
            aria-label={`${opt.label} theme`}
            className="relative flex items-center gap-1.5 h-7 px-2 rounded-lg text-[11px] font-medium transition-all duration-200"
            style={{
              background: active ? "var(--accent-base)" : "transparent",
              color: active ? "var(--accent-text)" : "var(--text-secondary)",
            }}
          >
            {active && (
              <span
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{ background: opt.sample }}
              />
            )}
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
