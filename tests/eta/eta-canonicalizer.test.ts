/**
 * ETA Canonicalizer & Tax Code Integration Tests
 * Hotels Vendors Compliance Layer
 *
 * Tests the full ETA pipeline:
 *   1. Alphabetical canonical flattening
 *   2. Dual-language field support (EN/AR)
 *   3. Tax code enum pre-mapping (T1/V009, T4/W003)
 *   4. Full multi-sector procurement order payload validation
 *   5. SHA-256 digest determinism
 */

import { describe, it, expect, vi } from "vitest";

// ─── Mock prisma before importing any module that depends on it ──
vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: {
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue({}),
    },
    hotel: {
      findUnique: vi.fn(),
    },
    supplier: {
      findUnique: vi.fn(),
    },
    order: {
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue({}),
    },
    $transaction: vi.fn().mockImplementation(async (fn: (tx: unknown) => unknown) => {
      const tx = {
        invoice: { update: vi.fn().mockResolvedValue({}) },
        order: { update: vi.fn().mockResolvedValue({}) },
      };
      return fn(tx);
    }),
  },
}));

// ─── Imports (after mock) ────────────────────────────────────────

const {
  canonicalizeEtaPayload,
  toCanonicalString,
  assertCanonicalizable,
  buildDualField,
  applyDualLanguage,
} = await import("@/lib/eta/canonicalizer");

const {
  EtaTaxType,
  TAX_CODE_REGISTRY,
  HOSPITALITY_TAX_CODES,
  getTaxCode,
  getVatTaxCode,
  getWithholdingTaxCode,
  buildTaxableItem,
  buildTaxTotal,
  isValidTaxType,
  getTaxLabel,
} = await import("@/lib/eta/tax-codes");

const {
  EtaInvoicePayload,
  EtaInvoiceLine,
  EtaTaxpayer,
  EtaTaxableItem,
} = await import("@/lib/eta/types");

// ─── Test Fixtures ───────────────────────────────────────────────

const MOCK_HOTEL: EtaTaxpayer = {
  type: "B",
  id: "704226146",
  name: "Stella Di Mare Resort Sharm",
  address: {
    country: "EG",
    governate: "South Sinai",
    regionCity: "Sharm El-Sheikh",
    street: "Naama Bay",
    buildingNumber: "12",
  },
};

const MOCK_SUPPLIER: EtaTaxpayer = {
  type: "B",
  id: "1053009001",
  name: "Red Sea Fresh Foods Co.",
  address: {
    country: "EG",
    governate: "Cairo",
    regionCity: "Cairo",
    street: "Tahrir Street",
    buildingNumber: "45",
  },
};

const MOCK_INVOICE_LINES: EtaInvoiceLine[] = [
  {
    description: "Fresh Salmon Fillets — Premium Atlantic",
    descriptionAr: "فيليه سلمون طازج — أطلنطي فاخر",
    itemType: "GS1",
    itemCode: "GS1-6281001000011",
    codeName: "SALMON-FILLET",
    codeNameAr: "فيليه-سلمون",
    unitType: "KG",
    quantity: 50,
    internalCode: "FNB-001",
    salesTotal: 15000.0,
    total: 15000.0,
    valueDifference: 0,
    totalTaxableFees: 0,
    netTotal: 15000.0,
    itemsDiscount: 0,
    discount: { amount: 0 },
    taxableItems: [buildTaxableItem("T1" as EtaTaxType, 2100.0)],
  },
  {
    description: "Pool Chlorine Tablets — 20kg Drum",
    descriptionAr: "أقراص كلور المسبح — برميل 20 كجم",
    itemType: "EGS",
    itemCode: "EGS-CHEM-0042",
    codeName: "CHLORINE-TAB-20K",
    codeNameAr: "أقراص-كلور-20ك",
    unitType: "EA",
    quantity: 10,
    internalCode: "CONS-042",
    salesTotal: 8000.0,
    total: 8000.0,
    valueDifference: 0,
    totalTaxableFees: 0,
    netTotal: 8000.0,
    itemsDiscount: 0,
    discount: { amount: 0 },
    taxableItems: [buildTaxableItem("T1" as EtaTaxType, 1120.0)],
  },
  {
    description: "Egyptian Cotton Towels — Guest Room Set",
    descriptionAr: "مناشف قطن مصري — طقم غرفة الضيف",
    itemType: "EGS",
    itemCode: "EGS-LINEN-0100",
    codeName: "TOWEL-SET-EG",
    codeNameAr: "طقم-مناشف-مصري",
    unitType: "SET",
    quantity: 200,
    internalCode: "GST-100",
    salesTotal: 25000.0,
    total: 25000.0,
    valueDifference: 0,
    totalTaxableFees: 0,
    netTotal: 25000.0,
    itemsDiscount: 0,
    discount: { amount: 0 },
    taxableItems: [buildTaxableItem("T1" as EtaTaxType, 3500.0)],
  },
];

