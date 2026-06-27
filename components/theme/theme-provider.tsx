"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark" | "coastal";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "hv-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved === "light" || saved === "dark" || saved === "coastal") {
        setModeState(saved);
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {}
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  const cycleMode = useCallback(() => {
    const order: ThemeMode[] = ["light", "dark", "coastal"];
    const idx = order.indexOf(mode);
    setMode(order[(idx + 1) % order.length]);
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, cycleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
