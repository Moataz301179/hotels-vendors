import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format piastres (EGP * 100) into a readable EGP string. */
export function egp(piastres: number, opts?: { compact?: boolean; decimals?: boolean }) {
  const value = piastres / 100;
  if (opts?.compact) {
    return (
      "EGP " +
      new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value)
    );
  }
  return (
    "EGP " +
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: opts?.decimals ? 2 : 0,
      maximumFractionDigits: opts?.decimals ? 2 : 0,
    }).format(value)
  );
}

export function pct(bps: number) {
  return (bps / 100).toFixed(2) + "%";
}

export function shortDate(d: Date | string | null) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ref(prefix: string) {
  return (
    prefix +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    Math.floor(Math.random() * 900 + 100)
  );
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
