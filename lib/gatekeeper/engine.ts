// ═══════════════════════════════════════════════════════════════
// PRE-SPEND GATEKEEPER ENGINE
// Budget control, authority matrix, AI risk scoring
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export type GatekeeperInput = {
  hotelId: string;
  tenantId: string;
  requesterId: string;
  requesterRole: string;
  total: Decimal | number;
  subtotal: Decimal | number;
  vatAmount: Decimal | number;
  items: {
    productId?: string;
    description: string;
    quantity: number;
    unitPrice: Decimal | number;
    total: Decimal | number;
  }[];
  preferredSupplierId?: string;
  costCenter?: string;
  deliveryDate?: Date;
};

export type GatekeeperResult = {
  decision: "PASS" | "FLAG_BUDGET_EXCEEDED" | "FLAG_AUTHORITY_MISMATCH" | "FLAG_SUPPLIER_RISK" | "FLAG_DUPLICATE" | "FLAG_SEASONAL_ANOMALY" | "BLOCKED";
  score: number; // 0-100
  reasons: string[];
  requiredApproverRole?: string;
  canAutoApprove: boolean;
  budgetImpact: {
    gateId?: string;
    currentSpent: number;
    currentReserved: number;
    totalBudget: number;
    afterReservation: number;
    categoryImpacts: { category: string; budget: number; spent: number; after: number }[];
  };
};

