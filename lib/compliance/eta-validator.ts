/**
 * ETA Compliance Validator — Pre-Submission Rules
 * Hotels Vendors Compliance Layer
 *
 * Validates invoices against Egyptian Tax Authority e-invoicing requirements
 * before submission. All monetary math uses Prisma.Decimal — never Number.
 */

import { Prisma } from "@prisma/client";
import type { OrderItem, Product, Hotel, Supplier, Invoice, Order } from "@prisma/client";

// ─────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────

export interface InvoiceWithItems {
  id: string;
  invoiceNumber: string;
  codeName: string | null;
  codeNameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  subtotal: Prisma.Decimal;
  vatAmount: Prisma.Decimal;
  netPayable: Prisma.Decimal | null;
  total: Prisma.Decimal;
  status: string;
  etaStatus: string;
  issueDate: Date;
  orderId: string;
  hotelId: string;
  supplierId: string;
  tenantId: string;
  hotel: Hotel;
  supplier: Supplier;
  order: Order & {
    items: (OrderItem & { product: Product })[];
  };
}

export interface EtaValidationResult {
  valid: boolean;
  errors: string[];
}

export interface EtaPayload {
  issuer: {
    type: "B" | "P" | "F";
    id: string;
    name: string;
    address: {
      country: string;
      governate: string;
      regionCity: string;
      street: string;
      buildingNumber: string;
      postalCode?: string;
    };
  };
  receiver: {
    type: "B" | "P" | "F";
    id: string;
    name: string;
    address: {
      country: string;
      governate: string;
      regionCity: string;
      street: string;
      buildingNumber: string;
      postalCode?: string;
    };
  };
  documentType: "I" | "C" | "D";
  documentTypeVersion: "1.0";
  dateIssued: string;
  internalId: string;
  purchaseOrderReference?: string;
  payment: { terms: string };
  delivery: { approach: string; terms: string };
  invoiceLines: EtaPayloadLine[];
  totalSalesAmount: Prisma.Decimal;
  netAmount: Prisma.Decimal;
  taxTotals: { taxType: string; amount: Prisma.Decimal }[];
  totalAmount: Prisma.Decimal;
  digitalSignature?: string;
}

export interface EtaPayloadLine {
  description: string;
  descriptionAr: string;
  itemType: "GS1" | "EGS";
  itemCode: string;
  codeName: string;
  codeNameAr: string;
  unitType: string;
  quantity: number;
  internalCode: string;
  salesTotal: Prisma.Decimal;
  total: Prisma.Decimal;
  valueDifference: Prisma.Decimal;
  totalTaxableFees: Prisma.Decimal;
  netTotal: Prisma.Decimal;
  itemsDiscount: Prisma.Decimal;
  discount: { amount: Prisma.Decimal };
  taxableItems: {
    taxType: string;
    amount: Prisma.Decimal;
    subType: string;
    rate: number;
  }[];
}

// ─────────────────────────────────────────
// 2. VALIDATION CONSTANTS
// ─────────────────────────────────────────

const AMOUNT_TOLERANCE = new Prisma.Decimal("0.01");
const VAT_RATE = new Prisma.Decimal("14.00");
const HS_CODE_PATTERN = /^\d{4,10}$/;

// ─────────────────────────────────────────
// 3. VALIDATION FUNCTION
// ─────────────────────────────────────────

/**
 * Validate an invoice for ETA e-invoicing compliance.
 * Returns { valid: false, errors: [...] } with specific messages per failure.
 */
