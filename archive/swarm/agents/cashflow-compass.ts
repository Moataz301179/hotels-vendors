/**
 * Cashflow Compass — Daily Market Intelligence Agent
 * Analyzes: supplier price velocity, hotel payment delays, CBE rates, inflation
 * Outputs: market direction (inflationary/recessionary/stable), pricing adjustments, risk alerts
 */

import { prisma } from "@/lib/prisma";
import { executeLLM } from "../model-router";

export interface CompassReading {
  timestamp: Date;
  marketDirection: "INFLATIONARY" | "RECESSIONARY" | "STABLE" | "VOLATILE";
  confidence: number; // 0-100
  
  // Components
  priceVelocity: {
    direction: "RISING" | "FALLING" | "STABLE";
    momentum: number; // -10 to +10
    topMovers: Array<{ category: string; changePercent: number }>;
    avgSupplierIncrease: number; // %
  };
  
  paymentDynamics: {
    avgDelayDays: number;
    delayTrend: "IMPROVING" | "WORSENING" | "STABLE";
    delayByTier: Record<string, number>;
    cashConversionCycle: number; // Days
  };
  
  macroIndicators: {
    cbeDepositRate: number;
    cbeLendingRate: number;
    impliedSpread: number;
    inflationEstimate: number; // % monthly
    exchangeRateEGPUSD: number;
    fxVolatility: "LOW" | "MEDIUM" | "HIGH";
  };
  
  // Platform-specific
  platformMetrics: {
    dailyGMV: number;
    orderCount: number;
    avgOrderValue: number;
    newHotels: number;
    newSuppliers: number;
    creditUtilization: number; // % of approved limits used
    defaultRiskScore: number; // 0-100
  };
  
  // Signals
  alerts: Array<{
    severity: "CRITICAL" | "WARNING" | "INFO";
    category: string;
    message: string;
    action: string;
  }>;
  
  // Recommendations
  pricingAdjustments: Array<{
    category: string;
    currentMargin: number;
    recommendedMargin: number;
    reason: string;
  }>;
  
  creditRecommendations: {
    tightenStandards: boolean;
    reduceTenorFor: string[];
    increaseCollateralFor: string[];
    suggestedFactoringFeeAdjustment: number; // basis points
  };
}

interface RawMarketData {
  orders: Array<{
    total: number;
    createdAt: Date;
    status: string;
    hotel?: { governorate?: string | null } | null;
  }>;
  priceChanges: Array<{
    category: string;
    avgPrice: number;
    previousAvgPrice: number;
    changePercent: number;
  }>;
  paymentDelays: Array<{
    tier: string;
    avgDelayDays: number;
    count: number;
  }>;
  creditLines: Array<{
    status: string;
    limit: number | null;
    utilized: number | null;
  }>;
}

export class CashflowCompass {
  private static instance: CashflowCompass;
  private lastReading: CompassReading | null = null;

  static getInstance(): CashflowCompass {
    if (!CashflowCompass.instance) {
      CashflowCompass.instance = new CashflowCompass();
    }
    return CashflowCompass.instance;
  }

  async generateReading(): Promise<CompassReading> {
    const rawData = await this.collectData();
    const reading = await this.analyze(rawData);
    this.lastReading = reading;

    // Persist to database
    await prisma.compassReading.create({
      data: {
        date: reading.timestamp,
        marketDirection: reading.marketDirection,
        confidence: reading.confidence,
        priceVelocity: JSON.stringify(reading.priceVelocity),
        paymentDynamics: JSON.stringify(reading.paymentDynamics),
        macroIndicators: JSON.stringify(reading.macroIndicators),
        platformMetrics: JSON.stringify(reading.platformMetrics),
        alerts: JSON.stringify(reading.alerts),
        pricingAdjustments: JSON.stringify(reading.pricingAdjustments),
        creditRecommendations: JSON.stringify(reading.creditRecommendations),
      },
    }).catch(() => null);

    return reading;
  }

  async getLastReading(): Promise<CompassReading | null> {
    if (this.lastReading) return this.lastReading;

    const dbReading = await prisma.compassReading.findFirst({
      orderBy: { date: "desc" },
    }).catch(() => null);

    if (!dbReading) return null;
    return this.deserialize(dbReading);
  }

