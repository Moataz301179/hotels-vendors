"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { accent, setAccent } = useTheme();

  return (
    <div
      className="flex items-center gap-1.5 p-1 rounded-full border"
      style={{
        borderColor: "rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)",
      }}
      title="Accent color"
    >
      {/* Lime option */}
      <button
        onClick={() => setAccent("lime")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: accent === "lime" ? "#84CC16" : "transparent",
          boxShadow: accent === "lime" ? "0 0 8px rgba(132,204,22,0.4)" : "none",
        }}
        aria-label="Lime accent"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: accent === "lime" ? "#fff" : "#84CC16",
            opacity: accent === "lime" ? 1 : 0.5,
          }}
        />
      </button>

      {/* Orange option */}
      <button
        onClick={() => setAccent("orange")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: accent === "orange" ? "#F97316" : "transparent",
          boxShadow: accent === "orange" ? "0 0 8px rgba(249,115,22,0.4)" : "none",
        }}
        aria-label="Orange accent"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: accent === "orange" ? "#fff" : "#F97316",
            opacity: accent === "orange" ? 1 : 0.5,
          }}
        />
      </button>
    </div>
  );
}
