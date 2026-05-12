/**
 * Agent Workflow Orchestrator API
 * POST /api/v1/intelligence/workflows — Execute a multi-agent workflow
 * Body: { workflowType: "credit_analysis" | "market_intelligence" | "compliance_check", input: {} }
 */

import { NextRequest } from "next/server";
import { AgentWorkflow, FinancialTools } from "@/lib/swarm/workflows/agent-workflow";
import { executeLLM } from "@/lib/swarm/model-router";

interface WorkflowDefinition {
  nodes: Array<{
    id: string;
    agentType: string;
    systemPrompt: string;
    tools: string[];
    input: Record<string, unknown>;
    parallel?: boolean;
    dependsOn?: string[];
  }>;
}

const WORKFLOW_DEFINITIONS: Record<string, WorkflowDefinition> = {
  credit_analysis: {
    nodes: [
      {
        id: "financial_analyst",
        agentType: "financial_analyst",
        systemPrompt: `You are a senior credit analyst at Hotels Vendors. Analyze hotel financial data and produce a structured risk assessment.
Output JSON with: riskScore (0-1000), grade (AAA-D), keyRisks (array), recommendedLimit (EGP), maxTenorDays, factoringFee (%).`,
        tools: ["calculate_ratios", "score_credit"],
        input: {},
        parallel: false,
      },
      {
        id: "compliance_checker",
        agentType: "compliance_checker",
        systemPrompt: `You are a compliance officer. Check if the hotel meets Egyptian hospitality regulatory requirements for credit.
Output JSON with: compliant (boolean), issues (array), requiredDocuments (array), etaReadiness (boolean).`,
        tools: [],
        input: {},
        parallel: true,
        dependsOn: ["financial_analyst"],
      },
      {
        id: "risk_assessor",
        agentType: "risk_assessor",
        systemPrompt: `You are a risk management specialist. Assess portfolio risk if we extend credit to this hotel.
Output JSON with: portfolioRiskScore (0-100), concentrationRisk (boolean), sectorExposure (%), recommendation (APPROVE/CONDITIONAL/REJECT).`,
        tools: [],
        input: {},
        parallel: true,
        dependsOn: ["financial_analyst"],
      },
      {
        id: "synthesizer",
        agentType: "synthesizer",
        systemPrompt: `You are the Chief Credit Officer. Synthesize findings from financial analyst, compliance checker, and risk assessor into a final recommendation.
Output JSON with: finalRecommendation (APPROVE/CONDITIONAL/REJECT), approvedLimit (EGP), conditions (array), explanation (string).`,
        tools: [],
        input: {},
        parallel: false,
        dependsOn: ["compliance_checker", "risk_assessor"],
      },
    ],
  },
  market_intelligence: {
    nodes: [
      {
        id: "price_analyst",
        agentType: "price_analyst",
        systemPrompt: `Analyze supplier price trends across categories. Output JSON with: risingCategories (array), fallingCategories (array), volatilityIndex (0-100), forecast (string).`,
        tools: ["query_market_data"],
        input: {},
        parallel: true,
      },
      {
        id: "payment_analyst",
        agentType: "payment_analyst",
        systemPrompt: `Analyze hotel payment behavior patterns. Output JSON with: avgDelayDays, delayTrend, atRiskHotels (count), cashConversionCycle (days).`,
        tools: [],
        input: {},
        parallel: true,
      },
      {
        id: "macro_synthesizer",
        agentType: "macro_synthesizer",
        systemPrompt: `Synthesize price and payment data into market direction. Output JSON with: direction (INFLATIONARY/RECESSIONARY/STABLE/VOLATILE), confidence (0-100), alerts (array), recommendations (array).`,
        tools: [],
        input: {},
        parallel: false,
        dependsOn: ["price_analyst", "payment_analyst"],
      },
    ],
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowType, input } = body;

    if (!workflowType || !WORKFLOW_DEFINITIONS[workflowType]) {
      return Response.json(
        { success: false, error: `Unknown workflow type: ${workflowType}. Available: ${Object.keys(WORKFLOW_DEFINITIONS).join(", ")}` },
        { status: 400 }
      );
    }

    const definition = WORKFLOW_DEFINITIONS[workflowType];
    const workflow = new AgentWorkflow(`${workflowType}-${Date.now()}`);

    // Register tools
    for (const tool of FinancialTools) {
      workflow.registerTool(tool);
    }

    // Add nodes with input merged
    for (const nodeDef of definition.nodes) {
      workflow.addNode({
        ...nodeDef,
        input: { ...nodeDef.input, ...input },
        timeoutMs: 60000,
      });
    }

    const state = await workflow.execute();

    return Response.json({
      success: true,
      data: {
        workflowId: workflowType,
        status: state.status,
        results: state.results,
        errors: state.errors,
        durationMs: state.completedAt ? state.completedAt.getTime() - state.startedAt.getTime() : 0,
      },
    });
  } catch (error) {
    console.error("Workflow error:", error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Workflow failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    success: true,
    data: {
      availableWorkflows: Object.keys(WORKFLOW_DEFINITIONS),
      description: "Multi-agent DAG workflow orchestrator",
    },
  });
}
