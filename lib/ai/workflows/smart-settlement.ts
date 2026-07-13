/**
 * Smart Settlement Engine
 * Automatically processes payments to suppliers after delivery.
 * Handles platform fees, factoring eligibility, and payment routing.
 */

import { executeSettlement } from "@/lib/invo/client";

export interface SettlementOrder {
  orderId: string;
  invoiceId: string;
  supplierId: string;
  supplierName: string;
  amountCents: number;
  deliveredAt: string;
  termsDays: number;
  factoringEligible: boolean;
  bankAccount?: string;
}

export interface SettlementResult {
  orderId: string;
  status: "settled" | "pending_factoring" | "failed" | "held_for_review";
  settlementId?: string;
  platformFeeCents: number;
  netAmountCents: number;
  factoringFeeCents?: number;
  supplierReceivedCents?: number;
  executedAt?: string;
  error?: string;
}

const PLATFORM_FEE_RATE = 0.025; // 2.5%
const FACTORING_FEE_RATE = 0.015; // 1.5% to factoring partner

/**
 * Process a batch of delivered orders for settlement.
 */
export async function processSettlements(
  orders: SettlementOrder[]
): Promise<SettlementResult[]> {
  const results: SettlementResult[] = [];

  for (const order of orders) {
    try {
      // Calculate fees
      const platformFeeCents = Math.floor(order.amountCents * PLATFORM_FEE_RATE);
      const factoringFeeCents = order.factoringEligible
        ? Math.floor(order.amountCents * FACTORING_FEE_RATE)
        : 0;

      const netAmountCents = order.amountCents - platformFeeCents - factoringFeeCents;

      // For demo/development, log instead of calling real API
      if (process.env.NODE_ENV === "development") {
  console.log(`[SmartSettlement] Order ${order.orderId}:`, {
          gross: order.amountCents,
          platformFee: platformFeeCents,
          factoringFee: factoringFeeCents,
          net: netAmountCents,
        });
      }

      // Execute via INVO bridge
      const result = await executeSettlement({
        invoiceId: order.invoiceId,
        supplierId: order.supplierId,
        amount: order.amountCents,
        method: "bank_transfer",
      });

      if (result.success && result.data) {
        results.push({
          orderId: order.orderId,
          status: "settled",
          settlementId: result.data.settlementId,
          platformFeeCents,
          netAmountCents,
          factoringFeeCents: factoringFeeCents || undefined,
          supplierReceivedCents: netAmountCents,
          executedAt: result.data.executedAt,
        });
      } else {
        results.push({
          orderId: order.orderId,
          status: "failed",
          platformFeeCents,
          netAmountCents,
          error: result.error || "Settlement failed",
        });
      }
    } catch (error: any) {
      results.push({
        orderId: order.orderId,
        status: "failed",
        platformFeeCents: Math.floor(order.amountCents * PLATFORM_FEE_RATE),
        netAmountCents: 0,
        error: error.message,
      });
    }
  }

  return results;
}
