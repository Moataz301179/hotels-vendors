/**
 * Egyptian Market Seed Data
 * Hotels Vendors — The Trojan Horse
 *
 * Realistic synthetic data representing the Egyptian hospitality
 * handshake economy. Pre-populates the marketplace with recognizable
 * industrial suppliers from key zones.
 */

import { prisma } from "./prisma";
import { ProductCategory } from "@prisma/client";

// ─────────────────────────────────────────
// 1. EGYPTIAN HOTEL CHAINS
// ─────────────────────────────────────────

const EGYPTIAN_HOTELS = [
  {
    name: "Marriott Mena House",
    legalName: "Mena House Hotels & Resorts S.A.E.",
    taxId: "100-245-963",
    city: "Giza",
    governorate: "Giza",
    address: "Pyramids Road, Giza",
    starRating: 5,
    roomCount: 331,
    tier: "PREMIER" as const,
    creditLimit: 5000000,
    riskScore: 15,
    riskTier: "LOW" as const,
  },
  {
    name: "Four Seasons Nile Plaza",
    legalName: "Four Seasons Hotels Egypt Ltd.",
    taxId: "100-312-784",
    city: "Cairo",
    governorate: "Cairo",
    address: "1089 Corniche El Nile, Garden City",
    starRating: 5,
    roomCount: 365,
    tier: "PREMIER" as const,
    creditLimit: 8000000,
    riskScore: 12,
    riskTier: "LOW" as const,
  },
  {
    name: "Hilton Alexandria Corniche",
    legalName: "Alexandria Hotels & Tourism Co.",
    taxId: "200-156-789",
    city: "Alexandria",
    governorate: "Alexandria",
    address: "544 El Geish Avenue, Sidi Bishr",
    starRating: 4,
    roomCount: 240,
    tier: "CORE" as const,
    creditLimit: 2500000,
    riskScore: 35,
    riskTier: "MEDIUM" as const,
  },
  {
    name: "Movenpick Resort El Gouna",
    legalName: "El Gouna Hotels Company S.A.E.",
    taxId: "300-789-456",
    city: "Hurghada",
    governorate: "Red Sea",
    address: "El Gouna, Red Sea Governorate",
    starRating: 5,
    roomCount: 420,
    tier: "COASTAL" as const,
    creditLimit: 4000000,
    riskScore: 42,
    riskTier: "MEDIUM" as const,
  },
  {
    name: "Steigenberger Hotel El Tahrir",
    legalName: "Egyptian Hotels Management S.A.E.",
    taxId: "100-567-234",
    city: "Cairo",
    governorate: "Cairo",
    address: "Tahrir Square, Downtown Cairo",
    starRating: 5,
    roomCount: 295,
    tier: "PREMIER" as const,
    creditLimit: 3500000,
    riskScore: 18,
    riskTier: "LOW" as const,
  },
  {
    name: "Kempinski Nile Hotel",
    legalName: "Nile Palace Hotels S.A.E.",
    taxId: "100-891-357",
    city: "Cairo",
    governorate: "Cairo",
    address: "12 Ahmed Ragheb Street, Garden City",
    starRating: 5,
    roomCount: 191,
    tier: "PREMIER" as const,
    creditLimit: 4500000,
    riskScore: 10,
    riskTier: "LOW" as const,
  },
  {
    name: "Pyramid View Inn",
    legalName: "Pyramid View Tourism Co.",
    taxId: "100-999-888",
    city: "Giza",
    governorate: "Giza",
    address: "Al Haram Street, Nazlet El-Semman",
    starRating: 3,
    roomCount: 45,
    tier: "CORE" as const,
    creditLimit: 200000,
    riskScore: 88,
    riskTier: "CRITICAL" as const,
  },
  {
    name: "Sunrise Marina Resort",
    legalName: "Marina Tourism Development S.A.E.",
    taxId: "400-123-789",
    city: "North Coast",
    governorate: "Matrouh",
    address: "Marina El Alamein, Kilometer 105",
    starRating: 4,
    roomCount: 180,
    tier: "COASTAL" as const,
    creditLimit: 1200000,
    riskScore: 67,
    riskTier: "HIGH" as const,
  },
];

// ─────────────────────────────────────────
// 2. EGYPTIAN SUPPLIERS (Industrial Zones)
// ─────────────────────────────────────────

