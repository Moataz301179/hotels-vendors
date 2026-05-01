import { prisma } from "./prisma";
import { INITIAL_COMPETITORS, INITIAL_MARKET_GAPS } from "./agents/agents";
import { CompetitorType, CompetitorStatus, FeatureCategory, Complexity, Impact } from "@prisma/client";

async function seedIntelligence() {
  console.log("🧠 Seeding intelligence layer...");

  // ── Seed Competitors ──
  for (const c of INITIAL_COMPETITORS) {
    await prisma.competitor.upsert({
      where: { name: c.name },
      update: {
        type: c.type as CompetitorType,
        vertical: c.vertical,
        model: c.model,
        strengths: JSON.stringify(c.strengths),
        weaknesses: JSON.stringify(c.weaknesses),
        features: JSON.stringify(c.features),
        funding: c.funding,
        status: c.status as CompetitorStatus,
        geoCoverage: c.scale.countries,
      },
      create: {
        name: c.name,
        type: c.type as CompetitorType,
        vertical: c.vertical,
        model: c.model,
        strengths: JSON.stringify(c.strengths),
        weaknesses: JSON.stringify(c.weaknesses),
        features: JSON.stringify(c.features),
        funding: c.funding,
        status: c.status as CompetitorStatus,
        geoCoverage: c.scale.countries,
        marketFocus: c.scale.countries?.includes("Egypt") ? "Egypt" : "Global",
      },
    });
  }
  console.log(`   Competitors: ${INITIAL_COMPETITORS.length}`);

  // ── Seed Market Gaps as Insights ──
  for (const g of INITIAL_MARKET_GAPS) {
    await prisma.marketInsight.upsert({
      where: { id: g.id },
      update: {},
      create: {
        id: g.id,
        title: g.title,
        category: "OPPORTUNITY",
        summary: g.description,
        detail: `## ${g.title}\n\n${g.description}\n\n**Severity:** ${g.severity.toUpperCase()}\n\n**Affected Parties:** ${g.affectedActors.join(", ")}\n\n**Competitor Blind Spot:** ${g.competitorBlindSpot}\n\n**Revenue Opportunity:** ${g.revenueOpportunity}\n\n**Proposed Solution:** ${g.proposedSolution}`,
        impactScore: g.severity === "critical" ? 95 : g.severity === "high" ? 80 : 60,
        confidence: 90,
        discoveredBy: "Data Harvester",
      },
    });
  }
  console.log(`   Market Gaps: ${INITIAL_MARKET_GAPS.length}`);

  // ── Seed Initial Feature Proposals ──
  const initialFeatures = [
    {
      title: "Occupancy-Linked Factoring",
      description:
        "Factor pays supplier within 24hrs at 2.5% fee. Repayment tied to hotel occupancy data + booking confirmations. Risk engine uses ETA invoice history + property PMS data.",
      category: "FINANCE",
      targetActor: "FACTOR",
      complexity: "HIGH",
      impact: "TRANSFORMATIVE",
      problem: "Suppliers face 60-120 day payment terms. No platform offers supplier-side factoring in Egypt hospitality.",
      solution: "Embedded factoring with occupancy-based risk scoring.",
      proposedBy: "Fintech Architect",
      gapAddressed: "No Embedded Factoring for Supplier Liquidity",
      moatScore: 95,
      revenuePotential: "EGP 42M/year at EGP 1.2B factored",
    },
    {
      title: "ETA API Connector",
      description:
        "Native integration with Egypt Tax Authority: auto-generate UUID, SHA-256 digital signature, submit via API, track status, handle rejections with dead-letter queue + manual resolution UI.",
      category: "COMPLIANCE",
      targetActor: "ALL",
      complexity: "HIGH",
      impact: "TRANSFORMATIVE",
      problem: "Egyptian law mandates ETA e-invoicing. No hospitality platform has built-in compliance.",
      solution: "End-to-end ETA submission with digital signing and retry logic.",
      proposedBy: "Integration Lead",
      gapAddressed: "No ETA E-Invoicing Native Integration",
      moatScore: 98,
      revenuePotential: "EGP 6.3M/year + mandatory lock-in",
    },
    {
      title: "AI Procurement Copilot",
      description:
        "Conversational AI that understands: 'Order rice for 3 properties for next week based on current occupancy.' Auto-generates POs, suggests alternatives, and routes for approval.",
      category: "AI_ML",
      targetActor: "HOTEL",
      complexity: "HIGH",
      impact: "TRANSFORMATIVE",
      problem: "Hotels overstock by 25% due to poor forecasting. Manual PO creation is time-consuming.",
      solution: "LLM-powered copilot with occupancy-aware demand forecasting.",
      proposedBy: "UX Designer",
      gapAddressed: "No Demand Forecasting or AI-Powered Procurement",
      moatScore: 90,
      revenuePotential: "High via SaaS premium tier",
    },
    {
      title: "Shark-Breaker Shared Logistics",
      description:
        "Cluster-based delivery optimization for coastal hotels. Dynamic truck sharing within 5km radius. Temperature-controlled compartments. 30% cost reduction guarantee.",
      category: "LOGISTICS",
      targetActor: "LOGISTICS",
      complexity: "HIGH",
      impact: "TRANSFORMATIVE",
      problem: "Coastal hotels operate seasonally with massive demand spikes. 40% empty truck miles.",
      solution: "Shared logistics with dynamic routing by cluster and temperature requirements.",
      proposedBy: "Business Strategist",
      gapAddressed: "No Coastal Logistics Optimization",
      moatScore: 88,
      revenuePotential: "EGP 12M/year logistics fees",
    },
    {
      title: "Visual Authority Matrix Builder",
      description:
        "Drag-and-drop interface to configure approval chains. Preview mode shows which orders will route where. Simulation tool tests edge cases before going live.",
      category: "GOVERNANCE",
      targetActor: "HOTEL",
      complexity: "MEDIUM",
      impact: "HIGH",
      problem: "Hotel chains need multi-level PO approval by property, role, category, and value. No platform supports this natively.",
      solution: "Visual matrix builder with simulation and immutable audit trails.",
      proposedBy: "UX Designer",
      gapAddressed: "Missing Multi-Property Governance & Authority Matrix",
      moatScore: 85,
      revenuePotential: "EGP 15K+/month per chain",
    },
    {
      title: "Supplier Trust Score",
      description:
        "Composite scoring: certifications, on-time delivery %, quality complaints, ETA compliance, hotel ratings. Auto-alerts for expiring certs. Premier suppliers get preferential placement.",
      category: "MARKETPLACE",
      targetActor: "SUPPLIER",
      complexity: "MEDIUM",
      impact: "HIGH",
      problem: "Hotels lack visibility into supplier certifications and quality history.",
      solution: "Dynamic trust score with certification expiry alerts and tiered benefits.",
      proposedBy: "Security Expert",
      gapAddressed: "No Supplier Certification & Quality Scoring",
      moatScore: 75,
      revenuePotential: "EGP 5K per inspection + premium placement fees",
    },
    {
      title: "Arabic RTL Mobile App",
      description:
        "Full Arabic interface with RTL layout for GMs and receiving clerks. Offline mode for basement storage areas. Barcode/QR scanning for goods receipt.",
      category: "MOBILE",
      targetActor: "ALL",
      complexity: "MEDIUM",
      impact: "HIGH",
      problem: "60% of Egyptian hotel staff prefer Arabic UI. Receiving clerks work on phones in storage areas.",
      solution: "Native mobile app with offline mode, RTL, and barcode scanning.",
      proposedBy: "UX Designer",
      gapAddressed: "General UX gap in local market",
      moatScore: 70,
      revenuePotential: "Adoption enabler — indirect revenue",
    },
    {
      title: "White-Label Marketplace",
      description:
        "Hotel chains can brand the procurement portal as their own. Custom catalogs, approval rules, and reporting. SaaS fee + revenue share on transactions.",
      category: "MARKETPLACE",
      targetActor: "HOTEL",
      complexity: "MEDIUM",
      impact: "HIGH",
      problem: "Large chains want procurement under their own brand, not a third-party marketplace.",
      solution: "White-label deployment with custom branding and isolated data.",
      proposedBy: "Business Strategist",
      gapAddressed: "Enterprise chain requirements",
      moatScore: 80,
      revenuePotential: "EGP 3-15K/month per chain + revenue share",
    },
    {
      title: "Fraud Detection Engine",
      description:
        "ML model detects anomalous orders: unusual quantities, off-hours submissions, duplicate invoices, supplier collusion patterns. Real-time alerts to controllers.",
      category: "AI_ML",
      targetActor: "HOTEL",
      complexity: "HIGH",
      impact: "HIGH",
      problem: "Procurement fraud is estimated at 2-5% of hospitality spend in emerging markets.",
      solution: "Anomaly detection with explainable alerts and case management.",
      proposedBy: "Security Expert",
      gapAddressed: "Governance and risk",
      moatScore: 82,
      revenuePotential: "High via fraud prevention value",
    },
    {
      title: "Dynamic Credit Scoring",
      description:
        "Real-time credit limit adjustments per hotel based on: occupancy trends, ETA invoice payment history, seasonality, and macroeconomic indicators. Auto-approves credit increases up to 20%.",
      category: "AI_ML",
      targetActor: "HOTEL",
      complexity: "HIGH",
      impact: "HIGH",
      problem: "Static credit limits don't reflect hotel performance. Good hotels are under-credited.",
      solution: "Multi-factor dynamic scoring with auto-adjustment and human override.",
      proposedBy: "Fintech Architect",
      gapAddressed: "Credit access optimization",
      moatScore: 85,
      revenuePotential: "Higher GMV via increased credit limits",
    },
  ];

  for (const f of initialFeatures) {
    const exists = await prisma.featureProposal.findFirst({
      where: { title: f.title },
    });
    if (!exists) {
      await prisma.featureProposal.create({
        data: {
          ...f,
          category: f.category as FeatureCategory,
          complexity: f.complexity as Complexity,
          impact: f.impact as Impact,
        },
      });
    }
  }
  console.log(`   Feature Proposals: ${initialFeatures.length}`);

  console.log("✅ Intelligence layer seeded!");
}

seedIntelligence()
  .catch((e) => {
    console.error("❌ Intelligence seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
