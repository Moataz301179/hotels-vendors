import { prisma } from "@/lib/prisma";
import { executeLLM } from "@/lib/ai/llm";
import { HotelScoreEngine } from "@/lib/fintech/scoring/hotel-score-engine";
import type { HotelCreditScore } from "@/lib/fintech/scoring/hotel-score-engine";

const NARRATIVE_PROMPT = `You are the Hotels Vendors Credit Underwriting AI — an institutional-grade financial analyst specialized in Egyptian hospitality sector credit risk.

Your job: Analyze the provided hotel financial data and produce a rigorous, bank-quality credit assessment.

SCORING FRAMEWORK (Hotels Vendors Proprietary):
- Financial Health (18%): Revenue scale, asset base, runway
- Liquidity Position (18%): Current ratio, quick ratio, cash buffer
- Leverage Profile (12%): Debt ratios, payment discipline
- Profitability (12%): Margins, ROA, asset turnover
- Collateral Strength (10%): Property deeds, guarantees, deposits
- Market Position (12%): Brand strength, scale, location quality
- Platform Behavior (10%): Payment history, order volume (if available)
- Sector Risk (8%): Inflation, payment delay trends, seasonality

OUTPUT FORMAT — JSON:
{
  "report": "Detailed 3-paragraph narrative assessment...",
  "riskFlags": [
    { "severity": "RED|AMBER|GREEN", "category": "LIQUIDITY|LEVERAGE|PROFITABILITY|COLLATERAL|MARKET", "description": "...", "mitigation": "..." }
  ],
  "recommendedLimit": 500000,
  "creditScore": 650,
  "grade": "BBB",
  "riskLevel": "MEDIUM",
  "maxTenorDays": 60,
  "factoringFee": 4.5,
  "approvalProbability": 75,
  "peerComparison": "Above average among Egyptian hospitality groups",
  "trendDirection": "STABLE|IMPROVING|DECLINING",
  "keyRisks": ["..."],
  "mitigationSuggestions": ["..."]
}`;

export interface CreditAssessment {
  applicationId: string;
  status: string;
  engineScore: HotelCreditScore;
  aiNarrative: string | null;
  riskFlags: Record<string, unknown>[];
  keyRisks: string[];
  mitigationSuggestions: string[];
}

