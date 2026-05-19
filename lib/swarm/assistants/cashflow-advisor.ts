/**
 * CashflowAdvisor Assistant Agent
 * Hotels Vendors FinTech Swarm Squad
 *
 * User-facing advisory agent that analyzes working capital, outstanding payables,
 * and factoring scenarios. Routes strictly through internal versioned /api/v1/ routes.
 */

export interface CashflowAnalysisResult {
  totalOutstandingInvoices: number;
  factorableInvoicesCount: number;
  projectedWorkingCapitalImprovement: number;
  platformFeesEstimate: number;
  netLiquidCashProjected: number;
  recommendations: string[];
}

export const CashflowAdvisorDef = {
  id: "cashflow-advisor",
  name: "Cashflow Advisor",
  squad: "fintech",
  avatar: "💰",
  role: "B2B Cashflow Analysis & Working Capital Optimization",
  systemPrompt: `You are the Cashflow Advisor for Hotels Vendors. Your objective is to help hospitality buyers and SME suppliers optimize liquidity. You analyze accounts payable, outstanding invoices, credit line utilization, and simulate reverse-factoring scenarios. You communicate strictly in financial optimization recommendations.`,
  capabilities: ["cashflow_projection", "factoring_simulation", "liquidity_optimization"],
  tools: ["api_v1_get_factoring_requests", "api_v1_get_invoices"],
  requiresApproval: false,
};

/**
 * Executes a cashflow analysis by consuming secure /api/v1/ endpoints.
 * Interacts purely via HTTP REST, preserving tenant security boundary constraints.
 */
export async function executeCashflowAnalysis(params: {
  tenantId: string;
  sessionToken: string;
  appUrl?: string;
}): Promise<CashflowAnalysisResult> {
  const { sessionToken } = params;
  const baseUrl = params.appUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/v1/factoring/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${sessionToken}`,
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch invoices: ${response.statusText}`);
    }

    const data = await response.json() as Record<string, unknown>;
    const requests = data.requests || [];

    let totalOutstanding = 0;
    let factorableCount = 0;
    let totalFactorableAmount = 0;

    for (const req of requests) {
      const amount = req.requestedAmount || req.invoice?.total || 0;
      totalOutstanding += amount;
      if (req.status === "UNDER_REVIEW" || req.status === "APPROVED") {
        factorableCount++;
        totalFactorableAmount += amount;
      }
    }

    // Default simulation parameters
    const advanceRate = 0.85;
    const factorFeeRate = 0.03;
    const platformFeeRate = 0.015;

    const projectedDisbursement = totalFactorableAmount * advanceRate;
    const platformFeesEstimate = totalFactorableAmount * platformFeeRate;
    const factorFeesEstimate = totalFactorableAmount * factorFeeRate;
    const netLiquidCashProjected = projectedDisbursement - platformFeesEstimate - factorFeesEstimate;

    const recommendations: string[] = [];
    if (factorableCount > 0) {
      recommendations.push(
        `Consolidate your ${factorableCount} factorable invoices (total EGP ${totalFactorableAmount.toLocaleString()}) to release EGP ${netLiquidCashProjected.toLocaleString()} in immediate cash within 24 hours.`
      );
      recommendations.push(
        `By leveraging Reverse Factoring, your supplier cluster gains immediate liquidity while you maintain your extended payment credit facility terms.`
      );
    } else {
      recommendations.push(
        `All active invoices are currently settled. Your cash flow cycle is performing within normal parameters.`
      );
    }

    return {
      totalOutstandingInvoices: totalOutstanding,
      factorableInvoicesCount: factorableCount,
      projectedWorkingCapitalImprovement: projectedDisbursement,
      platformFeesEstimate,
      netLiquidCashProjected,
      recommendations,
    };
  } catch (error) {
    throw new Error(
      `CashflowAdvisor execution failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
