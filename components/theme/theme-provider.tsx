"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "wimbledon" | "original" | "hercules" | "light" | "fintech" | "coastal" | "luxury";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "wimbledon",
  setMode: () => {},
  cycleMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const MODES: ThemeMode[] = ["wimbledon", "original", "hercules", "light", "fintech", "coastal", "luxury"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("fintech");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("hv-theme-mode") as ThemeMode | null;
    if (MODES.includes(savedMode as ThemeMode)) {
      setModeState(savedMode as ThemeMode);
      document.documentElement.setAttribute("data-theme", savedMode as ThemeMode);
    } else {
      setModeState("fintech");
      document.documentElement.setAttribute("data-theme", "fintech");
      localStorage.setItem("hv-theme-mode", "fintech");
    }
  }, []);

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