export async function evaluateSpendRequest(input: GatekeeperInput): Promise<GatekeeperResult> {
  const reasons: string[] = [];
  let score = 100;
  let decision: GatekeeperResult["decision"] = "PASS";

  // ── 1. BUDGET GATE CHECK ──
  const now = new Date();
  const budgetGate = await prisma.budgetGate.findFirst({
    where: {
      hotelId: input.hotelId,
      tenantId: input.tenantId,
      status: { in: ["ACTIVE", "WARNING"] },
      periodStart: { lte: now },
      periodEnd: { gte: now },
    },
  });

  const totalNum = Number(input.total);
  let budgetImpact: GatekeeperResult["budgetImpact"] = {
    currentSpent: 0,
    currentReserved: 0,
    totalBudget: 0,
    afterReservation: totalNum,
    categoryImpacts: [],
  };

  if (budgetGate) {
    const spent = Number(budgetGate.spentAmount);
    const reserved = Number(budgetGate.reservedAmount);
    const totalBudget = Number(budgetGate.totalBudget);
    const afterReservation = spent + reserved + totalNum;
    const pctUsed = (afterReservation / totalBudget) * 100;

    budgetImpact = {
      gateId: budgetGate.id,
      currentSpent: spent,
      currentReserved: reserved,
      totalBudget,
      afterReservation,
      categoryImpacts: [],
    };

    if (budgetGate.hardCap && afterReservation > totalBudget) {
      decision = "BLOCKED";
      reasons.push(`HARD CAP: Budget exceeded. Gate ${budgetGate.id}: ${afterReservation.toFixed(2)} > ${totalBudget.toFixed(2)} EGP`);
      score -= 50;
    } else if (pctUsed > Number(budgetGate.warningThreshold)) {
      decision = decision === "PASS" ? "FLAG_BUDGET_EXCEEDED" : decision;
      reasons.push(`WARNING: Budget at ${pctUsed.toFixed(1)}% of ${totalBudget.toFixed(2)} EGP`);
      score -= 15;
    }

    // Category-level checks
    if (budgetGate.categoryBudgets) {
      try {
        const catBudgets = JSON.parse(budgetGate.categoryBudgets);
        const catSpent = budgetGate.categorySpent ? JSON.parse(budgetGate.categorySpent) : {};
        for (const item of input.items) {
          if (item.productId) {
            const product = await prisma.product.findUnique({
              where: { id: item.productId },
              select: { category: true },
            });
            if (product && catBudgets[product.category]) {
              const catB = Number(catBudgets[product.category]);
              const catS = Number(catSpent[product.category] || 0);
              const catAfter = catS + Number(item.total);
              budgetImpact.categoryImpacts.push({
                category: product.category,
                budget: catB,
                spent: catS,
                after: catAfter,
              });
              if (catAfter > catB) {
                decision = decision === "PASS" ? "FLAG_BUDGET_EXCEEDED" : decision;
                reasons.push(`Category ${product.category} budget exceeded: ${catAfter.toFixed(2)} > ${catB.toFixed(2)}`);
                score -= 10;
              }
            }
          }
        }
      } catch {
        // ignore malformed category budgets
      }
    }
  } else {
    reasons.push("No active budget gate found for this period");
    score -= 5;
  }

  // ── 2. AUTHORITY MATRIX CHECK ──
  const authorityRules = await prisma.authorityRule.findMany({
    where: {
      isActive: true,
      hotelId: { in: [input.hotelId, null] },
      OR: [
        { minValue: { lte: input.total }, maxValue: { gte: input.total } },
        { minValue: { lte: input.total }, maxValue: { equals: 0 } },
      ],
    },
    orderBy: { priority: "desc" },
  });

  let requiredApproverRole: string | undefined;
  let canAutoApprove = true;

  const matchingRule = authorityRules.find((r) => {
    if (r.requesterRole && r.requesterRole !== input.requesterRole) return false;
    return true;
  });

  if (matchingRule) {
    if (matchingRule.requiresDualSignOff) {
      canAutoApprove = false;
      requiredApproverRole = matchingRule.routeToRole || "HOTEL_OWNER";
      reasons.push(`Dual sign-off required. Route to ${requiredApproverRole}`);
      score -= 10;
    } else if (matchingRule.routeToRole && matchingRule.routeToRole !== input.requesterRole) {
      canAutoApprove = false;
      requiredApproverRole = matchingRule.routeToRole;
      reasons.push(`Authority escalation: ${input.requesterRole} → ${requiredApproverRole} for ${input.total} EGP`);
      score -= 5;
    }
  } else if (totalNum > 50000) {
    // Default fallback for large amounts
    canAutoApprove = false;
    requiredApproverRole = "HOTEL_OWNER";
    reasons.push(`No authority rule matched. Default escalation for >50k EGP`);
    score -= 5;
  }

  if (!canAutoApprove && decision === "PASS") {
    decision = "FLAG_AUTHORITY_MISMATCH";
  }

  // ── 3. SUPPLIER RISK CHECK ──
  if (input.preferredSupplierId) {
    const supplier = await prisma.supplier.findUnique({
      where: { id: input.preferredSupplierId },
      select: { complianceStatus: true, rating: true, tier: true },
    });
    if (supplier) {
      if (supplier.complianceStatus === "BLOCKED" || supplier.complianceStatus === "EXPIRED") {
        decision = "BLOCKED";
        reasons.push(`Supplier compliance status: ${supplier.complianceStatus}`);
        score -= 40;
      } else if (supplier.complianceStatus === "PENDING_TAX_VERIFICATION") {
        decision = decision === "PASS" ? "FLAG_SUPPLIER_RISK" : decision;
        reasons.push("Supplier pending tax verification");
        score -= 15;
      }
      if (supplier.rating && Number(supplier.rating) < 2.5) {
        decision = decision === "PASS" ? "FLAG_SUPPLIER_RISK" : decision;
        reasons.push(`Low supplier rating: ${supplier.rating}`);
        score -= 10;
      }
    }
  }

  // ── 4. DUPLICATE CHECK ──
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentSimilar = await prisma.spendRequest.findFirst({
    where: {
      hotelId: input.hotelId,
      status: { in: ["APPROVED", "CONVERTED_TO_ORDER", "PENDING_APPROVAL"] },
      createdAt: { gte: sevenDaysAgo },
      total: { gte: new Decimal(totalNum * 0.9), lte: new Decimal(totalNum * 1.1) },
    },
  });
  if (recentSimilar) {
    decision = decision === "PASS" ? "FLAG_DUPLICATE" : decision;
    reasons.push(`Similar spend request found within 7 days: ${recentSimilar.requestNumber}`);
    score -= 10;
  }

  // ── 5. SEASONAL ANOMALY (simple heuristic) ──
  const month = now.getMonth(); // 0-11
  const seasonalCategories = ["FOOD_BEVERAGE", "HOUSEKEEPING", "MAINTENANCE"];
  for (const item of input.items) {
    if (!item.productId) continue;
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { category: true },
    });
    if (product && seasonalCategories.includes(product.category)) {
      // Summer spike check (June-Aug)
      if (month >= 5 && month <= 7) {
        const avgMonthly = await prisma.spendRecord.findFirst({
          where: { hotelId: input.hotelId, category: product.category },
          orderBy: { createdAt: "desc" },
        });
        if (avgMonthly && Number(item.total) > Number(avgMonthly.amount) * 2) {
          decision = decision === "PASS" ? "FLAG_SEASONAL_ANOMALY" : decision;
          reasons.push(`Seasonal anomaly: ${product.category} spend 2x above recent monthly average`);
          score -= 8;
        }
      }
    }
  }

  // ── 6. AI RISK SCORING (placeholder for swarm integration) ──
  // This will be enhanced by the swarm's intelligence agent
  const aiScore = await computeAiRiskScore(input);
  if (aiScore < 40) {
    decision = decision === "PASS" ? "BLOCKED" : decision;
    reasons.push(`AI risk score critical: ${aiScore}/100`);
    score = Math.min(score, aiScore);
  } else if (aiScore < 60) {
    decision = decision === "PASS" ? "FLAG_SUPPLIER_RISK" : decision;
    reasons.push(`AI risk score elevated: ${aiScore}/100`);
    score = Math.min(score, aiScore);
  }

  score = Math.max(0, Math.min(100, score));

  return {
    decision,
    score,
    reasons,
    requiredApproverRole,
    canAutoApprove: canAutoApprove && decision === "PASS" && score >= 70,
    budgetImpact,
  };
}

