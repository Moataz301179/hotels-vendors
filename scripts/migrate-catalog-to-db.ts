/**
 * Migrate catalog-products.json into the Prisma database.
 * Creates unique suppliers from the catalog, then maps all 94 products
 * with correct Prisma ProductCategory enum values.
 *
 * Run: npx tsx scripts/migrate-catalog-to-db.ts
 */

import { PrismaClient, ProductCategory, ProductStatus } from "@prisma/client";
import catalogData from "../data/catalog-products.json";

const prisma = new PrismaClient();

const MARKETPLACE_TO_PRISMA: Record<string, ProductCategory> = {
  fb: "F_AND_B",
  hk: "CONSUMABLES",
  ffe: "FFE",
  ose: "CONSUMABLES",
  gra: "GUEST_SUPPLIES",
  lin: "GUEST_SUPPLIES",
  eng: "SERVICES",
  spa: "GUEST_SUPPLIES",
  it: "SERVICES",
  sec: "SERVICES",
};

async function main() {
  console.log("🔄 Migrating catalog products to database...\n");

  const products = (catalogData as { products: any[] }).products;
  console.log(`📦 Found ${products.length} products in catalog`);

  // ── 1. Get or create default tenant ────────────────────────
  let tenant = await prisma.tenant.findFirst({ where: { slug: "platform" } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Hotels Vendors Platform",
        slug: "platform",
        type: "PLATFORM",
        status: "ACTIVE",
        taxId: "000-000-000",
      },
    });
    console.log(`🏢 Created tenant: ${tenant.id}`);
  }

  // ── 2. Collect unique suppliers ────────────────────────────
  const supplierMap = new Map<string, {
    name: string;
    city: string;
    tier: string;
    rating: number;
    reviewCount: number;
  }>();

  for (const p of products) {
    if (!supplierMap.has(p.supplierName)) {
      supplierMap.set(p.supplierName, {
        name: p.supplierName,
        city: p.supplierCity || "Cairo",
        tier: p.supplierTier || "CORE",
        rating: p.supplierRating || 4.0,
        reviewCount: p.supplierReviewCount || 0,
      });
    }
  }

  console.log(`🏭 ${supplierMap.size} unique suppliers found`);

  // ── 3. Create suppliers ────────────────────────────────────
  const supplierIdMap = new Map<string, string>();
  let supplierIndex = 1;

  for (const [name, data] of supplierMap) {
    const taxId = `SUP-${String(supplierIndex).padStart(4, "0")}`;
    const email = `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20)}.com`;

    const supplier = await prisma.supplier.upsert({
      where: { taxId },
      update: {},
      create: {
        name: data.name,
        legalName: data.name,
        taxId,
        email,
        city: data.city,
        governorate: data.city === "Obour" ? "Qalyubia" :
          data.city === "Fayoum" ? "Fayoum" :
          data.city === "Alexandria" ? "Alexandria" :
          data.city === "Hurghada" ? "Red Sea" :
          data.city === "Sharm El-Sheikh" ? "South Sinai" :
          data.city === "6th of October" ? "Giza" :
          data.city === "10th of Ramadan" ? "Sharqia" : "Cairo",
        tier: data.tier as any,
        rating: data.rating,
        reviewCount: data.reviewCount,
        status: "ACTIVE",
        tenantId: tenant.id,
      },
    });

    supplierIdMap.set(name, supplier.id);
    supplierIndex++;
  }

  console.log(`✅ ${supplierIdMap.size} suppliers created/verified`);

  // ── 4. Create products ─────────────────────────────────────
  let created = 0;
  let skipped = 0;

  for (const p of products) {
    const prismaCategory = MARKETPLACE_TO_PRISMA[p.category] || "F_AND_B";
    const supplierId = supplierIdMap.get(p.supplierName);

    if (!supplierId) {
      console.warn(`⚠️ No supplier found for: ${p.supplierName}`);
      skipped++;
      continue;
    }

    // Upsert by SKU to avoid duplicates
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        description: p.description,
        category: prismaCategory,
        subcategory: p.subcategory,
        unitPrice: p.unitPrice,
        currency: p.currency || "EGP",
        stockQuantity: p.stockQuantity || 0,
        minOrderQty: p.minOrderQty || 1,
        unitOfMeasure: p.unitOfMeasure || "piece",
        leadTimeDays: p.leadTimeDays || 1,
        shelfLifeDays: p.shelfLifeDays || null,
        temperatureReq: p.temperatureReq || null,
        status: "ACTIVE",
        supplierId,
        tenantId: tenant.id,
      },
      create: {
        sku: p.sku,
        name: p.name,
        description: p.description,
        category: prismaCategory,
        subcategory: p.subcategory,
        unitPrice: p.unitPrice,
        currency: p.currency || "EGP",
        stockQuantity: p.stockQuantity || 0,
        minOrderQty: p.minOrderQty || 1,
        unitOfMeasure: p.unitOfMeasure || "piece",
        leadTimeDays: p.leadTimeDays || 1,
        shelfLifeDays: p.shelfLifeDays || null,
        temperatureReq: p.temperatureReq || null,
        status: "ACTIVE",
        supplierId,
        tenantId: tenant.id,
      },
    });

    created++;
  }

  console.log(`\n✅ Migration complete:`);
  console.log(`   ${created} products created/updated`);
  console.log(`   ${skipped} products skipped`);
  console.log(`   ${supplierIdMap.size} suppliers`);

  // Verify
  const dbProducts = await prisma.product.count({ where: { status: "ACTIVE" } });
  console.log(`\n📊 Total ACTIVE products in database: ${dbProducts}`);
}

main()
  .catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