  private async collectData(): Promise<RawMarketData> {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      orders,
      priceChanges,
      paymentDelays,
      creditLines,
    ] = await Promise.all([
      // Recent orders
      prisma.order.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        include: { hotel: { select: { governorate: true } } },
        take: 10000,
      }).catch(() => []),

      // Price changes by category (compare last 7 days vs previous 7 days)
      prisma.$queryRaw<Array<{ category: string; avgPrice: number; previousAvgPrice: number; changePercent: number }>>`
        WITH recent AS (
          SELECT p.category, AVG(oi.price) as avg_price
          FROM "OrderItem" oi
          JOIN "Product" p ON oi."productId" = p.id
          WHERE oi."createdAt" >= ${sevenDaysAgo}
          GROUP BY p.category
        ),
        previous AS (
          SELECT p.category, AVG(oi.price) as avg_price
          FROM "OrderItem" oi
          JOIN "Product" p ON oi."productId" = p.id
          WHERE oi."createdAt" >= ${new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000)}
          AND oi."createdAt" < ${sevenDaysAgo}
          GROUP BY p.category
        )
        SELECT r.category, r.avg_price as avgPrice, p.avg_price as previousAvgPrice,
               CASE WHEN p.avg_price > 0 THEN ((r.avg_price - p.avg_price) / p.avg_price * 100) ELSE 0 END as changePercent
        FROM recent r
        LEFT JOIN previous p ON r.category = p.category
      `.catch(() => []),

      // Payment delays by hotel tier
      prisma.$queryRaw<Array<{ tier: string; avgDelayDays: number; count: number }>>`
        SELECT 
          CASE 
            WHEN h.rooms >= 200 THEN 'LUXURY'
            WHEN h.rooms >= 100 THEN 'UPSCALE'
            WHEN h.rooms >= 50 THEN 'MIDSCALE'
            ELSE 'BUDGET'
          END as tier,
          AVG(EXTRACT(EPOCH FROM (i."paidAt" - i."dueDate")) / 86400) as avgDelayDays,
          COUNT(*) as count
        FROM "Invoice" i
        JOIN "Hotel" h ON i."hotelId" = h.id
        WHERE i."paidAt" IS NOT NULL 
        AND i."dueDate" IS NOT NULL
        AND i."paidAt" > i."dueDate"
        AND i."createdAt" >= ${thirtyDaysAgo}
        GROUP BY tier
      `.catch(() => []),

