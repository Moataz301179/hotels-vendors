"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "noir" | "ember";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "noir",
  setMode: () => {},
  cycleMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const MODES: ThemeMode[] = ["light", "noir", "ember"];

export function ThemeProvider({ children, defaultMode }: { children: React.ReactNode; defaultMode?: ThemeMode }) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode || "light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("hv-theme-mode") as ThemeMode | null;
    if (MODES.includes(savedMode as ThemeMode)) {
      setModeState(savedMode as ThemeMode);
      document.documentElement.setAttribute("data-theme", savedMode as ThemeMode);
    } else if (defaultMode) {
      setModeState(defaultMode);
      document.documentElement.setAttribute("data-theme", defaultMode);
      localStorage.setItem("hv-theme-mode", defaultMode);
    } else {
      const initial: ThemeMode = "light";
      setModeState(initial);
      document.documentElement.setAttribute("data-theme", initial);
      localStorage.setItem("hv-theme-mode", initial);
    }
  }, [defaultMode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("hv-theme-mode", newMode);
    document.documentElement.setAttribute("data-theme", newMode);
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
    <ThemeContext.Provider value={{ mode, setMode, cycleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