async function computeAiRiskScore(input: GatekeeperInput): Promise<number> {
  // Placeholder: In production, this calls the swarm intelligence agent
  // Factors: hotel payment history, supplier reliability, market volatility, seasonal patterns
  let baseScore = 75;

  // Hotel credit utilization
  const hotel = await prisma.hotel.findUnique({
    where: { id: input.hotelId },
    select: { creditLimit: true, creditUsed: true, riskScore: true },
  });
  if (hotel?.creditLimit && Number(hotel.creditLimit) > 0) {
    const utilization = Number(hotel.creditUsed || 0) / Number(hotel.creditLimit);
    if (utilization > 0.8) baseScore -= 15;
    else if (utilization > 0.5) baseScore -= 5;
  }
  if (hotel?.riskScore && hotel.riskScore > 70) {
    baseScore -= 10;
  }

  // Order size relative to hotel tier
  const totalNum = Number(input.total);
  if (totalNum > 100000) baseScore -= 10;
  else if (totalNum > 50000) baseScore -= 5;

  return Math.max(0, Math.min(100, baseScore));
}

export async function reserveBudget(gateId: string, amount: number): Promise<boolean> {
  const gate = await prisma.budgetGate.findUnique({ where: { id: gateId } });
  if (!gate) return false;
  if (gate.hardCap && Number(gate.spentAmount) + Number(gate.reservedAmount) + amount > Number(gate.totalBudget)) {
    return false;
  }
  await prisma.budgetGate.update({
    where: { id: gateId },
    data: { reservedAmount: { increment: amount } },
  });
  return true;
}

export async function releaseBudgetReservation(gateId: string, amount: number): Promise<void> {
  await prisma.budgetGate.update({
    where: { id: gateId },
    data: { reservedAmount: { decrement: amount } },
  });
}

export async function commitBudgetSpend(gateId: string, amount: number): Promise<void> {
  await prisma.budgetGate.update({
    where: { id: gateId },
    data: {
      spentAmount: { increment: amount },
      reservedAmount: { decrement: amount },
    },
  });
}

export async function logGatekeeperEvent(
  spendRequestId: string,
  event: string,
  decision: string | null,
  score: number | null,
  details: Record<string, unknown>,
  actorId?: string
): Promise<void> {
  await prisma.spendGatekeeperLog.create({
    data: {
      spendRequestId,
      event,
      decision: decision as any,
      score,
      details: JSON.stringify(details),
      actorId,
    },
  });
}
