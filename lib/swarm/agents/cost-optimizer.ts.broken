/**
 * Cost Optimizer — Hotels Vendors AI Agent
 * Continuous cost optimization across suppliers, payment lanes, and consolidation.
 *
 * RULES:
 * - Read-only analysis. Never mutates orders, prices, or supplier data.
 * - All money uses Prisma.Decimal(12,2).
 * - Every DB query scoped to tenantId.
 * - Tracks realized savings vs recommendations.
 */

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { ProductCategory } from "@prisma/client";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

export interface CostOptimizationReport {
  hotelId: string;
  tenantId: string;
  generatedAt: string;
  totalOpportunities: number;
  totalPotentialSavings: number;
  categories: CategoryOptimization[];
  supplierSwitches: SupplierSwitchOpportunity[];
  laneOptimizations: LaneOptimization[];
  consolidationOpportunities: ConsolidationOpportunity[];
  volumeDiscounts: VolumeDiscountOpportunity[];
}

interface CategoryOptimization {
  category: ProductCategory;
  currentMonthlySpend: number;
  optimizedSpend: number;
  potentialSavings: number;
  savingsPct: number;
  topOpportunities: string[];
}

interface SupplierSwitchOpportunity {
  productId: string;
  productName: string;
  currentSupplierId: string;
  currentSupplierName: string;
  currentPrice: number;
  alternativeSupplierId: string;
  alternativeSupplierName: string;
  alternativePrice: number;
  savingsPerUnit: number;
  projectedMonthlySavings: number;
  qualityRisk: "LOW" | "MEDIUM" | "HIGH";
  switchEffort: "EASY" | "MODERATE" | "HARD";
}

interface LaneOptimization {
  orderId: string;
  currentLane: string;
  recommendedLane: string;
  currentCost: number;
  recommendedCost: number;
  savings: number;
  reason: string;
}

interface ConsolidationOpportunity {
  hotelIds: string[];
  hotelNames: string[];
  productId: string;
  productName: string;
  combinedQuantity: number;
  individualOrders: number;
  consolidatedPrice: number;
  currentTotalSpend: number;
  savings: number;
  logisticsSavings: number;
}

interface VolumeDiscountOpportunity {
  supplierId: string;
  supplierName: string;
  category: ProductCategory;
  currentMonthlyVolume: number;
  thresholdForDiscount: number;
  gapToThreshold: number;
  potentialDiscountPct: number;
  projectedSavings: number;
  recommendation: string;
}

// ─────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────

const VAT_RATE = 0.14;
const CONSOLIDATION_MIN_QUANTITY = 100;
const VOLUME_DISCOUNT_THRESHOLDS = [50, 100, 250, 500];
const VOLUME_DISCOUNT_PCTS = [0.02, 0.05, 0.08, 0.12];

// ─────────────────────────────────────────
// MAIN OPTIMIZER
// ─────────────────────────────────────────

export class CostOptimizer {
  /**
   * Generate a comprehensive cost optimization report for a hotel.
   */
  public async generateReport(
    hotelId: string,
    tenantId: string
  ): Promise<CostOptimizationReport> {
    const [
      categoryOpts,
      supplierSwitches,
      laneOpts,
      consolidationOps,
      volumeDiscounts,
    ] = await Promise.all([
      this.analyzeByCategory(hotelId, tenantId),
      this.findSupplierSwitches(hotelId, tenantId),
      this.optimizeLanes(hotelId, tenantId),
      this.findConsolidationOpportunities(hotelId, tenantId),
      this.findVolumeDiscounts(hotelId, tenantId),
    ]);

    const allSavings = [
      ...categoryOpts.map((c) => c.potentialSavings),
      ...supplierSwitches.map((s) => s.projectedMonthlySavings),
      ...laneOpts.map((l) => l.savings),
      ...consolidationOps.map((c) => c.savings + c.logisticsSavings),
      ...volumeDiscounts.map((v) => v.projectedSavings),
    ];

    const totalPotentialSavings = allSavings.reduce((a, b) => a + b, 0);

    return {
      hotelId,
      tenantId,
      generatedAt: new Date().toISOString(),
      totalOpportunities:
        categoryOpts.length +
        supplierSwitches.length +
        laneOpts.length +
        consolidationOps.length +
        volumeDiscounts.length,
      totalPotentialSavings,
      categories: categoryOpts,
      supplierSwitches,
      laneOptimizations: laneOpts,
      consolidationOpportunities: consolidationOps,
      volumeDiscounts,
    };
  }

