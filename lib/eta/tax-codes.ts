/**
 * ETA Tax Code Registry — Pre-Mapped Enum Constants
 * Hotels Vendors Compliance Layer
 *
 * Pre-mapped Egyptian Tax Authority tax code enums with bilingual labels
 * and ETA sub-type codes. Used across invoice generation, canonicalization,
 * and ETA submission payloads.
 *
 * Source: ETA e-invoicing V2 API specification
 */

// ─── Tax Code Types ────────────────────────────────────────────---

/**
 * All 12 ETA tax types.
 * T1 (VAT) and T4 (Withholding) are the primary codes for hospitality procurement.
 */
export const EtaTaxType = {
  T1: "T1",   // Value Added Tax — ضريبه القيمه المضافه
  T2: "T2",   // Table Tax (Percentage) — ضريبه الجدول (نسبي)
  T3: "T3",   // Table Tax (Fixed) — ضريبه الجدول (قطعي)
  T4: "T4",   // Withholding Tax — الخصم تحت حساب الضريبه
  T5: "T5",   // Stamping Tax (Percentage) — ضريبه الدمغه (نسبي)
  T6: "T6",   // Stamping Tax (Fixed) — ضريبه الدمغه (قطعي)
  T7: "T7",   // Entertainment Tax — ضريبه الملاهي
  T8: "T8",   // Resource Development Fee — رسم تنميه الموارد
  T9: "T9",   // Service Charges — رسوم خدمات
  T10: "T10", // Municipality Fees — رسوم محليه
  T11: "T11", // Medical Insurance Fee — رسم التامين الصحي
  T12: "T12", // Other Fees — رسوم أخرى
} as const;

export type EtaTaxType = (typeof EtaTaxType)[keyof typeof EtaTaxType];

// ─── Tax Code Detail ─────────────────────────────────────────────

export interface TaxCodeDetail {
  /** ETA tax type code (T1–T12) */
  code: EtaTaxType;
  /** Human-readable name (English) */
  labelEn: string;
  /** Human-readable name (Arabic) */
  labelAr: string;
  /** ETA sub-type code (e.g., V009, W003) */
  subType: string;
  /** Default rate as percentage (0–100) */
  defaultRate: number;
  /** Whether this tax type is active for hospitality procurement */
  activeForHospitality: boolean;
}

// ─── Pre-Mapped Tax Code Registry ────────────────────────────────

/**
 * Canonical tax code registry.
 * T1 (VAT) and T4 (Withholding) are the primary codes for hotel procurement.
 */
export const TAX_CODE_REGISTRY: Record<EtaTaxType, TaxCodeDetail> = {
  [EtaTaxType.T1]: {
    code: "T1",
    labelEn: "Value Added Tax",
    labelAr: "ضريبه القيمه المضافه",
    subType: "V009", // VAT — General Goods/Services
    defaultRate: 14,
    activeForHospitality: true,
  },
  [EtaTaxType.T2]: {
    code: "T2",
    labelEn: "Table Tax (Percentage)",
    labelAr: "ضريبه الجدول (نسبي)",
    subType: "TBL01",
    defaultRate: 0,
    activeForHospitality: false,
  },
  [EtaTaxType.T3]: {
    code: "T3",
    labelEn: "Table Tax (Fixed)",
    labelAr: "ضريبه الجدول (قطعي)",
    subType: "TBL02",
    defaultRate: 0,
    activeForHospitality: false,
  },
  [EtaTaxType.T4]: {
    code: "T4",
    labelEn: "Withholding Tax",
    labelAr: "الخصم تحت حساب الضريبه",
    subType: "W003", // Withholding — Services
    defaultRate: 5,
    activeForHospitality: true,
  },
  [EtaTaxType.T5]: {
    code: "T5",
    labelEn: "Stamping Tax (Percentage)",
    labelAr: "ضريبه الدمغه (نسبي)",
    subType: "SD01",
    defaultRate: 0,
    activeForHospitality: false,
  },
  [EtaTaxType.T6]: {
    code: "T6",
    labelEn: "Stamping Tax (Fixed)",
    labelAr: "ضريبه الدمغه (قطعي)",
    subType: "SD02",
    defaultRate: 0,
    activeForHospitality: false,
  },
  [EtaTaxType.T7]: {
    code: "T7",
    labelEn: "Entertainment Tax",
    labelAr: "ضريبه الملاهي",
    subType: "ENT01",
    defaultRate: 0,
    activeForHospitality: false,
  },
  [EtaTaxType.T8]: {
    code: "T8",
    labelEn: "Resource Development Fee",
    labelAr: "رسم تنميه الموارد",
    subType: "RD01",
    defaultRate: 0,
    activeForHospitality: false,
  },
  [EtaTaxType.T9]: {
    code: "T9",
    labelEn: "Service Charges",
    labelAr: "رسوم خدمات",
    subType: "SC01",
    defaultRate: 0,
    activeForHospitality: false,
  },
  [EtaTaxType.T10]: {
    code: "T10",
    labelEn: "Municipality Fees",
    labelAr: "رسوم محليه",
    subType: "MF01",
    defaultRate: 0,
    activeForHospitality: false,
  },
  [EtaTaxType.T11]: {
    code: "T11",
    labelEn: "Medical Insurance Fee",
    labelAr: "رسم التامين الصحي",
    subType: "MI01",
    defaultRate: 0,
    activeForHospitality: false,
  },
  [EtaTaxType.T12]: {
    code: "T12",
    labelEn: "Other Fees",
    labelAr: "رسوم أخرى",
    subType: "OF01",
    defaultRate: 0,
    activeForHospitality: false,
  },
};

