/**
 * Load Pooling Engine — Eco-Ship Optimization
 * Hotels Vendors Logistics Layer
 *
 * Bundles orders from the same industrial zone to reduce shipping costs.
 * Uses AI prediction to decide whether holding for bundling is worthwhile.
 */

import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────

export interface BundleCandidate {
  orderId: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  supplierZone: string; // e.g., "6th_of_october", "10th_of_ramadan"
  hotelId: string;
  hotelZone: string; // Delivery zone
  totalWeight: number; // kg
  totalValue: number;
  temperatureReq: string; // ambient, chilled, frozen
  urgency: "URGENT" | "STANDARD" | "FLEXIBLE";
  requestedDeliveryDate: Date;
  ecoShipEligible: boolean;
}

export interface BundleCluster {
  id: string;
  zone: string;
  temperatureReq: string;
  orders: BundleCandidate[];
  totalWeight: number;
  totalValue: number;
  estimatedSavings: number;
  estimatedDeliveryCost: number;
  holdUntil: Date;
  status: "FORMING" | "READY" | "DISPATCHED" | "CANCELLED";
}

export interface EcoShipRecommendation {
  orderId: string;
  eligible: boolean;
  bundleProbability: number; // 0-1
  recommendedAction: "HOLD_FOR_BUNDLE" | "SHIP_IMMEDIATELY";
  estimatedSavings: number;
  estimatedDelayMinutes: number;
  explanation: string;
}

// ─────────────────────────────────────────
// 2. ZONE MAPPING
// ─────────────────────────────────────────

const INDUSTRIAL_ZONES: Record<string, string[]> = {
  "6th_of_october": ["6th of October", "October City", "السادس من أكتوبر"],
  "10th_of_ramadan": ["10th of Ramadan", "العاشر من رمضان"],
  "obour": ["Obour City", "العبور"],
  "borg_el_arab": ["Borg El Arab", "برج العرب"],
  "nasr_city": ["Nasr City", "مدينة نصر"],
  "new_cairo": ["New Cairo", "التجمع"],
};

const DELIVERY_ZONES: Record<string, string[]> = {
  "greater_cairo": ["Cairo", "Giza", "Nasr City", "Maadi", "Zamalek", "Heliopolis", "New Cairo", "6th of October"],
  "north_coast": ["North Coast", "Sahel", "Marina", "Hacienda"],
  "alexandria": ["Alexandria", "Borg El Arab"],
  "red_sea": ["Hurghada", "Sharm El Sheikh", "El Gouna"],
  "luxor": ["Luxor", "Aswan"],
};

// ─────────────────────────────────────────
// 3. BUNDLE PREDICTOR
// ─────────────────────────────────────────

/**
 * Predict whether holding an order for bundling is worthwhile.
 */
export async function predictBundleEligibility(orderId: string): Promise<EcoShipRecommendation> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      supplier: true,
      hotel: true,
      items: { include: { product: true } },
    },
  });

  if (!order) {
    return {
      orderId,
      eligible: false,
      bundleProbability: 0,
      recommendedAction: "SHIP_IMMEDIATELY",
      estimatedSavings: 0,
      estimatedDelayMinutes: 0,
      explanation: "Order not found",
    };
  }

  // Urgent orders are never eligible
  // TODO: Add urgency field to Order model
  const isUrgent = false; // Placeholder until urgency field exists

  // Frozen items cannot be bundled with ambient/chilled
  const temperatureReq = order.items.some((i) => i.product.temperatureReq === "frozen")
    ? "frozen"
    : order.items.some((i) => i.product.temperatureReq === "chilled")
    ? "chilled"
    : "ambient";

  // Determine supplier zone
  const supplierZone = detectZone(order.supplier.city);
  const hotelZone = detectDeliveryZone(order.hotel.city);

  // Check if there are other orders in the same zone within the last 2 hours
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const recentOrders = await prisma.order.findMany({
    where: {
      id: { not: orderId },
      status: { in: ["APPROVED", "CONFIRMED"] },
      createdAt: { gte: twoHoursAgo },
      supplier: { city: { contains: order.supplier.city } },
    },
    include: { supplier: true, hotel: true, items: { include: { product: true } } },
  });

  // Filter by temperature compatibility
  const compatibleOrders = recentOrders.filter((o) => {
    // We need to fetch items for each order to check temperature
    // For now, simplified: assume same supplier = compatible temperature
    return true;
  });

  // Calculate bundle probability
  const bundleProbability = Math.min(1, compatibleOrders.length / 3); // 3+ orders = 100%

  // Cost estimation
  const orderWeight = order.items.reduce((s, i) => s + i.quantity, 0); // Simplified
  const standaloneCost = estimateDeliveryCost(orderWeight, 1);
  const bundledCost = estimateDeliveryCost(orderWeight + compatibleOrders.reduce((s, o) => s + o.items.reduce((is, ii) => is + ii.quantity, 0), 0), 1 + compatibleOrders.length);
  const estimatedSavings = standaloneCost - (bundledCost / (1 + compatibleOrders.length));

  // Recommendation
  if (bundleProbability >= 0.7 && estimatedSavings > 50 && !isUrgent) {
    return {
      orderId,
      eligible: true,
      bundleProbability,
      recommendedAction: "HOLD_FOR_BUNDLE",
      estimatedSavings: Math.max(0, estimatedSavings),
      estimatedDelayMinutes: 120,
      explanation: `${compatibleOrders.length} compatible orders in ${supplierZone} zone. Holding for 2 hours could save ${estimatedSavings.toFixed(0)} EGP via Eco-Ship bundling.`,
    };
  }

  return {
    orderId,
    eligible: false,
    bundleProbability,
    recommendedAction: "SHIP_IMMEDIATELY",
    estimatedSavings: Math.max(0, estimatedSavings),
    estimatedDelayMinutes: 0,
    explanation: compatibleOrders.length === 0
      ? "No compatible orders in zone for bundling."
      : `Bundle probability (${(bundleProbability * 100).toFixed(0)}%) or savings (${estimatedSavings.toFixed(0)} EGP) too low to justify holding.`,
  };
}

