import { db } from "@/db";
import {
  organizations,
  users,
  products,
  orders,
  invoices,
  financings,
  transactions,
  guarantees,
} from "@/db/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { ref } from "@/lib/utils";

/**
 * ⚠️  DEVELOPMENT ONLY — All data below is obviously fake test data.
 *     Do NOT use in production. Do NOT commit real PII.
 */

export async function isSeeded() {
  const rows = await db.select({ n: sql<number>`count(*)::int` }).from(users);
  return (rows[0]?.n ?? 0) > 0;
}

export async function seedDatabase() {
  await db.execute(sql`
    TRUNCATE TABLE
      guarantees, transactions, financings, invoices, orders, products, users, organizations
    RESTART IDENTITY CASCADE;
  `);

  const pw = await bcrypt.hash(process.env.SEED_PASSWORD || "change-me-immediately", 10);

  const [nileRitz, steigen, marsaHotel] = await db
    .insert(organizations)
    .values([
      { name: "Hotel Test Alpha (Dev)", type: "hotel", city: "Cairo", description: "Test hotel for development.", creditLimit: 500000000, creditUsed: 310000000, walletBalance: 42000000, rating: "4.9" },
      { name: "Hotel Test Beta (Dev)", type: "hotel", city: "Hurghada", description: "Test hotel for development.", creditLimit: 350000000, creditUsed: 120000000, walletBalance: 18500000, rating: "4.7" },
      { name: "Hotel Test Gamma (Dev)", type: "hotel", city: "El Gouna", description: "Test hotel for development.", creditLimit: 200000000, creditUsed: 55000000, walletBalance: 9800000, rating: "4.6" },
    ])
    .returning();

  const [freshFields, linenCo, aquaPure, chefSupply, cleanPro, amenityWorld, engiParts, frontDesk] = await db
    .insert(organizations)
    .values([
      { name: "Supplier Test A (Dev)", type: "supplier", city: "Giza", description: "Test supplier for development.", walletBalance: 61000000, rating: "4.8" },
      { name: "Supplier Test B (Dev)", type: "supplier", city: "Cairo", description: "Test supplier for development.", walletBalance: 33000000, rating: "4.7" },
      { name: "Supplier Test C (Dev)", type: "supplier", city: "Alexandria", description: "Test supplier for development.", walletBalance: 27000000, rating: "4.6" },
      { name: "Supplier Test D (Dev)", type: "supplier", city: "6th of October", description: "Test supplier for development.", walletBalance: 44000000, rating: "4.9" },
      { name: "Supplier Test E (Dev)", type: "supplier", city: "Cairo", description: "Test supplier for development.", walletBalance: 18000000, rating: "4.7" },
      { name: "Supplier Test F (Dev)", type: "supplier", city: "Cairo", description: "Test supplier for development.", walletBalance: 22000000, rating: "4.5" },
      { name: "Supplier Test G (Dev)", type: "supplier", city: "Cairo", description: "Test supplier for development.", walletBalance: 19000000, rating: "4.6" },
      { name: "Supplier Test H (Dev)", type: "supplier", city: "Cairo", description: "Test supplier for development.", walletBalance: 12000000, rating: "4.5" },
    ])
    .returning();

  const [deltaCap, sarwaFund] = await db
    .insert(organizations)
    .values([
      { name: "Funder Test A (Dev)", type: "funder", city: "Cairo", description: "Test funder for development.", walletBalance: 1200000000, rating: "5.0" },
      { name: "Funder Test B (Dev)", type: "funder", city: "Cairo", description: "Test funder for development.", walletBalance: 640000000, rating: "4.9" },
    ])
    .returning();

  const [swiftLog] = await db
    .insert(organizations)
    .values([
      { name: "Carrier Test A (Dev)", type: "carrier", city: "Cairo", description: "Test carrier for development.", walletBalance: 14000000, rating: "4.7" },
    ])
    .returning();

  await db.insert(organizations).values([{ name: "HotelsVendors", type: "platform", city: "Cairo", walletBalance: 0 }]);

  await db.insert(users).values([
    { orgId: nileRitz.id, name: "Hotel Test User", email: "hotel-test@test.hotelsvendors.demo", passwordHash: pw, role: "admin" },
    { orgId: freshFields.id, name: "Supplier Test User", email: "supplier-test@test.hotelsvendors.demo", passwordHash: pw, role: "admin" },
    { orgId: deltaCap.id, name: "Factoring Test User", email: "funder-test@test.hotelsvendors.demo", passwordHash: pw, role: "admin" },
    { orgId: swiftLog.id, name: "Logistics Test User", email: "carrier-test@test.hotelsvendors.demo", passwordHash: pw, role: "admin" },
  ]);

  // Realistic Egyptian hospitality procurement catalog. Prices in piastres (EGP * 100)
  const catalog: { name: string; category: string; unit: string; price: number; moq: number; stock: number; leadTimeDays: number; supplierId: number; image: string; deal?: boolean }[] = [
    // F&B
    { supplierId: freshFields.id, name: "Egyptian Premium Tomatoes (10kg crate)", category: "F&B Fresh Produce", unit: "crate", price: 42000, moq: 5, stock: 1200, leadTimeDays: 1, image: "🍅", deal: true },
    { supplierId: freshFields.id, name: "Fresh Cow Milk (12 × 1L)", category: "F&B Dairy", unit: "case", price: 38000, moq: 10, stock: 800, leadTimeDays: 1, image: "🥛" },
    { supplierId: freshFields.id, name: "Mixed Salad Greens (5kg)", category: "F&B Fresh Produce", unit: "box", price: 55000, moq: 4, stock: 400, leadTimeDays: 1, image: "🥬" },
    { supplierId: freshFields.id, name: "Local Chicken Breast Fillet (5kg)", category: "F&B Poultry", unit: "pack", price: 85000, moq: 3, stock: 300, leadTimeDays: 2, image: "🍗" },
    { supplierId: freshFields.id, name: "Imported Ribeye Steak (4kg)", category: "F&B Meat", unit: "pack", price: 320000, moq: 2, stock: 120, leadTimeDays: 3, image: "🥩" },
    { supplierId: aquaPure.id, name: "Still Water 500ml (Case of 24)", category: "F&B Beverages", unit: "case", price: 18000, moq: 20, stock: 4000, leadTimeDays: 2, image: "💧", deal: true },
    { supplierId: aquaPure.id, name: "Fresh Orange Juice 1L (12-pack)", category: "F&B Beverages", unit: "pack", price: 46000, moq: 8, stock: 900, leadTimeDays: 2, image: "🧃" },
    { supplierId: aquaPure.id, name: "Espresso Beans 1kg (Case of 8)", category: "F&B Beverages", unit: "case", price: 128000, moq: 4, stock: 350, leadTimeDays: 3, image: "☕" },
    { supplierId: aquaPure.id, name: "Soft Drink Cans Assorted (24-pack)", category: "F&B Beverages", unit: "case", price: 54000, moq: 10, stock: 600, leadTimeDays: 2, image: "🥤" },

    // Linens & Uniforms
    { supplierId: linenCo.id, name: "Egyptian Cotton Bath Towel (Set of 12)", category: "Linens & Towels", unit: "set", price: 96000, moq: 2, stock: 300, leadTimeDays: 4, image: "🛁", deal: true },
    { supplierId: linenCo.id, name: "Hotel Bed Sheet King (Set of 6)", category: "Linens & Bedding", unit: "set", price: 132000, moq: 2, stock: 260, leadTimeDays: 5, image: "🛏️" },
    { supplierId: linenCo.id, name: "Pillow Protectors (Pack of 10)", category: "Linens & Bedding", unit: "pack", price: 48000, moq: 5, stock: 500, leadTimeDays: 4, image: "🛌" },
    { supplierId: linenCo.id, name: "Housekeeping Uniform Set (per unit)", category: "Uniforms", unit: "unit", price: 48000, moq: 10, stock: 500, leadTimeDays: 7, image: "👔" },
    { supplierId: linenCo.id, name: "Waffle Bathrobe (Premium)", category: "Linens & Towels", unit: "piece", price: 350000, moq: 6, stock: 180, leadTimeDays: 7, image: "🧖" },

    // Housekeeping Chemicals
    { supplierId: cleanPro.id, name: "All-Purpose Surface Sanitizer (5L)", category: "Housekeeping Chemicals", unit: "can", price: 22000, moq: 12, stock: 800, leadTimeDays: 2, image: "🧴", deal: true },
    { supplierId: cleanPro.id, name: "Laundry Detergent Industrial (20L)", category: "Housekeeping Chemicals", unit: "can", price: 68000, moq: 4, stock: 320, leadTimeDays: 2, image: "🧺" },
    { supplierId: cleanPro.id, name: "Glass Cleaner Concentrate (5L)", category: "Housekeeping Chemicals", unit: "can", price: 18000, moq: 12, stock: 650, leadTimeDays: 2, image: "🪟" },
    { supplierId: cleanPro.id, name: "Floor Polish (10L)", category: "Housekeeping Chemicals", unit: "can", price: 42000, moq: 6, stock: 280, leadTimeDays: 3, image: "✨" },

    // Amenities
    { supplierId: amenityWorld.id, name: "Guest Amenity Kit (Shampoo, Soap, Lotion)", category: "Guest Amenities", unit: "set", price: 3500, moq: 500, stock: 10000, leadTimeDays: 5, image: "🧼", deal: true },
    { supplierId: amenityWorld.id, name: "Disposable Hotel Slippers (Pair)", category: "Guest Amenities", unit: "pair", price: 1200, moq: 500, stock: 12000, leadTimeDays: 5, image: "🩴" },
    { supplierId: amenityWorld.id, name: "Dental Kit (Toothbrush + Paste)", category: "Guest Amenities", unit: "set", price: 2200, moq: 500, stock: 8000, leadTimeDays: 5, image: "🪥" },
    { supplierId: amenityWorld.id, name: "Shaving Kit", category: "Guest Amenities", unit: "set", price: 2800, moq: 500, stock: 6000, leadTimeDays: 5, image: "🪒" },

    // Kitchen Equipment
    { supplierId: chefSupply.id, name: "Commercial Convection Oven", category: "Kitchen Equipment", unit: "unit", price: 8900000, moq: 1, stock: 15, leadTimeDays: 14, image: "🔥", deal: true },
    { supplierId: chefSupply.id, name: "Stainless Prep Table 1.8m", category: "Kitchen Equipment", unit: "unit", price: 1250000, moq: 1, stock: 40, leadTimeDays: 10, image: "🍳" },
    { supplierId: chefSupply.id, name: "Chef Knife Set (Professional)", category: "Kitchen Equipment", unit: "set", price: 320000, moq: 2, stock: 80, leadTimeDays: 6, image: "🔪" },
    { supplierId: chefSupply.id, name: "Commercial Blender 2L", category: "Kitchen Equipment", unit: "unit", price: 580000, moq: 1, stock: 45, leadTimeDays: 7, image: "🌪️" },
    { supplierId: chefSupply.id, name: "Insulated Food Pan Carrier", category: "Kitchen Equipment", unit: "unit", price: 210000, moq: 2, stock: 90, leadTimeDays: 5, image: "🍲" },

    // MRO / Engineering
    { supplierId: engiParts.id, name: "LED Downlight Panel 18W (Pack of 10)", category: "MRO & Engineering", unit: "pack", price: 145000, moq: 3, stock: 220, leadTimeDays: 4, image: "💡" },
    { supplierId: engiParts.id, name: "HVAC Air Filter 20x20 (Pack of 5)", category: "MRO & Engineering", unit: "pack", price: 98000, moq: 4, stock: 300, leadTimeDays: 4, image: "🌀" },
    { supplierId: engiParts.id, name: "Room Door Lock Card Reader", category: "MRO & Engineering", unit: "unit", price: 420000, moq: 1, stock: 60, leadTimeDays: 10, image: "🗝️", deal: true },
    { supplierId: engiParts.id, name: "Smoke Detector (Pack of 5)", category: "MRO & Engineering", unit: "pack", price: 76000, moq: 5, stock: 250, leadTimeDays: 5, image: "🚨" },

    // Front Office / Admin
    { supplierId: frontDesk.id, name: "Key Cards Magnetic Stripe (Box of 500)", category: "Front Office", unit: "box", price: 32000, moq: 2, stock: 900, leadTimeDays: 5, image: "💳" },
    { supplierId: frontDesk.id, name: "A4 Printing Paper (Box of 5 Reams)", category: "Front Office", unit: "box", price: 28000, moq: 5, stock: 700, leadTimeDays: 3, image: "📄" },
    { supplierId: frontDesk.id, name: "Luggage Tags (Pack of 200)", category: "Front Office", unit: "pack", price: 9500, moq: 5, stock: 800, leadTimeDays: 5, image: "🏷️" },
    { supplierId: frontDesk.id, name: "Room Cleaning Status Cards (Pack of 50)", category: "Front Office", unit: "pack", price: 6500, moq: 10, stock: 600, leadTimeDays: 5, image: "🚪" },
  ];

  const prod = await db
    .insert(products)
    .values(catalog)
    .returning();

  const now = Date.now();
  const [o1, o2, o3] = await db
    .insert(orders)
    .values([
      {
        reference: ref("ORD"), hotelId: nileRitz.id, supplierId: freshFields.id, carrierId: swiftLog.id,
        status: "financed", subtotal: 480000, platformFee: 12000, total: 492000, paymentTermDays: 60,
        items: [{ productId: prod[0].id, name: prod[0].name, qty: 8, price: prod[0].price }, { productId: prod[1].id, name: prod[1].name, qty: 4, price: prod[1].price }],
        etaUuid: "ETA-77E59D11-667C-4B9B-89E3-0FFBDCE2841E", // DEMO ONLY — fake UUID, not ETA-compliant
        etaStatus: "valid",
        grnStatus: "fully_received",
        grnVarianceBps: 0,
        grnNotes: "All fresh produce arrived within cold-chain specification.",
        createdAt: new Date(now - 3 * 864e5),
      },
      {
        reference: ref("ORD"), hotelId: steigen.id, supplierId: linenCo.id, carrierId: swiftLog.id,
        status: "in_transit", subtotal: 660000, platformFee: 16500, total: 676500, paymentTermDays: 90,
        items: [{ productId: prod[4].id, name: prod[4].name, qty: 5, price: prod[4].price }],
        etaUuid: "ETA-20329348-EE4B-0E0B-6DBA-E90CDE340937", // DEMO ONLY — fake UUID
        etaStatus: "submitted",
        grnStatus: "not_received",
        createdAt: new Date(now - 1 * 864e5),
      },
      {
        reference: ref("ORD"), hotelId: nileRitz.id, supplierId: chefSupply.id,
        status: "delivered", subtotal: 8900000, platformFee: 178000, total: 9078000, paymentTermDays: 90,
        items: [{ productId: prod[19].id, name: prod[19].name, qty: 1, price: prod[19].price }],
        etaUuid: "ETA-08006112-1070-7B23-DA17-169E30007467", // DEMO ONLY — fake UUID
        etaStatus: "valid",
        grnStatus: "partially_received",
        grnVarianceBps: 250,
        grnNotes: "Oven arrived with missing rack accessory; adjusted variance reported.",
        createdAt: new Date(now - 12 * 864e5),
      },
    ])
    .returning();

  await db.insert(invoices).values([
    { orderId: o1.id, supplierId: freshFields.id, hotelId: nileRitz.id, amount: 480000, status: "financed", dueDate: new Date(now + 57 * 864e5) },
    { orderId: o2.id, supplierId: linenCo.id, hotelId: steigen.id, amount: 660000, status: "issued", dueDate: new Date(now + 89 * 864e5) },
    { orderId: o3.id, supplierId: chefSupply.id, hotelId: nileRitz.id, amount: 8900000, status: "financed", dueDate: new Date(now + 78 * 864e5) },
  ]);

  await db.insert(financings).values([
    { reference: ref("FIN"), type: "trade_credit", orderId: o1.id, borrowerId: nileRitz.id, funderId: deltaCap.id, principal: 480000, aprBps: 1840, termDays: 60, feeBps: 150, status: "funded", riskScore: "A+", underwritingConfidence: 98, insuranceStatus: "insured" },
    { reference: ref("FIN"), type: "factoring", orderId: o3.id, borrowerId: chefSupply.id, funderId: sarwaFund.id, principal: 8900000, aprBps: 2100, termDays: 78, feeBps: 220, status: "repaying", riskScore: "AA-", underwritingConfidence: 96, insuranceStatus: "insured" },
    { reference: ref("FIN"), type: "trade_credit", borrowerId: marsaHotel.id, funderId: deltaCap.id, principal: 1500000, aprBps: 1950, termDays: 45, feeBps: 160, status: "requested", riskScore: "B+", underwritingConfidence: 89, insuranceStatus: "pending" },
  ]);

  await db.insert(transactions).values([
    { orgId: freshFields.id, kind: "disbursement", gateway: "instapay", amount: 468000, reference: ref("TX"), meta: { note: "Factored payout ORD-1" } },
    { orgId: nileRitz.id, kind: "fee", gateway: "wallet", amount: 12000, reference: ref("TX"), meta: { note: "Platform fee" } },
    { orgId: deltaCap.id, kind: "repayment", gateway: "bank", amount: 512000, reference: ref("TX"), meta: { note: "Facility repayment" } },
    { orgId: chefSupply.id, kind: "payout", gateway: "paymob", amount: 8722000, reference: ref("TX"), meta: { note: "Equipment settlement" } },
  ]);

  // Payment Guarantee Orders (PGO) at various lifecycle stages
  await db.insert(guarantees).values([
    { reference: ref("PGO"), instrument: "PGO", orderId: o1.id, hotelId: nileRitz.id, supplierId: freshFields.id, funderId: deltaCap.id, faceValue: 480000, supplierDiscountBps: 300, hotelFeeBps: 150, funderSpreadBps: 1850, platformMarginBps: 120, termDays: 60, status: "settled", complianceScore: 96, evidenceComplete: true },
    { reference: ref("PGO"), instrument: "PGO", orderId: o2.id, hotelId: steigen.id, supplierId: linenCo.id, funderId: deltaCap.id, faceValue: 660000, supplierDiscountBps: 280, hotelFeeBps: 140, funderSpreadBps: 1800, platformMarginBps: 110, termDays: 90, status: "issued", complianceScore: 92, evidenceComplete: true },
    { reference: ref("PGO"), instrument: "PGO", orderId: o3.id, hotelId: nileRitz.id, supplierId: chefSupply.id, funderId: sarwaFund.id, faceValue: 8900000, supplierDiscountBps: 250, hotelFeeBps: 120, funderSpreadBps: 2100, platformMarginBps: 100, termDays: 78, status: "claimed", complianceScore: 94, evidenceComplete: true },
    { reference: ref("PGO"), instrument: "PGO", hotelId: marsaHotel.id, supplierId: aquaPure.id, faceValue: 1500000, supplierDiscountBps: 380, hotelFeeBps: 200, funderSpreadBps: 2100, platformMarginBps: 150, termDays: 45, status: "under_review", complianceScore: 68, evidenceComplete: false },
    { reference: ref("PGO"), instrument: "PGO", hotelId: nileRitz.id, supplierId: cleanPro.id, faceValue: 264000, supplierDiscountBps: 300, hotelFeeBps: 150, funderSpreadBps: 1850, platformMarginBps: 120, termDays: 60, status: "funder_pending", complianceScore: 90, evidenceComplete: true },
  ]);

  return { ok: true };
}