const EGYPTIAN_SUPPLIERS = [
  // 6th of October City — Food & Beverage
  {
    name: "Al-Doha Food Industries",
    legalName: "Al-Doha Food Industries S.A.E.",
    taxId: "500-111-222",
    email: "procurement@aldoha-foods.com",
    city: "6th of October",
    governorate: "Giza",
    address: "Industrial Zone B, 6th of October City",
    tier: "PREMIER" as const,
    description: "Leading manufacturer of hotel-grade frozen meats, dairy, and packaged foods. ISO 22000 certified.",
    certifications: '["ISO 22000", "HACCP", "Halal Certified"]',
  },
  {
    name: "Nile Fresh Produce",
    legalName: "Nile Agricultural Supplies Co.",
    taxId: "500-333-444",
    email: "orders@nilefresh.com",
    city: "6th of October",
    governorate: "Giza",
    address: "Logistics Hub, 6th of October City",
    tier: "VERIFIED" as const,
    description: "Daily fresh produce delivery to hotels across Greater Cairo. Cold chain certified.",
    certifications: '["HACCP", "GlobalG.A.P."]',
  },
  // 10th of Ramadan — Housekeeping & Amenities
  {
    name: "Egyptian Linen & Textiles",
    legalName: "Egyptian Linen Manufacturing S.A.E.",
    taxId: "600-555-666",
    email: "sales@egyptianlinen.com",
    city: "10th of Ramadan",
    governorate: "Sharqia",
    address: "Industrial Area C, 10th of Ramadan City",
    tier: "PREMIER" as const,
    description: "Premium Egyptian cotton linens, towels, and hotel textiles. Export-grade quality.",
    certifications: '["OEKO-TEX", "ISO 9001"]',
  },
  {
    name: "CleanTech Chemicals",
    legalName: "CleanTech Chemical Industries Co.",
    taxId: "600-777-888",
    email: "bulk@cleantech-eg.com",
    city: "10th of Ramadan",
    governorate: "Sharqia",
    address: "Chemical Zone, 10th of Ramadan City",
    tier: "VERIFIED" as const,
    description: "Industrial cleaning chemicals, detergents, and sanitizers for hospitality sector.",
    certifications: '["ISO 14001", "REACH Compliant"]',
  },
  // Obour City — Engineering & FFE
  {
    name: "Delta Engineering Supplies",
    legalName: "Delta Engineering & Maintenance Co.",
    taxId: "700-999-000",
    email: "engineering@delta-supplies.com",
    city: "Obour",
    governorate: "Qalyubia",
    address: "Industrial Zone A, Obour City",
    tier: "CORE" as const,
    description: "HVAC parts, electrical supplies, plumbing fixtures, and general engineering maintenance materials.",
    certifications: '["ISO 9001"]',
  },
  {
    name: "Royal Amenities Factory",
    legalName: "Royal Amenities Manufacturing S.A.E.",
    taxId: "700-111-333",
    email: "b2b@royalamenities.com",
    city: "Obour",
    governorate: "Qalyubia",
    address: "Light Industry Zone, Obour City",
    tier: "COASTAL" as const,
    description: "Shampoo, conditioner, soap, slippers, and custom-branded hotel amenities.",
    certifications: '["GMP", "ISO 22716"]',
  },
  // Alexandria — Seafood & Maritime
  {
    name: "Mediterranean Seafoods",
    legalName: "Mediterranean Fisheries & Processing Co.",
    taxId: "200-444-555",
    email: "fresh@medseafoods.com",
    city: "Alexandria",
    governorate: "Alexandria",
    address: "El Max, Alexandria Port Area",
    tier: "PREMIER" as const,
    description: "Daily fresh and frozen seafood supply. Direct from Mediterranean fleet to hotel kitchens.",
    certifications: '["HACCP", "MSC Certified", "EU Export License"]',
  },
  // Borg El Arab — Textiles
  {
    name: "Alexandria Cotton Mills",
    legalName: "Alexandria Cotton & Textile Co.",
    taxId: "200-666-777",
    email: "orders@alexcotton.com",
    city: "Borg El Arab",
    governorate: "Alexandria",
    address: "Textile Industrial Zone, Borg El Arab",
    tier: "VERIFIED" as const,
    description: "Bulk Egyptian cotton, bedding, curtains, and upholstery fabrics for hotel renovations.",
    certifications: '["Cotton Egypt Association", "ISO 9001"]',
  },
];

// ─────────────────────────────────────────
// 3. PRODUCT CATALOG
// ─────────────────────────────────────────

