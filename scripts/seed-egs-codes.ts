/**
 * EGS Code Seeder
 * Auto-generates EGS codes for all existing products that don't have one.
 * Run with: npx tsx scripts/seed-egs-codes.ts
 */

import { prisma } from "@/lib/prisma";

async function main() {
  const products = await prisma.product.findMany({
    where: { EgsCode: null },
    include: {
      Supplier: { select: { id: true, name: true, taxId: true } },
      Tenant: { select: { id: true } },
    },
  });

  console.log(`Found ${products.length} products without EGS codes`);

  let created = 0;
  let skipped = 0;

  for (const product of products) {
    try {
      // Generate a deterministic EGS-like code from SKU
      // ETA EGS codes are typically numeric. We'll use SKU as base.
      const codeValue = product.sku.startsWith("EGS-")
        ? product.sku
        : `EGS-${product.sku.replace(/\D/g, "").padStart(6, "0").slice(0, 8)}`;

      await prisma.egsCode.create({
        data: {
          codeValue,
          codeType: "EGS",
          description: `Auto-generated EGS code for ${product.name}`,
          activeFrom: new Date(),
          activeTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          supplierId: product.supplierId,
          productId: product.id,
          tenantId: product.tenantId,
          status: "ACTIVE",
        },
      });
      created++;
      console.log(`  ✓ ${product.name} → ${codeValue}`);
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        skipped++;
        console.log(`  ⊘ ${product.name} → code already exists`);
      } else {
        console.error(`  ✗ ${product.name}: ${err.message}`);
      }
    }
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
