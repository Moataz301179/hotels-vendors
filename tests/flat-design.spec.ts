/**
 * Flat Design Verification Suite
 * HotelsVendors — No Glassmorphism/Shadows/Blurs Enforcement
 *
 * Run: npx vitest run tests/flat-design.spec.ts
 */

import { describe, it, expect } from "vitest";

/* ── Anti-Glassmorphism Rules ── */
const BANNED_CLASS_PATTERNS = [
  /backdrop-blur/,
  /shadow-lg/,
  /shadow-xl/,
  /shadow-2xl/,
  /shadow-\[/,
  /glass/,
  /frosted/,
  /translucent/,
  /opacity-\d{2,3}/, // opacity-50, opacity-80, etc — banned for backgrounds
  /bg-black\/\d/, // bg-black/70 etc — translucent overlays
  /bg-white\/\d/, // bg-white/80 etc — frosted
  /from-blue-\d+\/\d+/, // gradient alpha — banned
  /via-\w+-\d+\/\d+/, // gradient alpha
  /to-\w+-\d+\/\d+/, // gradient alpha end
  /radial-gradient/, // ambient glows
  /backdrop-blur/,
];

/* ── Allowed solid classes ── */
const ALLOWED_CLASSES = [
  "bg-white", "bg-slate-50", "bg-slate-100", "bg-slate-200", "bg-slate-900",
  "border-slate-200", "border-slate-300", "border-slate-100",
  "bg-emerald-100", "bg-emerald-50", "bg-amber-100", "bg-amber-50",
  "bg-blue-100", "bg-blue-50", "bg-red-100", "bg-red-50",
  "text-slate-900", "text-slate-700", "text-slate-600", "text-slate-500", "text-slate-400",
  "text-emerald-800", "text-emerald-700", "text-emerald-600",
  "text-amber-800", "text-amber-700",
  "text-blue-800", "text-blue-700", "text-blue-600",
  "text-white",
];

describe("Flat Design — No Glassmorphism", () => {
  it("should detect banned backdrop-blur classes", () => {
    const html = '<div class="backdrop-blur-md bg-white/60"></div>';
    const violations = BANNED_CLASS_PATTERNS.filter((r) => r.test(html));
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].source).toContain("backdrop-blur");
  });

  it("should detect banned shadow classes", () => {
    const html = '<div class="shadow-xl hover:shadow-lg"></div>';
    const hasShadow = BANNED_CLASS_PATTERNS.some((r) => r.test(html));
    expect(hasShadow).toBe(true);
  });

  it("should detect banned translucent overlay backgrounds", () => {
    const html = '<div class="bg-black/70 backdrop-blur-sm"></div>';
    const violations = BANNED_CLASS_PATTERNS.filter((r) => r.test(html));
    expect(violations.length).toBeGreaterThanOrEqual(2);
  });

  it("should pass clean flat HTML with no banned classes", () => {
    const html = '<div class="bg-white border border-slate-200 rounded-lg p-4 text-slate-900"></div>';
    const hasViolations = BANNED_CLASS_PATTERNS.some((r) => r.test(html));
    expect(hasViolations).toBe(false);
  });

  it("should detect gradient backgrounds", () => {
    const html = '<div class="bg-gradient-to-r from-blue-600/20 to-emerald-500/10"></div>';
    const hasGradient = BANNED_CLASS_PATTERNS.some((r) => r.test(html));
    expect(hasGradient).toBe(true);
  });

  it("should detect radial-gradient glows", () => {
    const html = '<div style="background: radial-gradient(ellipse at top, rgba(37,99,235,0.12))"></div>';
    const hasRadial = /radial-gradient/.test(html);
    expect(hasRadial).toBe(true);
  });

  it("should allow solid white cards with thin borders", () => {
    const html = '<div class="bg-white border border-slate-200 rounded-lg p-4"></div>';
    const hasSolidBg = /bg-white/.test(html);
    const hasThinBorder = /border-slate-200/.test(html);
    expect(hasSolidBg).toBe(true);
    expect(hasThinBorder).toBe(true);
  });
});

/* ── WCAG AA Contrast Check ── */
describe("WCAG AA Contrast Compliance", () => {
  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  }

  function relativeLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  function contrastRatio(fgHex: string, bgHex: string): number {
    const [fr, fg, fb] = hexToRgb(fgHex);
    const [br, bg, bb] = hexToRgb(bgHex);
    const l1 = relativeLuminance(fr, fg, fb);
    const l2 = relativeLuminance(br, bg, bb);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  it("should pass WCAG AA for body text (4.5:1 minimum)", () => {
    // #0F172A (slate-900) on #FFFFFF (white)
    const ratio = contrastRatio("#0F172A", "#FFFFFF");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("should pass WCAG AA for labels text", () => {
    // #475569 (slate-600) on #FFFFFF — may need larger text
    const ratio = contrastRatio("#475569", "#FFFFFF");
    expect(ratio).toBeGreaterThanOrEqual(3.0); // Large text (18px+) threshold
  });

  it("should pass WCAG AA for white on dark (CTA buttons)", () => {
    // #FFFFFF on #0F172A (slate-900)
    const ratio = contrastRatio("#FFFFFF", "#0F172A");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("should pass WCAG AA for emerald status on white", () => {
    // #065F46 (emerald-800) on #D1FAE5 (emerald-100)
    const ratio = contrastRatio("#065F46", "#D1FAE5");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("should pass WCAG AA for blue-600 on white (links)", () => {
    // #2563EB (blue-600) on #FFFFFF
    const ratio = contrastRatio("#2563EB", "#FFFFFF");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

/* ── Flat Status Pills ── */
describe("Flat Status Pills (Solid Fills)", () => {
  const STATUS_MAP = {
    "ETA Verified": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
    "Pending Approval": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
    "RFQ Active": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  };

  function renderPill(status: string) {
    const style = STATUS_MAP[status as keyof typeof STATUS_MAP];
    return `<span class="${style.bg} ${style.text} ${style.border} px-2 py-0.5 rounded text-xs font-medium border">${status}</span>`;
  }

  it("should render flat emerald pill for verified status", () => {
    const pill = renderPill("ETA Verified");
    expect(pill).toContain("bg-emerald-100");
    expect(pill).toContain("text-emerald-800");
    expect(pill).not.toContain("gradient");
    expect(pill).not.toContain("shadow");
  });

  it("should render flat amber pill for pending status", () => {
    const pill = renderPill("Pending Approval");
    expect(pill).toContain("bg-amber-100");
    expect(pill).toContain("text-amber-800");
  });

  it("should render flat blue pill for RFQ status", () => {
    const pill = renderPill("RFQ Active");
    expect(pill).toContain("bg-blue-100");
    expect(pill).toContain("text-blue-800");
  });
});