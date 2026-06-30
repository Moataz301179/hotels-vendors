/**
 * Procurement Agent Registry
 * Hotels Vendors — Operational AI Agents
 */

import type { ProcurementAgentConfig, ProcurementAgentId } from "./types";

export const PROCUREMENT_AGENTS: Record<ProcurementAgentId, ProcurementAgentConfig> = {
  "import-agent": {
    id: "import-agent",
    name: "Data Import Agent",
    description: "Connects to hotel ERP/accounting, pulls purchase history, builds supplier database",
    requiredPermissions: ["hotel:read", "supplier:read"],
    dataAccess: ["hotel", "supplier"],
    maxConcurrency: 1,
  },
  "onboarding-agent": {
    id: "onboarding-agent",
    name: "Supplier Onboarding Agent",
    description: "Sends WhatsApp/email invites, tracks onboarding status, guides suppliers through signup",
    requiredPermissions: ["supplier:invite", "notification:send"],
    dataAccess: ["supplier"],
    maxConcurrency: 5,
  },
  "integration-agent": {
    id: "integration-agent",
    name: "System Integration Agent",
    description: "AI wizard: detects supplier system, imports products/pricing, sets up bi-directional sync",
    requiredPermissions: ["supplier:write", "product:write"],
    dataAccess: ["supplier", "products"],
    maxConcurrency: 3,
  },
  "procurement-agent": {
    id: "procurement-agent",
    name: "Procurement Agent",
    description: "Creates POs, matches to supplier catalog, routes for approval, tracks delivery",
    requiredPermissions: ["order:write", "order:approve"],
    dataAccess: ["orders", "products", "supplier"],
    maxConcurrency: 10,
  },
  "invoice-agent": {
    id: "invoice-agent",
    name: "Invoice Matching Agent",
    description: "3-way match PO×GRN×Invoice, flags discrepancies, routes for approval",
    requiredPermissions: ["invoice:read", "invoice:approve"],
    dataAccess: ["invoices", "orders"],
    maxConcurrency: 10,
  },
  "audit-agent": {
    id: "audit-agent",
    name: "ETA Compliance Audit Agent",
    description: "Verifies every invoice against ETA via publicUrl. Free compliance check for hotels.",
    requiredPermissions: ["eta:read", "invoice:read"],
    dataAccess: ["eta", "invoices"],
    maxConcurrency: 20,
  },
  "cashflow-agent": {
    id: "cashflow-agent",
    name: "Cashflow Forecasting Agent",
    description: "Predicts payables, flags invoices nearing due, suggests factoring for suppliers",
    requiredPermissions: ["invoice:read", "finance:read"],
    dataAccess: ["invoices", "payments"],
    maxConcurrency: 1,
  },
  "dispute-agent": {
    id: "dispute-agent",
    name: "Dispute Resolution Agent",
    description: "Tracks returns, credit notes, disputes. Routes issues to appropriate parties.",
    requiredPermissions: ["invoice:write", "order:write"],
    dataAccess: ["invoices", "orders"],
    maxConcurrency: 5,
  },
  "inventory-agent": {
    id: "inventory-agent",
    name: "Inventory Agent",
    description: "Learns consumption patterns, predicts reorder points, generates suggested POs",
    requiredPermissions: ["product:read", "order:write"],
    dataAccess: ["products", "orders"],
    maxConcurrency: 1,
  },
  "reporting-agent": {
    id: "reporting-agent",
    name: "Reporting Agent",
    description: "Generates procurement intelligence: spend analytics, supplier performance, trends",
    requiredPermissions: ["report:read", "analytics:read"],
    dataAccess: ["hotel", "supplier", "invoices", "orders", "products"],
    maxConcurrency: 1,
  },
};
