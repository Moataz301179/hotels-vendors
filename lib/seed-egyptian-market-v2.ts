/**
 * Egyptian Market Seed v2.0
 * 52 Hotels + 68 Suppliers + 180 Products + ~136 Order Pairings
 * Reads from data/egyptian-market-v2.json
 */

import { prisma } from "./prisma";
import { readFileSync } from "fs";
import { join } from "path";
import type { HotelTier, SupplierTier, ProductCategory, OrderStatus } from "@prisma/client";

const DATA_PATH = join(process.cwd(), "data", "egyptian-market-v2.json");

interface MarketData {
  hotels: Array<{
    id: string; name: string; city: string; governorate: string;
    tier: string; rooms: number; chain: string; monthly_gmv_egp: number;
  }>;
  suppliers: Array<{
    id: string; name: string; city: string; governorate: string;
    category: string; industrial_zone: string; tax_id: string;
    monthly_capacity_egp: number;
  }>;
  pairings: Array<{
    hotel: string; supplier: string; category: string;
    frequency: string; value_egp: number;
  }>;
  product_catalog: Array<{
    sku: string; name: string; category: string;
    unit: string; base_price_egp: number; supplier_id: string;
  }>;
}

function loadData(): MarketData {
  const raw = readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as MarketData;
}

function mapHotelTier(tier: string): HotelTier {
  switch (tier) {
    case "luxury": return "PREMIER";
    case "upscale": return "PREMIER";
    case "heritage": return "CORE";
    case "economy": return "CORE";
    default: return "CORE"; // midscale
  }
}

function mapSupplierTier(capacity: number): SupplierTier {
  if (capacity >= 5000000) return "PREMIER";
  if (capacity >= 2500000) return "VERIFIED";
  return "CORE";
}

function mapProductCategory(cat: string): ProductCategory {
  const c = cat.toLowerCase();
  if (["poultry", "meat", "seafood", "dairy", "beverages", "fresh_produce", "oils", "spices", "sugar", "dates", "bakery", "canned_goods", "confectionery", "grains", "processed_food", "organic_produce", "food_ingredients", "water", "cold_storage"].includes(c)) return "F_AND_B";
  if (["linens", "paper_products", "cleaning", "uniforms", "amenities"].includes(c)) return "CONSUMABLES";
  if (["furniture", "glassware", "ceramics", "carpets", "building_materials", "hospitality_equipment", "handicrafts", "packaging", "plastics", "metals", "textiles", "electronics", "pharmaceuticals", "chemicals"].includes(c)) return "FFE";
  if (["logistics", "energy"].includes(c)) return "SERVICES";
  return "FFE";
}

function weightedStatus(): OrderStatus {
  const r = Math.random();
  if (r < 0.05) return "CANCELLED";
  if (r < 0.20) return "DRAFT";
  if (r < 0.40) return "PENDING_APPROVAL";
  if (r < 0.55) return "APPROVED";
  if (r < 0.70) return "CONFIRMED";
  if (r < 0.80) return "IN_TRANSIT";
  if (r < 0.90) return "DELIVERED";
  return "DISPUTED";
}

function randomDate(daysBack: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d;
}

export async function seedEgyptianMarketV2() {
  console.log("🚀 Seeding Egyptian Market v2.0...");
  const data = loadData();

  // ── Hotels ──
  const hotelMap = new Map<string, string>(); // json id → db id
  for (const h of data.hotels) {
    const hotel = await prisma.hotel.upsert({
      where: { taxId: h.id },
      update: {},
      create: {
        name: h.name,
        legalName: h.name,
        taxId: h.id,
        city: h.city,
        governorate: h.governorate,
        address: `${h.city}, ${h.governorate}`,
        starRating: h.tier === "luxury" ? 5 : h.tier === "upscale" ? 5 : h.tier === "midscale" ? 4 : h.tier === "heritage" ? 4 : 3,
        roomCount: h.rooms,
        tier: mapHotelTier(h.tier),
        status: "ACTIVE",
        creditLimit: h.monthly_gmv_egp * 1.5,
        creditUsed: 0,
        riskScore: Math.floor(Math.random() * 60) + 10,
        riskTier: h.tier === "luxury" ? "LOW" : h.tier === "economy" ? "HIGH" : "MEDIUM",
      },
    });
    hotelMap.set(h.id, hotel.id);
    console.log(`  ✅ Hotel: ${hotel.name} (${hotel.tier})`);
  }

  // ── Suppliers ──
  const supplierMap = new Map<string, string>();
  for (const s of data.suppliers) {
    const supplier = await prisma.supplier.upsert({
      where: { taxId: s.tax_id },
      update: {},
      create: {
        name: s.name,
        legalName: s.name,
        taxId: s.tax_id,
        email: `contact@${s.id}.hv.local`,
        city: s.city,
        governorate: s.governorate,
        address: `${s.industrial_zone}, ${s.city}`,
        tier: mapSupplierTier(s.monthly_capacity_egp),
        status: "ACTIVE",
        description: `${s.category} supplier based in ${s.industrial_zone}`,
        certifications: "[]",
      },
    });
    supplierMap.set(s.id, supplier.id);
    console.log(`  ✅ Supplier: ${supplier.name} (${supplier.tier})`);
  }

  // ── Products ──
  let productCount = 0;
  for (const p of data.product_catalog) {
    const supplierDbId = supplierMap.get(p.supplier_id);
    if (!supplierDbId) continue;
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        sku: p.sku,
        name: p.name,
        category: mapProductCategory(p.category),
        unitOfMeasure: p.unit,
        unitPrice: p.base_price_egp,
        stockQuantity: Math.floor(Math.random() * 500) + 50,
        status: "ACTIVE",
        supplierId: supplierDbId,
      },
    });
    productCount++;
  }
  console.log(`  ✅ Products: ${productCount}`);

  // ── Orders from pairings ──
  let orderCount = 0;
  for (const pair of data.pairings) {
    const hotelDbId = hotelMap.get(pair.hotel);
    const supplierDbId = supplierMap.get(pair.supplier);
    if (!hotelDbId || !supplierDbId) continue;

    const baseTotal = pair.value_egp * (0.8 + Math.random() * 0.4);
    const subtotal = baseTotal / 1.14;
    const vat = baseTotal - subtotal;
    const status = weightedStatus();

    const order = await prisma.order.create({
      data: {
        orderNumber: `PO-2026-${String(1000 + orderCount).padStart(4, "0")}`,
        hotelId: hotelDbId,
        supplierId: supplierDbId,
        requesterId: "system-seed",
        status,
        subtotal: Math.round(subtotal),
        vatAmount: Math.round(vat),
        total: Math.round(baseTotal),
        currency: "EGP",
        paymentGuaranteed: Math.random() > 0.3,
        paymentGuaranteeMethod: Math.random() > 0.5 ? "FACTORING" : "DIRECT",
        createdAt: randomDate(90),
        updatedAt: randomDate(30),
      },
    });
    orderCount++;
    if (orderCount % 20 === 0) {
      console.log(`  ✅ Orders: ${orderCount}/${data.pairings.length}`);
    }
  }

  console.log("\n🎯 Egyptian Market v2.0 seeded successfully!");
  console.log(`   Hotels:      ${data.hotels.length}`);
  console.log(`   Suppliers:   ${data.suppliers.length}`);
  console.log(`   Products:    ${productCount}`);
  console.log(`   Orders:      ${orderCount}`);
  console.log(`   Total GMV:   ${data.pairings.reduce((s, p) => s + p.value_egp, 0).toLocaleString()} EGP`);
}

// CLI execution
if (require.main === module) {
  seedEgyptianMarketV2()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
