/**
 * Pre-Spend Gatekeeper — AI Agent
 * Analyzes cart before checkout: budget, anomalies, price benchmarks, credit.
 * Returns a gate decision: APPROVE, WARN, or BLOCK.
 */

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export interface PreSpendInput {
  cartId: string;
  hotelId: string;
  tenantId: string;
  userId: string;
}

export interface PriceBenchmark {
  productId: string;
  sku: string;
  name: string;
  currentUnitPrice: number;
  marketAvg: number;
  marketMin: number;
  marketMax: number;
  benchmarkDate: string;
}

export interface PreSpendResult {
  decision: "APPROVE" | "WARN" | "BLOCK";
  score: number; // 0-100
  reasons: string[];
  warnings: string[];
  priceBenchmarks: PriceBenchmark[];
  budgetStatus: {
    allocated: number;
    spent: number;
    remaining: number;
    cartTotal: number;
    projectedRemaining: number;
  } | null;
  creditStatus: {
    creditLimit: number;
    creditUsed: number;
    creditAvailable: number;
    cartTotal: number;
    projectedUtilization: number;
  } | null;
  anomalies: string[];
  recommendedActions: string[];
}

export async function analyzePreSpend(input: PreSpendInput): Promise<PreSpendResult> {
  const { cartId, hotelId, tenantId } = input;

  // Fetch cart with items and products
  const cart = await prisma.cart.findFirst({
    where: { id: cartId, hotelId, tenantId },
    include: {
      CartItem: {
        include: {
          Product: {
            include: { Supplier: true },
          },
        },
      },
    },
  });

  if (!cart) {
    return blockResult("Cart not found or does not belong to this hotel.");
  }

  if (cart.CartItem.length === 0) {
    return blockResult("Cart is empty.");
  }

  const cartTotal = cart.CartItem.reduce((sum, item) => sum + Number(item.total), 0);
  const reasons: string[] = [];
  const warnings: string[] = [];
  const anomalies: string[] = [];
  const recommendedActions: string[] = [];

  // ── 1. BUDGET CHECK ──
  const budgetStatus = await checkBudget(hotelId, tenantId, cartTotal);
  if (budgetStatus) {
    if (budgetStatus.projectedRemaining < 0) {
      anomalies.push(`Cart total (${fmt(cartTotal)}) exceeds remaining budget (${fmt(budgetStatus.remaining)}).`);
      recommendedActions.push("Request budget increase or remove items.");
    } else if (budgetStatus.projectedRemaining < budgetStatus.allocated * 0.1) {
      warnings.push(`Budget nearly depleted after this order. Remaining: ${fmt(budgetStatus.projectedRemaining)}.`);
    } else {
      reasons.push(`Within budget. Remaining after order: ${fmt(budgetStatus.projectedRemaining)}.`);
    }
  }

  // ── 2. CREDIT CHECK ──
  const creditStatus = await checkCredit(hotelId, cartTotal);
  if (creditStatus) {
    if (creditStatus.projectedUtilization > 0.95) {
      anomalies.push(`Credit utilization would reach ${pct(creditStatus.projectedUtilization)}. Limit: ${fmt(creditStatus.creditLimit)}.`);
      recommendedActions.push("Pay down outstanding balance or request credit line increase.");
    } else if (creditStatus.projectedUtilization > 0.8) {
      warnings.push(`Credit utilization would be ${pct(creditStatus.projectedUtilization)}.`);
    } else {
      reasons.push(`Credit healthy. Utilization after order: ${pct(creditStatus.projectedUtilization)}.`);
    }
  }

  // ── 3. PRICE BENCHMARKING ──
  const priceBenchmarks = await benchmarkPrices(cart.CartItem.map((i) => i.productId), tenantId);
  for (const pb of priceBenchmarks) {
    if (pb.currentUnitPrice > pb.marketAvg * 1.2) {
      warnings.push(`${pb.name} is ${pct(pb.currentUnitPrice / pb.marketAvg - 1)} above market average.`);
      recommendedActions.push(`Consider alternative supplier for ${pb.sku}.`);
    }
  }

  // ── 4. ANOMALY DETECTION ──
  const orderAnomalies = await detectAnomalies(hotelId, tenantId, cart);
  anomalies.push(...orderAnomalies);

  // ── 5. SUPPLIER RISK ──
  const supplierIds = [...new Set(cart.CartItem.map((i) => i.Product.supplierId))];
  const suppliers = await prisma.supplier.findMany({
    where: { id: { in: supplierIds }, tenantId },
    select: { id: true, name: true, complianceStatus: true, rating: true, status: true },
  });
  for (const s of suppliers) {
    if (s.complianceStatus !== "ACTIVE") {
      warnings.push(`Supplier ${s.name} compliance status: ${s.complianceStatus}.`);
    }
    if (s.status !== "ACTIVE" && s.status !== "APPROVED") {
      anomalies.push(`Supplier ${s.name} is not active (status: ${s.status}).`);
    }
    if (s.rating !== null && Number(s.rating) < 2.5) {
      warnings.push(`Supplier ${s.name} has low rating (${Number(s.rating).toFixed(1)}).`);
    }
  }

  // ── 6. SCORING & DECISION ──
  let score = 100;
  score -= anomalies.length * 20;
  score -= warnings.length * 10;
  score = Math.max(0, Math.min(100, score));

  let decision: PreSpendResult["decision"] = "APPROVE";
  if (anomalies.length > 0) decision = "BLOCK";
  else if (warnings.length > 0) decision = "WARN";

  return {
    decision,
    score,
    reasons,
    warnings,
    priceBenchmarks,
    budgetStatus,
    creditStatus,
    anomalies,
    recommendedActions,
  };
}