const MOCK_FULL_PAYLOAD: EtaInvoicePayload = {
  issuer: MOCK_SUPPLIER,
  receiver: MOCK_HOTEL,
  documentType: "I",
  documentTypeVersion: "1.0",
  dateIssued: "2026-06-12T00:00:00.000Z",
  internalId: "INV-2026-00042",
  purchaseOrderReference: "PO-SDSM-2026-00187",
  payment: { terms: "Net 30" },
  delivery: { approach: "By Truck", terms: "DAP" },
  invoiceLines: MOCK_INVOICE_LINES,
  totalSalesAmount: 48000.0,
  netAmount: 48000.0,
  taxTotals: [buildTaxTotal("T1" as EtaTaxType, 6720.0)],
  totalAmount: 54720.0,
};

// ─── Test Suites ─────────────────────────────────────────────────

describe("ETA Canonicalizer", () => {
  describe("canonicalizeEtaPayload", () => {
    it("should produce a non-empty canonical string from a full payload", () => {
      const result = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
      expect(result.canonicalString).toBeTruthy();
      expect(result.canonicalString.length).toBeGreaterThan(0);
    });

    it("should produce sorted entries (alphabetical by key)", () => {
      const result = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
      const keys = result.entries.map((e) => e.key);
      const sorted = [...keys].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      );
      expect(keys).toEqual(sorted);
    });

    it("should produce a valid SHA-256 digest (64 hex chars)", () => {
      const result = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
      expect(result.sha256Digest).toMatch(/^[0-9a-f]{64}$/);
    });

    it("should be deterministic — same input produces same digest", () => {
      const r1 = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
      const r2 = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
      expect(r1.sha256Digest).toBe(r2.sha256Digest);
      expect(r1.canonicalString).toBe(r2.canonicalString);
    });

    it("should produce different digests for different payloads", () => {
      const r1 = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
      const modifiedPayload = { ...MOCK_FULL_PAYLOAD, totalAmount: 99999.0 };
      const r2 = canonicalizeEtaPayload(modifiedPayload as unknown as Record<string, unknown>);
      expect(r1.sha256Digest).not.toBe(r2.sha256Digest);
    });

    it("should handle null and undefined values as empty strings", () => {
      const payload = { a: null, b: undefined, c: "hello" } as unknown as Record<string, unknown>;
      const result = canonicalizeEtaPayload(payload);
      const aEntry = result.entries.find((e) => e.key === "a");
      const bEntry = result.entries.find((e) => e.key === "b");
      expect(aEntry?.value).toBe("");
      expect(bEntry?.value).toBe("");
    });

    it("should handle nested objects", () => {
      const payload = {
        z_outer: { b_inner: 2, a_inner: 1 },
        a_outer: { d_inner: 4, c_inner: 3 },
      } as unknown as Record<string, unknown>;
      const result = canonicalizeEtaPayload(payload);
      const keys = result.entries.map((e) => e.key);
      // All keys should be dot-delimited
      expect(keys.some((k) => k.includes("."))).toBe(true);
      // Keys should be sorted alphabetically
      const sorted = [...keys].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      );
      expect(keys).toEqual(sorted);
    });

    it("should handle arrays with indexed keys", () => {
      const payload = {
        items: [{ name: "A" }, { name: "B" }],
      } as unknown as Record<string, unknown>;
      const result = canonicalizeEtaPayload(payload);
      const itemKeys = result.entries.filter((e) => e.key.startsWith("items."));
      expect(itemKeys.length).toBe(2);
      expect(itemKeys[0].key).toBe("items.0.name");
      expect(itemKeys[1].key).toBe("items.1.name");
    });

    it("should format numbers without scientific notation", () => {
      const payload = { tiny: 0.0001, large: 1234567.89 } as unknown as Record<string, unknown>;
      const result = canonicalizeEtaPayload(payload);
      const tinyEntry = result.entries.find((e) => e.key === "large");
      expect(tinyEntry?.value).not.toContain("e");
      expect(tinyEntry?.value).not.toContain("E");
    });

    it("should normalize ISO date strings", () => {
      const payload = { date: "2026-06-12T00:00:00.000Z" } as unknown as Record<string, unknown>;
      const result = canonicalizeEtaPayload(payload);
      const dateEntry = result.entries.find((e) => e.key === "date");
      expect(dateEntry?.value).toBe("2026-06-12T00:00:00.000Z");
    });
  });

  describe("toCanonicalString", () => {
    it("should return only the canonical string", () => {
      const str = toCanonicalString(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
      expect(typeof str).toBe("string");
      expect(str.length).toBeGreaterThan(0);
      expect(str).toContain("=");
    });
  });

  describe("assertCanonicalizable", () => {
    it("should not throw for a valid payload", () => {
      expect(() => {
        assertCanonicalizable(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
      }).not.toThrow();
    });

    it("should throw for an empty object", () => {
      expect(() => {
        assertCanonicalizable({});
      }).toThrow("empty");
    });
  });

  describe("Dual-language field helpers", () => {
    it("buildDualField should return both EN and AR fields", () => {
      const dual = buildDualField("Salmon Fillet", "فيليه سلمون");
      expect(dual.codeName).toBe("Salmon Fillet");
      expect(dual.codeNameAr).toBe("فيليه سلمون");
      expect(dual.description).toBe("Salmon Fillet");
      expect(dual.descriptionAr).toBe("فيليه سلمون");
    });

    it("applyDualLanguage should add descriptionAr to a line", () => {
      const line = { description: "Test Product", quantity: 10 } as Record<string, unknown>;
      const result = applyDualLanguage(line, "Test Product", "منتج تجريبي");
      expect(result.description).toBe("Test Product");
      expect(result.descriptionAr).toBe("منتج تجريبي");
      expect(result.quantity).toBe(10); // preserved
    });

    it("should handle Arabic text with special characters", () => {
      const dual = buildDualField("Pool Chlorine", "كلور المسبح — ٢٠ كجم");
      expect(dual.codeNameAr).toBe("كلور المسبح — ٢٠ كجم");
    });
  });
});

