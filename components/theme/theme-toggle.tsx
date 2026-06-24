"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const isHercules = mode === "hercules";
  const isOriginal = mode === "original";

  return (
    <div
      className="flex items-center gap-1.5 p-1 rounded-full border"
      style={{
        borderColor: "rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)",
      }}
      title={`Theme: ${mode}`}
    >
      {/* Wimbledon (dark-orange) */}
      <button
        onClick={() => setMode("wimbledon")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: !isOriginal && !isHercules && mode === "wimbledon" ? "#FF6B00" : "transparent",
          boxShadow: !isOriginal && !isHercules && mode === "wimbledon" ? "0 0 8px rgba(255,107,0,0.4)" : "none",
        }}
        aria-label="Wimbledon theme"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: !isOriginal && !isHercules && mode === "wimbledon" ? "#fff" : "#FF6B00",
            opacity: !isOriginal && !isHercules && mode === "wimbledon" ? 1 : 0.5,
          }}
        />
      </button>

      {/* Original (red) */}
      <button
        onClick={() => setMode("original")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: isOriginal ? "#ED1C24" : "transparent",
          boxShadow: isOriginal ? "0 0 8px rgba(237,28,36,0.4)" : "none",
        }}
        aria-label="Original theme"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: isOriginal ? "#fff" : "#ED1C24",
            opacity: isOriginal ? 1 : 0.5,
          }}
        />
      </button>

      {/* Hercules (gold) */}
      <button
        onClick={() => setMode("hercules")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: isHercules ? "#D4AF37" : "transparent",
          boxShadow: isHercules ? "0 0 8px rgba(212,175,55,0.4)" : "none",
        }}
        aria-label="Hercules theme"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: isHercules ? "#fff" : "#D4AF37",
            opacity: isHercules ? 1 : 0.5,
          }}
        />
      </button>

      {/* Light */}
      <button
        onClick={() => setMode("light")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: mode === "light" ? "#0F172A" : "transparent",
          boxShadow: mode === "light" ? "0 0 8px rgba(15,23,42,0.3)" : "none",
        }}
        aria-label="Light theme"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: mode === "light" ? "#fff" : "#0F172A",
            opacity: mode === "light" ? 1 : 0.5,
          }}
        />
      </button>

      {/* Fintech (lime green) */}
      <button
        onClick={() => setMode("fintech")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: mode === "fintech" ? "#a3e635" : "transparent",
          boxShadow: mode === "fintech" ? "0 0 8px rgba(163,230,53,0.4)" : "none",
        }}
        aria-label="Fintech theme"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: mode === "fintech" ? "#000" : "#a3e635",
            opacity: mode === "fintech" ? 1 : 0.5,
          }}
        />
      </button>

      {/* Coastal (teal) */}
      <button
        onClick={() => setMode("coastal")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: mode === "coastal" ? "#0F766E" : "transparent",
          boxShadow: mode === "coastal" ? "0 0 8px rgba(15,118,110,0.4)" : "none",
        }}
        aria-label="Coastal theme"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: mode === "coastal" ? "#F5E6D3" : "#0F766E",
            opacity: mode === "coastal" ? 1 : 0.5,
          }}
        />
      </button>

      {/* Luxury (gold) */}
      <button
        onClick={() => setMode("luxury")}
        className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: mode === "luxury" ? "#D4AF37" : "transparent",
          boxShadow: mode === "luxury" ? "0 0 8px rgba(212,175,55,0.4)" : "none",
        }}
        aria-label="Luxury theme"
      >
        <span
          className="block w-3 h-3 rounded-full"
          style={{
            background: mode === "luxury" ? "#FAFAF9" : "#D4AF37",
            opacity: mode === "luxury" ? 1 : 0.5,
          }}
        />
      </button>
    </div>
  );
}
