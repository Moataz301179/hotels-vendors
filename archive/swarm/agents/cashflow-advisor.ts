import { prisma } from "@/lib/prisma";

export interface LiquidityStrategyMetrics {
  maturityExtensions: number;
  drawdownThresholds: number;
  retainedTreasuryYield: number;
}

export class CashflowAdvisor {
  /**
   * The Liquidity Optimization Engine
   * Strictly read-only telemetry module calculating Tri-Tier Fee Split metrics.
   *
   * @param tenantId The corporate group or hotel tenant identifier.
   */
  public async generateLiquidityStrategy(tenantId: string): Promise<LiquidityStrategyMetrics> {
    // SECURITY GUARD: Enforcing absolute architectural boundary.
    // This file is a sealed read-only telemetry module. 
    // Zero Prisma write mutations, zero ledger creation methods, zero execution hooks.

    const activePackages = await prisma.consolidatedInvoice.findMany({
      where: { 
        tenantId, 
        status: { notIn: ["DISBURSED", "SETTLED"] } 
      },
      include: {
        invoices: {
          select: { total: true }
        }
      }
    });

    let drawdownThresholds = 0;
    let retainedTreasuryYield = 0;
    let maturityExtensions = 0;

    for (const pkg of activePackages) {
      // Drawdown Thresholds: Total volume of aggregated capital ready to be liquidated
      drawdownThresholds += pkg.total;

      // Retained Treasury Yield: Stream 3 Hotel Admin Fee
      const adminFee = pkg.total * pkg.hotelAdminFeeRate;
      retainedTreasuryYield += adminFee;

      // Maturity Extensions: Total value of underlying receivables extending Days Payable Outstanding (DPO)
      const packageExtensionVolume = pkg.invoices.reduce((sum, inv) => sum + inv.total, 0);
      maturityExtensions += packageExtensionVolume;
    }

    return {
      maturityExtensions,
      drawdownThresholds,
      retainedTreasuryYield,
    };
  }
}