describe("ETA Tax Code Registry", () => {
  describe("T1 — Value Added Tax", () => {
    it("should have correct T1 details", () => {
      const t1 = getVatTaxCode();
      expect(t1.code).toBe("T1");
      expect(t1.labelEn).toBe("Value Added Tax");
      expect(t1.labelAr).toBe("ضريبه القيمه المضافه");
      expect(t1.subType).toBe("V009");
      expect(t1.defaultRate).toBe(14);
      expect(t1.activeForHospitality).toBe(true);
    });

    it("should be retrievable by code", () => {
      const t1 = getTaxCode("T1" as EtaTaxType);
      expect(t1.code).toBe("T1");
    });
  });

  describe("T4 — Withholding Tax", () => {
    it("should have correct T4 details", () => {
      const t4 = getWithholdingTaxCode();
      expect(t4.code).toBe("T4");
      expect(t4.labelEn).toBe("Withholding Tax");
      expect(t4.labelAr).toBe("الخصم تحت حساب الضريبه");
      expect(t4.subType).toBe("W003");
      expect(t4.defaultRate).toBe(5);
      expect(t4.activeForHospitality).toBe(true);
    });
  });

  describe("Hospitality-active tax codes", () => {
    it("should include T1 and T4 only", () => {
      expect(HOSPITALITY_TAX_CODES.length).toBe(2);
      expect(HOSPITALITY_TAX_CODES[0].code).toBe("T1");
      expect(HOSPITALITY_TAX_CODES[1].code).toBe("T4");
    });

    it("should all be marked active for hospitality", () => {
      HOSPITALITY_TAX_CODES.forEach((tc) => {
        expect(tc.activeForHospitality).toBe(true);
      });
    });
  });

  describe("buildTaxableItem", () => {
    it("should build a T1 taxable item with correct subType and rate", () => {
      const item = buildTaxableItem("T1" as EtaTaxType, 2100.0);
      expect(item.taxType).toBe("T1");
      expect(item.amount).toBe(2100.0);
      expect(item.subType).toBe("V009");
      expect(item.rate).toBe(14);
    });

    it("should build a T4 taxable item with correct subType and rate", () => {
      const item = buildTaxableItem("T4" as EtaTaxType, 500.0);
      expect(item.taxType).toBe("T4");
      expect(item.amount).toBe(500.0);
      expect(item.subType).toBe("W003");
      expect(item.rate).toBe(5);
    });

    it("should allow rate override", () => {
      const item = buildTaxableItem("T1" as EtaTaxType, 1000.0, 10);
      expect(item.rate).toBe(10);
    });
  });

  describe("buildTaxTotal", () => {
    it("should build a tax total entry", () => {
      const total = buildTaxTotal("T1" as EtaTaxType, 6720.0);
      expect(total.taxType).toBe("T1");
      expect(total.amount).toBe(6720.0);
    });
  });

  describe("isValidTaxType", () => {
    it("should return true for valid codes", () => {
      expect(isValidTaxType("T1")).toBe(true);
      expect(isValidTaxType("T4")).toBe(true);
      expect(isValidTaxType("T12")).toBe(true);
    });

    it("should return false for invalid codes", () => {
      expect(isValidTaxType("T13")).toBe(false);
      expect(isValidTaxType("VAT")).toBe(false);
      expect(isValidTaxType("")).toBe(false);
    });
  });

  describe("getTaxLabel", () => {
    it("should return English label by default", () => {
      expect(getTaxLabel("T1" as EtaTaxType)).toBe("Value Added Tax");
    });

    it("should return Arabic label when locale=ar", () => {
      expect(getTaxLabel("T1" as EtaTaxType, "ar")).toBe("ضريبه القيمه المضافه");
    });

    it("should return Arabic label for T4", () => {
      expect(getTaxLabel("T4" as EtaTaxType, "ar")).toBe("الخصم تحت حساب الضريبه");
    });
  });

  describe("All 12 tax types exist in registry", () => {
    it("should have entries for T1 through T12", () => {
      for (let i = 1; i <= 12; i++) {
        const code = `T${i}` as EtaTaxType;
        expect(TAX_CODE_REGISTRY[code]).toBeDefined();
        expect(TAX_CODE_REGISTRY[code].code).toBe(code);
        expect(TAX_CODE_REGISTRY[code].labelEn).toBeTruthy();
        expect(TAX_CODE_REGISTRY[code].labelAr).toBeTruthy();
        expect(TAX_CODE_REGISTRY[code].subType).toBeTruthy();
      }
    });
  });
});

