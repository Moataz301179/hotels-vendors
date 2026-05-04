"use client";

import { useTheme } from "@/components/theme/theme-provider";
import {
  Palette,
  Type,
  LayoutTemplate,
  RotateCcw,
  Check,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

export default function SettingsPage() {
  const {
    presets,
    currentPreset,
    presetId,
    customAccent,
    fontSizeScale,
    density,
    fontFamily,
    setPreset,
    setCustomAccent,
    setFontSizeScale,
    setDensity,
    setFontFamily,
  } = useTheme();

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-1">
          Customize your dashboard appearance, colors, and layout.
        </p>
      </div>

      <div className="space-y-6">
        {/* Presets */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <LayoutTemplate size={18} className="text-[var(--accent-400)]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Theme Presets</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`relative text-left p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
                  presetId === p.id && !customAccent
                    ? "border-[var(--accent-500)] bg-[var(--accent-500)]/10"
                    : "border-[var(--border-default)] bg-[var(--surface-raised)] hover:border-[var(--border-strong)]"
                }`}
              >
                {presetId === p.id && !customAccent && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--accent-500)] flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </span>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: p.accent[500] }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-[11px] text-[var(--foreground-muted)]">{p.density} · {p.fontSizeScale === 1 ? "Default" : p.fontSizeScale > 1 ? "Large" : "Small"}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--foreground-secondary)]">{p.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Custom Accent */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette size={18} className="text-[var(--accent-400)]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Custom Accent Color</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="color"
              value={customAccent || currentPreset.accent[500]}
              onChange={(e) => setCustomAccent(e.target.value)}
              className="w-16 h-16 rounded-xl border border-[var(--border-default)] cursor-pointer bg-transparent"
            />
            <div className="space-y-2">
              <p className="text-sm text-white font-medium">Pick any color</p>
              <p className="text-xs text-[var(--foreground-muted)]">
                Current: {customAccent || currentPreset.accent[500]}
              </p>
              <div className="flex gap-2">
                {["#dc143c", "#6366f1", "#10b981", "#8b5cf6", "#06b6d4", "#d97706", "#f97316", "#ec4899"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCustomAccent(c)}
                    className="w-8 h-8 rounded-full border-2 border-transparent hover:scale-110 transition-transform"
                    style={{ backgroundColor: c, borderColor: customAccent === c ? "white" : "transparent" }}
                  />
                ))}
              </div>
            </div>
            {customAccent && (
              <button
                onClick={() => setCustomAccent(null)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--foreground-secondary)] hover:text-white border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-colors"
              >
                <RotateCcw size={12} />
                Reset to preset
              </button>
            )}
          </div>
        </section>

        {/* Typography */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Type size={18} className="text-[var(--accent-400)]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Typography</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Font Family */}
            <div>
              <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3 block">Font Family</label>
              <div className="space-y-2">
                {[
                  { label: "Inter / System", value: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
                  { label: "Georgia / Serif", value: 'Georgia, "Times New Roman", serif' },
                  { label: "JetBrains Mono", value: '"JetBrains Mono", "SF Mono", ui-monospace, monospace' },
                ].map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setFontFamily(f.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                      fontFamily === f.value
                        ? "border-[var(--accent-500)] bg-[var(--accent-500)]/10 text-white"
                        : "border-[var(--border-default)] text-[var(--foreground-secondary)] hover:text-white hover:border-[var(--border-strong)]"
                    }`}
                    style={{ fontFamily: f.value }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3 block">Font Size Scale</label>
              <div className="space-y-2">
                {[
                  { label: "Small", value: 0.875, icon: Smartphone },
                  { label: "Default", value: 1, icon: Tablet },
                  { label: "Large", value: 1.125, icon: Monitor },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setFontSizeScale(s.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-colors ${
                      fontSizeScale === s.value
                        ? "border-[var(--accent-500)] bg-[var(--accent-500)]/10 text-white"
                        : "border-[var(--border-default)] text-[var(--foreground-secondary)] hover:text-white hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <s.icon size={16} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Layout Density */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <LayoutTemplate size={18} className="text-[var(--accent-400)]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Layout Density</h2>
          </div>
          <div className="flex gap-3">
            {(["compact", "default", "spacious"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                  density === d
                    ? "border-[var(--accent-500)] bg-[var(--accent-500)]/10 text-white"
                    : "border-[var(--border-default)] text-[var(--foreground-secondary)] hover:text-white hover:border-[var(--border-strong)]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--foreground-muted)]">
            Affects padding, spacing, and card sizes across the dashboard.
          </p>
        </section>
      </div>
    </div>
  );
}
