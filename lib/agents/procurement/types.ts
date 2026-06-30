/**
 * Procurement Agent Types
 * Hotels Vendors — Operational AI Agents
 */

export type ProcurementAgentId =
  | "import-agent"
  | "onboarding-agent"
  | "integration-agent"
  | "procurement-agent"
  | "invoice-agent"
  | "audit-agent"
  | "cashflow-agent"
  | "dispute-agent"
  | "inventory-agent"
  | "reporting-agent";

export interface ProcurementAgentConfig {
  id: ProcurementAgentId;
  name: string;
  description: string;
  requiredPermissions: string[];
  dataAccess: ("hotel" | "supplier" | "invoices" | "orders" | "products" | "eta" | "payments")[];
  maxConcurrency: number;
}

export interface AgentTask<T = unknown> {
  id: string;
  agentId: ProcurementAgentId;
  tenantId: string;
  hotelId?: string;
  supplierId?: string;
  type: string;
  input: T;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  output?: unknown;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface AgentActionResult {
  taskId: string;
  agentId: ProcurementAgentId;
  status: "completed" | "failed";
  output: unknown;
  error?: string;
  durationMs: number;
}

export interface ImportTaskInput {
  hotelId: string;
  sourceType: "erp" | "csv" | "manual";
  connectionConfig?: Record<string, string>;
}

export interface InviteTaskInput {
  hotelId: string;
  supplierIds: string[];
  channel: "whatsapp" | "email" | "both";
}

export interface InvoiceAuditInput {
  invoiceId: string;
  etaPublicUrl?: string;
  expectedAmount?: number;
  expectedReceiverTaxId?: string;
}
