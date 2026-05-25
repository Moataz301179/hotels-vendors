/**
 * Cost Optimizer — AI Agent
 * Recommends cost-saving actions: substitute products, bulk discounts,
 * consolidate suppliers, negotiate credit terms.
 */

import { prisma } from "@/lib/prisma";

export interface CostOptimizationInput {
  cartId: string;
  hotelId: string;
  tenantId: string;
}

export interface SubstitutionRecommendation {
  currentProductId: string;
  currentSku: string;
  currentName: string;
  currentUnitPrice: number;
  alternativeProductId: string;
  alternativeSku: string;
  alternativeName: string;
  alternativeUnitPrice: number;
  savingsPerUnit: number;
  savingsPct: number;
  rationale: string;
}

export interface BulkDiscountRecommendation {
  productId: string;
  sku: string;
  name: string;
  currentQty: number;
  currentUnitPrice: number;
  recommendedQty: number;
  recommendedUnitPrice: number;
  totalSavings: number;
  rationale: string;
}

export interface SupplierConsolidationRecommendation {
  supplierIds: string[];
  supplierNames: string[];
  currentItemCount: number;
  consolidatedItemCount: number;
  estimatedSavings: number;
  rationale: string;
}

export interface CostOptimizationResult {
  cartTotal: number;
  optimizedTotal: number;
  potentialSavings: number;
  savingsPct: number;
  substitutions: SubstitutionRecommendation[];
  bulkDiscounts: BulkDiscountRecommendation[];
  consolidations: SupplierConsolidationRecommendation[];
  creditTermRecommendations: string[];
  summary: string;
}

export async function optimizeCosts(input: CostOptimizationInput): Promise<CostOptimizationResult> {
  const { cartId, hotelId, tenantId } = input;

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

  if (!cart || cart.CartItem.length === 0) {
    return emptyResult();
  }

  const cartTotal = cart.CartItem.reduce((s, item) => s + Number(item.total), 0);

  const substitutions = await findSubstitutions(cart.CartItem, tenantId);
  const bulkDiscounts = await findBulkDiscounts(cart.CartItem);
  const consolidations = await findConsolidations(cart.CartItem, tenantId);
  const creditTerms = await recommendCreditTerms(cart.CartItem, hotelId, tenantId);

  const subSavings = substitutions.reduce((s, r) => s + r.savingsPerUnit * cart.CartItem.find((i) => i.productId === r.currentProductId)!.quantity, 0);
  const bulkSavings = bulkDiscounts.reduce((s, r) => s + r.totalSavings, 0);
  const conSavings = consolidations.reduce((s, r) => s + r.estimatedSavings, 0);

  const potentialSavings = subSavings + bulkSavings + conSavings;
  const optimizedTotal = Math.max(0, cartTotal - potentialSavings);
  const savingsPct = cartTotal > 0 ? potentialSavings / cartTotal : 0;

  return {
    cartTotal,
    optimizedTotal,
    potentialSavings,
    savingsPct,
    substitutions,
    bulkDiscounts,
    consolidations,
    creditTermRecommendations: creditTerms,
    summary: `Potential savings: ${fmt(potentialSavings)} (${pct(savingsPct)}) via ${substitutions.length} substitutions, ${bulkDiscounts.length} bulk discounts, ${consolidations.length} consolidations.`,
  };
}

// ── Helpers ──

async function findSubstitutions(
  items: Array<{ productId: string; quantity: number; Product: { sku: string; name: string; unitPrice: number; category: string; supplierId: string } }>,
  tenantId: string
): Promise<SubstitutionRecommendation[]> {
  const results: SubstitutionRecommendation[] = [];
  for (const item of items) {
    const p = item.Product;
    const alternatives = await prisma.product.findMany({
      where: {
        category: p.category,
        tenantId,
        NOT: { id: item.productId },
        status: "ACTIVE",
      },
      select: { id: true, sku: true, name: true, unitPrice: true },
      orderBy: { unitPrice: "asc" },
      take: 3,
    });
    for (const alt of alternatives) {
      const currentPrice = Number(p.unitPrice);
      const altPrice = Number(alt.unitPrice);
      if (altPrice < currentPrice * 0.9) {
        results.push({
          currentProductId: item.productId,
          currentSku: p.sku,
          currentName: p.name,
          currentUnitPrice: currentPrice,
          alternativeProductId: alt.id,
          alternativeSku: alt.sku,
          alternativeName: alt.name,
          alternativeUnitPrice: altPrice,
          savingsPerUnit: currentPrice - altPrice,
          savingsPct: (currentPrice - altPrice) / currentPrice,
          rationale: `Same category, ${pct((currentPrice - altPrice) / currentPrice)} cheaper.`,
        });
        break; // best alternative only
      }
    }
  }
  return results;
}