export function validateInvoiceForEta(invoice: InvoiceWithItems): EtaValidationResult {
  const errors: string[] = [];

  // Rule 1: Bilingual codeName must be present
  if (!invoice.codeName || invoice.codeName.trim().length === 0) {
    errors.push("codeName (English) is required for ETA submission");
  }
  if (!invoice.codeNameAr || invoice.codeNameAr.trim().length === 0) {
    errors.push("codeNameAr (Arabic) is required for ETA submission — اسم الكود مطلوب");
  }

  // Rule 2: Description must have both Arabic and English
  if (!invoice.description || invoice.description.trim().length === 0) {
    errors.push("description (English) is required for ETA submission");
  }
  if (!invoice.descriptionAr || invoice.descriptionAr.trim().length === 0) {
    errors.push("descriptionAr (Arabic) is required for ETA submission — الوصف مطلوب");
  }

  // Rule 3: Each item must have a valid HS code (on Product)
  if (!invoice.order.items || invoice.order.items.length === 0) {
    errors.push("Invoice must have at least one line item for ETA submission");
  } else {
    invoice.order.items.forEach((item, idx) => {
      const product = item.product as unknown as { hsCode?: string; name: string };
      if (!product.hsCode || !HS_CODE_PATTERN.test(product.hsCode)) {
        errors.push(
          `Line item ${idx + 1} (${product.name}): invalid or missing HS code. ` +
            "Must be 4-10 digits (Harmonized System code)."
        );
      }
    });
  }

  // Rule 4: Monetary validation — subtotal, vatAmount, netPayable > 0
  if (invoice.subtotal.lessThanOrEqualTo(0)) {
    errors.push(`subtotal must be > 0, got ${invoice.subtotal.toString()}`);
  }
  if (invoice.vatAmount.lessThanOrEqualTo(0)) {
    errors.push(`vatAmount must be > 0, got ${invoice.vatAmount.toString()}`);
  }
  if (!invoice.netPayable) {
    errors.push("netPayable is required for ETA submission");
  } else if (invoice.netPayable.lessThanOrEqualTo(0)) {
    errors.push(`netPayable must be > 0, got ${invoice.netPayable.toString()}`);
  } else {
    // Rule 4b: subtotal + vatAmount = netPayable (within 0.01 tolerance)
    const expectedNet = invoice.subtotal.add(invoice.vatAmount);
    const diff = expectedNet.sub(invoice.netPayable).abs();
    if (diff.greaterThan(AMOUNT_TOLERANCE)) {
      errors.push(
        `Amount mismatch: subtotal(${invoice.subtotal.toString()}) + vatAmount(${invoice.vatAmount.toString()}) = ${expectedNet.toString()}, but netPayable is ${invoice.netPayable.toString()}. Tolerance: ${AMOUNT_TOLERANCE.toString()} EGP`
      );
    }
  }

  // Rule 5: Supplier must have a tax registration number
  const supplier = invoice.supplier as unknown as { taxRegistrationNumber?: string; taxId: string; name: string };
  const supplierTaxReg =
    supplier.taxRegistrationNumber || supplier.taxId;
  if (!supplierTaxReg || supplierTaxReg.trim().length === 0) {
    errors.push(
      `Supplier '${supplier.name}' is missing a tax registration number. Required for ETA issuer.`
    );
  }

  // Rule 6: Hotel must have a tax registration number
  const hotel = invoice.hotel as unknown as { taxRegistrationNumber?: string; taxId: string; name: string };
  const hotelTaxReg =
    hotel.taxRegistrationNumber || hotel.taxId;
  if (!hotelTaxReg || hotelTaxReg.trim().length === 0) {
    errors.push(
      `Hotel '${hotel.name}' is missing a tax registration number. Required for ETA receiver.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ─────────────────────────────────────────
// 4. PAYLOAD GENERATION
// ─────────────────────────────────────────

/**
 * Transform an InvoiceWithItems into the exact JSON structure
 * the Egyptian Tax Authority e-invoicing API expects.
 *
 * All monetary values remain as Prisma.Decimal for precision.
 * The caller is responsible for converting to Number/String when
 * serializing for the HTTP request body.
 */
export function generateEtaPayload(invoice: InvoiceWithItems): EtaPayload {
  const vatRateNum = 14; // Standard VAT rate for hospitality goods in Egypt

  const invoiceLines: EtaPayloadLine[] = invoice.order.items.map((item) => {
    const lineTotal = item.total;
    const vatAmount = lineTotal
      .mul(new Prisma.Decimal(vatRateNum))
      .div(new Prisma.Decimal(100));

    return {
      description: invoice.description || item.product.name,
      descriptionAr: invoice.descriptionAr || item.product.name,
      itemType: "EGS",
      itemCode: item.product.sku,
      codeName: invoice.codeName || item.product.sku,
      codeNameAr: invoice.codeNameAr || item.product.sku,
      unitType: item.product.unitOfMeasure || "piece",
      quantity: item.quantity,
      internalCode: item.product.sku,
      salesTotal: lineTotal,
      total: lineTotal,
      valueDifference: new Prisma.Decimal(0),
      totalTaxableFees: new Prisma.Decimal(0),
      netTotal: lineTotal,
      itemsDiscount: new Prisma.Decimal(0),
      discount: { amount: new Prisma.Decimal(0) },
      taxableItems: [
        {
          taxType: "T1",
          amount: vatAmount,
          subType: "V009",
          rate: vatRateNum,
        },
      ],
    };
  });

  const supplier = invoice.supplier as unknown as { taxRegistrationNumber?: string; taxId: string; legalName?: string; name: string; governorate: string; city: string; address?: string };
  const hotel = invoice.hotel as unknown as { taxRegistrationNumber?: string; taxId: string; legalName?: string; name: string; governorate: string; city: string; address?: string };
  return {
    issuer: {
      type: "B",
      id: supplier.taxRegistrationNumber || supplier.taxId,
      name: supplier.legalName || supplier.name,
      address: {
        country: "EG",
        governate: supplier.governorate,
        regionCity: supplier.city,
        street: supplier.address || "Unknown",
        buildingNumber: "1",
      },
    },
    receiver: {
      type: "B",
      id: hotel.taxRegistrationNumber || hotel.taxId,
      name: hotel.legalName || hotel.name,
      address: {
        country: "EG",
        governate: hotel.governorate,
        regionCity: hotel.city,
        street: hotel.address || "Unknown",
        buildingNumber: "1",
      },
    },
    documentType: "I",
    documentTypeVersion: "1.0",
    dateIssued: invoice.issueDate.toISOString(),
    internalId: invoice.invoiceNumber,
    purchaseOrderReference: invoice.orderId,
    payment: { terms: "Net 30" },
    delivery: { approach: "By Truck", terms: "DAP" },
    invoiceLines,
    totalSalesAmount: invoice.subtotal,
    netAmount: invoice.subtotal,
    taxTotals: [
      {
        taxType: "T1",
        amount: invoice.vatAmount,
      },
    ],
    totalAmount: invoice.netPayable || invoice.total,
  };
}
