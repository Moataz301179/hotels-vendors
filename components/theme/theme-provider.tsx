"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "notion" | "coinbase";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "coinbase",
  setMode: () => {},
  cycleMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const MODES: ThemeMode[] = ["notion", "coinbase"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("coinbase");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("hv-theme-mode") as ThemeMode | null;
    if (MODES.includes(savedMode as ThemeMode)) {
      setModeState(savedMode as ThemeMode);
      document.documentElement.setAttribute("data-theme", savedMode as ThemeMode);
    } else {
      setModeState("coinbase");
      document.documentElement.setAttribute("data-theme", "coinbase");
      localStorage.setItem("hv-theme-mode", "coinbase");
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
