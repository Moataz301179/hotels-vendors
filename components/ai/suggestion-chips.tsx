"use client";

import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface SuggestionChip {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
}

export function SuggestionChips({ chips }: { chips: SuggestionChip[] }) {
  if (!chips.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
      {chips.map((chip) => {
        const Icon = chip.icon || Sparkles;
        return (
          <button
            key={chip.label}
            onClick={chip.onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all hover:opacity-80 shrink-0"
            style={{ backgroundColor: "var(--accent-muted)", color: "var(--accent-base)", border: "1px solid var(--accent-glow)" }}
          >
            <Icon size={12} />
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
