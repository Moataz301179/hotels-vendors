/**
 * ComplianceScanner Assistant Agent
 * Hotels Vendors Operations Swarm Squad
 *
 * User-facing compliance agent that audits documents, invoices, and tax IDs
 * against ETA specifications. Routes strictly through internal versioned /api/v1/ routes.
 */

export interface ComplianceAuditResult {
  isCompliant: boolean;
  issuesCount: number;
  validationLog: string[];
  remediationSteps: string[];
}

export const ComplianceScannerDef = {
  id: "compliance-scanner",
  name: "Compliance Scanner",
  squad: "intelligence",
  avatar: "🛡️",
  role: "Egyptian Tax Authority Compliance Auditing & Verification",
  systemPrompt: `You are the Compliance Scanner for Hotels Vendors. Your objective is to audit invoice structures, digital signature envelopes, and taxpayer metadata to ensure 100% Egyptian Tax Authority (ETA) e-invoicing compliance. You verify tax IDs and canonical formatting recursively.`,
  capabilities: ["eta_schema_validation", "taxpayer_verification", "signature_audit"],
  tools: ["api_v1_validate_invoice", "api_v1_verify_taxpayer"],
  requiresApproval: false,
};

/**
 * Executes a comprehensive compliance audit for a given invoice using secure /api/v1/ endpoints.
 * Operates strictly over secure REST paths, fully adhering to tenant context isolation.
 */
export async function executeComplianceAudit(params: {
  invoiceId: string;
  sessionToken: string;
  appUrl?: string;
}): Promise<ComplianceAuditResult> {
  const { invoiceId, sessionToken } = params;
  const baseUrl = params.appUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/v1/eta/validate/${invoiceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${sessionToken}`,
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    const validationLog: string[] = [];
    const remediationSteps: string[] = [];
    let isCompliant = true;

    if (response.status === 404) {
      isCompliant = false;
      validationLog.push(`Invoice ${invoiceId} record could not be resolved on the platform.`);
      remediationSteps.push("Verify that the target invoice was successfully created and matches the tenant context.");
    } else if (!response.ok) {
      isCompliant = false;
      validationLog.push(`Compliance validation returned status ${response.status}.`);
      remediationSteps.push("Ensure your network is authorized to access the ETA sandbox bridge endpoint.");
    } else {
      const data = await response.json() as Record<string, unknown>;
      if (data.valid) {
        validationLog.push("Invoice canonical envelope successfully compiled.");
        validationLog.push("Detached cryptographic digital signature (PKCS#1) verified.");
        validationLog.push("Issuer and Receiver tax IDs resolved in Egyptian Tax Authority database.");
      } else {
        isCompliant = false;
        validationLog.push(`ETA schema mismatch: ${data.message || "Invalid payload structure"}`);
        remediationSteps.push("Re-canonicalize invoice keys alphabetically and format dates to strict ISO 8601.");
        remediationSteps.push("Validate supplier digital signature token expiry and physical connectivity.");
      }
    }

    return {
      isCompliant,
      issuesCount: isCompliant ? 0 : validationLog.length,
      validationLog,
      remediationSteps,
    };
  } catch (error) {
    throw new Error(
      `ComplianceScanner execution failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