export async function runCreditPipeline(applicationId: string): Promise<CreditAssessment> {
  const app = await prisma.creditLineApplication.findUnique({
    where: { id: applicationId },
  });

  if (!app) {
    throw new Error(`CreditLineApplication ${applicationId} not found`);
  }

  await prisma.creditLineApplication.update({
    where: { id: applicationId },
    data: { status: "AI_ANALYZING" },
  });

  const financials = {
    annualRevenue: Number(app.annualRevenue || 0),
    netProfit: Number(app.netProfit || 0),
    totalAssets: Number(app.totalAssets || 0),
    currentAssets: Number(app.currentAssets || 0),
    totalLiabilities: Number(app.totalLiabilities || 0),
    currentLiabilities: Number(app.currentLiabilities || 0),
    bankBalance: Number(app.bankBalance || 0),
    monthlyPurchases: Number(app.monthlyPurchases || 0),
    avgPaymentDays: Number(app.avgPaymentDays || 0),
    existingDebt: Number(app.existingDebt || 0),
  };

  const profile = {
    properties: app.properties || 1,
    rooms: app.rooms || 0,
    governorate: app.governorate || "Unknown",
    brand: app.brand,
    yearsInOperation: 5,
  };

  const collateral = {
    propertyDeed: app.propertyDeed,
    bankGuarantee: app.bankGuarantee,
    personalGuarantee: app.personalGuarantee,
    equipmentCollateral: app.equipmentCollateral,
    depositAmount: Number(app.depositAmount || 0),
  };

  const market = {
    sectorInflation: 12,
    avgPaymentDelayTrend: 5,
    tourismOccupancyRate: 65,
    seasonalFactor: 1.0,
  };

  const engineScore = HotelScoreEngine.calculateScore(financials, profile, collateral, market);

  const financialPrompt = `HOTEL: ${app.hotelName}
BRAND: ${app.brand || "Independent"}
PROPERTIES: ${app.properties || 1} | ROOMS: ${app.rooms || "N/A"}
LOCATION: ${app.governorate || "Unknown"}

FINANCIAL SNAPSHOT:
- Annual Revenue: EGP ${Number(app.annualRevenue || 0).toLocaleString()}
- Net Profit: EGP ${Number(app.netProfit || 0).toLocaleString()} (${Number(app.annualRevenue || 0) > 0 ? (Number(app.netProfit || 0) / Number(app.annualRevenue) * 100).toFixed(1) : "N/A"}% margin)
- Total Assets: EGP ${Number(app.totalAssets || 0).toLocaleString()}
- Total Liabilities: EGP ${Number(app.totalLiabilities || 0).toLocaleString()}
- Current Ratio: ${Number(app.currentLiabilities || 0) > 0 ? (Number(app.currentAssets || 0) / Number(app.currentLiabilities || 1)).toFixed(2) : "N/A"}
- Bank Balance: EGP ${Number(app.bankBalance || 0).toLocaleString()}
- Monthly Purchases: EGP ${Number(app.monthlyPurchases || 0).toLocaleString()}
- Average Payment Days: ${app.avgPaymentDays || "N/A"}
- Existing Debt: EGP ${Number(app.existingDebt || 0).toLocaleString()}

COLLATERAL:
- Property Deed: ${app.propertyDeed ? "YES" : "NO"}
- Bank Guarantee: ${app.bankGuarantee ? "YES" : "NO"}
- Personal Guarantee: ${app.personalGuarantee ? "YES" : "NO"}
- Equipment Collateral: ${app.equipmentCollateral ? "YES" : "NO"}
- Cash Deposit: EGP ${Number(app.depositAmount || 0).toLocaleString()}

PROPRIETARY ENGINE SCORE: ${engineScore.overallScore}/1000
GRADE: ${engineScore.grade} | RISK: ${engineScore.riskLevel}
RECOMMENDED LIMIT: EGP ${engineScore.recommendedLimit.toLocaleString()}
MAX TENOR: ${engineScore.maxTenorDays} days | FACTORING FEE: ${engineScore.factoringFee}%

COMPONENT SCORES:
- Financial Health: ${engineScore.financialHealth}/100
- Liquidity: ${engineScore.liquidityPosition}/100
- Leverage: ${engineScore.leverageProfile}/100
- Profitability: ${engineScore.profitability}/100
- Collateral: ${engineScore.collateralStrength}/100
- Market Position: ${engineScore.marketPosition}/100
- Sector Risk: ${engineScore.sectorRisk}/100

Use the engine scores as your baseline. Your task is to write the narrative report and validate/refine the risk flags.`;

  let aiNarrative: string | null = null;
  let riskFlags: Record<string, unknown>[] = [];
  let finalScore = engineScore.overallScore;
  let finalLimit = engineScore.recommendedLimit;
  let finalGrade = engineScore.grade;
  let finalRiskLevel = engineScore.riskLevel;
  let finalTenor = engineScore.maxTenorDays;
  let finalFee = engineScore.factoringFee;
  let finalApprovalProb = engineScore.approvalProbability;
  let finalPeerComparison = engineScore.peerComparison;
  let finalTrendDirection = engineScore.trendDirection;
  let finalKeyRisks = engineScore.keyRisks;
  let finalMitigations = engineScore.mitigationSuggestions;

  try {
    const llmResult = await executeLLM(NARRATIVE_PROMPT, financialPrompt, {
      temperature: 0.2,
      maxTokens: 3000,
    });
    const parsed = JSON.parse(llmResult.content.replace(/```json?\s*|```/g, "").trim());

    aiNarrative = parsed.report || null;
    riskFlags = parsed.riskFlags || [];
    finalScore = Number(parsed.creditScore) || engineScore.overallScore;
    finalLimit = Number(parsed.recommendedLimit) || engineScore.recommendedLimit;
    finalGrade = (parsed.grade as "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "D") || engineScore.grade;
    finalRiskLevel = (parsed.riskLevel as "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH") || engineScore.riskLevel;
    finalTenor = Number(parsed.maxTenorDays) || engineScore.maxTenorDays;
    finalFee = Number(parsed.factoringFee) || engineScore.factoringFee;
    finalApprovalProb = Number(parsed.approvalProbability) || engineScore.approvalProbability;
    finalPeerComparison = (parsed.peerComparison as string) || engineScore.peerComparison;
    finalTrendDirection = (parsed.trendDirection as "IMPROVING" | "STABLE" | "DECLINING") || engineScore.trendDirection;
    finalKeyRisks = (parsed.keyRisks as string[]) || engineScore.keyRisks;
    finalMitigations = (parsed.mitigationSuggestions as string[]) || engineScore.mitigationSuggestions;
  } catch {
    riskFlags = engineScore.redFlags.map((f) => ({ severity: "RED", category: "GENERAL", description: f, mitigation: "Review with underwriting team" })).concat(
      engineScore.amberFlags.map((f) => ({ severity: "AMBER", category: "GENERAL", description: f, mitigation: "Monitor closely" }))
    );
  }

  await prisma.creditLineApplication.update({
    where: { id: applicationId },
    data: {
      status: "FACTORING_REVIEW",
      creditScore: finalScore,
      recommendedLimit: finalLimit,
      aiAnalysisReport: JSON.stringify({
        report: aiNarrative,
        riskFlags,
        peerComparison: finalPeerComparison,
        trendDirection: finalTrendDirection,
        keyRisks: finalKeyRisks,
        mitigationSuggestions: finalMitigations,
        engineScores: {
          financialHealth: engineScore.financialHealth,
          liquidityPosition: engineScore.liquidityPosition,
          leverageProfile: engineScore.leverageProfile,
          profitability: engineScore.profitability,
          collateralStrength: engineScore.collateralStrength,
          marketPosition: engineScore.marketPosition,
          sectorRisk: engineScore.sectorRisk,
        },
      }),
      aiRiskFlags: JSON.stringify({
        redFlags: engineScore.redFlags,
        amberFlags: engineScore.amberFlags,
        greenFlags: engineScore.greenFlags,
      }),
    },
  });

  return {
    applicationId,
    status: "FACTORING_REVIEW",
    engineScore,
    aiNarrative,
    riskFlags,
    keyRisks: finalKeyRisks,
    mitigationSuggestions: finalMitigations,
  };
}
