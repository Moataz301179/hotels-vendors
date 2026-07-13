/**
 * VAT Calculator — Egyptian Tax Law Compliance
 * Hotels Vendors Fintech Layer
 *
 * Validates and calculates VAT per Egyptian Tax Law:
 *   - Standard rate: 14% (Article 16, Value Added Tax Law No. 91 of 2016)
 *   - Zero-rated: 0% (exports, international transport, some agricultural inputs)
 *   - Exempt: specific categories (medical, educational, financial services)
 *
 * Validation rules:
 *   1. VAT rate must be one of the legally allowed rates
 *   2. VAT must be calculated on the correct base (subtotal before discounts)
 *   3. VAT amount = base × rate / 100
 *   4. Rounding: Egyptian tax law requires rounding to 2 decimal places
 */

import { z } from "zod";

// ─────────────────────────────────────────
// 1. EGYPTIAN VAT RATE DEFINITIONS
// ─────────────────────────────────────────

/**
 * Valid VAT rates under Egyptian Tax Law (Law No. 91 of 2016, Article 16).
 * The standard rate is 14%. Reduced rates and zero-rates apply to specific categories.
 */
export const EGYPTIAN_VAT_RATES = {
  /** Standard rate: 14% — applies to most goods and services */
  STANDARD: 14,
  /** Reduced rate: 5% — certain agricultural inputs, medical equipment */
  REDUCED: 5,
  /** Zero rate: 0% — exports, international transport, new residential construction */
  ZERO: 0,
  /** Exempt — specific categories (financial services, medical, educational) */
  EXEMPT: 0,
} as const;

/** All legally valid VAT rates in Egypt */
export const VALID_VAT_RATES: readonly number[] = [
  EGYPTIAN_VAT_RATES.STANDARD,
  EGYPTIAN_VAT_RATES.REDUCED,
  EGYPTIAN_VAT_RATES.ZERO,
] as const;

/**
 * VAT category descriptions for validation messages.
 */
export const VAT_CATEGORY_DESCRIPTIONS: Record<number, string> = {
  14: "Standard rate — most goods and services",
  5: "Reduced rate — agricultural inputs, medical equipment",
  0: "Zero-rated — exports, international transport, or exempt",
};

// ─────────────────────────────────────────
// 2. VALIDATION SCHEMAS
// ─────────────────────────────────────────

export const VatRateSchema = z
  .number()
  .refine(
    (rate) => VALID_VAT_RATES.includes(rate),
    {
      message: `Invalid VAT rate. Egyptian law allows only: ${VALID_VAT_RATES.join(", ")}%`,
    }
  );

export const VatCalculationInputSchema = z.object({
  subtotal: z
    .number()
    .positive("Subtotal must be positive")
    .finite("Subtotal must be a finite number"),
  vatRate: VatRateSchema,
  /** Optional: line-item level overrides for mixed-rate invoices */
  items: z
    .array(
      z.object({
        description: z.string(),
        quantity: z.number().positive(),
        unitPrice: z.number().min(0),
        vatRate: VatRateSchema,
      })
    )
    .optional(),
});

export type VatCalculationInput = z.infer<typeof VatCalculationInputSchema>;

export interface VatCalculationResult {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  compliant: boolean;
  warnings: string[];
}

// ─────────────────────────────────────────
// 3. VAT CALCULATION ENGINE
// ─────────────────────────────────────────

/**
 * Calculate VAT amount per Egyptian Tax Law.
 *
 * Rules:
 *   - VAT is calculated on the subtotal (before VAT)
 *   - Round to 2 decimal places (Egyptian convention)
 *   - Validate rate is legally allowed
 *   - Flag if standard rate is not applied to standard-rated items
 */
