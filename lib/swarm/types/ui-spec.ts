/**
 * Hotels Vendors Portal Assistant UI Layer Specification
 * Standard B2B Supply-Chain Finance Nomenclature & Audit Types
 *
 * This file declares the strict type-safety wrappers, interfaces, and enums
 * governing Layer 4 (Portal Assistant UI components). It strictly aligns front-end
 * metrics and data tables with global institutional FinTech standards (e.g., PrimeRevenue, Demica),
 * adapted to the Egyptian Financial Regulatory Authority (FRA) & Egyptian Tax Authority (ETA) frameworks.
 *
 * NOMENCLATURE MANDATES:
 * 1. Invoices / Bills       ===> Receivables / Aggregated Debt Packages
 * 2. Payouts / Payments     ===> Accelerated Capital Liquidations / Settlement Disbursals
 * 3. Approvals              ===> Four-Eyes Attestation State Transitions
 */

export enum TenantRole {
  HOTEL = "HOTEL",       // Buyer Anchor (debt debtor)
  SUPPLIER = "SUPPLIER",   // Seller SME (receivable creditor)
  FACTOR = "FACTOR",       // Liquidity Provider (underwriting funder)
}

export enum AttestationState {
  DRAFT = "DRAFT",
  ORIGINATED = "ORIGINATED",                             // Signature A applied by Clerk
  FOUR_EYES_CONSTRAINED = "FOUR_EYES_CONSTRAINED",       // Awaiting Signature B
  FULLY_ATTESTED = "FULLY_ATTESTED",                     // Dual authentication committed
  TRANSMITTED = "TRANSMITTED",                           // Dispatched to Factor portal
  REJECTED = "REJECTED",
}

export enum AssetStatus {
  AVAILABLE = "AVAILABLE",
  LOCKED_BY_MASTER = "LOCKED_BY_MASTER",                 // Anti-fraud double-factoring protection
  DISBURSED = "DISBURSED",
  SETTLED = "SETTLED",
  BREACHED = "BREACHED",                                 // Yield-spread or default exception
}

/**
 * 1. RECEIVABLE (Formerly: Invoice / Bill)
 * Represents a single property-level supply transaction issued by an SME Supplier.
 */
export interface Receivable {
  id: string;
  receivableNumber: string;         // Format: REC-[SUPPLIER]-[TIMESTAMP]
  etaUuid: string | null;           // Mandatory Egyptian Tax Authority unique hash
  etaStatus: "VALID" | "INVALID" | "PENDING";

  // Financial parameters
  subtotal: number;
  vatAmount: number;
  total: number;                    // Gross value in EGP
  currency: string;                 // Default: EGP

  // Stream 2: Supplier Cash-Discount Delta
  supplierDiscountRate: number;     // e.g. 0.03 (3% accelerated discount rate)
  acceleratedCashRate: number | null; // Net amount payable immediately to supplier
  cashDiscountDelta: number | null;   // Profit delta pocketed by the platform

  issueDate: Date;
  dueDate: Date;
  status: AssetStatus;

  supplierId: string;
  hotelId: string;                  // Target property identifier
  tenantId: string;
}

/**
 * 2. AGGREGATED DEBT PACKAGE (Formerly: Consolidated Invoice)
 * Multi-vendor aggregated asset mapping property-level Receivables under a single Corporate credit line.
 */
export interface AggregatedDebtPackage {
  id: string;
  packageNumber: string;            // Format: CI-HOTEL-GROUP-[TIMESTAMP]
  attestationState: AttestationState;

  // Aggregated totals
  subtotal: number;
  vatAmount: number;
  total: number;                    // Consolidated gross package value
  currency: string;

  // Stream 3: Hotel Treasury Admin Fee
  hotelAdminFeeRate: number;        // e.g. 0.015 (1.5%)
  hotelAdminFeeAmount: number | null;

  issueDate: Date;
  dueDate: Date;
  paidDate: Date | null;

