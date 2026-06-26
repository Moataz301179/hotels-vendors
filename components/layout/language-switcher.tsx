"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

export type Locale = "en" | "ar";

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>("en");

  const toggle = () => {
    setLocale((prev) => (prev === "en" ? "ar" : "en"));
  };

  const nextLabel = locale === "en" ? "AR" : "EN";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      title={locale === "en" ? "Switch to Arabic" : "Switch to English"}
      className="relative flex items-center gap-1.5 h-7 px-2 rounded-lg text-[11px] font-medium transition-all duration-200"
      style={{
        background: "var(--bg-surface-2)",
        color: "var(--text-secondary)",
        border: "1px solid var(--border-subtle)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-base)";
        (e.currentTarget as HTMLElement).style.color = "var(--accent-base)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
      }}
    >
      <Globe className="w-3.5 h-3.5 shrink-0" />
      <span>{nextLabel}</span>
    </button>
  );
}