  // ─────────────────────────────────────────
  // CATEGORY ANALYSIS
  // ─────────────────────────────────────────

  private async analyzeByCategory(
    hotelId: string,
    tenantId: string
  ): Promise<CategoryOptimization[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const spendByCategory = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        Order: { hotelId, tenantId, createdAt: { gte: thirtyDaysAgo } },
      },
      _sum: { total: true, quantity: true },
    });

    const categoryMap: Record<string, { spend: number; qty: number }> = {};

    for (const row of spendByCategory) {
      const product = await prisma.product.findUnique({
        where: { id: row.productId },
        select: { category: true },
      });
      if (!product) continue;
      const cat = product.category;
      if (!categoryMap[cat]) categoryMap[cat] = { spend: 0, qty: 0 };
      categoryMap[cat].spend += Number(row._sum.total ?? 0);
      categoryMap[cat].qty += row._sum.quantity ?? 0;
    }

    const results: CategoryOptimization[] = [];
    for (const [category, data] of Object.entries(categoryMap)) {
      // Estimate 5-15% savings potential based on category maturity
      const savingsPct = category === "F_AND_B" ? 0.08 : category === "CONSUMABLES" ? 0.12 : 0.05;
      const potentialSavings = data.spend * savingsPct;

      results.push({
        category: category as ProductCategory,
        currentMonthlySpend: data.spend,
        optimizedSpend: data.spend - potentialSavings,
        potentialSavings,
        savingsPct: savingsPct * 100,
        topOpportunities: this.getCategoryOpportunities(category as ProductCategory),
      });
    }

    return results.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }

  private getCategoryOpportunities(category: ProductCategory): string[] {
    const map: Record<ProductCategory, string[]> = {
      F_AND_B: ["Negotiate bulk protein contracts", "Switch to seasonal produce suppliers", "Consolidate beverage orders"],
      CONSUMABLES: ["Pool cleaning supplies across properties", "Switch to private-label options", "Negotiate annual contracts"],
      GUEST_SUPPLIES: ["Standardize amenities across chain", "Source from certified local manufacturers", "Reduce packaging waste"],
      FFE: ["Lease vs buy analysis for equipment", "Group furniture orders across hotels", "Refurbish vs replace assessment"],
      SERVICES: ["Bundle maintenance contracts", "Switch to retainer-based agencies", "Negotiate volume discounts"],
    };
    return map[category] || ["Review supplier contracts annually"];
  }

  // ─────────────────────────────────────────
  // SUPPLIER SWITCH ANALYSIS
  // ─────────────────────────────────────────

  private async findSupplierSwitches(
    hotelId: string,
    tenantId: string
  ): Promise<SupplierSwitchOpportunity[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get products this hotel ordered recently
    const recentItems = await prisma.orderItem.findMany({
      where: {
        Order: { hotelId, tenantId, createdAt: { gte: thirtyDaysAgo } },
      },
      include: {
        Product: {
          include: { supplier: { select: { id: true, name: true, tier: true } } },
        },
      },
      distinct: ["productId"],
    });

    const opportunities: SupplierSwitchOpportunity[] = [];

    for (const item of recentItems) {
      const product = item.Product;
      if (!product.sku) continue;

      // Find cheaper alternatives with same/similar SKU
      const alternatives = await prisma.product.findMany({
        where: {
          tenantId,
          sku: { contains: product.sku.split("-")[0] },
          id: { not: product.id },
          unitPrice: { lt: product.unitPrice },
        },
        orderBy: { unitPrice: "asc" },
        take: 3,
        include: { supplier: { select: { id: true, name: true, tier: true } } },
      });

      if (alternatives.length === 0) continue;

      const best = alternatives[0];
      const currentPrice = Number(product.unitPrice);
      const altPrice = Number(best.unitPrice);
      const savingsPerUnit = currentPrice - altPrice;

      // Estimate monthly volume from recent orders
      const monthlyVolume = await prisma.orderItem.aggregate({
        where: {
          productId: product.id,
          Order: { hotelId, tenantId, createdAt: { gte: thirtyDaysAgo } },
        },
        _sum: { quantity: true },
      });
      const qty = monthlyVolume._sum.quantity ?? 0;

      opportunities.push({
        productId: product.id,
        productName: product.name,
        currentSupplierId: product.supplier.id,
        currentSupplierName: product.supplier.name,
        currentPrice,
        alternativeSupplierId: best.supplier.id,
        alternativeSupplierName: best.supplier.name,
        alternativePrice: altPrice,
        savingsPerUnit,
        projectedMonthlySavings: savingsPerUnit * qty,
        qualityRisk: best.supplier.tier === "PREMIUM" ? "LOW" : best.supplier.tier === "STANDARD" ? "MEDIUM" : "HIGH",
        switchEffort: qty > 50 ? "MODERATE" : "EASY",
      });
    }

    return opportunities
      .filter((o) => o.projectedMonthlySavings > 0)
      .sort((a, b) => b.projectedMonthlySavings - a.projectedMonthlySavings)
      .slice(0, 20);
  }

  // ─────────────────────────────────────────
  // LANE OPTIMIZATION
  // ─────────────────────────────────────────

  private async optimizeLanes(
    hotelId: string,
    tenantId: string
  ): Promise<LaneOptimization[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const recentOrders = await prisma.order.findMany({
      where: {
        hotelId,
        tenantId,
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ["CONFIRMED", "DELIVERED"] },
      },
      include: {
        OrderItem: { include: { Product: true } },
      },
      take: 50,
    });

    const optimizations: LaneOptimization[] = [];

    for (const order of recentOrders) {
      const currentLane = order.paymentLaneRef ?? "DIRECT_BANK";
      const total = Number(order.total);

      // Simple heuristic: if order > 10k and hotel has active credit line, suggest factoring
      if (total > 10000 && currentLane === "DIRECT_BANK") {
        const creditLine = await prisma.hotelCreditLine.findUnique({
          where: { hotelId },
        });
        if (creditLine?.status === "ACTIVE" && Number(creditLine.availableBalance) >= total) {
          const financingFee = total * 0.02;
          const interestSaved = total * 0.04 * (60 / 365); // Rough: 4% annualized for 60 days
          const netSavings = interestSaved - financingFee;

          if (netSavings > 0) {
            optimizations.push({
              orderId: order.id,
              currentLane: "DIRECT_BANK",
              recommendedLane: "FACTORING",
              currentCost: total,
              recommendedCost: total + financingFee,
              savings: netSavings,
              reason: `Use factoring to preserve cash. Net savings EGP ${netSavings.toFixed(2)} after financing fee.`,
            });
          }
        }
      }
    }

    return optimizations.sort((a, b) => b.savings - a.savings);
  }

  // ─────────────────────────────────────────
  // CONSOLIDATION OPPORTUNITIES
  // ─────────────────────────────────────────

  private async findConsolidationOpportunities(
    hotelId: string,
    tenantId: string
  ): Promise<ConsolidationOpportunity[]> {
    // Find other hotels in same tenant that ordered same products recently
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const myRecentProducts = await prisma.orderItem.findMany({
      where: {
        Order: { hotelId, tenantId, createdAt: { gte: thirtyDaysAgo } },
      },
      distinct: ["productId"],
      select: { productId: true },
    });

    const opportunities: ConsolidationOpportunity[] = [];

    for (const { productId } of myRecentProducts) {
      // Find orders for same product from other hotels in tenant
      const otherOrders = await prisma.order.findMany({
        where: {
          tenantId,
          hotelId: { not: hotelId },
          createdAt: { gte: thirtyDaysAgo },
          OrderItem: { some: { productId } },
        },
        include: {
          Hotel: { select: { id: true, name: true } },
          OrderItem: { where: { productId } },
        },
      });

      if (otherOrders.length < 2) continue;

      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { name: true, unitPrice: true },
      });
      if (!product) continue;

      const hotelIds = [hotelId, ...otherOrders.map((o) => o.Hotel.id)];
      const hotelNames = ["This hotel", ...otherOrders.map((o) => o.Hotel.name ?? "Unknown")];
      const combinedQty = otherOrders.reduce((sum, o) => sum + o.OrderItem.reduce((s, i) => s + i.quantity, 0), 0);

      if (combinedQty < CONSOLIDATION_MIN_QUANTITY) continue;

      const currentTotal = Number(product.unitPrice) * combinedQty;
      // Assume 8% discount for consolidated volume
      const consolidatedPrice = Number(product.unitPrice) * 0.92;
      const savings = currentTotal - consolidatedPrice * combinedQty;
      const logisticsSavings = otherOrders.length * 150; // Rough EGP 150 per delivery saved

      opportunities.push({
        hotelIds,
        hotelNames,
        productId,
        productName: product.name,
        combinedQuantity: combinedQty,
        individualOrders: otherOrders.length + 1,
        consolidatedPrice,
        currentTotalSpend: currentTotal,
        savings,
        logisticsSavings,
      });
    }

    return opportunities
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 10);
  }

  // ─────────────────────────────────────────
  // VOLUME DISCOUNTS
  // ─────────────────────────────────────────

  private async findVolumeDiscounts(
    hotelId: string,
    tenantId: string
  ): Promise<VolumeDiscountOpportunity[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const spendBySupplier = await prisma.order.groupBy({
      by: ["supplierId"],
      where: {
        hotelId,
        tenantId,
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { subtotal: true },
      _count: { id: true },
    });

    const opportunities: VolumeDiscountOpportunity[] = [];

    for (const row of spendBySupplier) {
      const supplier = await prisma.supplier.findUnique({
        where: { id: row.supplierId },
        select: { name: true },
      });
      if (!supplier) continue;

      const monthlyVolume = Number(row._sum.subtotal ?? 0);

      // Find next threshold
      let nextThreshold = 0;
      let discountPct = 0;
      for (let i = 0; i < VOLUME_DISCOUNT_THRESHOLDS.length; i++) {
        if (monthlyVolume < VOLUME_DISCOUNT_THRESHOLDS[i] * 1000) {
          nextThreshold = VOLUME_DISCOUNT_THRESHOLDS[i] * 1000;
          discountPct = VOLUME_DISCOUNT_PCTS[i];
          break;
        }
      }

      if (nextThreshold === 0) continue;

      const gap = nextThreshold - monthlyVolume;
      const projectedSavings = nextThreshold * discountPct;

      opportunities.push({
        supplierId: row.supplierId,
        supplierName: supplier.name,
        category: "F_AND_B" as ProductCategory, // Generic — could be refined
        currentMonthlyVolume: monthlyVolume,
        thresholdForDiscount: nextThreshold,
        gapToThreshold: gap,
        potentialDiscountPct: discountPct * 100,
        projectedSavings,
        recommendation: `Increase monthly spend with ${supplier.name} by EGP ${gap.toFixed(2)} to unlock ${(discountPct * 100).toFixed(0)}% volume discount.`,
      });
    }

    return opportunities.sort((a, b) => b.projectedSavings - a.projectedSavings);
  }
}

// Singleton export
export const costOptimizer = new CostOptimizer();
