/**
 * Pre-Spend Gatekeeper — Hotels Vendors AI Agent
 * Analyzes cart/checkout before execution to prevent overspend,
 * detect anomalies, enforce budgets, and recommend optimizations.
 *
 * RULES:
 * - Read-only analysis. Never mutates orders, budgets, or carts.
 * - All money uses Prisma.Decimal(12,2).
 * - Every DB query scoped to tenantId.
 * - Returns structured risk score + recommendations.
 */

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { ProductCategory } from "@prisma/client";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

export interface CartItemInput {
  productId: string;
  quantity: number;
  unitPrice: number; // EGP
}

export interface PreSpendAnalysis {
  riskScore: number; // 0-100, higher = riskier
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  gateOpen: boolean; // false = block checkout
  cartTotal: number;
  vatAmount: number;
  totalWithVat: number;
  budgetStatus: BudgetCheckResult;
  priceBenchmark: PriceBenchmarkResult;
  anomalyFlags: AnomalyFlag[];
  recommendations: string[];
  savingsOpportunities: SavingsOpportunity[];
  authorityRequired: boolean;
  authorityReason?: string;
}

interface BudgetCheckResult {
  hasBudget: boolean;
  budgetId?: string;
  allocatedLimit: number;
  remainingBuffer: number;
  projectedSpend: number;
  bufferAfterPurchase: number;
  bufferRatio: number; // 0-1
  status: "SAFE" | "WARNING" | "EXCEEDED" | "NO_BUDGET";
}

interface PriceBenchmarkResult {
  skuCount: number;
  productsAnalyzed: number;
  averageVsBenchmark: number; // % difference from market avg
  cheapestAlternativeSavings: number; // EGP saved if switched to cheapest
  bestDeals: BestDeal[];
  overpricedItems: OverpricedItem[];
}

interface BestDeal {
  productId: string;
  productName: string;
  currentPrice: number;
  bestPrice: number;
  bestSupplierId: string;
  bestSupplierName: string;
  savings: number;
}

interface OverpricedItem {
  productId: string;
  productName: string;
  currentPrice: number;
  marketAverage: number;
  premium: number;
  premiumPct: number;
}

interface AnomalyFlag {
  type: "QUANTITY_SPIKE" | "PRICE_SPIKE" | "NEW_SUPPLIER" | "CATEGORY_SURGE" | "FREQUENCY_SPIKE" | "UNUSUAL_HOUR";
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  metadata: Record<string, unknown>;
}

interface SavingsOpportunity {
  type: "BULK_DISCOUNT" | "SUPPLIER_SWITCH" | "LANE_SWITCH" | "CONSOLIDATION";
  description: string;
  potentialSavings: number;
  actionRequired: boolean;
}

// ─────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────

const VAT_RATE = 0.14;
const RISK_THRESHOLDS = { LOW: 30, MEDIUM: 60, HIGH: 80 };
const AUTHORITY_THRESHOLD = 50000; // EGP — orders above require approval
const QUANTITY_SPIKE_MULTIPLIER = 3.0; // 3x avg = spike
const PRICE_SPIKE_MULTIPLIER = 1.5; // 1.5x avg = spike
const CATEGORY_SURGE_MULTIPLIER = 2.0; // 2x monthly avg = surge

// ─────────────────────────────────────────
// MAIN ANALYZER
// ─────────────────────────────────────────

