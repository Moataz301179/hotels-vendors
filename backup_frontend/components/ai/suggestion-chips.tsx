"use client"

import { type LucideIcon } from "lucide-react"

export type Chip = {
  label: string
  icon: LucideIcon
  onClick: () => void
}

export function SuggestionChips({ chips }: { chips: Chip[] }) {
  if (chips.length === 0) return null

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {chips.map((chip) => {
        const Icon = chip.icon
        return (
          <button
            key={chip.label}
            onClick={chip.onClick}
            className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95"
            style={{
              backgroundColor: "var(--accent-muted)",
              color: "var(--accent-base)",
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}
