"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AccentMode = "orange" | "lime";
export type ThemeMode = "dark" | "light";

interface ThemeContextType {
  accent: AccentMode;
  setAccent: (mode: AccentMode) => void;
  toggleAccent: () => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  accent: "orange",
  setAccent: () => {},
  toggleAccent: () => {},
  mode: "dark",
  setMode: () => {},
  toggleMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentMode>("orange");
  const [mode, setModeState] = useState<ThemeMode>("dark");
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
    if (savedMode === "light" || savedMode === "dark") {
      setModeState(savedMode);
      document.documentElement.setAttribute("data-mode", savedMode);
    } else {
      document.documentElement.setAttribute("data-mode", "dark");
    }
  }, []);

  const setAccent = (mode: AccentMode) => {
    setAccentState(mode);
    localStorage.setItem("hv-accent-mode", mode);
    document.documentElement.setAttribute("data-accent", mode);
  };

  const toggleAccent = () => {
    const next = accent === "orange" ? "lime" : "orange";
    setAccent(next);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("hv-theme-mode", newMode);
    document.documentElement.setAttribute("data-mode", newMode);
  };

  const toggleMode = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ accent, setAccent, toggleAccent, mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
