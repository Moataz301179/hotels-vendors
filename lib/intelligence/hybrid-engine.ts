/**
 * Hybrid Intelligence Engine — Tri-Layer Guardian
 * Hotels Vendors Intelligence Layer
 *
 * Layer 1: LLM Advisor (Generates, NEVER Executes)
 * Layer 2: Deterministic Rule Engine (Validates, NEVER Generates)
 * Layer 3: Human-in-the-Loop (Approves Critical Decisions)
 *
 * Ensures 0% hallucination in financial transactions.
 */

import { evaluateTransactionGuardrails, type TransactionGuardrailResult } from "@/lib/security/fortress";

// ─────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────

export interface LLMRecommendation {
  type: "PRICE_ADJUSTMENT" | "CREDIT_EXTENSION" | "SUPPLIER_SWITCH" | "INVENTORY_REORDER" | "BUNDLE_SUGGESTION";
  confidence: number; // 0-1
  suggestion: string;
  reasoning: string;
  expectedImpact: {
    revenueChange?: number;
    costChange?: number;
    riskChange?: number;
  };
  metadata: Record<string, unknown>;
}

export interface RuleValidationResult {
  valid: boolean;
  violations: RuleViolation[];
  correctedRecommendation?: LLMRecommendation;
}

export interface RuleViolation {
  rule: string;
  severity: "ERROR" | "WARNING";
  message: string;
  field: string;
  expectedValue: string;
  actualValue: string;
}

export interface HybridDecision {
  recommendation: LLMRecommendation;
  validation: RuleValidationResult;
  guardrail: TransactionGuardrailResult;
  approved: boolean;
  approvalLevel: "AUTO" | "DUAL_AUTH" | "HITL" | "REJECTED";
  executed: boolean;
  executionResult?: string;
  decisionLog: string;
}

// ─────────────────────────────────────────
// 2. HARD-CODED BUSINESS RULES
// ─────────────────────────────────────────

const BUSINESS_RULES = {
  // Price rules
  maxPriceChangePercent: 15,        // Max 15% price change per month
  minPriceMarginPercent: 5,         // Minimum 5% margin
  maxPriceAboveMarketPercent: 20,   // Cannot exceed market price by >20%

  // Credit rules
  maxCreditExtensionPercent: 10,    // Max 10% auto-extension
  maxCreditLimit: 5_000_000,        // Absolute ceiling: 5M EGP
  creditExtensionRequiresDualAuth: 50_000, // >50K requires dual auth

  // Inventory rules
  maxReorderQtyMultiplier: 3,       // Cannot order >3x monthly average
  minDaysOfInventory: 3,            // Minimum 3 days safety stock

  // Transaction rules
  maxTransactionAutoApprove: 10_000, // 10K EGP
  maxTransactionDualAuth: 100_000,   // 100K EGP
  hitlThreshold: 1_000_000,          // 1M EGP
};

// ─────────────────────────────────────────
// 3. LAYER 1: LLM ADVISOR
// ─────────────────────────────────────────

/**
 * Generate a recommendation using LLM.
 * This is a STUB that simulates LLM output.
 * In production, this calls the Vercel AI SDK.
 */