describe("Multi-Sector Procurement Order — Full Payload Validation", () => {
  it("should canonicalize a full 3-sector invoice payload", () => {
    const result = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
    expect(result.entries.length).toBeGreaterThan(20); // many flattened fields
    expect(result.sha256Digest).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should include issuer and receiver tax IDs in canonical output", () => {
    const result = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
    const canonical = result.canonicalString;
    expect(canonical).toContain("704226146"); // hotel tax ID
    expect(canonical).toContain("1053009001"); // supplier tax ID
  });

  it("should include all invoice line descriptions (EN and AR)", () => {
    const result = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
    const canonical = result.canonicalString;
    // English descriptions
    expect(canonical).toContain("Fresh Salmon Fillets");
    expect(canonical).toContain("Pool Chlorine Tablets");
    expect(canonical).toContain("Egyptian Cotton Towels");
    // Arabic descriptions
    expect(canonical).toContain("فيليه سلمون طازج");
    expect(canonical).toContain("أقراص كلور المسبح");
    expect(canonical).toContain("مناشف قطن مصري");
  });

  it("should include tax type T1 in canonical output", () => {
    const result = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
    const canonical = result.canonicalString;
    expect(canonical).toContain("T1");
    expect(canonical).toContain("V009");
  });

  it("should include correct totals in canonical output", () => {
    const result = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
    const canonical = result.canonicalString;
    expect(canonical).toContain("48000"); // subtotal
    expect(canonical).toContain("54720"); // total with VAT
  });

  it("should include dual-language codeName fields", () => {
    const result = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
    const canonical = result.canonicalString;
    expect(canonical).toContain("SALMON-FILLET");
    expect(canonical).toContain("فيليه-سلمون");
    expect(canonical).toContain("CHLORINE-TAB-20K");
    expect(canonical).toContain("أقراص-كلور-20ك");
  });

  it("should produce a canonical string suitable for RSA signing (no trailing whitespace)", () => {
    const result = canonicalizeEtaPayload(MOCK_FULL_PAYLOAD as unknown as Record<string, unknown>);
    const lines = result.canonicalString.split("\n");
    for (const line of lines) {
      expect(line).not.toMatch(/\s+$/); // no trailing whitespace
      expect(line).toContain("="); // every line has key=value format
    }
  });

  it("should handle the full payload with all 3 product categories (F&B, Consumables, Guest Supplies)", () => {
    // Verify all 3 lines are present
    expect(MOCK_FULL_PAYLOAD.invoiceLines.length).toBe(3);

    // F&B line
    expect(MOCK_FULL_PAYLOAD.invoiceLines[0].itemCode).toBe("GS1-6281001000011");
    expect(MOCK_FULL_PAYLOAD.invoiceLines[0].salesTotal).toBe(15000.0);

    // Consumables line
    expect(MOCK_FULL_PAYLOAD.invoiceLines[1].itemCode).toBe("EGS-CHEM-0042");
    expect(MOCK_FULL_PAYLOAD.invoiceLines[1].salesTotal).toBe(8000.0);

    // Guest Supplies line
    expect(MOCK_FULL_PAYLOAD.invoiceLines[2].itemCode).toBe("EGS-LINEN-0100");
    expect(MOCK_FULL_PAYLOAD.invoiceLines[2].salesTotal).toBe(25000.0);

    // Total should match sum
    const lineTotal = MOCK_FULL_PAYLOAD.invoiceLines.reduce((sum, l) => sum + l.salesTotal, 0);
    expect(lineTotal).toBe(MOCK_FULL_PAYLOAD.totalSalesAmount);

    // VAT should be 14% of subtotal (allow 0.01 tolerance for float arithmetic)
    const expectedVat = MOCK_FULL_PAYLOAD.totalSalesAmount * 0.14;
    expect(Math.abs(MOCK_FULL_PAYLOAD.taxTotals[0].amount - expectedVat)).toBeLessThan(0.01);

    // Grand total
    expect(MOCK_FULL_PAYLOAD.totalAmount).toBe(MOCK_FULL_PAYLOAD.totalSalesAmount + expectedVat);
  });
});