  hotelId: string;                  // Parent Corporate Hotel Group
  receivables: Receivable[];        // Grouped underlying child receivables

  // Audit reference linking the dual attested actors
  originatorSignatureId: string | null; // References Signature A AuditLog
  verifierSignatureId: string | null;   // References Signature B AuditLog

  tenantId: string;
}

/**
 * 3. ACCELERATED CAPITAL LIQUIDATION (Formerly: Factoring Request)
 * Represents the early disbursement underwriting structure processed by the factoring partner.
 */
export interface AcceleratedCapitalLiquidation {
  id: string;
  packageId: string;               // Reference to the underlying AggregatedDebtPackage
  factoringCompanyId: string;
  requestedAmount: number;

  // Programmatic Yield Spread Guard metrics
  advanceRate: number;              // e.g. 0.90 (90% factoring advance)
  underwritingFeeRate: number;      // Underwriting fee rate (r_factor_fee) charged by partner
  netPlatformFee: number | null;    // Dynamic stream revenues earned by platform

  platformMargin: number;           // Net yield margin. Must be >= 0.015 (1.5%) unless overridden.
  isTreasuryOverridden: boolean;    // True if processed via high-privilege override

  status: "UNDER_REVIEW" | "APPROVED" | "DISBURSED" | "SETTLED" | "YIELD_SPREAD_BREACH";
  initiatedAt: Date;
  disbursedAt: Date | null;
  tenantId: string;
}

/**
 * 4. SETTLEMENT DISBURSAL (Formerly: Payout / Payment)
 * Represents the final double-entry transaction record written to the immutable general ledger.
 */
export interface SettlementDisbursal {
  id: string;
  disbursalNumber: string;          // Format: SD-DISB-[TIMESTAMP]
  packageId: string | null;
  grossAmount: number;
  netDisbursed: number;
  platformCut: number;
  disbursedAt: Date;

  // Ledger trace properties
  journalEntryId: string;          // Reference to write-once JournalEntry table
  bankRef: string;                  // Clearing house transaction reference
  tenantId: string;
}

/**
 * 5. LIVE PIPELINE TRACING (SSE Stream Protocol Payload)
 * Event structure dispatched via Server-Sent Events to Hotel Dashboards during heavy operations.
 */
export interface PipelineTraceLog {
  id: string;
  timestamp: string;                // ISO-8601 string
  eventCode: 
    | "INITIATED"
    | "TENANT_VALIDATION"
    | "ISO_20022_PARSING"
    | "ETA_CANONICALIZATION"
    | "VAULT_RESOLUTION"
    | "SOFT_HSM_SIGNING"
    | "HSM_HARDWARE_SIGNING"
    | "ETA_API_HANDSHAKE"
    | "YIELD_SPREAD_CHECK"
    | "LEDGER_BOOKING"
    | "COMPLETED"
    | "EXCEPTION";
  level: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
  message: string;                  // Deep-dive execution detail
  stepNumber: number;
  totalSteps: number;
}

/**
 * 6. ANTI-FRAUD CRADLE (Read-Only Cryptographic Audit Envelope)
 * Displayed in the factoring portal to verify the absolute safety of aggregated packages.
 */
export interface AntiFraudAuditEnvelope {
  packageId: string;
  packageNumber: string;
  isLockedByMaster: boolean;        // True if underlying receivables are LOCKED_BY_MASTER
  etaUuidValidationHash: string;    // SHA-256 fingerprint of all ETA UUUIDs grouped
  vaultSecretsRetrieved: string[];  // Masked audit paths (e.g., "vault://tenants/{id}/eta-credentials")
  originatorAttestation: {
    userId: string;
    userName: string;
    role: string;
    timestamp: Date;
    digitalSignature: string;       // Cryptographic attestation string
  } | null;
  verifierAttestation: {
    userId: string;
    userName: string;
    role: string;
    timestamp: Date;
    digitalSignature: string;       // Cryptographic attestation string
  } | null;
  immutableLedgerLock: boolean;     // Verifies block on update/delete routes
}