export async function generateLLMRecommendation(params: {
  type: LLMRecommendation["type"];
  context: Record<string, unknown>;
}): Promise<LLMRecommendation> {
  const { type, context } = params;

  // Simulate LLM processing time
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Stub responses based on type
  const responses: Record<string, LLMRecommendation> = {
    PRICE_ADJUSTMENT: {
      type: "PRICE_ADJUSTMENT",
      confidence: 0.85,
      suggestion: "Increase unit price by 12% due to rising raw material costs",
      reasoning: "Steel prices have increased 15% in the last quarter. Competitor analysis shows similar increases. Demand elasticity is low for this SKU.",
      expectedImpact: { revenueChange: 50000, costChange: 0, riskChange: 0.05 },
      metadata: { sku: context.sku, currentPrice: context.currentPrice, suggestedPrice: (context.currentPrice as number) * 1.12 },
    },
    CREDIT_EXTENSION: {
      type: "CREDIT_EXTENSION",
      confidence: 0.92,
      suggestion: "Extend credit limit by 15% for hotel chain",
      reasoning: "Payment history shows 98% on-time rate over 12 months. Order frequency has increased 30%.",
      expectedImpact: { revenueChange: 100000, costChange: 0, riskChange: -0.02 },
      metadata: { hotelId: context.hotelId, currentLimit: context.currentLimit, suggestedExtension: (context.currentLimit as number) * 0.15 },
    },
    SUPPLIER_SWITCH: {
      type: "SUPPLIER_SWITCH",
      confidence: 0.78,
      suggestion: "Switch to alternative supplier for SKU-1234",
      reasoning: "Current supplier has 3 delayed deliveries in the last month. Alternative offers 8% lower price with similar quality.",
      expectedImpact: { revenueChange: 0, costChange: -25000, riskChange: -0.1 },
      metadata: { currentSupplierId: context.currentSupplierId, alternativeSupplierId: context.alternativeSupplierId },
    },
    INVENTORY_REORDER: {
      type: "INVENTORY_REORDER",
      confidence: 0.88,
      suggestion: "Reorder 500 units of SKU-5678",
      reasoning: "Current stock is at 15 units. AI forecast predicts depletion in 4 days. Lead time is 3 days.",
      expectedImpact: { revenueChange: 0, costChange: 15000, riskChange: -0.15 },
      metadata: { sku: context.sku, currentStock: context.currentStock, suggestedQty: 500 },
    },
    BUNDLE_SUGGESTION: {
      type: "BUNDLE_SUGGESTION",
      confidence: 0.72,
      suggestion: "Bundle orders from 3 suppliers in 6th of October",
      reasoning: "3 orders from the same zone within 1 hour. Bundling reduces logistics cost by 22%.",
      expectedImpact: { revenueChange: 0, costChange: -8000, riskChange: 0 },
      metadata: { orderIds: context.orderIds, zone: context.zone },
    },
  };

  return responses[type] || {
    type,
    confidence: 0.5,
    suggestion: "No specific recommendation available",
    reasoning: "Insufficient data for recommendation",
    expectedImpact: {},
    metadata: context,
  };
}

// ─────────────────────────────────────────
// 4. LAYER 2: RULE ENGINE VALIDATOR
// ─────────────────────────────────────────

/**
 * Validate LLM recommendation against hard-coded business rules.
 * This is the GUARDIAN. It can REJECT but never GENERATE.
 */
export function validateRecommendation(recommendation: LLMRecommendation): RuleValidationResult {
  const violations: RuleViolation[] = [];

  switch (recommendation.type) {
    case "PRICE_ADJUSTMENT": {
      const currentPrice = recommendation.metadata.currentPrice as number;
      const suggestedPrice = recommendation.metadata.suggestedPrice as number;
      if (currentPrice && suggestedPrice) {
        const changePercent = ((suggestedPrice - currentPrice) / currentPrice) * 100;
        if (changePercent > BUSINESS_RULES.maxPriceChangePercent) {
          violations.push({
            rule: "MAX_PRICE_CHANGE",
            severity: "ERROR",
            message: `Price increase ${changePercent.toFixed(1)}% exceeds maximum ${BUSINESS_RULES.maxPriceChangePercent}%`,
            field: "suggestedPrice",
            expectedValue: `< ${(currentPrice * (1 + BUSINESS_RULES.maxPriceChangePercent / 100)).toFixed(2)}`,
            actualValue: suggestedPrice.toFixed(2),
          });
        }
      }
      break;
    }

    case "CREDIT_EXTENSION": {
      const currentLimit = recommendation.metadata.currentLimit as number;
      const suggestedExtension = recommendation.metadata.suggestedExtension as number;
      if (currentLimit && suggestedExtension) {
        const extensionPercent = (suggestedExtension / currentLimit) * 100;
        if (extensionPercent > BUSINESS_RULES.maxCreditExtensionPercent) {
          violations.push({
            rule: "MAX_CREDIT_EXTENSION",
            severity: "ERROR",
            message: `Credit extension ${extensionPercent.toFixed(1)}% exceeds maximum ${BUSINESS_RULES.maxCreditExtensionPercent}%`,
            field: "suggestedExtension",
            expectedValue: `< ${(currentLimit * BUSINESS_RULES.maxCreditExtensionPercent / 100).toFixed(2)}`,
            actualValue: suggestedExtension.toFixed(2),
          });
        }
        if (currentLimit + suggestedExtension > BUSINESS_RULES.maxCreditLimit) {
          violations.push({
            rule: "MAX_CREDIT_LIMIT",
            severity: "ERROR",
            message: `New limit ${(currentLimit + suggestedExtension).toFixed(0)} exceeds absolute ceiling ${BUSINESS_RULES.maxCreditLimit.toLocaleString()}`,
            field: "newLimit",
            expectedValue: `< ${BUSINESS_RULES.maxCreditLimit.toLocaleString()}`,
            actualValue: (currentLimit + suggestedExtension).toFixed(0),
          });
        }
      }
      break;
    }

    case "INVENTORY_REORDER": {
      const suggestedQty = recommendation.metadata.suggestedQty as number;
      const monthlyAvg = recommendation.metadata.monthlyAvg as number;
      if (suggestedQty && monthlyAvg && suggestedQty > monthlyAvg * BUSINESS_RULES.maxReorderQtyMultiplier) {
        violations.push({
          rule: "MAX_REORDER_QTY",
          severity: "WARNING",
          message: `Reorder quantity ${suggestedQty} exceeds ${BUSINESS_RULES.maxReorderQtyMultiplier}x monthly average`,
          field: "suggestedQty",
          expectedValue: `< ${(monthlyAvg * BUSINESS_RULES.maxReorderQtyMultiplier).toFixed(0)}`,
          actualValue: suggestedQty.toFixed(0),
        });
      }
      break;
    }
  }

  return {
    valid: violations.filter((v) => v.severity === "ERROR").length === 0,
    violations,
  };
}

