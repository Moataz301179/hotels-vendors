"use client";

import * as React from "react";
import type { ReactNode } from "react";
import type { Locale } from "./translations";
import { isRTL } from "./translations";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "hv_locale";

function getInitialLocale(): Locale {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "ar" || saved === "en") return saved;
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setLocaleState(getInitialLocale());
    setMounted(true);
  }, []);

  const setLocale = React.useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = isRTL(newLocale) ? "rtl" : "ltr";
    }
  }, []);

  const toggleLocale = React.useCallback(() => {
    setLocale(locale === "en" ? "ar" : "en");
  }, [locale, setLocale]);

  React.useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = isRTL(locale) ? "rtl" : "ltr";
    }
  }, [locale, mounted]);

  const value: LanguageContextValue = {
    locale,
    setLocale,
    toggleLocale,
    dir: isRTL(locale) ? "rtl" : "ltr",
    isRTL: isRTL(locale),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
