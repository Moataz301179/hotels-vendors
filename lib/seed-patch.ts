import { prisma } from "./prisma";

async function patch() {
  console.log("🩹 Patching existing data...");

  const IMAGE_MAP: Record<string, string[]> = {
    F_AND_B: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"],
    CONSUMABLES: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"],
    GUEST_SUPPLIES: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"],
    FFE: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop"],
    SERVICES: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop"],
  };

  // Update products with inventory fields and images
  const products = await prisma.product.findMany();
  for (const p of products) {
    const avgDaily = Math.max(1, Math.round(p.stockQuantity / 30));
    await prisma.product.update({
      where: { id: p.id },
      data: {
        reorderPoint: Math.max(5, Math.round(p.stockQuantity * 0.15)),
        reorderQty: Math.max(20, Math.round(p.stockQuantity * 0.3)),
        avgDailyUsage: avgDaily,
        lastCountedAt: new Date(),
        images: JSON.stringify(IMAGE_MAP[p.category] || ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop"]),
      },
    });
  }
  console.log(`   Updated ${products.length} products with inventory fields`);

  // Create journal entries for existing APPROVED orders
  const orders = await prisma.order.findMany({
    where: { status: "APPROVED" },
    include: { hotel: true },
  });
  for (const o of orders) {
    const exists = await prisma.journalEntry.findFirst({ where: { sourceId: o.id } });
    if (exists) continue;
    const lines = [
      { accountCode: "1300", accountName: "Inventory / Purchases", debit: o.subtotal, credit: 0 },
      { accountCode: "2400", accountName: "VAT Input", debit: o.vatAmount, credit: 0 },
      { accountCode: "2100", accountName: "Accounts Payable", debit: 0, credit: o.total },
    ];
    await prisma.journalEntry.create({
      data: {
        entryNumber: `JE-PO-${o.orderNumber}`,
        date: o.createdAt,
        sourceType: "ORDER",
        sourceId: o.id,
        description: `Auto-posted PO approval — ${o.orderNumber}`,
        lines: JSON.stringify(lines),
        totalDebit: o.subtotal + o.vatAmount,
        totalCredit: o.total,
        status: "POSTED",
        hotelId: o.hotelId,
      },
    });
  }
  console.log(`   Created ${orders.length} journal entries`);

  // Create inventory snapshots
  for (const p of products) {
    const avgDaily = Math.max(1, Math.round(p.stockQuantity / 30));
    await prisma.inventorySnapshot.create({
      data: {
        productId: p.id,
        stockLevel: p.stockQuantity,
        projectedDays: Math.round(p.stockQuantity / avgDaily),
        aiSuggestion: JSON.stringify({
          reorderQty: Math.max(20, Math.round(p.stockQuantity * 0.3)),
          reason: p.stockQuantity < 50 ? "Stock below reorder point" : "Seasonal demand expected",
          confidence: 0.85 + Math.random() * 0.12,
        }),
        occupancyRate: 0.72 + Math.random() * 0.2,
        consumptionRate: avgDaily,
      },
    });
  }
  console.log(`   Created ${products.length} inventory snapshots`);

  console.log("✅ Patch complete");
}

patch()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
