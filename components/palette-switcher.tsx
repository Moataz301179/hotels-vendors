"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

const palettes = [
  { id: "olive", label: "Executive Olive", colors: ["#11160f", "#d6a73a", "#e8ddc3"] },
  { id: "carbon", label: "Carbon Gold", colors: ["#080806", "#c99933", "#eee2c7"] },
  { id: "midnight", label: "Midnight Sand", colors: ["#10191c", "#d9ad4b", "#e2d5bb"] },
] as const;

type PaletteId = (typeof palettes)[number]["id"];

export function PaletteSwitcher() {
  const [palette, setPalette] = useState<PaletteId>("olive");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("hv-palette") as PaletteId | null) ?? "olive";
    setPalette(saved);
    document.documentElement.dataset.palette = saved;
  }, []);

  function choose(id: PaletteId) {
    setPalette(id);
    localStorage.setItem("hv-palette", id);
    document.documentElement.dataset.palette = id;
    setOpen(false);
  }

  const current = palettes.find((p) => p.id === palette) ?? palettes[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 items-center gap-2 rounded-lg border border-border-2 px-2.5 text-xs text-fg-3 transition hover:border-border-3 hover:text-fg"
        aria-label="Choose palette"
      >
        <Palette className="h-3.5 w-3.5" />
        <span className="hidden xl:inline">{current.label}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-bg-1 shadow-2xl">
            {palettes.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => choose(p.id)}
                className={`flex w-full items-center justify-between px-3 py-3 text-left text-sm transition hover:bg-bg-2 ${palette === p.id ? "text-lime" : "text-fg-2"}`}
              >
                <span>{p.label}</span>
                <span className="flex gap-1">
                  {p.colors.map((c) => (
                    <span key={c} className="h-3 w-3 rounded-full border border-white/20" style={{ background: c }} />
                  ))}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
