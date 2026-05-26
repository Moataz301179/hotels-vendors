"use client";

import { useTheme } from "./ThemeProvider";
import { Settings, CheckCircle2, Monitor, Moon, Sun } from "lucide-react";

export default function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "classic",
      name: "Legacy Classic (Current)",
      description: "The baseline Crimson & Gold dark matrix.",
      icon: Moon,
      colors: ["#000000", "#bef264", "#e1a95f"]
    },
    {
      id: "midnight-glass",
      name: "Midnight Glassmorphism",
      description: "Ultra-premium translucent aesthetic with cyan neon accents.",
      icon: Monitor,
      colors: ["#020817", "rgba(255,255,255,0.05)", "#06b6d4"]
    },
    {
      id: "enterprise-light",
      name: "Enterprise High-Contrast",
      description: "Clean, high-visibility daylight mode for bright office environments.",
      icon: Sun,
      colors: ["#f9fafb", "#ffffff", "#bef264"]
    }
  ];

  return (
    <div className="bg-[var(--bg-surface-1,#0a0a0a)] border border-[var(--border-subtle,rgba(255,255,255,0.1))] p-6 rounded-lg text-[var(--text-primary,#f0f0f0)] w-full max-w-2xl font-sans">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-subtle,rgba(255,255,255,0.1))]">
        <div className="p-2 bg-[var(--crimson-glow,rgba(139, 92, 246,0.2))] rounded">
          <Settings size={20} className="text-[var(--crimson-base,#bef264)]" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Workspace Appearance</h2>
          <p className="text-xs text-[var(--text-secondary,#a0a0a0)]">
            Select an interface theme. Your corporate logo remains strictly unmodified across all templates.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id as any)}
            className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
              theme === t.id
                ? "bg-[var(--bg-surface-2,#101010)] border-[var(--brand-400,#bef264)] ring-1 ring-[var(--brand-400,#bef264)] shadow-lg"
                : "bg-transparent border-[var(--border-invisible,rgba(255,255,255,0.06))] hover:bg-[var(--bg-surface-2,rgba(255,255,255,0.02))]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {t.colors.map((color, i) => (
                  <div 
                    key={i} 
                    className="w-6 h-6 rounded-full border-2 border-white/[0.2] shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">{t.name}</div>
                <div className="text-xs text-[var(--text-secondary,#a0a0a0)] mt-0.5">{t.description}</div>
              </div>
            </div>
            
            {theme === t.id ? (
              <CheckCircle2 size={20} className="text-[var(--brand-400,#bef264)]" />
            ) : (
              <div className="w-5 h-5 rounded-full border border-[var(--border-visible,rgba(255,255,255,0.2))]" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-[var(--bg-surface-2,#101010)] border border-[var(--border-subtle,rgba(255,255,255,0.1))] rounded text-xs flex items-center justify-between">
        <span className="text-[var(--text-secondary,#a0a0a0)]">Global brand assets (Logo, Favicon) are structurally isolated from CSS themes.</span>
        <img 
          src="/logo.png" 
          alt="HotelsVendors Logo Preview" 
          className="h-6 w-auto grayscale opacity-50"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
    </div>
  );
}
