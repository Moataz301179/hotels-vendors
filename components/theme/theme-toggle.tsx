"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { accent, toggleAccent } = useTheme();

  return (
    <button
      onClick={toggleAccent}
      className="toggle-switch"
      data-active={accent}
      aria-label={`Switch to ${accent === "orange" ? "lime" : "orange"} accent`}
      title={`${accent === "orange" ? "Lime" : "Orange"} mode`}
    />
  );
}
