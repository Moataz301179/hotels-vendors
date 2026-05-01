/**
 * Memory Layer — Temporal Graph + Price Intelligence
 * Hotels Vendors Intelligence Layer
 *
 * Learns from supplier behavior and market prices over time.
 * Uses temporal embeddings + anomaly detection.
 * NEVER scrapes competitors — uses internal data only.
 */

import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────

export interface SupplierEmbedding {
  supplierId: string;
  vector: number[]; // 32-dimensional behavior vector
  dimensions: {
    pricingStability: number;    // Low variance = high score
    onTimeDelivery: number;      // % on-time
    qualityScore: number;        // Based on disputes/returns
    creditBehavior: number;      // Payment timeliness
    communication: number;       // Response time to orders
    catalogDepth: number;        // Number of active SKUs
    seasonalityScore: number;    // Consistency across seasons
  };
  updatedAt: Date;
}

export interface PriceBenchmark {
  sku: string;
  category: string;
  fairPriceMin: number;
  fairPriceMax: number;
  marketAverage: number;
  lastUpdated: Date;
  sampleSize: number;
}

export interface AnomalyAlert {
  entityId: string;
  entityType: "SUPPLIER" | "HOTEL" | "PRODUCT";
  anomalyType: "PRICE_SPIKE" | "PRICE_DROP" | "DELAY_INCREASE" | "QUALITY_DROP" | "CREDIT_RISK";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  expectedValue: number;
  actualValue: number;
  detectedAt: Date;
}

// ─────────────────────────────────────────
// 2. SUPPLIER EMBEDDING ENGINE
// ─────────────────────────────────────────

/**
 * Compute a 32-dimensional embedding vector for a supplier.
 * Represents their "behavior profile" in the marketplace.
 */
export async function computeSupplierEmbedding(supplierId: string): Promise<SupplierEmbedding> {
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    include: {
      products: true,
      orders: {
        include: { approvals: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      },
      invoices: { orderBy: { issueDate: "desc" }, take: 50 },
      audits: true,
    },
  });

  if (!supplier) {
    throw new Error(`Supplier not found: ${supplierId}`);
  }

  const orders = supplier.orders;
  const products = supplier.products;
  const invoices = supplier.invoices;
  const audits = supplier.audits;

  // Dimension 1: Pricing Stability (0-1)
  const pricingStability = calculatePricingStability(products);

  // Dimension 2: On-Time Delivery (0-1)
  const onTimeDelivery = calculateOnTimeDelivery(orders);

  // Dimension 3: Quality Score (0-1)
  const qualityScore = calculateQualityScore(orders, audits);

  // Dimension 4: Credit Behavior (0-1)
  const creditBehavior = calculateCreditBehavior(invoices);

  // Dimension 5: Communication (0-1)
  const communication = calculateCommunicationScore(orders);

  // Dimension 6: Catalog Depth (0-1)
  const catalogDepth = Math.min(1, products.length / 50);

  // Dimension 7: Seasonality Score (0-1)
  const seasonalityScore = calculateSeasonalityScore(orders);

  // Build vector (repeat dimensions to reach 32 for pgvector compatibility)
  const baseVector = [
    pricingStability,
    onTimeDelivery,
    qualityScore,
    creditBehavior,
    communication,
    catalogDepth,
    seasonalityScore,
  ];

  // Pad to 32 dimensions by repeating and adding noise
  const vector: number[] = [];
  while (vector.length < 32) {
    vector.push(...baseVector.map((v) => v + (Math.random() - 0.5) * 0.01));
  }
  vector.length = 32;

  // Normalize vector to unit length
  const magnitude = Math.sqrt(vector.reduce((s, v) => s + v * v, 0));
  const normalizedVector = vector.map((v) => v / magnitude);

  return {
    supplierId,
    vector: normalizedVector,
    dimensions: {
      pricingStability,
      onTimeDelivery,
      qualityScore,
      creditBehavior,
      communication,
      catalogDepth,
      seasonalityScore,
    },
    updatedAt: new Date(),
  };
}

// ─────────────────────────────────────────
// 3. PRICE INTELLIGENCE (INTERNAL ONLY)
// ─────────────────────────────────────────

/**
 * Build fair price benchmark for a SKU using ONLY internal platform data.
 * NEVER scrapes competitors.
 */