async function findBulkDiscounts(
  items: Array<{ productId: string; quantity: number; Product: { sku: string; name: string; unitPrice: number; minOrderQty: number; stockQuantity: number } }>
): Promise<BulkDiscountRecommendation[]> {
  const results: BulkDiscountRecommendation[] = [];
  for (const item of items) {
    const p = item.Product;
    const currentQty = item.quantity;
    const currentPrice = Number(p.unitPrice);
    // Suggest 2x minOrderQty if current qty is below it
    const recommendedQty = Math.max(p.minOrderQty * 2, currentQty * 2);
    if (recommendedQty <= p.stockQuantity && recommendedQty > currentQty) {
      const discount = 0.05; // 5% bulk discount heuristic
      const newPrice = currentPrice * (1 - discount);
      const currentTotal = currentQty * currentPrice;
      const newTotal = recommendedQty * newPrice;
      const unitSavings = currentPrice - newPrice;
      results.push({
        productId: item.productId,
        sku: p.sku,
        name: p.name,
        currentQty,
        currentUnitPrice: currentPrice,
        recommendedQty,
        recommendedUnitPrice: newPrice,
        totalSavings: unitSavings * recommendedQty,
        rationale: `Bulk order ${recommendedQty} units for ~5% unit discount. In stock: ${p.stockQuantity}.`,
      });
    }
  }
  return results;
}

async function findConsolidations(
  items: Array<{ Product: { supplierId: string; Supplier: { name: string } } }>,
  tenantId: string
): Promise<SupplierConsolidationRecommendation[]> {
  const supplierMap = new Map<string, { name: string; count: number }>();
  for (const item of items) {
    const sid = item.Product.supplierId;
    const existing = supplierMap.get(sid);
    if (existing) {
      existing.count += 1;
    } else {
      supplierMap.set(sid, { name: item.Product.Supplier.name, count: 1 });
    }
  }

  if (supplierMap.size <= 1) return [];

  // Find supplier with most items in cart
  let topSupplierId = "";
  let topCount = 0;
  for (const [sid, data] of supplierMap) {
    if (data.count > topCount) {
      topCount = data.count;
      topSupplierId = sid;
    }
  }

  const topName = supplierMap.get(topSupplierId)!.name;
  const otherIds = Array.from(supplierMap.keys()).filter((id) => id !== topSupplierId);
  const otherNames = otherIds.map((id) => supplierMap.get(id)!.name);
  const otherCount = otherIds.reduce((s, id) => s + supplierMap.get(id)!.count, 0);

  // Heuristic: 3% savings on consolidated items via reduced shipping/fees
  const estimatedSavings = otherCount * 50; // 50 EGP per item heuristic

  return [{
    supplierIds: [topSupplierId, ...otherIds],
    supplierNames: [topName, ...otherNames],
    currentItemCount: items.length,
    consolidatedItemCount: topCount,
    estimatedSavings,
    rationale: `Consolidate ${otherCount} items to ${topName} to reduce shipping overhead and leverage volume pricing.`,
  }];
}

async function recommendCreditTerms(
  items: Array<{ Product: { supplierId: string; creditPrice: number | null; unitPrice: number } }>,
  hotelId: string,
  tenantId: string
): Promise<string[]> {
  const recommendations: string[] = [];
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    select: { creditLimit: true, creditUsed: true, tier: true },
  });
  if (!hotel || hotel.creditLimit == null) return recommendations;

  const creditAvailable = Number(hotel.creditLimit) - Number(hotel.creditUsed ?? 0);
  const cartCashTotal = items.reduce((s, i) => s + Number(i.Product.unitPrice), 0);
  const cartCreditTotal = items.reduce((s, i) => s + Number(i.Product.creditPrice ?? i.Product.unitPrice), 0);

  if (cartCreditTotal < cartCashTotal && creditAvailable >= cartCreditTotal) {
    const savings = cartCashTotal - cartCreditTotal;
    recommendations.push(`Use credit terms for this order. Cash total: ${fmt(cartCashTotal)}, Credit total: ${fmt(cartCreditTotal)}, Savings: ${fmt(savings)}.`);
  }

  if (hotel.tier === "CORE" || hotel.tier === "PREMIUM") {
    recommendations.push("Negotiate 60-day credit terms with top suppliers to improve cash flow.");
  }

  return recommendations;
}

function emptyResult(): CostOptimizationResult {
  return {
    cartTotal: 0,
    optimizedTotal: 0,
    potentialSavings: 0,
    savingsPct: 0,
    substitutions: [],
    bulkDiscounts: [],
    consolidations: [],
    creditTermRecommendations: [],
    summary: "Cart is empty. No optimizations available.",
  };
}

function fmt(n: number) {
  return `${n.toFixed(2)} EGP`;
}
function pct(n: number) {
  return `${(n * 100).toFixed(0)}%`;
}
