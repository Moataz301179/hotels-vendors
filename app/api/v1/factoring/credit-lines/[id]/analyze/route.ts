import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeLLM } from "@/lib/swarm/model-router";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const app = await prisma.creditLineApplication.findUnique({ where: { id } });
    if (!app) return Response.json({ success: false, error: "Not found" }, { status: 404 });

    await prisma.creditLineApplication.update({
      where: { id },
      data: { status: "AI_ANALYZING" },
    });

    const rev = app.annualRevenue || 0;
    const profit = app.netProfit || 0;
    const assets = app.totalAssets || 1;
    const liabilities = app.totalLiabilities || 1;
    const currentAssets = app.currentAssets || 0;
    const currentLiab = app.currentLiabilities || 1;
    const bankBal = app.bankBalance || 0;
    const debt = app.existingDebt || 0;
    const monthlyPurch = app.monthlyPurchases || rev * 0.3;

    const margin = rev > 0 ? (profit / rev) * 100 : 0;
    const currentRatio = currentAssets / currentLiab;
    const debtRatio = debt / assets;
    const debtToEquity = liabilities / (assets - liabilities + 0.001);
    const runway = rev > 0 ? (bankBal / (rev / 12)) : 0;

    const prompt = `You are a senior credit risk analyst at a factoring company reviewing a hotel group for a non-recourse factoring facility in Egypt.

Analyze the following hotel and provide a structured credit risk assessment. Be professional, precise, and conservative.

HOTEL PROFILE:
- Name: ${app.hotelName}
- Brand: ${app.brand || "Independent"}
- Properties: ${app.properties || "N/A"}
- Rooms: ${app.rooms || "N/A"}
- Location: ${app.governorate || "N/A"}
- CR: ${app.crNumber}
- Tax ID: ${app.taxId}

FINANCIAL METRICS:
- Annual Revenue: EGP ${rev.toLocaleString()}
- Net Profit: EGP ${profit.toLocaleString()} (${margin.toFixed(1)}% margin)
- Total Assets: EGP ${assets.toLocaleString()}
- Current Assets: EGP ${currentAssets.toLocaleString()}
- Total Liabilities: EGP ${liabilities.toLocaleString()}
- Current Liabilities: EGP ${currentLiab.toLocaleString()}
- Bank Balance: EGP ${bankBal.toLocaleString()}
- Monthly Procurement: EGP ${monthlyPurch.toLocaleString()}
- Existing Debt: EGP ${debt.toLocaleString()}
- Avg Payment Days: ${app.avgPaymentDays || "N/A"}

DERIVED RATIOS:
- Current Ratio: ${currentRatio.toFixed(2)}
- Debt-to-Assets: ${(debtRatio * 100).toFixed(1)}%
- Debt-to-Equity: ${debtToEquity.toFixed(2)}
- Cash Runway (months): ${runway.toFixed(1)}

COLLATERAL:
- Property Deed: ${app.propertyDeed ? "Yes" : "No"}
- Bank Guarantee: ${app.bankGuarantee ? "Yes" : "No"}
- Personal Guarantee: ${app.personalGuarantee ? "Yes" : "No"}
- Equipment Collateral: ${app.equipmentCollateral ? "Yes" : "No"}
- Cash Deposit: EGP ${(app.depositAmount || 0).toLocaleString()}

EGYPTIAN HOSPITALITY CONTEXT:
- Peak season: Red Sea (Oct-Apr), North Coast (Jun-Sep)
- Major chains: Marriott, Hilton, Accor, Jaz, Steigenberger
- Factoring rates in Egypt: 3.5-6.5% for 60 days non-recourse
- Hotel sector is considered medium-high risk by Egyptian banks

Provide your analysis in this exact format:

## CREDIT RISK SUMMARY
[One-paragraph executive summary: overall risk level and key concerns]

## STRENGTHS
- [List 3-5 strengths]

## WEAKNESSES / RED FLAGS
- [List 3-5 weaknesses or red flags]

## KEY RATIOS ANALYSIS
- [Interpret each ratio in plain language]

## RECOMMENDED CREDIT LINE
- Suggested Limit: EGP [amount]
- Justification: [Why this amount]
- Risk Grade: [A/B/C/D]

## CONDITIONS FOR APPROVAL
- [List specific conditions]

## FINAL RECOMMENDATION
[APPROVE / APPROVE WITH CONDITIONS / REJECT — with explanation]`;

    const result = await executeLLM(prompt, "Analyze this hotel for credit line approval", {
      maxTokens: 1200,
      temperature: 0.3,
      preferredModel: "auto",
    });

    const report = result.content;
    let riskGrade = "C";
    if (report.includes("Risk Grade: A")) riskGrade = "A";
    else if (report.includes("Risk Grade: B")) riskGrade = "B";
    else if (report.includes("Risk Grade: D")) riskGrade = "D";

    const flags: string[] = [];
    if (currentRatio < 1) flags.push("Low current ratio — liquidity risk");
    if (debtRatio > 0.6) flags.push("High debt load");
    if (margin < 5) flags.push("Thin profit margins");
    if (runway < 2) flags.push("Low cash reserves");
    if (!app.propertyDeed && !app.bankGuarantee) flags.push("No tangible collateral");
    if (app.avgPaymentDays && app.avgPaymentDays > 90) flags.push("History of late payments");

    await prisma.creditLineApplication.update({
      where: { id },
      data: {
        status: "FACTORING_REVIEW",
        aiAnalysisReport: report,
        aiRiskFlags: flags.join(", "),
      },
    });

    return Response.json({ success: true, data: { report, riskGrade, flags } });
  } catch (error) {
    console.error("[AI Credit Analysis] Error:", error);
    await prisma.creditLineApplication.update({
      where: { id },
      data: { status: "PENDING_REVIEW", aiRiskFlags: "Analysis failed — manual review required" },
    }).catch(() => {});
    return Response.json({ success: false, error: "Analysis failed" }, { status: 500 });
  }
}