export function calculateVat(params: {
  subtotal: number;
  vatRate: number;
  currency?: string;
}): VatCalculationResult {
  const { subtotal, vatRate, currency = "EGP" } = params;
  const warnings: string[] = [];

  // Validate rate
  if (!VALID_VAT_RATES.includes(vatRate)) {
    warnings.push(
      `Invalid VAT rate ${vatRate}%. Egyptian law allows only: ${VALID_VAT_RATES.join(", ")}%. Using 14% as default.`
    );
  }

  const effectiveRate = VALID_VAT_RATES.includes(vatRate) ? vatRate : 14;

  // Calculate VAT: base × rate / 100
  const vatAmount = Math.round(subtotal * effectiveRate * 100) / 10000;

  // Total = subtotal + VAT
  const total = Math.round((subtotal + vatAmount) * 100) / 100;

  // Flag if non-standard rate is used without justification
  if (effectiveRate !== 14 && effectiveRate !== 0) {
    warnings.push(
      `Non-standard VAT rate (${effectiveRate}%) applied. Ensure this is justified under Egyptian tax law.`
    );
  }

  if (effectiveRate === 0 && subtotal > 0) {
    warnings.push(
      "Zero-rated VAT applied. Verify this invoice qualifies for zero-rating under Egyptian tax law (e.g., exports, international transport)."
    );
  }

  return {
    subtotal,
    vatRate: effectiveRate,
    vatAmount,
    total,
    currency,
    compliant: warnings.length === 0,
    warnings,
  };
}

/**
 * Calculate VAT with line-item granularity (for mixed-rate invoices).
 * Each line item can have its own VAT rate.
 */
export function calculateVatByItems(params: {
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
  }>;
  currency?: string;
}): VatCalculationResult & {
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    vatRate: number;
    vatAmount: number;
  }>;
} {
  const { items, currency = "EGP" } = params;
  const warnings: string[] = [];
  let totalSubtotal = 0;
  let totalVat = 0;

  const lineItems = items.map((item) => {
    const lineTotal = Math.round(item.quantity * item.unitPrice * 100) / 100;

    if (!VALID_VAT_RATES.includes(item.vatRate)) {
      warnings.push(
        `Item "${item.description}" has invalid VAT rate ${item.vatRate}%. Using 14%.`
      );
    }

    const effectiveRate = VALID_VAT_RATES.includes(item.vatRate) ? item.vatRate : 14;
    const lineVat = Math.round(lineTotal * effectiveRate * 100) / 10000;

    totalSubtotal += lineTotal;
    totalVat += lineVat;

    return {
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal,
      vatRate: effectiveRate,
      vatAmount: lineVat,
    };
  });

  const subtotal = Math.round(totalSubtotal * 100) / 100;
  const vatAmount = Math.round(totalVat * 100) / 100;
  const total = Math.round((subtotal + vatAmount) * 100) / 100;

  return {
    subtotal,
    vatRate: 14, // Effective combined rate (for display)
    vatAmount,
    total,
    currency,
    compliant: warnings.length === 0,
    warnings,
    lineItems,
  };
}

// ─────────────────────────────────────────
// 4. INVOICE-LEVEL VALIDATION
// ─────────────────────────────────────────

/**
 * Validate that an invoice's VAT fields are correct per Egyptian tax law.
 * Used before ETA submission.
 */
export function validateInvoiceVat(params: {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}): { valid: boolean; errors: string[] } {
  const { subtotal, vatRate, vatAmount, total } = params;
  const errors: string[] = [];

  // 1. Validate rate
  if (!VALID_VAT_RATES.includes(vatRate)) {
    errors.push(
      `Invalid VAT rate: ${vatRate}%. Allowed: ${VALID_VAT_RATES.join(", ")}%`
    );
  }

  // 2. Recalculate and compare
  const expectedVat = Math.round(subtotal * vatRate * 100) / 10000;
  const tolerance = 0.02; // EGP 0.02 tolerance for rounding

  if (Math.abs(vatAmount - expectedVat) > tolerance) {
    errors.push(
      `VAT amount mismatch: expected ${expectedVat.toFixed(2)}, got ${vatAmount.toFixed(2)}`
    );
  }

  // 3. Validate total = subtotal + vatAmount
  const expectedTotal = Math.round((subtotal + vatAmount) * 100) / 100;
  if (Math.abs(total - expectedTotal) > tolerance) {
    errors.push(
      `Total mismatch: expected ${expectedTotal.toFixed(2)}, got ${total.toFixed(2)}`
    );
  }

  // 4. Sanity checks
  if (subtotal <= 0) {
    errors.push("Subtotal must be positive");
  }
  if (vatAmount < 0) {
    errors.push("VAT amount cannot be negative");
  }
  if (total <= 0) {
    errors.push("Total must be positive");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