export class PreSpendGatekeeper {
  /**
   * Analyze a cart before checkout.
   * @param items Cart items with productId, quantity, unitPrice
   * @param hotelId Hotel placing the order
   * @param tenantId Tenant isolation
   * @param userId User placing the order (for frequency checks)
   */
  public async analyze(
    items: CartItemInput[],
    hotelId: string,
    tenantId: string,
    userId: string
  ): Promise<PreSpendAnalysis> {
    // Resolve products from DB for accurate pricing/category data
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, tenantId },
      include: { supplier: { select: { id: true, name: true, tier: true } } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Enrich items with DB data
    const enrichedItems = items
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          lineTotal: new Prisma.Decimal(item.unitPrice).mul(item.quantity).toNumber(),
        };
      })
      .filter(Boolean) as (CartItemInput & { product: (typeof products)[0]; lineTotal: number })[];

    const cartTotal = enrichedItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const vatAmount = cartTotal * VAT_RATE;
    const totalWithVat = cartTotal + vatAmount;

    // Parallel analysis
    const [budgetStatus, priceBenchmark, anomalyFlags] = await Promise.all([
      this.checkBudget(hotelId, tenantId, totalWithVat),
      this.benchmarkPrices(enrichedItems, tenantId),
      this.detectAnomalies(enrichedItems, hotelId, tenantId, userId),
    ]);

    // Build recommendations
    const recommendations = this.buildRecommendations(
      budgetStatus,
      priceBenchmark,
      anomalyFlags,
      totalWithVat
    );

    // Savings opportunities
    const savingsOpportunities = this.findSavings(enrichedItems, priceBenchmark, tenantId);

    // Calculate risk score
    const riskScore = this.calculateRiskScore(
      budgetStatus,
      priceBenchmark,
      anomalyFlags,
      totalWithVat
    );

    const riskLevel = this.scoreToLevel(riskScore);
    const gateOpen = riskLevel !== "CRITICAL" && budgetStatus.status !== "EXCEEDED";
    const authorityRequired = totalWithVat >= AUTHORITY_THRESHOLD || riskLevel === "CRITICAL";

    return {
      riskScore,
      riskLevel,
      gateOpen,
      cartTotal,
      vatAmount,
      totalWithVat,
      budgetStatus,
      priceBenchmark,
      anomalyFlags,
      recommendations,
      savingsOpportunities,
      authorityRequired,
      authorityReason: authorityRequired
        ? totalWithVat >= AUTHORITY_THRESHOLD
          ? `Order value EGP ${totalWithVat.toFixed(2)} exceeds authority threshold of EGP ${AUTHORITY_THRESHOLD}`
          : `Critical risk score (${riskScore}) detected`
        : undefined,
    };
  }

  // ─────────────────────────────────────────
  // BUDGET CHECK
  // ─────────────────────────────────────────

  private async checkBudget(
    hotelId: string,
    tenantId: string,
    projectedSpend: number
  ): Promise<BudgetCheckResult> {
    const now = new Date();
    const fiscalYear = now.getFullYear();
    const quarter = this.getQuarter(now);

    const budget = await prisma.procurementBudget.findFirst({
      where: { hotelId, tenantId, fiscalYear, quarter },
    });

    if (!budget) {
      return {
        hasBudget: false,
        allocatedLimit: 0,
        remainingBuffer: 0,
        projectedSpend,
        bufferAfterPurchase: -projectedSpend,
        bufferRatio: 0,
        status: "NO_BUDGET",
      };
    }

    const allocated = Number(budget.allocatedCashLimit);
    const remaining = Number(budget.remainingCashBuffer);
    const bufferAfter = remaining - projectedSpend;
    const bufferRatio = allocated > 0 ? bufferAfter / allocated : 0;

    let status: BudgetCheckResult["status"] = "SAFE";
    if (bufferAfter < 0) status = "EXCEEDED";
    else if (bufferRatio < 0.1) status = "WARNING";

    return {
      hasBudget: true,
      budgetId: budget.id,
      allocatedLimit: allocated,
      remainingBuffer: remaining,
      projectedSpend,
      bufferAfterPurchase: bufferAfter,
      bufferRatio,
      status,
    };
  }

  // ─────────────────────────────────────────
  // PRICE BENCHMARK
  // ─────────────────────────────────────────

  private async benchmarkPrices(
    items: { productId: string; unitPrice: number; product: { sku?: string | null; name: string; category: ProductCategory } }[],
    tenantId: string
  ): Promise<PriceBenchmarkResult> {
    const bestDeals: BestDeal[] = [];
    const overpricedItems: OverpricedItem[] = [];
    let totalVsBenchmark = 0;
    let analyzedCount = 0;
    let totalCheapestSavings = 0;

    for (const item of items) {
      const sku = item.product.sku;
      if (!sku) continue;

      // Find all products with same/similar SKU
      const alternatives = await prisma.product.findMany({
        where: {
          tenantId,
          sku: { contains: sku.split("-")[0] }, // Match base SKU
          id: { not: item.productId },
        },
        orderBy: { unitPrice: "asc" },
        take: 10,
        include: { supplier: { select: { id: true, name: true } } },
      });

      if (alternatives.length === 0) continue;

      analyzedCount++;
      const prices = alternatives.map((a) => Number(a.unitPrice));
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      const min = Math.min(...prices);
      const cheapest = alternatives[0];

      totalVsBenchmark += (item.unitPrice - avg) / avg;

      // Best deal detection
      if (min < item.unitPrice) {
        const savings = (item.unitPrice - min); // per unit
        totalCheapestSavings += savings;
        bestDeals.push({
          productId: item.productId,
          productName: item.product.name,
          currentPrice: item.unitPrice,
          bestPrice: min,
          bestSupplierId: cheapest.supplier.id,
          bestSupplierName: cheapest.supplier.name,
          savings,
        });
      }

      // Overpriced detection (>20% above average)
      if (item.unitPrice > avg * 1.2) {
        overpricedItems.push({
          productId: item.productId,
          productName: item.product.name,
          currentPrice: item.unitPrice,
          marketAverage: avg,
          premium: item.unitPrice - avg,
          premiumPct: ((item.unitPrice - avg) / avg) * 100,
        });
      }
    }

    return {
      skuCount: items.filter((i) => i.product.sku).length,
      productsAnalyzed: analyzedCount,
      averageVsBenchmark: analyzedCount > 0 ? (totalVsBenchmark / analyzedCount) * 100 : 0,
      cheapestAlternativeSavings: totalCheapestSavings,
      bestDeals,
      overpricedItems,
    };
  }

  // ─────────────────────────────────────────
  // ANOMALY DETECTION
  // ─────────────────────────────────────────

  private async detectAnomalies(
    items: { productId: string; quantity: number; lineTotal: number; product: { category: ProductCategory; supplierId: string } }[],
    hotelId: string,
    tenantId: string,
    userId: string
  ): Promise<AnomalyFlag[]> {
    const flags: AnomalyFlag[] = [];

    // 1. Quantity spikes vs historical avg
    for (const item of items) {
      const avgQty = await this.getAverageOrderQuantity(hotelId, item.productId, tenantId);
      if (avgQty > 0 && item.quantity > avgQty * QUANTITY_SPIKE_MULTIPLIER) {
        flags.push({
          type: "QUANTITY_SPIKE",
          severity: "WARNING",
          message: `Quantity ${item.quantity} is ${(item.quantity / avgQty).toFixed(1)}x your average order for this product`,
          metadata: { productId: item.productId, quantity: item.quantity, average: avgQty },
        });
      }
    }

    // 2. Price spikes vs historical avg
    for (const item of items) {
      const avgPrice = await this.getAverageUnitPrice(hotelId, item.productId, tenantId);
      if (avgPrice > 0 && item.lineTotal / item.quantity > avgPrice * PRICE_SPIKE_MULTIPLIER) {
        flags.push({
          type: "PRICE_SPIKE",
          severity: "CRITICAL",
          message: `Unit price EGP ${(item.lineTotal / item.quantity).toFixed(2)} is ${((item.lineTotal / item.quantity) / avgPrice).toFixed(1)}x your historical average`,
          metadata: { productId: item.productId, unitPrice: item.lineTotal / item.quantity, average: avgPrice },
        });
      }
    }

    // 3. New supplier detection
    const supplierIds = [...new Set(items.map((i) => i.product.supplierId))];
    for (const supplierId of supplierIds) {
      const previousOrders = await prisma.order.count({
        where: { hotelId, supplierId, tenantId },
      });
      if (previousOrders === 0) {
        const supplier = await prisma.supplier.findUnique({
          where: { id: supplierId },
          select: { name: true },
        });
        flags.push({
          type: "NEW_SUPPLIER",
          severity: "INFO",
          message: `First order with ${supplier?.name ?? "new supplier"}. Verify quality and terms.`,
          metadata: { supplierId, supplierName: supplier?.name },
        });
      }
    }

    // 4. Category surge vs monthly avg
    const categoryTotals: Record<string, number> = {};
    for (const item of items) {
      const cat = item.product.category;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + item.lineTotal;
    }
    for (const [category, total] of Object.entries(categoryTotals)) {
      const monthlyAvg = await this.getMonthlyCategorySpend(hotelId, category as ProductCategory, tenantId);
      if (monthlyAvg > 0 && total > monthlyAvg * CATEGORY_SURGE_MULTIPLIER) {
        flags.push({
          type: "CATEGORY_SURGE",
          severity: "WARNING",
          message: `${category} spend EGP ${total.toFixed(2)} is ${(total / monthlyAvg).toFixed(1)}x your monthly average`,
          metadata: { category, amount: total, monthlyAverage: monthlyAvg },
        });
      }
    }

    // 5. Frequency spike — too many orders today
    const todayOrders = await prisma.order.count({
      where: {
        hotelId,
        tenantId,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });
    if (todayOrders > 5) {
      flags.push({
        type: "FREQUENCY_SPIKE",
        severity: "INFO",
        message: `${todayOrders} orders placed in the last 24 hours`,
        metadata: { orderCount: todayOrders },
      });
    }

    // 6. Unusual hour (outside 6am-10pm Cairo)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      flags.push({
        type: "UNUSUAL_HOUR",
        severity: "INFO",
        message: `Order placed at unusual hour (${hour}:00). Verify authorization.`,
        metadata: { hour },
      });
    }

    return flags;
  }

  // ─────────────────────────────────────────
  // RECOMMENDATIONS
  // ─────────────────────────────────────────

  private buildRecommendations(
    budget: BudgetCheckResult,
    benchmark: PriceBenchmarkResult,
    flags: AnomalyFlag[],
    total: number
  ): string[] {
    const recs: string[] = [];

    if (budget.status === "NO_BUDGET") {
      recs.push("No procurement budget set for this quarter. Set a budget to enable spend tracking.");
    } else if (budget.status === "EXCEEDED") {
      recs.push(`Budget exceeded by EGP ${Math.abs(budget.bufferAfterPurchase).toFixed(2)}. Consider deferring non-essential items.`);
    } else if (budget.status === "WARNING") {
      recs.push(`Budget buffer low (${(budget.bufferRatio * 100).toFixed(1)}% remaining). Monitor closely.`);
    }

    if (benchmark.cheapestAlternativeSavings > 0) {
      recs.push(`Save EGP ${benchmark.cheapestAlternativeSavings.toFixed(2)} by switching to cheaper suppliers for ${benchmark.bestDeals.length} items.`);
    }

    if (benchmark.overpricedItems.length > 0) {
      recs.push(`${benchmark.overpricedItems.length} items are priced above market average. Negotiate or switch suppliers.`);
    }

    const criticalFlags = flags.filter((f) => f.severity === "CRITICAL");
    for (const flag of criticalFlags) {
      recs.push(`[CRITICAL] ${flag.message}`);
    }

    if (total >= AUTHORITY_THRESHOLD) {
      recs.push(`Order exceeds EGP ${AUTHORITY_THRESHOLD} authority threshold. Manager approval required.`);
    }

    return recs;
  }

  // ─────────────────────────────────────────
  // SAVINGS OPPORTUNITIES
  // ─────────────────────────────────────────

  private findSavings(
    items: { quantity: number; product: { id: string; name: string; category: ProductCategory; supplierId: string } }[],
    benchmark: PriceBenchmarkResult,
    tenantId: string
  ): SavingsOpportunity[] {
    const ops: SavingsOpportunity[] = [];

    // Supplier switch savings
    for (const deal of benchmark.bestDeals) {
      ops.push({
        type: "SUPPLIER_SWITCH",
        description: `Switch ${deal.productName} to ${deal.bestSupplierName} at EGP ${deal.bestPrice.toFixed(2)}/unit`,
        potentialSavings: deal.savings,
        actionRequired: true,
      });
    }

    // Bulk discount detection
    const categoryGroups: Record<string, typeof items> = {};
    for (const item of items) {
      const cat = item.product.category;
      if (!categoryGroups[cat]) categoryGroups[cat] = [];
      categoryGroups[cat].push(item);
    }
    for (const [cat, group] of Object.entries(categoryGroups)) {
      const totalQty = group.reduce((s, i) => s + i.quantity, 0);
      if (totalQty >= 50) {
        ops.push({
          type: "BULK_DISCOUNT",
          description: `Bulk order ${totalQty} units in ${cat}. Negotiate 5-10% volume discount with supplier.`,
          potentialSavings: group.reduce((s, i) => s + i.quantity, 0) * 0.05, // rough estimate
          actionRequired: false,
        });
      }
    }

    return ops;
  }

  // ─────────────────────────────────────────
  // RISK SCORING
  // ─────────────────────────────────────────

  private calculateRiskScore(
    budget: BudgetCheckResult,
    benchmark: PriceBenchmarkResult,
    flags: AnomalyFlag[],
    total: number
  ): number {
    let score = 0;

    // Budget risk (0-40)
    if (budget.status === "EXCEEDED") score += 40;
    else if (budget.status === "WARNING") score += 25;
    else if (budget.status === "NO_BUDGET") score += 10;

    // Price risk (0-25)
    if (benchmark.overpricedItems.length > 0) {
      score += Math.min(25, benchmark.overpricedItems.length * 8);
    }

    // Anomaly risk (0-25)
    const criticalCount = flags.filter((f) => f.severity === "CRITICAL").length;
    const warningCount = flags.filter((f) => f.severity === "WARNING").length;
    score += criticalCount * 15 + warningCount * 5;

    // Value risk (0-10)
    if (total >= 100000) score += 10;
    else if (total >= 50000) score += 5;
    else if (total >= 25000) score += 2;

    return Math.min(100, score);
  }

  private scoreToLevel(score: number): PreSpendAnalysis["riskLevel"] {
    if (score >= RISK_THRESHOLDS.HIGH) return "CRITICAL";
    if (score >= RISK_THRESHOLDS.MEDIUM) return "HIGH";
    if (score >= RISK_THRESHOLDS.LOW) return "MEDIUM";
    return "LOW";
  }

  // ─────────────────────────────────────────
  // HISTORICAL HELPERS
  // ─────────────────────────────────────────

  private async getAverageOrderQuantity(
    hotelId: string,
    productId: string,
    tenantId: string
  ): Promise<number> {
    const result = await prisma.orderItem.aggregate({
      where: {
        productId,
        Order: { hotelId, tenantId },
      },
      _avg: { quantity: true },
    });
    return result._avg.quantity ?? 0;
  }

  private async getAverageUnitPrice(
    hotelId: string,
    productId: string,
    tenantId: string
  ): Promise<number> {
    const result = await prisma.orderItem.aggregate({
      where: {
        productId,
        Order: { hotelId, tenantId },
      },
      _avg: { unitPrice: true },
    });
    return result._avg.unitPrice ? Number(result._avg.unitPrice) : 0;
  }

  private async getMonthlyCategorySpend(
    hotelId: string,
    category: ProductCategory,
    tenantId: string
  ): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await prisma.orderItem.aggregate({
      where: {
        Product: { category },
        Order: { hotelId, tenantId, createdAt: { gte: thirtyDaysAgo } },
      },
      _sum: { total: true },
    });
    return result._sum.total ? Number(result._sum.total) : 0;
  }

  private getQuarter(date: Date): "Q1" | "Q2" | "Q3" | "Q4" {
    const m = date.getMonth();
    if (m < 3) return "Q1";
    if (m < 6) return "Q2";
    if (m < 9) return "Q3";
    return "Q4";
  }
}

// Singleton export
export const preSpendGatekeeper = new PreSpendGatekeeper();
