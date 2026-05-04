"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PRESETS, DEFAULT_PRESET, applyPreset, applyCustomAccent, ThemePreset } from "@/lib/theme/presets";

interface ThemeState {
  presetId: string;
  customAccent: string | null;
  fontSizeScale: number;
  density: "compact" | "default" | "spacious";
  fontFamily: string;
}

interface ThemeContextValue extends ThemeState {
  setPreset: (id: string) => void;
  setCustomAccent: (hex: string | null) => void;
  setFontSizeScale: (scale: number) => void;
  setDensity: (density: "compact" | "default" | "spacious") => void;
  setFontFamily: (family: string) => void;
  presets: typeof PRESETS;
  currentPreset: ThemePreset;
}

const STORAGE_KEY = "hv_theme_v1";

const defaultState: ThemeState = {
  presetId: DEFAULT_PRESET.id,
  customAccent: null,
  fontSizeScale: 1,
  density: "default",
  fontFamily: DEFAULT_PRESET.fontFamily,
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(defaultState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({ ...defaultState, ...parsed });
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    const preset = PRESETS.find((p) => p.id === state.presetId) || DEFAULT_PRESET;
    applyPreset(preset);

    if (state.customAccent) {
      applyCustomAccent(state.customAccent);
    }

    const root = document.documentElement;
    root.style.setProperty("--font-size-scale", String(state.fontSizeScale));
    root.style.setProperty("--density", state.density);
    root.style.setProperty("--font-family", state.fontFamily);
    document.body.style.fontSize = `${16 * state.fontSizeScale}px`;
  }, [state, mounted]);

  const currentPreset = PRESETS.find((p) => p.id === state.presetId) || DEFAULT_PRESET;

  const value: ThemeContextValue = {
    ...state,
    presets: PRESETS,
    currentPreset,
    setPreset: (id) => setState((s) => ({ ...s, presetId: id, customAccent: null })),
    setCustomAccent: (hex) => setState((s) => ({ ...s, customAccent: hex })),
    setFontSizeScale: (scale) => setState((s) => ({ ...s, fontSizeScale: scale })),
    setDensity: (density) => setState((s) => ({ ...s, density })),
    setFontFamily: (family) => setState((s) => ({ ...s, fontFamily: family })),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