      // Credit line utilization
      prisma.creditFacility.findMany({
        where: { status: "ACTIVE" },
        select: { limit: true, utilized: true, status: true },
      }).catch(() => []),
    ]);

    return { orders, priceChanges, paymentDelays, creditLines };
  }

  private async analyze(raw: RawMarketData): Promise<CompassReading> {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate platform metrics
    const recentOrders = raw.orders.filter((o) => new Date(o.createdAt) >= sevenDaysAgo);
    const dailyGMV = recentOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0) / 7;
    const orderCount = recentOrders.length;
    const avgOrderValue = orderCount > 0 ? dailyGMV * 7 / orderCount : 0;

    const totalLimit = raw.creditLines.reduce((s, c) => s + (Number(c.limit) || 0), 0);
    const totalUtilized = raw.creditLines.reduce((s, c) => s + (Number(c.utilized) || 0), 0);
    const creditUtilization = totalLimit > 0 ? (totalUtilized / totalLimit) * 100 : 0;

    // Calculate price velocity
    const topMovers = raw.priceChanges
      .filter((p) => Math.abs(p.changePercent) > 2)
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 5)
      .map((p) => ({ category: p.category, changePercent: Math.round(p.changePercent * 100) / 100 }));

    const avgIncrease = raw.priceChanges.length > 0
      ? raw.priceChanges.reduce((s, p) => s + p.changePercent, 0) / raw.priceChanges.length
      : 0;

    // Payment dynamics
    const avgDelay = raw.paymentDelays.length > 0
      ? raw.paymentDelays.reduce((s, p) => s + (Number(p.avgDelayDays) || 0) * (Number(p.count) || 0), 0)
        / raw.paymentDelays.reduce((s, p) => s + (Number(p.count) || 0), 0)
      : 0;

    const delayByTier: Record<string, number> = {};
    for (const d of raw.paymentDelays) {
      delayByTier[d.tier] = Number(d.avgDelayDays) || 0;
    }

    // Use AI for macro analysis and market direction
    const macroPrompt = `Analyze this Egyptian hospitality market data and provide a structured assessment.

DATA SNAPSHOT:
- Daily GMV (7d avg): EGP ${Math.round(dailyGMV).toLocaleString()}
- Orders (7d): ${orderCount}
- Avg order value: EGP ${Math.round(avgOrderValue).toLocaleString()}
- Credit utilization: ${Math.round(creditUtilization)}%
- Avg payment delay: ${Math.round(avgDelay)} days
- Price momentum: ${avgIncrease > 0 ? "+" : ""}${Math.round(avgIncrease * 100) / 100}% average
- Top price movers: ${JSON.stringify(topMovers)}

CONTEXT:
- CBE deposit rate: 19%, lending rate: 20% (May 2026)
- Egyptian hospitality market: $21.54B, 7.12% CAGR
- Supply chain: 6th of October City (1,853 factories), 10th of Ramadan (3,000+ factories)

Provide JSON with these fields:
{
  "marketDirection": "INFLATIONARY|RECESSIONARY|STABLE|VOLATILE",
  "confidence": 0-100,
  "priceVelocityMomentum": -10 to 10,
  "inflationEstimate": monthly inflation %,
  "fxVolatility": "LOW|MEDIUM|HIGH",
  "defaultRiskScore": 0-100,
  "cashConversionCycle": estimated days,
  "alerts": [{"severity": "CRITICAL|WARNING|INFO", "category": "...", "message": "...", "action": "..."}],
  "pricingAdjustments": [{"category": "...", "currentMargin": %, "recommendedMargin": %, "reason": "..."}],
  "creditRecommendations": {
    "tightenStandards": true/false,
    "reduceTenorFor": ["tier1", "tier2"],
    "increaseCollateralFor": ["tier1"],
    "suggestedFactoringFeeAdjustment": basis points (can be negative)
  }
}`;

    let aiResult: Record<string, unknown> = {};
    try {
      const llmResponse = await executeLLM(
        `You are the Cashflow Compass — Hotels Vendors' proprietary macroeconomic intelligence engine. 
You analyze Egyptian hospitality supply chain dynamics, payment behavior, and inflation signals.
You provide concise, actionable market direction signals with specific pricing and credit recommendations.
Respond ONLY in JSON format.`,
        macroPrompt,
        { temperature: 0.3, maxTokens: 2000, preferredModel: "xai" }
      );
      aiResult = JSON.parse(llmResponse.content.replace(/```json?\s*|```/g, "").trim());
    } catch {
      // Fallback to rule-based if AI fails
      aiResult = this.fallbackAnalysis(avgIncrease, avgDelay, creditUtilization, dailyGMV);
    }

    return {
      timestamp: today,
      marketDirection: (aiResult.marketDirection as CompassReading["marketDirection"]) || "STABLE",
      confidence: Number(aiResult.confidence) || 60,
      priceVelocity: {
        direction: avgIncrease > 3 ? "RISING" : avgIncrease < -3 ? "FALLING" : "STABLE",
        momentum: Number(aiResult.priceVelocityMomentum) || Math.max(-10, Math.min(10, avgIncrease)),
        topMovers,
        avgSupplierIncrease: Math.round(avgIncrease * 100) / 100,
      },
      paymentDynamics: {
        avgDelayDays: Math.round(avgDelay * 10) / 10,
        delayTrend: avgDelay > 45 ? "WORSENING" : avgDelay < 30 ? "IMPROVING" : "STABLE",
        delayByTier,
        cashConversionCycle: Number(aiResult.cashConversionCycle) || Math.round(avgDelay + 15),
      },
      macroIndicators: {
        cbeDepositRate: 19.0,
        cbeLendingRate: 20.0,
        impliedSpread: 1.0,
        inflationEstimate: Number(aiResult.inflationEstimate) || Math.max(5, avgIncrease * 2),
        exchangeRateEGPUSD: 50.5, // Approximate as of May 2026
        fxVolatility: (aiResult.fxVolatility as CompassReading["macroIndicators"]["fxVolatility"]) || "MEDIUM",
      },
      platformMetrics: {
        dailyGMV: Math.round(dailyGMV),
        orderCount,
        avgOrderValue: Math.round(avgOrderValue),
        newHotels: 0, // Would need to query
        newSuppliers: 0, // Would need to query
        creditUtilization: Math.round(creditUtilization * 100) / 100,
        defaultRiskScore: Number(aiResult.defaultRiskScore) || Math.round((avgDelay / 60) * 50 + (avgIncrease / 10) * 20),
      },
      alerts: Array.isArray(aiResult.alerts) ? aiResult.alerts as CompassReading["alerts"] : [],
      pricingAdjustments: Array.isArray(aiResult.pricingAdjustments) ? aiResult.pricingAdjustments as CompassReading["pricingAdjustments"] : [],
      creditRecommendations: (aiResult.creditRecommendations as CompassReading["creditRecommendations"]) || {
        tightenStandards: false,
        reduceTenorFor: [],
        increaseCollateralFor: [],
        suggestedFactoringFeeAdjustment: 0,
      },
    };
  }

  private fallbackAnalysis(
    avgIncrease: number,
    avgDelay: number,
    creditUtil: number,
    dailyGMV: number
  ): Record<string, unknown> {
    const alerts = [];
    if (avgIncrease > 10) alerts.push({ severity: "WARNING", category: "INFLATION", message: "Supplier prices rising sharply", action: "Tighten pricing margins and review supplier contracts" });
    if (avgDelay > 60) alerts.push({ severity: "CRITICAL", category: "CREDIT", message: "Average payment delays exceeding 60 days", action: "Tighten credit standards and reduce tenors" });
    if (creditUtil > 80) alerts.push({ severity: "WARNING", category: "LIQUIDITY", message: "High credit utilization", action: "Monitor exposure and consider raising factoring fees" });
    if (dailyGMV < 100000) alerts.push({ severity: "INFO", category: "GROWTH", message: "Low daily GMV", action: "Focus on hotel acquisition" });

    return {
      marketDirection: avgIncrease > 5 ? "INFLATIONARY" : avgDelay > 45 ? "VOLATILE" : "STABLE",
      confidence: 50,
      priceVelocityMomentum: Math.max(-10, Math.min(10, avgIncrease)),
      inflationEstimate: avgIncrease * 2,
      fxVolatility: "MEDIUM",
      defaultRiskScore: Math.round((avgDelay / 60) * 50 + (avgIncrease / 10) * 20),
      cashConversionCycle: Math.round(avgDelay + 15),
      alerts,
      pricingAdjustments: avgIncrease > 5 ? [{ category: "ALL", currentMargin: 15, recommendedMargin: 18, reason: "Inflationary pressure" }] : [],
      creditRecommendations: {
        tightenStandards: avgDelay > 60,
        reduceTenorFor: avgDelay > 45 ? ["BB", "B"] : [],
        increaseCollateralFor: avgDelay > 60 ? ["ALL"] : [],
        suggestedFactoringFeeAdjustment: avgIncrease > 10 ? 50 : avgIncrease > 5 ? 25 : 0,
      },
    };
  }

  private deserialize(dbReading: any): CompassReading {
    return {
      timestamp: dbReading.date,
      marketDirection: dbReading.marketDirection,
      confidence: dbReading.confidence,
      priceVelocity: JSON.parse(dbReading.priceVelocity || "{}"),
      paymentDynamics: JSON.parse(dbReading.paymentDynamics || "{}"),
      macroIndicators: JSON.parse(dbReading.macroIndicators || "{}"),
      platformMetrics: JSON.parse(dbReading.platformMetrics || "{}"),
      alerts: JSON.parse(dbReading.alerts || "[]"),
      pricingAdjustments: JSON.parse(dbReading.pricingAdjustments || "[]"),
      creditRecommendations: JSON.parse(dbReading.creditRecommendations || "{}"),
    };
  }
}

// ── Singleton export ───────────────────────────────────────────

export const cashflowCompass = CashflowCompass.getInstance();
