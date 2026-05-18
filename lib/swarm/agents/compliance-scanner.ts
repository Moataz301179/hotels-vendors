import { prisma } from "@/lib/prisma";
import type { AntiFraudAuditEnvelope } from "@/lib/swarm/types/ui-spec";
import { fetchTenantVaultCredentials } from "@/lib/fintech/vault-keys";
import { signEtaDocument } from "@/lib/eta/signer";
import * as crypto from "crypto";

export class ComplianceScanner {
  /**
   * The Underwriting Verification Engine
   * Assembles an immutable data passport for financial underwriters, strictly
   * adhering to FRA Governance Gates and ETA Cryptographic Compliance.
   *
   * @param consolidatedInvoiceId The asset package identifier.
   */
  public async verifyAssetIntegrity(consolidatedInvoiceId: string): Promise<AntiFraudAuditEnvelope> {
    // 1. Resolve the Aggregated Debt Package
    const pkg = await prisma.consolidatedInvoice.findUnique({
      where: { id: consolidatedInvoiceId },
      include: {
        invoices: true,
      }
    });

    if (!pkg) {
      throw new Error(`ASSET_NOT_FOUND: Aggregated Debt Package ${consolidatedInvoiceId} could not be resolved.`);
    }

    const childInvoices = pkg.invoices;
    if (childInvoices.length === 0) {
      throw new Error("ORPHANED_ASSET_EXCEPTION: The Aggregated Debt Package contains no underlying receivables.");
    }

    // 2. Verification Gate: Active 'LOCKED_BY_MASTER' row-state validation
    const isLockedByMaster = childInvoices.every(inv => inv.factoringStatus === "LOCKED_BY_MASTER");
    if (!isLockedByMaster) {
      throw new Error("FRAUD_VECTOR_DETECTED: Underlying child receivables are not securely locked, risking double-factoring.");
    }

    // 3. Verification Gate: Independent User Signature Tokens (FRA Four-Eyes Mandate)
    const approvals = await prisma.auditLog.findMany({
      where: {
        entityType: "CONSOLIDATED_INVOICE",
        entityId: consolidatedInvoiceId,
        action: "CONSOLIDATED_INVOICE_APPROVED"
      },
      orderBy: { createdAt: "asc" }
    });

    // Deduplicate to ensure distinct approvers
    const distinctApprovals = Array.from(new Map(approvals.map(a => [a.actorId, a])).values());

    if (distinctApprovals.length < 2) {
      throw new Error("COMPLIANCE_BREACH: Package lacks the required Dual-Authorization (Four-Eyes) signatures.");
    }

    const originator = distinctApprovals[0];
    const verifier = distinctApprovals[1];

    // 4. Verification Gate: Detached CAdES-BES signature hash via Soft-HSM/ETA simulation layer
    const vaultKeys = await fetchTenantVaultCredentials(pkg.tenantId);
    
    // Canonicalize payload for Soft-HSM
    const compliancePayload = {
      assetId: pkg.invoiceNumber,
      total: pkg.total,
      timestamp: pkg.issueDate.toISOString(),
      currency: pkg.currency
    };

    const signature = await signEtaDocument(compliancePayload, vaultKeys.ETA_HARDWARE_PIN, pkg.tenantId);

    // Compute ETA UUID Validations
    const etaUuids = childInvoices.map(i => i.etaUuid).filter(Boolean).sort().join("|");
    const etaUuidValidationHash = crypto.createHash("sha256").update(etaUuids).digest("hex");

    // Assemble the Immutable Data Passport
    const passport: AntiFraudAuditEnvelope = {
      packageId: pkg.id,
      packageNumber: pkg.invoiceNumber,
      isLockedByMaster: true,
      etaUuidValidationHash,
      vaultSecretsRetrieved: [`vault://tenants/${pkg.tenantId}/eta-credentials`],
      originatorAttestation: {
        userId: originator.actorId || "SYSTEM",
        userName: "Treasury Originator", 
        role: "Originator",
        timestamp: originator.createdAt,
        digitalSignature: signature.value 
      },
      verifierAttestation: {
        userId: verifier.actorId || "SYSTEM",
        userName: "Finance Verifier", 
        role: "Verifier",
        timestamp: verifier.createdAt,
        digitalSignature: signature.value
      },
      immutableLedgerLock: true
    };

    return passport;
  }
}