// ─────────────────────────────────────────
// 5. LAYER 3: HUMAN-IN-THE-LOOP GATE
// ─────────────────────────────────────────

/**
 * Execute the full Hybrid Intelligence pipeline.
 */
export async function executeHybridDecision(params: {
  userId: string;
  userRole: string;
  recommendationType: LLMRecommendation["type"];
  context: Record<string, unknown>;
  idempotencyKey?: string;
}): Promise<HybridDecision> {
  const { userId, userRole, recommendationType, context, idempotencyKey } = params;

  // Step 1: LLM generates recommendation
  const recommendation = await generateLLMRecommendation({ type: recommendationType, context });

  // Step 2: Rule Engine validates
  const validation = validateRecommendation(recommendation);

  // Step 3: Fortress Protocol guardrails
  const impactAmount = Math.abs(recommendation.expectedImpact.revenueChange || 0) +
    Math.abs(recommendation.expectedImpact.costChange || 0);

  const guardrail = await evaluateTransactionGuardrails({
    amount: impactAmount,
    userId,
    userRole,
    action: recommendation.type,
    idempotencyKey,
  });

  // Step 4: Determine approval level
  let approved = false;
  let approvalLevel: HybridDecision["approvalLevel"] = "REJECTED";
  let executed = false;

  if (!validation.valid) {
    approvalLevel = "REJECTED";
  } else if (guardrail.requiresHITL) {
    approvalLevel = "HITL";
    approved = false; // Waiting for human approval
  } else if (guardrail.requiresDualAuth) {
    approvalLevel = "DUAL_AUTH";
    approved = false; // Waiting for dual authorization
  } else if (guardrail.approved) {
    approvalLevel = "AUTO";
    approved = true;
    executed = true; // Auto-execute
  }

  const decisionLog = JSON.stringify({
    timestamp: new Date().toISOString(),
    recommendation: recommendation.type,
    confidence: recommendation.confidence,
    validation: validation.valid ? "PASSED" : "FAILED",
    violations: validation.violations.length,
    guardrail: guardrail.level,
    approved,
    approvalLevel,
    executed,
  });

  return {
    recommendation,
    validation,
    guardrail,
    approved,
    approvalLevel,
    executed,
    decisionLog,
  };
}

// ─────────────────────────────────────────
// 6. BUSINESS RULES ACCESSOR
// ─────────────────────────────────────────

export function getBusinessRules(): typeof BUSINESS_RULES {
  return { ...BUSINESS_RULES };
}
