/**
 * Utility Helpers
 *
 * cn() — tailwind-merge + clsx for conditional class merging
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Egyptian Pounds (EGP).
 */
export function egp(amount: number, opts?: { compact?: boolean }): string {
  if (opts?.compact) {
    if (amount >= 1_000_000) return `EGP ${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `EGP ${(amount / 1_000).toFixed(0)}K`;
  }
  return `EGP ${amount.toLocaleString("en-EG")}`;
}

/**
 * Format basis points as a percentage string (e.g., 1500 → "15.0%").
 */
export function pct(bps: number): string {
  return `${(bps / 100).toFixed(1)}%`;
}
