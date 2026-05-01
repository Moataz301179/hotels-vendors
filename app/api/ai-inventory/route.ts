import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: { supplier: { select: { name: true } }, inventorySnapshots: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    const data = products.map((p) => {
      const snap = p.inventorySnapshots[0];
      const projectedDays = p.avgDailyUsage > 0 ? Math.round(p.stockQuantity / p.avgDailyUsage) : 99;
      const isLow = p.stockQuantity <= p.reorderPoint;

      // Simulate AI forecast
      const forecast = Array.from({ length: 30 }, (_, i) => {
        const base = p.avgDailyUsage || Math.max(1, Math.round(p.stockQuantity / 30));
        const noise = Math.round((Math.random() - 0.5) * base * 0.4);
        return Math.max(0, base + noise);
      });

      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        stockQuantity: p.stockQuantity,
        reorderPoint: p.reorderPoint,
        reorderQty: p.reorderQty,
        avgDailyUsage: p.avgDailyUsage,
        projectedDays,
        isLow,
        supplierName: p.supplier.name,
        unitPrice: p.unitPrice,
        forecast,
        aiSuggestion: snap?.aiSuggestion
          ? JSON.parse(snap.aiSuggestion)
          : isLow
            ? { reorderQty: p.reorderQty, reason: "Stock below reorder point", confidence: 0.92 }
            : null,
        lastCountedAt: p.lastCountedAt,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
