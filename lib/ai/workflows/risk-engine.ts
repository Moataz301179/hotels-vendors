/**
 * Risk Engine (Smart Fix)
 * Automatically generates fixes when a hotel is blocked by credit/risk.
 * No manual intervention required.
 */

export interface HotelRiskProfile {
  hotelId: string;
  creditLimitCents: number;
  outstandingBalanceCents: number;
  paymentHistoryScore: number; // 0-100
  avgOrderValueCents: number;
  daysSinceLastPayment: number;
}

export interface OrderRiskCheck {
  orderId: string;
  hotelId: string;
  orderValueCents: number;
}

export type FixType = "deposit" | "high_risk_factoring" | "split_payment" | "auto_limit_extension" | "block";

export interface SmartFix {
  fixType: FixType;
  title: string;
  description: string;
  actionRequired: "auto" | "hotel_approval";
  depositAmountCents?: number;
  splitPayments?: { amountCents: number; dueDate: string }[];
  newLimitCents?: number;
}

export interface RiskCheckResult {
  orderId: string;
  approved: boolean;
  reason?: string;
  fixes: SmartFix[];
}

/**
 * Evaluate if an order can proceed and generate fixes if blocked.
 */
export async function evaluateOrderRisk(
  order: OrderRiskCheck,
  profile: HotelRiskProfile
): Promise<RiskCheckResult> {
  const { orderValueCents } = order;
  const { creditLimitCents, outstandingBalanceCents, paymentHistoryScore, daysSinceLastPayment } = profile;

  const availableCredit = creditLimitCents - outstandingBalanceCents;
  const creditUtilization = outstandingBalanceCents / Math.max(creditLimitCents, 1);

  const fixes: SmartFix[] = [];

  // Case 1: Sufficient credit → approve
  if (orderValueCents <= availableCredit && creditUtilization < 0.8 && paymentHistoryScore > 60) {
    return { orderId: order.orderId, approved: true, fixes: [] };
  }

  // Case 2: Over limit but good history → auto limit extension
  if (paymentHistoryScore > 70 && daysSinceLastPayment < 30) {
    const newLimit = Math.round(creditLimitCents * 1.2);
    fixes.push({
      fixType: "auto_limit_extension",
      title: "Automatic Credit Extension",
      description: `Your credit limit has been temporarily extended to EGP ${(newLimit / 100).toFixed(2)} based on your payment history.`,
      actionRequired: "auto",
      newLimitCents: newLimit,
    });
    return { orderId: order.orderId, approved: true, fixes };
  }

  // Case 3: Moderate risk → split payment
  if (paymentHistoryScore > 50 && orderValueCents > 500000) {
    // EGP 5,000+
    const half = Math.round(orderValueCents / 2);
    fixes.push({
      fixType: "split_payment",
      title: "Split Payment",
      description: "Pay 50% now, 50% in 15 days. No fees.",
      actionRequired: "hotel_approval",
      splitPayments: [
        { amountCents: half, dueDate: new Date().toISOString() },
        { amountCents: half, dueDate: new Date(Date.now() + 15 * 86400000).toISOString() },
      ],
    });
  }

  // Case 4: Higher risk → deposit required
  if (creditUtilization > 0.8 || daysSinceLastPayment > 45) {
    const deposit = Math.round(orderValueCents * 0.3);
    fixes.push({
      fixType: "deposit",
      title: "30% Deposit Required",
      description: `A deposit of EGP ${(deposit / 100).toFixed(2)} is required to proceed with this order.`,
      actionRequired: "hotel_approval",
      depositAmountCents: deposit,
    });
  }

  // Case 5: High risk → high-risk factoring
  if (paymentHistoryScore < 50) {
    fixes.push({
      fixType: "high_risk_factoring",
      title: "High-Risk Factoring",
      description: "This order will be financed by our factoring partner. Your supplier gets paid in 48 hours.",
      actionRequired: "auto",
    });
  }

  // Case 6: Extreme risk → block
  if (paymentHistoryScore < 30 && daysSinceLastPayment > 90) {
    fixes.push({
      fixType: "block",
      title: "Account Temporarily Suspended",
      description: "Please settle outstanding invoices to restore ordering capability.",
      actionRequired: "hotel_approval",
    });
    return { orderId: order.orderId, approved: false, reason: "Account suspended due to overdue payments", fixes };
  }

  return {
    orderId: order.orderId,
    approved: fixes.length > 0 && fixes[0].fixType !== "block",
    fixes,
  };
}