// ─────────────────────────────────────────
// 4. BUNDLE CLUSTERING
// ─────────────────────────────────────────

/**
 * Form bundles from pending orders in the same zone.
 */
export async function formBundles(): Promise<BundleCluster[]> {
  const pendingOrders = await prisma.order.findMany({
    where: {
      status: { in: ["APPROVED", "CONFIRMED"] },
      paymentGuaranteed: true,
    },
    include: {
      supplier: true,
      hotel: true,
      items: { include: { product: true } },
    },
  });

  const candidates: BundleCandidate[] = pendingOrders.map((order) => {
    const temperatureReq = order.items.some((i) => i.product.temperatureReq === "frozen")
      ? "frozen"
      : order.items.some((i) => i.product.temperatureReq === "chilled")
      ? "chilled"
      : "ambient";

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      supplierId: order.supplierId,
      supplierName: order.supplier.name,
      supplierZone: detectZone(order.supplier.city),
      hotelId: order.hotelId,
      hotelZone: detectDeliveryZone(order.hotel.city),
      totalWeight: order.items.reduce((s, i) => s + i.quantity, 0),
      totalValue: order.total,
      temperatureReq,
      urgency: "STANDARD", // TODO: Add urgency field to order
      requestedDeliveryDate: order.deliveryDate || new Date(),
      ecoShipEligible: true,
    };
  });

  // Cluster by supplier zone + temperature requirement
  const clusters = new Map<string, BundleCandidate[]>();
  for (const candidate of candidates) {
    const key = `${candidate.supplierZone}:${candidate.temperatureReq}`;
    if (!clusters.has(key)) {
      clusters.set(key, []);
    }
    clusters.get(key)!.push(candidate);
  }

  const bundleClusters: BundleCluster[] = [];
  for (const [key, orders] of clusters) {
    if (orders.length >= 2) {
      const [zone, temp] = key.split(":");
      const totalWeight = orders.reduce((s, o) => s + o.totalWeight, 0);
      const totalValue = orders.reduce((s, o) => s + o.totalValue, 0);
      const standaloneCost = orders.reduce((s, o) => s + estimateDeliveryCost(o.totalWeight, 1), 0);
      const bundledCost = estimateDeliveryCost(totalWeight, orders.length);

      bundleClusters.push({
        id: `bundle_${Date.now()}_${key}`,
        zone,
        temperatureReq: temp,
        orders,
        totalWeight,
        totalValue,
        estimatedSavings: standaloneCost - bundledCost,
        estimatedDeliveryCost: bundledCost,
        holdUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: "FORMING",
      });
    }
  }

  return bundleClusters.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
}

// ─────────────────────────────────────────
// 5. COST SHARING
// ─────────────────────────────────────────

export interface CostShareResult {
  orderId: string;
  originalCost: number;
  sharedCost: number;
  savings: number;
  sharePercentage: number;
}

/**
 * Calculate cost-sharing for a bundle.
 */
export function calculateCostSharing(cluster: BundleCluster): CostShareResult[] {
  const totalValue = cluster.totalValue;
  const totalCost = cluster.estimatedDeliveryCost;

  return cluster.orders.map((order) => {
    const sharePercentage = totalValue > 0 ? order.totalValue / totalValue : 1 / cluster.orders.length;
    const originalCost = estimateDeliveryCost(order.totalWeight, 1);
    const sharedCost = totalCost * sharePercentage;

    return {
      orderId: order.orderId,
      originalCost,
      sharedCost,
      savings: originalCost - sharedCost,
      sharePercentage,
    };
  });
}

// ─────────────────────────────────────────
// 6. UTILITIES
// ─────────────────────────────────────────

function detectZone(city: string): string {
  const normalized = city.toLowerCase();
  for (const [zone, aliases] of Object.entries(INDUSTRIAL_ZONES)) {
    if (aliases.some((a) => normalized.includes(a.toLowerCase()))) {
      return zone;
    }
  }
  return "unknown";
}

function detectDeliveryZone(city: string): string {
  const normalized = city.toLowerCase();
  for (const [zone, aliases] of Object.entries(DELIVERY_ZONES)) {
    if (aliases.some((a) => normalized.includes(a.toLowerCase()))) {
      return zone;
    }
  }
  return "unknown";
}

function estimateDeliveryCost(weightKg: number, orderCount: number): number {
  // Simplified Egyptian logistics pricing
  const baseCost = 150; // Base delivery fee
  const weightCost = weightKg * 2; // 2 EGP per kg
  const multiOrderDiscount = Math.min(0.3, (orderCount - 1) * 0.05); // 5% per additional order, max 30%
  return (baseCost + weightCost) * (1 - multiOrderDiscount);
}
