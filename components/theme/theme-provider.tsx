"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AccentMode = "orange" | "lime";
export type ThemeMode = "dark" | "light" | "original";

interface ThemeContextType {
  accent: AccentMode;
  setAccent: (mode: AccentMode) => void;
  toggleAccent: () => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  cycleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  accent: "orange",
  setAccent: () => {},
  toggleAccent: () => {},
  mode: "dark",
  setMode: () => {},
  toggleMode: () => {},
  cycleMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const MODES: ThemeMode[] = ["dark", "light", "original"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentMode>("orange");
  const [mode, setModeState] = useState<ThemeMode>("original");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedAccent = localStorage.getItem("hv-accent-mode") as AccentMode | null;
    if (savedAccent === "lime" || savedAccent === "orange") {
      setAccentState(savedAccent);
      document.documentElement.setAttribute("data-accent", savedAccent);
    } else {
      document.documentElement.setAttribute("data-accent", "orange");
    }

    const savedMode = localStorage.getItem("hv-theme-mode") as ThemeMode | null;
    if (savedMode === "light" || savedMode === "dark" || savedMode === "original") {
      setModeState(savedMode);
      document.documentElement.setAttribute("data-theme", savedMode);
    } else {
      // Default to original theme
      setModeState("original");
      document.documentElement.setAttribute("data-theme", "original");
      localStorage.setItem("hv-theme-mode", "original");
    }
  }, []);

  const setAccent = (m: AccentMode) => {
    setAccentState(m);
    localStorage.setItem("hv-accent-mode", m);
    document.documentElement.setAttribute("data-accent", m);
  };

  const toggleAccent = () => {
    const next = accent === "orange" ? "lime" : "orange";
    setAccent(next);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("hv-theme-mode", newMode);
    document.documentElement.setAttribute("data-theme", newMode);
  };

  const toggleMode = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
  };

  const cycleMode = () => {
    const idx = MODES.indexOf(mode);
    const next = MODES[(idx + 1) % MODES.length];
    setMode(next);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ accent, setAccent, toggleAccent, mode, setMode, toggleMode, cycleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