const PRODUCT_CATALOG = [
  // F&B
  { sku: "FB-001", name: "Premium Ground Beef (Halal)", category: "F_AND_B", unitPrice: 185, stockQuantity: 500 },
  { sku: "FB-002", name: "Chicken Breast Fillets (Frozen)", category: "F_AND_B", unitPrice: 95, stockQuantity: 800 },
  { sku: "FB-003", name: "Egyptian White Cheese (Domiati)", category: "F_AND_B", unitPrice: 65, stockQuantity: 300 },
  { sku: "FB-004", name: "Fresh Tomatoes (Grade A)", category: "F_AND_B", unitPrice: 12, stockQuantity: 2000 },
  { sku: "FB-005", name: "Extra Virgin Olive Oil (5L)", category: "F_AND_B", unitPrice: 450, stockQuantity: 150 },
  // Housekeeping
  { sku: "HK-001", name: "Egyptian Cotton Bed Sheet (King)", category: "CONSUMABLES", unitPrice: 320, stockQuantity: 400 },
  { sku: "HK-002", name: "Premium Bath Towel Set", category: "CONSUMABLES", unitPrice: 180, stockQuantity: 600 },
  { sku: "HK-003", name: "All-Purpose Cleaner (20L)", category: "CONSUMABLES", unitPrice: 85, stockQuantity: 250 },
  // Amenities
  { sku: "AM-001", name: "Shampoo Sachet (5ml, Custom Branded)", category: "GUEST_SUPPLIES", unitPrice: 1.5, stockQuantity: 50000 },
  { sku: "AM-002", name: "Slippers (Disposable, White)", category: "GUEST_SUPPLIES", unitPrice: 8, stockQuantity: 10000 },
  // Engineering
  { sku: "EN-001", name: "HVAC Filter (Standard)", category: "FFE", unitPrice: 120, stockQuantity: 200 },
  { sku: "EN-002", name: "LED Panel Light (60x60cm)", category: "FFE", unitPrice: 85, stockQuantity: 350 },
];

// ─────────────────────────────────────────
// 4. SEED FUNCTION
// ─────────────────────────────────────────

export async function seedEgyptianMarket() {
  console.log("🚀 Seeding Egyptian hospitality market...");

  // Seed Hotels
  const hotels = [];
  for (const hotelData of EGYPTIAN_HOTELS) {
    const hotel = await prisma.hotel.upsert({
      where: { taxId: hotelData.taxId },
      update: {},
      create: hotelData,
    });
    hotels.push(hotel);
    console.log(`  ✅ Hotel: ${hotel.name} (${hotel.tier})`);
  }

  // Seed Suppliers
  const suppliers = [];
  for (const supplierData of EGYPTIAN_SUPPLIERS) {
    const supplier = await prisma.supplier.upsert({
      where: { taxId: supplierData.taxId },
      update: {},
      create: supplierData,
    });
    suppliers.push(supplier);
    console.log(`  ✅ Supplier: ${supplier.name} (${supplier.tier})`);
  }

  // Seed Products (assign to suppliers round-robin)
  for (let i = 0; i < PRODUCT_CATALOG.length; i++) {
    const product = PRODUCT_CATALOG[i];
    const supplier = suppliers[i % suppliers.length];

    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        sku: product.sku,
        name: product.name,
        category: product.category as ProductCategory,
        unitPrice: product.unitPrice,
        stockQuantity: product.stockQuantity,
        supplierId: supplier.id,
        status: "ACTIVE",
      },
    });
    console.log(`  ✅ Product: ${product.name} → ${supplier.name}`);
  }

  // Seed sample orders
  const sampleOrders = [
    { hotel: hotels[0], supplier: suppliers[0], total: 47500, status: "DELIVERED" },
    { hotel: hotels[1], supplier: suppliers[1], total: 28300, status: "DELIVERED" },
    { hotel: hotels[2], supplier: suppliers[2], total: 156000, status: "APPROVED" },
    { hotel: hotels[3], supplier: suppliers[3], total: 89000, status: "CONFIRMED" },
    { hotel: hotels[4], supplier: suppliers[4], total: 34200, status: "DELIVERED" },
  ];

  for (const orderData of sampleOrders) {
    const orderNumber = `PO-2026-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    await prisma.order.create({
      data: {
        orderNumber,
        hotelId: orderData.hotel.id,
        supplierId: orderData.supplier.id,
        requesterId: "system",
        status: orderData.status as any,
        subtotal: orderData.total * 0.877,
        vatAmount: orderData.total * 0.123,
        total: orderData.total,
        paymentGuaranteed: true,
        paymentGuaranteeMethod: "FACTORING",
      },
    });
    console.log(`  ✅ Order: ${orderNumber} — ${orderData.total.toLocaleString()} EGP`);
  }

  console.log("\n🎯 Egyptian market seeded successfully!");
  console.log(`   Hotels: ${hotels.length}`);
  console.log(`   Suppliers: ${suppliers.length}`);
  console.log(`   Products: ${PRODUCT_CATALOG.length}`);
  console.log(`   Sample Orders: ${sampleOrders.length}`);
}

// CLI execution
if (require.main === module) {
  seedEgyptianMarket()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
