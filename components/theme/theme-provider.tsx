"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeName = "burgundy" | "linear" | "mercury" | "dodo" | "ocean";

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  description: string;
  bg: string;
  bgElevated: string;
  bgCard: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentGlow: string;
  success: string;
  warning: string;
  danger: string;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  burgundy: {
    id: "burgundy",
    name: "Burgundy Royal",
    description: "Classic Egyptian luxury with deep burgundy and gold",
    bg: "#000000",
    bgElevated: "#0A0505",
    bgCard: "#120A0A",
    border: "rgba(255,255,255,0.08)",
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.65)",
    textMuted: "rgba(255,255,255,0.4)",
    accent: "#8B1A3C",
    accentLight: "#B82E4E",
    accentGlow: "rgba(139,26,60,0.4)",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  linear: {
    id: "linear",
    name: "Linear Midnight",
    description: "Sleek developer-focused with electric purple",
    bg: "#000000",
    bgElevated: "#0A0A0F",
    bgCard: "#111118",
    border: "rgba(255,255,255,0.08)",
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.65)",
    textMuted: "rgba(255,255,255,0.4)",
    accent: "#6C6CFF",
    accentLight: "#8B8BFF",
    accentGlow: "rgba(108,108,255,0.4)",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  mercury: {
    id: "mercury",
    name: "Mercury Finance",
    description: "Financial institution elegance with teal precision",
    bg: "#000000",
    bgElevated: "#050A0A",
    bgCard: "#0A1212",
    border: "rgba(255,255,255,0.08)",
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.65)",
    textMuted: "rgba(255,255,255,0.4)",
    accent: "#00D4AA",
    accentLight: "#00FFCC",
    accentGlow: "rgba(0,212,170,0.4)",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  dodo: {
    id: "dodo",
    name: "Dodo Fintech",
    description: "Bold Egyptian fintech with coral warmth",
    bg: "#000000",
    bgElevated: "#0F0808",
    bgCard: "#150C0C",
    border: "rgba(255,255,255,0.08)",
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.65)",
    textMuted: "rgba(255,255,255,0.4)",
    accent: "#FF6B6B",
    accentLight: "#FF8E53",
    accentGlow: "rgba(255,107,107,0.4)",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  ocean: {
    id: "ocean",
    name: "Supabase Ocean",
    description: "Deep ocean teal with emerald vitality",
    bg: "#000000",
    bgElevated: "#050A0F",
    bgCard: "#0A1218",
    border: "rgba(255,255,255,0.08)",
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.65)",
    textMuted: "rgba(255,255,255,0.4)",
    accent: "#3ECF8E",
    accentLight: "#71F7AD",
    accentGlow: "rgba(62,207,142,0.4)",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
};

const THEME_DATA_MAP: Record<ThemeName, string> = {
  burgundy: "crimson",
  linear: "plum",
  mercury: "emerald",
  dodo: "crimson",
  ocean: "navy",
};

interface ThemeContextType {
  theme: ThemeConfig;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  themes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("burgundy");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("hv-theme") as ThemeName;
    if (saved && THEMES[saved]) setThemeName(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("hv-theme", themeName);
    const t = THEMES[themeName];
    const root = document.documentElement;
    root.style.setProperty("--hv-bg", t.bg);
    root.style.setProperty("--hv-bg-elevated", t.bgElevated);
    root.style.setProperty("--hv-bg-card", t.bgCard);
    root.style.setProperty("--hv-border", t.border);
    root.style.setProperty("--hv-text-primary", t.textPrimary);
    root.style.setProperty("--hv-text-secondary", t.textSecondary);
    root.style.setProperty("--hv-text-muted", t.textMuted);
    root.style.setProperty("--hv-accent", t.accent);
    root.style.setProperty("--hv-accent-light", t.accentLight);
    root.style.setProperty("--hv-accent-glow", t.accentGlow);
    root.style.setProperty("--hv-success", t.success);
    root.style.setProperty("--hv-warning", t.warning);
    root.style.setProperty("--hv-danger", t.danger);
    root.setAttribute("data-theme", THEME_DATA_MAP[themeName]);
  }, [themeName, mounted]);

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeName], themeName, setTheme: setThemeName, themes: Object.keys(THEMES) as ThemeName[] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