export async function buildPriceBenchmark(sku: string): Promise<PriceBenchmark | null> {
  const product = await prisma.product.findUnique({
    where: { sku },
    include: { supplier: true },
  });

  if (!product) return null;

  // Get historical prices for this SKU (via Order to access createdAt)
  const ordersWithProduct = await prisma.order.findMany({
    where: { items: { some: { productId: product.id } } },
    select: { createdAt: true, items: { where: { productId: product.id }, select: { unitPrice: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const orderItems = ordersWithProduct.flatMap((o) => o.items.map((i) => ({ ...i, createdAt: o.createdAt })));

  if (orderItems.length < 5) {
    // Not enough data
    return {
      sku,
      category: product.category,
      fairPriceMin: product.unitPrice * 0.85,
      fairPriceMax: product.unitPrice * 1.15,
      marketAverage: product.unitPrice,
      lastUpdated: new Date(),
      sampleSize: orderItems.length,
    };
  }

  const prices = orderItems.map((item) => item.unitPrice).sort((a, b) => a - b);
  const min = prices[0];
  const max = prices[prices.length - 1];
  const avg = prices.reduce((s, p) => s + p, 0) / prices.length;

  // Use interquartile range for fair price band
  const q1Index = Math.floor(prices.length * 0.25);
  const q3Index = Math.floor(prices.length * 0.75);
  const q1 = prices[q1Index];
  const q3 = prices[q3Index];
  const iqr = q3 - q1;

  const fairMin = Math.max(min, q1 - 1.5 * iqr);
  const fairMax = Math.min(max, q3 + 1.5 * iqr);

  return {
    sku,
    category: product.category,
    fairPriceMin: fairMin,
    fairPriceMax: fairMax,
    marketAverage: avg,
    lastUpdated: new Date(),
    sampleSize: prices.length,
  };
}

// ─────────────────────────────────────────
// 4. ANOMALY DETECTION
// ─────────────────────────────────────────

/**
 * Detect anomalies in supplier behavior or pricing.
 */
export async function detectAnomalies(supplierId: string): Promise<AnomalyAlert[]> {
  const alerts: AnomalyAlert[] = [];

  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    include: {
      products: true,
      orders: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  if (!supplier) return alerts;

  // Price spike detection
  for (const product of supplier.products) {
    const recentOrdersWithProduct = await prisma.order.findMany({
      where: { items: { some: { productId: product.id } } },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { createdAt: true, items: { where: { productId: product.id }, select: { unitPrice: true } } },
    });
    const recentItems = recentOrdersWithProduct.flatMap((o) => o.items.map((i) => ({ ...i, createdAt: o.createdAt })));

    if (recentItems.length >= 5) {
      const recentPrices = recentItems.slice(0, 5).map((i) => i.unitPrice);
      const olderPrices = recentItems.slice(5).map((i) => i.unitPrice);
      const recentAvg = recentPrices.reduce((s, p) => s + p, 0) / recentPrices.length;
      const olderAvg = olderPrices.length > 0
        ? olderPrices.reduce((s, p) => s + p, 0) / olderPrices.length
        : recentAvg;

      if (olderAvg > 0) {
        const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
        if (changePercent > 30) {
          alerts.push({
            entityId: product.id,
            entityType: "PRODUCT",
            anomalyType: "PRICE_SPIKE",
            severity: changePercent > 50 ? "CRITICAL" : "HIGH",
            description: `Price increased ${changePercent.toFixed(0)}% for ${product.name}`,
            expectedValue: olderAvg,
            actualValue: recentAvg,
            detectedAt: new Date(),
          });
        } else if (changePercent < -30) {
          alerts.push({
            entityId: product.id,
            entityType: "PRODUCT",
            anomalyType: "PRICE_DROP",
            severity: "MEDIUM",
            description: `Price dropped ${Math.abs(changePercent).toFixed(0)}% for ${product.name}`,
            expectedValue: olderAvg,
            actualValue: recentAvg,
            detectedAt: new Date(),
          });
        }
      }
    }
  }

  // Delay increase detection
  const recentOrders = supplier.orders.slice(0, 20);
  const onTimeRecent = recentOrders.filter((o) =>
    o.status === "DELIVERED" && o.deliveryDate && o.createdAt &&
    o.deliveryDate.getTime() - o.createdAt.getTime() <= 3 * 24 * 60 * 60 * 1000
  ).length;
  const onTimeRateRecent = recentOrders.length > 0 ? onTimeRecent / recentOrders.length : 1;

  const olderOrders = supplier.orders.slice(20, 50);
  const onTimeOlder = olderOrders.filter((o) =>
    o.status === "DELIVERED" && o.deliveryDate && o.createdAt &&
    o.deliveryDate.getTime() - o.createdAt.getTime() <= 3 * 24 * 60 * 60 * 1000
  ).length;
  const onTimeRateOlder = olderOrders.length > 0 ? onTimeOlder / olderOrders.length : 1;

  if (onTimeRateOlder > 0 && onTimeRateRecent < onTimeRateOlder - 0.2) {
    alerts.push({
      entityId: supplierId,
      entityType: "SUPPLIER",
      anomalyType: "DELAY_INCREASE",
      severity: onTimeRateRecent < 0.5 ? "CRITICAL" : "HIGH",
      description: `On-time delivery dropped from ${(onTimeRateOlder * 100).toFixed(0)}% to ${(onTimeRateRecent * 100).toFixed(0)}%`,
      expectedValue: onTimeRateOlder,
      actualValue: onTimeRateRecent,
      detectedAt: new Date(),
    });
  }

  return alerts;
}

// ─────────────────────────────────────────
// 5. AUTO-OPTIMIZATION (CONSERVATIVE)
// ─────────────────────────────────────────

export interface AutoOptimization {
  type: "REORDER_POINT" | "CREDIT_LIMIT" | "ROUTE_PREFERENCE";
  entityId: string;
  currentValue: number;
  suggestedValue: number;
  confidence: number;
  reason: string;
  reversible: boolean;
  reversalDeadline: Date;
}

/**
 * Generate conservative auto-optimization suggestions.
 * NEVER auto-adjusts prices, fees, or factoring rates.
 */
export async function generateAutoOptimizations(entityId: string, entityType: "HOTEL" | "SUPPLIER"): Promise<AutoOptimization[]> {
  const optimizations: AutoOptimization[] = [];

  if (entityType === "HOTEL") {
    // Suggest reorder points based on consumption history
    const hotel = await prisma.hotel.findUnique({
      where: { id: entityId },
      include: {
        orders: { include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" }, take: 50 },
      },
    });

    if (!hotel) return optimizations;

    // Aggregate consumption by product
    const consumption = new Map<string, { total: number; count: number; lastOrder: Date }>();
    for (const order of hotel.orders) {
      for (const item of order.items) {
        const existing = consumption.get(item.productId) || { total: 0, count: 0, lastOrder: order.createdAt };
        existing.total += item.quantity;
        existing.count += 1;
        consumption.set(item.productId, existing);
      }
    }

    for (const [productId, data] of consumption) {
      if (data.count >= 3) {
        const avgMonthly = data.total / (data.count / 4); // Rough: 4 orders per month
        const suggestedReorder = Math.ceil(avgMonthly * 0.5); // 2 weeks supply

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (product && product.reorderPoint !== suggestedReorder) {
          optimizations.push({
            type: "REORDER_POINT",
            entityId: productId,
            currentValue: product.reorderPoint,
            suggestedValue: suggestedReorder,
            confidence: Math.min(0.9, data.count / 10),
            reason: `Based on ${data.count} orders averaging ${avgMonthly.toFixed(0)} units/month`,
            reversible: true,
            reversalDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
        }
      }
    }
  }

  return optimizations;
}

// ─────────────────────────────────────────
// 6. HELPERS
// ─────────────────────────────────────────

function calculatePricingStability(products: { unitPrice: number; updatedAt: Date }[]): number {
  if (products.length === 0) return 0.5;
  // More recent updates = less stable
  const recentUpdates = products.filter((p) => {
    const daysSinceUpdate = (Date.now() - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate < 30;
  }).length;
  return Math.max(0, 1 - recentUpdates / products.length);
}

function calculateOnTimeDelivery(orders: { status: string; createdAt: Date; deliveryDate: Date | null }[]): number {
  const delivered = orders.filter((o) => o.status === "DELIVERED" && o.deliveryDate);
  if (delivered.length === 0) return 0.5;
  const onTime = delivered.filter((o) => {
    const days = (o.deliveryDate!.getTime() - o.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return days <= 3;
  }).length;
  return onTime / delivered.length;
}

function calculateQualityScore(
  orders: { status: string }[],
  audits: { status: string; score: number | null }[]
): number {
  const disputeRate = orders.filter((o) => o.status === "DISPUTED").length / Math.max(1, orders.length);
  const auditScore = audits.length > 0
    ? audits.reduce((s, a) => s + (a.score ?? 50), 0) / audits.length / 100
    : 0.5;
  return (1 - disputeRate) * 0.5 + auditScore * 0.5;
}

function calculateCreditBehavior(invoices: { paidDate: Date | null; dueDate: Date | null }[]): number {
  const paid = invoices.filter((inv) => inv.paidDate && inv.dueDate);
  if (paid.length === 0) return 0.5;
  const onTime = paid.filter((inv) => {
    const daysLate = (inv.paidDate!.getTime() - inv.dueDate!.getTime()) / (1000 * 60 * 60 * 24);
    return daysLate <= 3;
  }).length;
  return onTime / paid.length;
}

function calculateCommunicationScore(orders: { status: string; createdAt: Date }[]): number {
  // Proxy: orders that moved quickly from draft to approved
  if (orders.length === 0) return 0.5;
  const fastOrders = orders.filter((o) => {
    // Simplified: approved within 24 hours
    return o.status !== "DRAFT";
  }).length;
  return fastOrders / orders.length;
}

function calculateSeasonalityScore(orders: { createdAt: Date }[]): number {
  if (orders.length < 12) return 0.5;
  // Check if orders are spread across months (not concentrated in one season)
  const months = new Set(orders.map((o) => o.createdAt.getMonth()));
  return Math.min(1, months.size / 12);
}
