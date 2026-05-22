"use client";

import { useState } from "react";
import { X, Palette, Layout, Eye, EyeOff, RotateCcw, Download, Wand2, ChevronRight } from "lucide-react";
import { type DesignConfig } from "./use-design-editor";

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const isRgba = value.startsWith("rgba");
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[11px] text-white/60">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isRgba ? "#ffffff" : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded border-0 p-0 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-[90px] px-1.5 py-0.5 text-[10px] bg-white/[0.04] border border-white/[0.08] rounded text-white/80 focus:outline-none"
        />
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange, unit = "" }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-white/60">{label}</span>
        <span className="text-[10px] text-white/40">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-white/[0.08] rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "var(--preview-accent, #8b5cf6)" }}
      />
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex items-center justify-between w-full py-2 text-left">
      <span className="text-[11px] text-white/60">{label}</span>
      {checked ? <Eye size={14} className="text-white/40" /> : <EyeOff size={14} className="text-white/20" />}
    </button>
  );
}

export function DesignEditorPanel({
  config,
  update,
  reset,
  exportConfig,
  applyStyles,
  onClose,
}: {
  config: DesignConfig;
  update: (patch: Partial<DesignConfig>) => void;
  reset: () => void;
  exportConfig: () => void;
  applyStyles: () => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"colors" | "layout" | "sections">("colors");

  return (
    <div className="fixed top-0 right-0 h-full w-[320px] bg-[#0a0a0a] border-l border-white/[0.08] shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Wand2 size={14} className="text-[var(--preview-accent,#8b5cf6)]" />
          <span className="text-[13px] font-semibold text-white">Design Studio</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={applyStyles} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white transition-colors" title="Apply">
            <ChevronRight size={14} />
          </button>
          <button onClick={exportConfig} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white transition-colors" title="Export">
            <Download size={14} />
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06]">
        {[
          { id: "colors" as const, label: "Colors", icon: Palette },
          { id: "layout" as const, label: "Layout", icon: Layout },
          { id: "sections" as const, label: "Sections", icon: Eye },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors ${
              activeTab === tab.id ? "text-white border-b-2 border-[var(--preview-accent,#8b5cf6)]" : "text-white/30 hover:text-white/60"
            }`}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "colors" && (
          <>
            <div>
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Canvas</h4>
              <ColorPicker label="Page Background" value={config.canvasBg} onChange={(v) => update({ canvasBg: v })} />
              <ColorPicker label="Hero Background" value={config.heroBg} onChange={(v) => update({ heroBg: v })} />
            </div>
            <div className="border-t border-white/[0.04] pt-3">
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Brand</h4>
              <ColorPicker label="Accent" value={config.accentColor} onChange={(v) => update({ accentColor: v })} />
              <ColorPicker label="Accent Dark" value={config.accentDark} onChange={(v) => update({ accentDark: v })} />
            </div>
            <div className="border-t border-white/[0.04] pt-3">
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Cards</h4>
              <ColorPicker label="Card Background" value={config.cardBg} onChange={(v) => update({ cardBg: v })} />
              <ColorPicker label="Card Border" value={config.cardBorder} onChange={(v) => update({ cardBorder: v })} />
            </div>
            <div className="border-t border-white/[0.04] pt-3">
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Typography</h4>
              <ColorPicker label="Primary Text" value={config.textPrimary} onChange={(v) => update({ textPrimary: v })} />
              <ColorPicker label="Secondary Text" value={config.textSecondary} onChange={(v) => update({ textSecondary: v })} />
              <ColorPicker label="Muted Text" value={config.textMuted} onChange={(v) => update({ textMuted: v })} />
            </div>
          </>
        )}

        {activeTab === "layout" && (
          <>
            <div>
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Spacing</h4>
              <Slider label="Section Padding" value={config.sectionPadding} min={40} max={160} onChange={(v) => update({ sectionPadding: v })} unit="px" />
            </div>
            <div className="border-t border-white/[0.04] pt-3">
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Shape</h4>
              <Slider label="Card Radius" value={config.cardRadius} min={0} max={32} onChange={(v) => update({ cardRadius: v })} unit="px" />
            </div>
            <div className="border-t border-white/[0.04] pt-3">
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Typography Scale</h4>
              <Slider label="Hero Size" value={config.fontSizeHero} min={24} max={80} onChange={(v) => update({ fontSizeHero: v })} unit="px" />
              <Slider label="Section Size" value={config.fontSizeSection} min={20} max={48} onChange={(v) => update({ fontSizeSection: v })} unit="px" />
              <Slider label="Body Size" value={config.fontSizeBody} min={10} max={20} onChange={(v) => update({ fontSizeBody: v })} unit="px" />
            </div>
          </>
        )}

        {activeTab === "sections" && (
          <>
            <div>
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Visibility</h4>
              <ToggleRow label="Platform Overview" checked={config.showPlatform} onChange={() => update({ showPlatform: !config.showPlatform })} />
              <ToggleRow label="Workflow" checked={config.showWorkflow} onChange={() => update({ showWorkflow: !config.showWorkflow })} />
              <ToggleRow label="Coverage" checked={config.showCoverage} onChange={() => update({ showCoverage: !config.showCoverage })} />
              <ToggleRow label="Modules" checked={config.showModules} onChange={() => update({ showModules: !config.showModules })} />
              <ToggleRow label="Trust & Security" checked={config.showTrust} onChange={() => update({ showTrust: !config.showTrust })} />
              <ToggleRow label="CTA" checked={config.showCTA} onChange={() => update({ showCTA: !config.showCTA })} />
            </div>
            <div className="border-t border-white/[0.04] pt-3">
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Actions</h4>
              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 py-2 text-[11px] text-white/50 hover:text-white bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] rounded-lg transition-colors"
              >
                <RotateCcw size={12} />
                Reset to Defaults
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
