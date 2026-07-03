/**
 * Input Sanitization — OWASP A03:2021 Injection
 * Sanitizes user-generated content to prevent XSS and HTML injection.
 *
 * Uses DOMPurify (isomorphic for SSR/edge compatibility).
 */

import DOMPurify from "isomorphic-dompurify";

const DEFAULT_CONFIG = {
  ALLOWED_TAGS: [], // Strip all HTML by default
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

const RICH_TEXT_CONFIG = {
  ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li"],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

/**
 * Strip all HTML from a string. Safe for names, emails, IDs, etc.
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return "";
  return DOMPurify.sanitize(input, DEFAULT_CONFIG);
}

/**
 * Allow limited safe HTML (bold, italic, lists). Use for descriptions, notes.
 */
export function sanitizeRichText(input: string | undefined | null): string {
  if (!input) return "";
  return DOMPurify.sanitize(input, RICH_TEXT_CONFIG);
}

/**
 * Sanitize an object recursively — strips HTML from all string values.
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T
): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeText(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  return result;
}

/**
 * Validate and sanitize an email address.
 */
export function sanitizeEmail(input: string | undefined | null): string {
  if (!input) return "";
  const cleaned = sanitizeText(input).trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : "";
}

/**
 * Validate and sanitize a phone number (Egyptian format).
 */
export function sanitizePhone(input: string | undefined | null): string {
  if (!input) return "";
  const cleaned = sanitizeText(input).replace(/[^\d+]/g, "");
  // Egyptian mobile: +20 1xx xxx xxxx or 01xx xxx xxxx
  if (/^(\+20|0)?1[0-2,5]{1}[0-9]{8}$/.test(cleaned)) {
    return cleaned;
  }
  return "";
}
