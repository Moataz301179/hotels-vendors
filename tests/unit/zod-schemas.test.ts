import { describe, it, expect } from "vitest";
import {
  HotelCreateSchema,
  HotelUpdateSchema,
  UserCreateSchema,
  UserUpdateSchema,
  SupplierCreateSchema,
  SupplierUpdateSchema,
  ProductCreateSchema,
  ProductUpdateSchema,
  OrderItemSchema,
  OrderCreateSchema,
  InvoiceCreateSchema,
  AuthorityRuleSchema,
  CartItemCreateSchema,
  CartCheckoutSchema,
  EtaSubmissionSchema,
  FactoringCompanySchema,
  CreditFacilityCreateSchema,
  CreditFacilityUpdateSchema,
  OutletCreateSchema,
  OutletUpdateSchema,
  TripCreateSchema,
  TripUpdateSchema,
  TripStopCreateSchema,
  SupplierAuditCreateSchema,
  SupplierAuditUpdateSchema,
  RegisterSchema,
  BusinessRegisterSchema,
  LoginSchema,
  PaginationSchema,
} from "@/lib/zod";

const cuid = "clx1234567890abcdefg";

function cuidStr(): string {
  return cuid;
}

// ─── HotelCreateSchema ───

describe("HotelCreateSchema", () => {
  it("accepts valid hotel data", () => {
    const result = HotelCreateSchema.safeParse({
      name: "Grand Nile Hotel",
      taxId: "123-456-789",
      city: "Cairo",
      governorate: "Cairo",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name < 2 chars", () => {
    const result = HotelCreateSchema.safeParse({
      name: "A",
      taxId: "123-456-789",
      city: "Cairo",
      governorate: "Cairo",
    });
    expect(result.success).toBe(false);
  });

  it("rejects taxId < 3 chars", () => {
    const result = HotelCreateSchema.safeParse({
      name: "Grand Nile",
      taxId: "AB",
      city: "Cairo",
      governorate: "Cairo",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing city", () => {
    const result = HotelCreateSchema.safeParse({
      name: "Grand Nile",
      taxId: "123-456-789",
      governorate: "Cairo",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing governorate", () => {
    const result = HotelCreateSchema.safeParse({
      name: "Grand Nile",
      taxId: "123-456-789",
      city: "Cairo",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = HotelCreateSchema.safeParse({
      name: "Grand Nile Hotel",
      legalName: "Grand Nile LLC",
      taxId: "123-456-789",
      commercialReg: "CR-123",
      address: "123 Nile St",
      city: "Cairo",
      governorate: "Cairo",
      phone: "+201234567890",
      email: "info@grandnile.com",
      starRating: 5,
      roomCount: 200,
      creditLimit: 100000,
    });
    expect(result.success).toBe(true);
  });

  it("defaults tier to CORE", () => {
    const result = HotelCreateSchema.safeParse({
      name: "Grand Nile",
      taxId: "123-456-789",
      city: "Cairo",
      governorate: "Cairo",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tier).toBe("CORE");
    }
  });

  it("rejects starRating > 7", () => {
    const result = HotelCreateSchema.safeParse({
      name: "Grand Nile",
      taxId: "123-456-789",
      city: "Cairo",
      governorate: "Cairo",
      starRating: 8,
    });
    expect(result.success).toBe(false);
  });

  it("rejects starRating < 1", () => {
    const result = HotelCreateSchema.safeParse({
      name: "Grand Nile",
      taxId: "123-456-789",
      city: "Cairo",
      governorate: "Cairo",
      starRating: 0,
    });
    expect(result.success).toBe(false);
  });
});

// ─── HotelUpdateSchema ───

describe("HotelUpdateSchema", () => {
  it("accepts partial update", () => {
    const result = HotelUpdateSchema.safeParse({ name: "Updated Name" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = HotelUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

// ─── UserCreateSchema ───

describe("UserCreateSchema", () => {
  it("accepts valid user data", () => {
    const result = UserCreateSchema.safeParse({
      email: "user@hotel.com",
      name: "Ahmed Hassan",
      roleId: cuidStr(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = UserCreateSchema.safeParse({
      email: "not-an-email",
      name: "Ahmed",
      roleId: cuidStr(),
    });
    expect(result.success).toBe(false);
  });

  it("rejects name < 2 chars", () => {
    const result = UserCreateSchema.safeParse({
      email: "a@b.com",
      name: "A",
      roleId: cuidStr(),
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing roleId", () => {
    const result = UserCreateSchema.safeParse({
      email: "a@b.com",
      name: "Ahmed",
    });
    expect(result.success).toBe(false);
  });

  it("defaults role to DEPARTMENT_HEAD", () => {
    const result = UserCreateSchema.safeParse({
      email: "user@hotel.com",
      name: "Ahmed",
      roleId: cuidStr(),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe("DEPARTMENT_HEAD");
    }
  });

  it("defaults canOverride to false", () => {
    const result = UserCreateSchema.safeParse({
      email: "user@hotel.com",
      name: "Ahmed",
      roleId: cuidStr(),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.canOverride).toBe(false);
    }
  });

  it("accepts optional hotelId and supplierId", () => {
    const result = UserCreateSchema.safeParse({
      email: "user@hotel.com",
      name: "Ahmed",
      roleId: cuidStr(),
      hotelId: cuidStr(),
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(true);
  });
});

// ─── UserUpdateSchema ───

describe("UserUpdateSchema", () => {
  it("accepts partial update", () => {
    const result = UserUpdateSchema.safeParse({ name: "Updated" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = UserUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

// ─── SupplierCreateSchema ───

describe("SupplierCreateSchema", () => {
  it("accepts valid supplier data", () => {
    const result = SupplierCreateSchema.safeParse({
      name: "Cairo Foods Co",
      taxId: "987-654-321",
      city: "6th October",
      governorate: "Giza",
      email: "info@cairofoods.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name < 2 chars", () => {
    const result = SupplierCreateSchema.safeParse({
      name: "C",
      taxId: "987-654-321",
      city: "6th October",
      governorate: "Giza",
      email: "info@cairofoods.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = SupplierCreateSchema.safeParse({
      name: "Cairo Foods",
      taxId: "987-654-321",
      city: "6th October",
      governorate: "Giza",
      email: "bad-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing city", () => {
    const result = SupplierCreateSchema.safeParse({
      name: "Cairo Foods",
      taxId: "987-654-321",
      governorate: "Giza",
      email: "info@cairofoods.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid website URL", () => {
    const result = SupplierCreateSchema.safeParse({
      name: "Cairo Foods",
      taxId: "987-654-321",
      city: "6th October",
      governorate: "Giza",
      email: "info@cairofoods.com",
      website: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid website URL", () => {
    const result = SupplierCreateSchema.safeParse({
      name: "Cairo Foods",
      taxId: "987-654-321",
      city: "6th October",
      governorate: "Giza",
      email: "info@cairofoods.com",
      website: "https://cairofoods.com",
    });
    expect(result.success).toBe(true);
  });
});

// ─── SupplierUpdateSchema ───

describe("SupplierUpdateSchema", () => {
  it("accepts partial update", () => {
    const result = SupplierUpdateSchema.safeParse({ name: "Updated Supplier" });
    expect(result.success).toBe(true);
  });
});

// ─── ProductCreateSchema ───

describe("ProductCreateSchema", () => {
  it("accepts valid product data", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "HB-001",
      name: "Hand Soap 500ml",
      category: "F_AND_B",
      unitPrice: 25.5,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects SKU < 2 chars", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "H",
      name: "Hand Soap",
      category: "F_AND_B",
      unitPrice: 25.5,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative unitPrice", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "HB-001",
      name: "Hand Soap",
      category: "F_AND_B",
      unitPrice: -5,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero unitPrice", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "HB-001",
      name: "Hand Soap",
      category: "F_AND_B",
      unitPrice: 0,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing category", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "HB-001",
      name: "Hand Soap",
      unitPrice: 25.5,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(false);
  });

  it("defaults currency to EGP", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "HB-001",
      name: "Hand Soap",
      category: "F_AND_B",
      unitPrice: 25.5,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currency).toBe("EGP");
    }
  });

  it("defaults stockQuantity to 0", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "HB-001",
      name: "Hand Soap",
      category: "F_AND_B",
      unitPrice: 25.5,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stockQuantity).toBe(0);
    }
  });

  it("defaults minOrderQty to 1", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "HB-001",
      name: "Hand Soap",
      category: "F_AND_B",
      unitPrice: 25.5,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.minOrderQty).toBe(1);
    }
  });

  it("defaults unitOfMeasure to piece", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "HB-001",
      name: "Hand Soap",
      category: "F_AND_B",
      unitPrice: 25.5,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.unitOfMeasure).toBe("piece");
    }
  });

  it("rejects negative stockQuantity", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "HB-001",
      name: "Hand Soap",
      category: "F_AND_B",
      unitPrice: 25.5,
      stockQuantity: -1,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(false);
  });

  it("rejects minOrderQty < 1", () => {
    const result = ProductCreateSchema.safeParse({
      sku: "HB-001",
      name: "Hand Soap",
      category: "F_AND_B",
      unitPrice: 25.5,
      minOrderQty: 0,
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(false);
  });
});

// ─── ProductUpdateSchema ───

describe("ProductUpdateSchema", () => {
  it("accepts partial update", () => {
    const result = ProductUpdateSchema.safeParse({ name: "Updated Product" });
    expect(result.success).toBe(true);
  });
});

// ─── OrderItemSchema ───

describe("OrderItemSchema", () => {
  it("accepts valid order item", () => {
    const result = OrderItemSchema.safeParse({
      productId: cuidStr(),
      quantity: 10,
      unitPrice: 25.5,
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero quantity", () => {
    const result = OrderItemSchema.safeParse({
      productId: cuidStr(),
      quantity: 0,
      unitPrice: 25.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative unitPrice", () => {
    const result = OrderItemSchema.safeParse({
      productId: cuidStr(),
      quantity: 10,
      unitPrice: -5,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional notes", () => {
    const result = OrderItemSchema.safeParse({
      productId: cuidStr(),
      quantity: 10,
      unitPrice: 25.5,
      notes: "Handle with care",
    });
    expect(result.success).toBe(true);
  });
});

// ─── OrderCreateSchema ───

describe("OrderCreateSchema", () => {
  it("accepts valid order with items", () => {
    const result = OrderCreateSchema.safeParse({
      orderNumber: "PO-2026-001",
      supplierId: cuidStr(),
      items: [
        { productId: cuidStr(), quantity: 10, unitPrice: 25.5 },
        { productId: cuidStr(), quantity: 5, unitPrice: 12.0 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty items array", () => {
    const result = OrderCreateSchema.safeParse({
      orderNumber: "PO-2026-001",
      supplierId: cuidStr(),
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing orderNumber", () => {
    const result = OrderCreateSchema.safeParse({
      supplierId: cuidStr(),
      items: [{ productId: cuidStr(), quantity: 1, unitPrice: 10 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty orderNumber", () => {
    const result = OrderCreateSchema.safeParse({
      orderNumber: "",
      supplierId: cuidStr(),
      items: [{ productId: cuidStr(), quantity: 1, unitPrice: 10 }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid ISO datetime for deliveryDate", () => {
    const result = OrderCreateSchema.safeParse({
      orderNumber: "PO-2026-001",
      supplierId: cuidStr(),
      items: [{ productId: cuidStr(), quantity: 1, unitPrice: 10 }],
      deliveryDate: "2026-08-01T12:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid datetime format", () => {
    const result = OrderCreateSchema.safeParse({
      orderNumber: "PO-2026-001",
      supplierId: cuidStr(),
      items: [{ productId: cuidStr(), quantity: 1, unitPrice: 10 }],
      deliveryDate: "not-a-date",
    });
    expect(result.success).toBe(false);
  });
});

// ─── InvoiceCreateSchema ───

describe("InvoiceCreateSchema", () => {
  it("accepts valid invoice data", () => {
    const result = InvoiceCreateSchema.safeParse({
      invoiceNumber: "INV-2026-001",
      orderId: cuidStr(),
      hotelId: cuidStr(),
      supplierId: cuidStr(),
      subtotal: 1000,
      vatAmount: 140,
      total: 1140,
      issueDate: "2026-07-27T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("defaults vatRate to 14", () => {
    const result = InvoiceCreateSchema.safeParse({
      invoiceNumber: "INV-2026-001",
      orderId: cuidStr(),
      hotelId: cuidStr(),
      supplierId: cuidStr(),
      subtotal: 1000,
      vatAmount: 140,
      total: 1140,
      issueDate: "2026-07-27T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.vatRate).toBe(14);
    }
  });

  it("rejects negative subtotal", () => {
    const result = InvoiceCreateSchema.safeParse({
      invoiceNumber: "INV-2026-001",
      orderId: cuidStr(),
      hotelId: cuidStr(),
      supplierId: cuidStr(),
      subtotal: -100,
      vatAmount: 14,
      total: 86,
      issueDate: "2026-07-27T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero total", () => {
    const result = InvoiceCreateSchema.safeParse({
      invoiceNumber: "INV-2026-001",
      orderId: cuidStr(),
      hotelId: cuidStr(),
      supplierId: cuidStr(),
      subtotal: 0,
      vatAmount: 0,
      total: 0,
      issueDate: "2026-07-27T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing invoiceNumber", () => {
    const result = InvoiceCreateSchema.safeParse({
      orderId: cuidStr(),
      hotelId: cuidStr(),
      supplierId: cuidStr(),
      subtotal: 1000,
      vatAmount: 140,
      total: 1140,
      issueDate: "2026-07-27T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid issueDate", () => {
    const result = InvoiceCreateSchema.safeParse({
      invoiceNumber: "INV-2026-001",
      orderId: cuidStr(),
      hotelId: cuidStr(),
      supplierId: cuidStr(),
      subtotal: 1000,
      vatAmount: 140,
      total: 1140,
      issueDate: "not-a-date",
    });
    expect(result.success).toBe(false);
  });
});

// ─── AuthorityRuleSchema ───

describe("AuthorityRuleSchema", () => {
  it("accepts valid authority rule", () => {
    const result = AuthorityRuleSchema.safeParse({
      role: "DEPARTMENT_HEAD",
      minValue: 0,
      maxValue: 50000,
      category: "HOUSEKEEPING",
      supplierTier: "TIER_1",
      action: "APPROVE",
    });
    expect(result.success).toBe(true);
  });

  it("defaults priority to 0", () => {
    const result = AuthorityRuleSchema.safeParse({
      role: "DEPARTMENT_HEAD",
      minValue: 0,
      maxValue: 50000,
      category: "HOUSEKEEPING",
      supplierTier: "TIER_1",
      action: "APPROVE",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priority).toBe(0);
    }
  });

  it("rejects negative minValue", () => {
    const result = AuthorityRuleSchema.safeParse({
      role: "DEPARTMENT_HEAD",
      minValue: -1,
      maxValue: 50000,
      category: "HOUSEKEEPING",
      supplierTier: "TIER_1",
      action: "APPROVE",
    });
    expect(result.success).toBe(false);
  });

  it("accepts zero minValue", () => {
    const result = AuthorityRuleSchema.safeParse({
      role: "DEPARTMENT_HEAD",
      minValue: 0,
      maxValue: 50000,
      category: "HOUSEKEEPING",
      supplierTier: "TIER_1",
      action: "APPROVE",
    });
    expect(result.success).toBe(true);
  });
});

// ─── CartItemCreateSchema ───

describe("CartItemCreateSchema", () => {
  it("accepts valid cart item", () => {
    const result = CartItemCreateSchema.safeParse({
      productId: cuidStr(),
      quantity: 3,
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero quantity", () => {
    const result = CartItemCreateSchema.safeParse({
      productId: cuidStr(),
      quantity: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid productId", () => {
    const result = CartItemCreateSchema.safeParse({
      productId: "not-a-cuid",
      quantity: 3,
    });
    expect(result.success).toBe(false);
  });
});

// ─── CartCheckoutSchema ───

describe("CartCheckoutSchema", () => {
  it("accepts valid checkout data", () => {
    const result = CartCheckoutSchema.safeParse({
      supplierId: cuidStr(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing supplierId", () => {
    const result = CartCheckoutSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts optional deliveryDate", () => {
    const result = CartCheckoutSchema.safeParse({
      supplierId: cuidStr(),
      deliveryDate: "2026-08-15T10:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid deliveryDate", () => {
    const result = CartCheckoutSchema.safeParse({
      supplierId: cuidStr(),
      deliveryDate: "tomorrow",
    });
    expect(result.success).toBe(false);
  });
});

// ─── EtaSubmissionSchema ───

describe("EtaSubmissionSchema", () => {
  it("accepts valid invoiceId", () => {
    const result = EtaSubmissionSchema.safeParse({
      invoiceId: cuidStr(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing invoiceId", () => {
    const result = EtaSubmissionSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects invalid invoiceId format", () => {
    const result = EtaSubmissionSchema.safeParse({
      invoiceId: "not-a-cuid",
    });
    expect(result.success).toBe(false);
  });
});

// ─── FactoringCompanySchema ───

describe("FactoringCompanySchema", () => {
  it("accepts valid factoring company", () => {
    const result = FactoringCompanySchema.safeParse({
      name: "Cairo Capital",
      taxId: "TAX-001",
    });
    expect(result.success).toBe(true);
  });

  it("defaults status to ACTIVE", () => {
    const result = FactoringCompanySchema.safeParse({
      name: "Cairo Capital",
      taxId: "TAX-001",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("ACTIVE");
    }
  });

  it("rejects name < 2 chars", () => {
    const result = FactoringCompanySchema.safeParse({
      name: "C",
      taxId: "TAX-001",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid contactEmail", () => {
    const result = FactoringCompanySchema.safeParse({
      name: "Cairo Capital",
      taxId: "TAX-001",
      contactEmail: "bad-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid contactEmail", () => {
    const result = FactoringCompanySchema.safeParse({
      name: "Cairo Capital",
      taxId: "TAX-001",
      contactEmail: "info@cairocapital.com",
    });
    expect(result.success).toBe(true);
  });
});

// ─── CreditFacilityCreateSchema ───

describe("CreditFacilityCreateSchema", () => {
  it("accepts valid credit facility", () => {
    const result = CreditFacilityCreateSchema.safeParse({
      hotelId: cuidStr(),
      factoringCompanyId: cuidStr(),
      limit: 500000,
      interestRate: 5.5,
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero limit", () => {
    const result = CreditFacilityCreateSchema.safeParse({
      hotelId: cuidStr(),
      factoringCompanyId: cuidStr(),
      limit: 0,
      interestRate: 5.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative limit", () => {
    const result = CreditFacilityCreateSchema.safeParse({
      hotelId: cuidStr(),
      factoringCompanyId: cuidStr(),
      limit: -1000,
      interestRate: 5.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative interestRate", () => {
    const result = CreditFacilityCreateSchema.safeParse({
      hotelId: cuidStr(),
      factoringCompanyId: cuidStr(),
      limit: 500000,
      interestRate: -1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts zero interestRate", () => {
    const result = CreditFacilityCreateSchema.safeParse({
      hotelId: cuidStr(),
      factoringCompanyId: cuidStr(),
      limit: 500000,
      interestRate: 0,
    });
    expect(result.success).toBe(true);
  });
});

// ─── CreditFacilityUpdateSchema ───

describe("CreditFacilityUpdateSchema", () => {
  it("accepts partial update", () => {
    const result = CreditFacilityUpdateSchema.safeParse({ limit: 600000 });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = CreditFacilityUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects negative utilized", () => {
    const result = CreditFacilityUpdateSchema.safeParse({ utilized: -100 });
    expect(result.success).toBe(false);
  });

  it("accepts zero utilized", () => {
    const result = CreditFacilityUpdateSchema.safeParse({ utilized: 0 });
    expect(result.success).toBe(true);
  });
});

// ─── OutletCreateSchema ───

describe("OutletCreateSchema", () => {
  it("accepts valid outlet", () => {
    const result = OutletCreateSchema.safeParse({
      propertyId: cuidStr(),
      name: "Main Kitchen",
    });
    expect(result.success).toBe(true);
  });

  it("defaults type to KITCHEN", () => {
    const result = OutletCreateSchema.safeParse({
      propertyId: cuidStr(),
      name: "Main Kitchen",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe("KITCHEN");
    }
  });

  it("rejects name < 2 chars", () => {
    const result = OutletCreateSchema.safeParse({
      propertyId: cuidStr(),
      name: "M",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing propertyId", () => {
    const result = OutletCreateSchema.safeParse({
      name: "Main Kitchen",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all optional fields", () => {
    const result = OutletCreateSchema.safeParse({
      propertyId: cuidStr(),
      name: "Pool Bar",
      type: "POOL_BAR",
      managerName: "Sara Ali",
      managerPhone: "+201234567890",
      operatingHours: "08:00-22:00",
    });
    expect(result.success).toBe(true);
  });
});

// ─── OutletUpdateSchema ───

describe("OutletUpdateSchema", () => {
  it("accepts partial update without propertyId", () => {
    const result = OutletUpdateSchema.safeParse({ name: "Updated Kitchen" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = OutletUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("omits propertyId from output even if provided", () => {
    const result = OutletUpdateSchema.safeParse({
      propertyId: cuidStr(),
      name: "Kitchen",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("propertyId");
    }
  });
});

// ─── TripCreateSchema ───

describe("TripCreateSchema", () => {
  it("accepts valid trip data", () => {
    const result = TripCreateSchema.safeParse({
      hubId: cuidStr(),
      driverName: "Mohamed",
      driverPhone: "+201234567890",
      vehiclePlate: "ABC-1234",
      scheduledDate: "2026-08-01T08:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing driverName", () => {
    const result = TripCreateSchema.safeParse({
      hubId: cuidStr(),
      driverPhone: "+201234567890",
      vehiclePlate: "ABC-1234",
      scheduledDate: "2026-08-01T08:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty driverPhone", () => {
    const result = TripCreateSchema.safeParse({
      hubId: cuidStr(),
      driverName: "Mohamed",
      driverPhone: "",
      vehiclePlate: "ABC-1234",
      scheduledDate: "2026-08-01T08:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid scheduledDate", () => {
    const result = TripCreateSchema.safeParse({
      hubId: cuidStr(),
      driverName: "Mohamed",
      driverPhone: "+201234567890",
      vehiclePlate: "ABC-1234",
      scheduledDate: "next monday",
    });
    expect(result.success).toBe(false);
  });
});

// ─── TripUpdateSchema ───

describe("TripUpdateSchema", () => {
  it("accepts partial update", () => {
    const result = TripUpdateSchema.safeParse({ status: "IN_TRANSIT" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = TripUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

// ─── TripStopCreateSchema ───

describe("TripStopCreateSchema", () => {
  it("accepts valid trip stop", () => {
    const result = TripStopCreateSchema.safeParse({
      stopNumber: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero stopNumber", () => {
    const result = TripStopCreateSchema.safeParse({
      stopNumber: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative stopNumber", () => {
    const result = TripStopCreateSchema.safeParse({
      stopNumber: -1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional orderId and eta", () => {
    const result = TripStopCreateSchema.safeParse({
      orderId: cuidStr(),
      stopNumber: 2,
      eta: "2026-08-01T10:30:00.000Z",
    });
    expect(result.success).toBe(true);
  });
});

// ─── SupplierAuditCreateSchema ───

describe("SupplierAuditCreateSchema", () => {
  it("accepts valid audit data", () => {
    const result = SupplierAuditCreateSchema.safeParse({
      auditorName: "Inspector Youssef",
      auditDate: "2026-07-27T14:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("defaults status to PENDING", () => {
    const result = SupplierAuditCreateSchema.safeParse({
      auditorName: "Inspector Youssef",
      auditDate: "2026-07-27T14:00:00.000Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("PENDING");
    }
  });

  it("rejects score > 100", () => {
    const result = SupplierAuditCreateSchema.safeParse({
      auditorName: "Inspector Youssef",
      auditDate: "2026-07-27T14:00:00.000Z",
      score: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative score", () => {
    const result = SupplierAuditCreateSchema.safeParse({
      auditorName: "Inspector Youssef",
      auditDate: "2026-07-27T14:00:00.000Z",
      score: -1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts boundary score of 0", () => {
    const result = SupplierAuditCreateSchema.safeParse({
      auditorName: "Inspector Youssef",
      auditDate: "2026-07-27T14:00:00.000Z",
      score: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts boundary score of 100", () => {
    const result = SupplierAuditCreateSchema.safeParse({
      auditorName: "Inspector Youssef",
      auditDate: "2026-07-27T14:00:00.000Z",
      score: 100,
    });
    expect(result.success).toBe(true);
  });

  it("accepts all optional boolean fields", () => {
    const result = SupplierAuditCreateSchema.safeParse({
      auditorName: "Inspector Youssef",
      auditDate: "2026-07-27T14:00:00.000Z",
      coldChainCompliant: true,
      haccpCertified: true,
      onSiteVisited: true,
      labTested: false,
    });
    expect(result.success).toBe(true);
  });
});

// ─── SupplierAuditUpdateSchema ───

describe("SupplierAuditUpdateSchema", () => {
  it("accepts partial update", () => {
    const result = SupplierAuditUpdateSchema.safeParse({ score: 85 });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = SupplierAuditUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

// ─── RegisterSchema ───

describe("RegisterSchema", () => {
  it("accepts valid registration", () => {
    const result = RegisterSchema.safeParse({
      name: "Ahmed Hassan",
      email: "ahmed@hotel.com",
      password: "Secure123!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = RegisterSchema.safeParse({
      name: "Ahmed",
      email: "not-an-email",
      password: "Secure123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name < 2 chars", () => {
    const result = RegisterSchema.safeParse({
      name: "A",
      email: "a@b.com",
      password: "Secure123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password < 8 chars", () => {
    const result = RegisterSchema.safeParse({
      name: "Ahmed",
      email: "ahmed@hotel.com",
      password: "Sec1!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = RegisterSchema.safeParse({
      name: "Ahmed",
      email: "ahmed@hotel.com",
      password: "secure123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase", () => {
    const result = RegisterSchema.safeParse({
      name: "Ahmed",
      email: "ahmed@hotel.com",
      password: "SECURE123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = RegisterSchema.safeParse({
      name: "Ahmed",
      email: "ahmed@hotel.com",
      password: "SecurePass!",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional hotelId and role", () => {
    const result = RegisterSchema.safeParse({
      name: "Ahmed",
      email: "ahmed@hotel.com",
      password: "Secure123!",
      hotelId: cuidStr(),
      role: "DEPARTMENT_HEAD",
    });
    expect(result.success).toBe(true);
  });
});

// ─── BusinessRegisterSchema ───

describe("BusinessRegisterSchema", () => {
  it("accepts valid business registration", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "hotel",
      name: "Grand Nile Hotel",
      email: "register@grandnile.com",
      password: "Secure123!",
      taxId: "123-456-789",
      city: "Cairo",
      governorate: "Cairo",
      termsAccepted: true,
    });
    expect(result.success).toBe(true);
  });

  it("defaults accountType to business", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "supplier",
      name: "Cairo Foods",
      email: "reg@cairofoods.com",
      password: "Secure123!",
      taxId: "TAX-001",
      city: "Giza",
      governorate: "Giza",
      termsAccepted: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.accountType).toBe("business");
    }
  });

  it("defaults marketingConsent to false", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "hotel",
      name: "Grand Nile",
      email: "reg@grandnile.com",
      password: "Secure123!",
      taxId: "123-456-789",
      city: "Cairo",
      governorate: "Cairo",
      termsAccepted: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.marketingConsent).toBe(false);
    }
  });

  it("rejects missing termsAccepted", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "hotel",
      name: "Grand Nile",
      email: "reg@grandnile.com",
      password: "Secure123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects termsAccepted = false", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "hotel",
      name: "Grand Nile",
      email: "reg@grandnile.com",
      password: "Secure123!",
      termsAccepted: false,
    });
    expect(result.success).toBe(false);
  });

  it("requires taxId for business accounts (superRefine)", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "hotel",
      name: "Grand Nile",
      email: "reg@grandnile.com",
      password: "Secure123!",
      accountType: "business",
      termsAccepted: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const taxIdIssue = result.error.issues.find(
        (i) => i.path.includes("taxId")
      );
      expect(taxIdIssue).toBeDefined();
    }
  });

  it("requires city for business accounts (superRefine)", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "hotel",
      name: "Grand Nile",
      email: "reg@grandnile.com",
      password: "Secure123!",
      taxId: "123-456-789",
      accountType: "business",
      termsAccepted: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const cityIssue = result.error.issues.find(
        (i) => i.path.includes("city")
      );
      expect(cityIssue).toBeDefined();
    }
  });

  it("requires governorate for business accounts (superRefine)", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "hotel",
      name: "Grand Nile",
      email: "reg@grandnile.com",
      password: "Secure123!",
      taxId: "123-456-789",
      city: "Cairo",
      accountType: "business",
      termsAccepted: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const govIssue = result.error.issues.find(
        (i) => i.path.includes("governorate")
      );
      expect(govIssue).toBeDefined();
    }
  });

  it("skips superRefine for individual account type", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "supplier",
      name: "Cairo Foods",
      email: "reg@cairofoods.com",
      password: "Secure123!",
      accountType: "individual",
      termsAccepted: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid type enum", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "invalid",
      name: "Test",
      email: "test@test.com",
      password: "Secure123!",
      termsAccepted: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak password", () => {
    const result = BusinessRegisterSchema.safeParse({
      type: "hotel",
      name: "Grand Nile",
      email: "reg@grandnile.com",
      password: "weak",
      taxId: "123-456-789",
      city: "Cairo",
      governorate: "Cairo",
      termsAccepted: true,
    });
    expect(result.success).toBe(false);
  });
});

// ─── LoginSchema ───

describe("LoginSchema", () => {
  it("accepts valid email login", () => {
    const result = LoginSchema.safeParse({
      email: "user@hotel.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts 'admin' as special login", () => {
    const result = LoginSchema.safeParse({
      email: "admin",
      password: "adminpass",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = LoginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = LoginSchema.safeParse({
      email: "user@hotel.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing password", () => {
    const result = LoginSchema.safeParse({
      email: "user@hotel.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = LoginSchema.safeParse({
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("accepts 'ADMIN' case-insensitive via refine", () => {
    const result = LoginSchema.safeParse({
      email: "admin",
      password: "adminpass",
    });
    expect(result.success).toBe(true);
  });
});

// ─── PaginationSchema ───

describe("PaginationSchema", () => {
  it("applies defaults for empty input", () => {
    const result = PaginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.sortOrder).toBe("desc");
    }
  });

  it("coerces string numbers to integers", () => {
    const result = PaginationSchema.safeParse({
      page: "3",
      limit: "50",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(50);
    }
  });

  it("rejects limit > 100", () => {
    const result = PaginationSchema.safeParse({ limit: 101 });
    expect(result.success).toBe(false);
  });

  it("rejects page < 1", () => {
    const result = PaginationSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects limit < 1", () => {
    const result = PaginationSchema.safeParse({ limit: 0 });
    expect(result.success).toBe(false);
  });

  it("accepts valid sortBy and search", () => {
    const result = PaginationSchema.safeParse({
      search: "nile",
      sortBy: "name",
      sortOrder: "asc",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid sortOrder", () => {
    const result = PaginationSchema.safeParse({ sortOrder: "random" });
    expect(result.success).toBe(false);
  });
});
