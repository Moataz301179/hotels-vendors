"use client";

import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "hv-theme-mode";

function getStoredMode(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore
  }
  return "dark";
}

export function setThemeMode(mode: "dark" | "light") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

export function initThemeMode() {
  const mode = getStoredMode();
  setThemeMode(mode);
  return mode;
}

interface ThemeModeToggleProps {
  variant?: "icon" | "button";
  className?: string;
}

export function ThemeModeToggle({ variant = "icon", className = "" }: ThemeModeToggleProps) {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMode(getStoredMode());
  }, []);

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    setThemeMode(next);
  };

  if (!mounted) {
    // Render a placeholder to avoid layout shift
    return (
      <div className={`w-8 h-8 rounded-lg ${variant === "button" ? "w-auto px-3" : ""} ${className}`} />
    );
  }

  const isLight = mode === "light";

  if (variant === "button") {
    return (
      <button
        onClick={toggle}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
          isLight
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
            : "bg-white/[0.06] text-white/70 hover:bg-white/[0.10] border-white/[0.08]"
        } ${className}`}
        aria-label="Toggle theme"
      >
        {isLight ? <Moon size={14} /> : <Sun size={14} />}
        <span className="hidden sm:inline">{isLight ? "Dark" : "Light"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-lg transition-colors ${
        isLight
          ? "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          : "text-white/40 hover:text-white hover:bg-white/[0.06]"
      } ${className}`}
      aria-label="Toggle theme"
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
