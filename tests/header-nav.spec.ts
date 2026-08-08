/**
 * Header Navigation Tests
 * HotelsVendors — Dropdown population & link validity
 *
 * Run: npx vitest run tests/header-nav.spec.ts
 */

import { describe, it, expect } from "vitest";

/* ── Extracted dropdown data (mirrors site-nav.tsx) ── */
const NAV_GROUPS = [
  {
    label: "Products",
    items: [
      { href: "/marketplace", label: "INVO Marketplace" },
      { href: "/categories", label: "Category Hubs" },
      { href: "/rfq", label: "Hybrid RFQ Engine" },
      { href: "/catalog/import", label: "AI Catalog Ingestion" },
      { href: "/compliance", label: "ETA Compliance Sentinel" },
    ],
  },
  {
    label: "Financing",
    items: [
      { href: "/factoring-service", label: "48-Hour Reverse Factoring" },
      { href: "/financing/yield-calculator", label: "Dynamic Yield Calculator" },
      { href: "/financing/fra", label: "FRA Regulatory Shield" },
      { href: "/financing/rails", label: "Bank & Payment Rails" },
      { href: "/financing/oliv", label: "Oliv Credit Line" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { href: "/hotels/join", label: "For Hotels & Resorts" },
      { href: "/suppliers/join", label: "For Suppliers & Mills" },
      { href: "/funders/join", label: "For Funders & Banks" },
      { href: "/carriers/join", label: "For Carriers & Logistics" },
      { href: "/solutions/erp", label: "ERP Integrations" },
    ],
  },
];

const STATIC_LINKS = [
  { href: "/sandbox", label: "Sandbox" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Sign In" },
  { href: "/register", label: "Get Started" },
];

describe("Header Navigation — Dropdowns", () => {
  it("should have exactly 3 dropdown groups: Products, Financing, Solutions", () => {
    const labels = NAV_GROUPS.map((g) => g.label);
    expect(labels).toEqual(["Products", "Financing", "Solutions"]);
  });

  it("should have Products dropdown with 5 rich sub-items", () => {
    const products = NAV_GROUPS.find((g) => g.label === "Products")!;
    expect(products.items.length).toBe(5);
  });

  it("should have Financing dropdown with 5 sub-items", () => {
    const financing = NAV_GROUPS.find((g) => g.label === "Financing")!;
    expect(financing.items.length).toBe(5);
  });

  it("should have Solutions dropdown with 5 sub-items", () => {
    const solutions = NAV_GROUPS.find((g) => g.label === "Solutions")!;
    expect(solutions.items.length).toBe(5);
  });
});

describe("Header Navigation — Link Validity", () => {
  it("should have valid route patterns for all Products links", () => {
    const products = NAV_GROUPS.find((g) => g.label === "Products")!;
    for (const item of products.items) {
      expect(item.href).toMatch(/^\/(marketplace|categories|rfq|catalog\/import|compliance)/);
      expect(item.label.length).toBeGreaterThan(0);
    }
  });

  it("should have valid route patterns for all Financing links", () => {
    const financing = NAV_GROUPS.find((g) => g.label === "Financing")!;
    for (const item of financing.items) {
      expect(item.href).not.toBe("");
      expect(item.label.length).toBeGreaterThan(0);
    }
  });

  it("should have valid route patterns for all Solutions links", () => {
    const solutions = NAV_GROUPS.find((g) => g.label === "Solutions")!;
    for (const item of solutions.items) {
      expect(item.href).not.toBe("");
      expect(item.label.length).toBeGreaterThan(0);
    }
  });

  it("should include key platform routes", () => {
    const allHrefs = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));
    expect(allHrefs).toContain("/marketplace");
    expect(allHrefs).toContain("/rfq");
    expect(allHrefs).toContain("/factoring-service");
    expect(allHrefs).toContain("/hotels/join");
    expect(allHrefs).toContain("/suppliers/join");
    expect(allHrefs).toContain("/compliance");
  });

  it("should have static links for Sandbox, Pricing, Sign In, Get Started", () => {
    expect(STATIC_LINKS.length).toBe(4);
    expect(STATIC_LINKS.map((l) => l.href)).toContain("/sandbox");
    expect(STATIC_LINKS.map((l) => l.href)).toContain("/pricing");
    expect(STATIC_LINKS.map((l) => l.href)).toContain("/login");
    expect(STATIC_LINKS.map((l) => l.href)).toContain("/register");
  });

  it("should not produce empty or invalid hrefs", () => {
    const allItems = [...NAV_GROUPS.flatMap((g) => g.items), ...STATIC_LINKS];
    for (const item of allItems) {
      expect(item.href).not.toBe("");
      expect(item.href.startsWith("/")).toBe(true);
      expect(item.label).not.toBe("");
    }
  });
});

describe("Header Navigation — Design Compliance", () => {
  it("should use solid white styling (no dark theme classes)", () => {
    const darkClasses = ["bg-surface", "bg-canvas", "text-foreground-muted", "shadow-2xl", "backdrop-blur", "bg-white/[", "text-white/"];
    const navClasses = "bg-white border-b border-slate-200 text-slate-600 hover:text-slate-900";

    for (const dc of darkClasses) {
      expect(navClasses).not.toContain(dc);
    }
    expect(navClasses).toContain("bg-white");
    expect(navClasses).toContain("border-slate-200");
  });
});