// ── Helpers ──

async function checkBudget(hotelId: string, tenantId: string, cartTotal: number) {
  const now = new Date();
  const fy = now.getFullYear();
  const q: Array<"Q1" | "Q2" | "Q3" | "Q4"> = ["Q1", "Q2", "Q3", "Q4"];
  const quarter = q[Math.floor(now.getMonth() / 3)];

  const budgets = await prisma.procurementBudget.findMany({
    where: { hotelId, tenantId, fiscalYear: fy, quarter },
  });

  if (budgets.length === 0) return null;

  const allocated = budgets.reduce((s, b) => s + Number(b.allocatedCashLimit), 0);
  const spent = budgets.reduce((s, b) => s + Number(b.totalSpend), 0);
  const remaining = budgets.reduce((s, b) => s + Number(b.remainingCashBuffer), 0);

  return {
    allocated,
    spent,
    remaining,
    cartTotal,
    projectedRemaining: remaining - cartTotal,
  };
}

async function checkCredit(hotelId: string, cartTotal: number) {
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    select: { creditLimit: true, creditUsed: true },
  });
  if (!hotel || hotel.creditLimit == null) return null;

  const limit = Number(hotel.creditLimit);
  const used = Number(hotel.creditUsed ?? 0);
  const available = limit - used;
  const projected = limit > 0 ? (used + cartTotal) / limit : 0;

  return {
    creditLimit: limit,
    creditUsed: used,
    creditAvailable: available,
    cartTotal,
    projectedUtilization: projected,
  };
}

async function benchmarkPrices(productIds: string[], tenantId: string): Promise<PriceBenchmark[]> {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, tenantId },
    select: { id: true, sku: true, name: true, unitPrice: true, category: true },
  });

  const results: PriceBenchmark[] = [];
  for (const p of products) {
    const peers = await prisma.product.findMany({
      where: { category: p.category, tenantId, NOT: { id: p.id } },
      select: { unitPrice: true },
      take: 50,
    });
    const prices = peers.map((x) => Number(x.unitPrice)).filter((x) => x > 0);
    const current = Number(p.unitPrice);

    if (prices.length === 0) {
      results.push({
        productId: p.id,
        sku: p.sku,
        name: p.name,
        currentUnitPrice: current,
        marketAvg: current,
        marketMin: current,
        marketMax: current,
        benchmarkDate: new Date().toISOString(),
      });
      continue;
    }

    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    results.push({
      productId: p.id,
      sku: p.sku,
      name: p.name,
      currentUnitPrice: current,
      marketAvg: avg,
      marketMin: Math.min(...prices),
      marketMax: Math.max(...prices),
      benchmarkDate: new Date().toISOString(),
    });
  }
  return results;
}

async function detectAnomalies(
  hotelId: string,
  tenantId: string,
  cart: { CartItem: Array<{ Product: { supplierId: string }; quantity: number; total: number }> }
) {
  const anomalies: string[] = [];

  // Unusual order size
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentOrders = await prisma.order.findMany({
    where: {
      hotelId,
      tenantId,
      createdAt: { gte: thirtyDaysAgo },
      status: { notIn: [OrderStatus.DRAFT, OrderStatus.CANCELLED, OrderStatus.REJECTED] },
    },
    select: { totalAmount: true },
  });

  const cartTotal = cart.CartItem.reduce((s, i) => s + Number(i.total), 0);
  if (recentOrders.length > 0) {
    const avgOrder = recentOrders.reduce((s, o) => s + Number(o.totalAmount), 0) / recentOrders.length;
    if (cartTotal > avgOrder * 3) {
      anomalies.push(`Order value (${fmt(cartTotal)}) is >3x your 30-day average (${fmt(avgOrder)}).`);
    }
  }

  // Single-supplier concentration
  const supplierIds = cart.CartItem.map((i) => i.Product.supplierId);
  const uniqueSuppliers = new Set(supplierIds);
  if (uniqueSuppliers.size === 1 && cart.CartItem.length > 2) {
    anomalies.push("High supplier concentration: all items from one supplier.");
  }

  return anomalies;
}

function blockResult(reason: string): PreSpendResult {
  return {
    decision: "BLOCK",
    score: 0,
    reasons: [],
    warnings: [],
    priceBenchmarks: [],
    budgetStatus: null,
    creditStatus: null,
    anomalies: [reason],
    recommendedActions: ["Review cart and try again."],
  };
}

function fmt(n: number) {
  return `${n.toFixed(2)} EGP`;
}
function pct(n: number) {
  return `${(n * 100).toFixed(0)}%`;
}
