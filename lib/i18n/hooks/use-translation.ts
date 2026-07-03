"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import { common } from "@/lib/i18n/translations/common";
import { marketplace } from "@/lib/i18n/translations/marketplace";
import { checkout } from "@/lib/i18n/translations/checkout";

const namespaces = {
  common,
  marketplace,
  checkout,
};

export type Namespace = keyof typeof namespaces;

export function useTranslation(ns: Namespace = "common") {
  const { locale } = useLanguage();
  const translations = namespaces[ns];

  const t = (key: string): string => {
    const lang = locale as "en" | "ar";
    const dict = translations[lang] || translations.en;
    return (dict as Record<string, string>)[key] || key;
  };

  return { t, locale };
}
