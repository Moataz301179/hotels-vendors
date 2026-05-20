import { NextResponse } from "next/server";
import { CashflowAdvisor } from "@/lib/swarm/agents/cashflow-advisor";
import { ComplianceScanner } from "@/lib/swarm/agents/compliance-scanner";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get("agent");

    // Strict UX Constraint: Ensure NO unstructured text mutations or unrecognized parameters bypass the router.
    // This API route accepts ONLY predefined structured commands mapped from our slash-router.
    const queryKeys = Array.from(searchParams.keys());
    const validKeys = ["agent", "tenantId", "assetId"];
    const hasUnstructuredInput = queryKeys.some(key => !validKeys.includes(key));

    if (hasUnstructuredInput || searchParams.has("mutation") || searchParams.has("execute")) {
      return NextResponse.json(
        { 
          error: "UNAUTHORIZED_INPUT_VECTOR", 
          message: "Execution Rejected: Payload attempts to pass raw unstructured text mutations or invalid query parameters." 
        },
        { status: 403 }
      );
    }

    if (agent === "cashflow") {
      const tenantId = searchParams.get("tenantId");
      if (!tenantId) {
        return NextResponse.json(
          { error: "MISSING_PARAMETER", message: "tenantId parameter is required for the CashflowAdvisor execution method." }, 
          { status: 400 }
        );
      }

      const advisor = new CashflowAdvisor();
      const metrics = await advisor.generateLiquidityStrategy(tenantId);
      
      return NextResponse.json({
        success: true,
        data: metrics,
        meta: { 
          agent: "CashflowAdvisor", 
          status: "TELEMETRY_RESOLVED",
          message: "Liquidity Strategy Metrics successfully retrieved via strictly read-only execution."
        }
      });
    }

    if (agent === "compliance") {
      const assetId = searchParams.get("assetId");
      if (!assetId) {
        return NextResponse.json(
          { error: "MISSING_PARAMETER", message: "assetId (MasterInvoice ID) parameter is required for the ComplianceScanner." }, 
          { status: 400 }
        );
      }

      const scanner = new ComplianceScanner();
      const passport = await scanner.verifyAssetIntegrity(assetId);

      return NextResponse.json({
        success: true,
        data: passport,
        meta: { 
          agent: "ComplianceScanner", 
          status: "IMMUTABLE_PASSPORT_GENERATED",
          message: "Four-Eyes Attestation State Transitions and CAdES-BES signatures verified."
        }
      });
    }

    // Reject if no valid agent matched
    return NextResponse.json(
      { error: "UNKNOWN_AGENT", message: "Predefined structure command not recognized by the router." },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("[Copilot Execution Failure]", error);
    
    // Graceful exception mapping
    const errorCode = error.message?.includes("FRAUD_VECTOR_DETECTED") ? "FRAUD_VECTOR_DETECTED" 
                    : error.message?.includes("COMPLIANCE_BREACH") ? "COMPLIANCE_BREACH"
                    : "INTERNAL_EXECUTION_FAILURE";

    return NextResponse.json(
      { error: errorCode, message: error.message },
      { status: 500 }
    );
  }
}