// ─── Hospitality-Active Tax Codes ────────────────────────────────

/**
 * Tax codes active for hospitality procurement.
 * Currently: T1 (VAT at 14%) and T4 (Withholding at 5%).
 */
export const HOSPITALITY_TAX_CODES: TaxCodeDetail[] = [
  TAX_CODE_REGISTRY[EtaTaxType.T1],
  TAX_CODE_REGISTRY[EtaTaxType.T4],
];

// ─── Helper Functions ────────────────────────────────────────────

/**
 * Look up a tax code detail by ETA tax type code.
 */
export function getTaxCode(code: EtaTaxType): TaxCodeDetail {
  return TAX_CODE_REGISTRY[code];
}

/**
 * Get the T1 (VAT) tax code detail — the default for hospitality invoices.
 */
export function getVatTaxCode(): TaxCodeDetail {
  return TAX_CODE_REGISTRY[EtaTaxType.T1];
}

/**
 * Get the T4 (Withholding) tax code detail.
 */
export function getWithholdingTaxCode(): TaxCodeDetail {
  return TAX_CODE_REGISTRY[EtaTaxType.T4];
}

/**
 * Build a taxable item for an ETA invoice line.
 * Pre-fills subType and rate from the registry.
 */
export function buildTaxableItem(
  taxType: EtaTaxType,
  amount: number,
  overrideRate?: number
): {
  taxType: EtaTaxType;
  amount: number;
  subType: string;
  rate: number;
} {
  const detail = TAX_CODE_REGISTRY[taxType];
  return {
    taxType: detail.code,
    amount,
    subType: detail.subType,
    rate: overrideRate ?? detail.defaultRate,
  };
}

/**
 * Build a tax total entry for the ETA invoice summary.
 */
export function buildTaxTotal(
  taxType: EtaTaxType,
  amount: number
): {
  taxType: EtaTaxType;
  amount: number;
} {
  return {
    taxType: TAX_CODE_REGISTRY[taxType].code,
    amount,
  };
}

/**
 * Validate that a tax type code is one of the 12 valid ETA codes.
 */
export function isValidTaxType(code: string): code is EtaTaxType {
  return code in TAX_CODE_REGISTRY;
}

/**
 * Get bilingual label for a tax type.
 * @param code - ETA tax type code (e.g., "T1")
 * @param locale - "en" | "ar"
 */
export function getTaxLabel(code: EtaTaxType, locale: "en" | "ar" = "en"): string {
  const detail = TAX_CODE_REGISTRY[code];
  return locale === "ar" ? detail.labelAr : detail.labelEn;
}
