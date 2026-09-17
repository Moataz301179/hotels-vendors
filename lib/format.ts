/**
 * Formatting utilities for HotelsVendors UI
 */

export function initials(name: string | undefined | null): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

export function fmtDate(input: string | Date | null | undefined, _lang?: string): string {
  if (!input) return "";
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toISOString().split("T")[0];
}

export function fmtDateTime(input: string | Date | null | undefined, _lang?: string): string {
  if (!input) return "";
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toISOString();
}

export function fmtMoney(amount: number | null | undefined, lang: string = "en"): string {
  if (amount == null || isNaN(amount)) return "0";
  return Math.round(amount).toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
}

export function relDay(input: string | Date | null | undefined): string {
  if (!input) return "";
  const d = typeof input === "string" ? new Date(input) : input;
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}
