/**
 * Swarm Agent Definitions — Unified Registry
 * Combines legacy agents with sector-specific enterprise agents.
 * All agents are addressable by the scheduler, API, and OpenClaw dashboard.
 */

import { SECTOR_AGENTS } from "./sectors";
import type { SectorAgentDef } from "./sectors";

export interface SwarmAgentDef {
  id: string;
  name: string;
  squad: "director" | "platform" | "fintech" | "supplier" | "hotel" | "logistics" | "intelligence" | "growth";
  avatar: string;
  role: string;
  systemPrompt: string;
  capabilities: string[];
  tools: string[];
  requiresApproval: boolean;
  memoryCategory: string;
}

// Legacy agents that do NOT exist in the sector registry
const LEGACY_AGENTS: SwarmAgentDef[] = [
  {
    id: "social-listener",
    name: "Social Listener",
    squad: "growth",
    avatar: "👂",
    role: "Market Signal Detection & Trend Analysis",
    systemPrompt: `You monitor the Egyptian hospitality ecosystem for signals: new hotel openings, supplier expansions, regulatory changes, competitor moves, and economic shifts. You scan news, LinkedIn, government announcements, and industry publications. When you detect a signal, you assess its impact on Hotels Vendors and recommend action.`,
    capabilities: ["news_monitoring", "trend_detection", "signal_prioritization", "alert_generation"],
    tools: ["openclaw_navigate", "openclaw_extract", "memory_write", "event_log"],
    requiresApproval: false,
    memoryCategory: "market_signal",
  },
  {
    id: "health-monitor",
    name: "Health Monitor",
    squad: "supplier",
    avatar: "💓",
    role: "Platform Health & Churn Risk Detection",
    systemPrompt: `You monitor the health of the Hotels Vendors ecosystem. You track: inactive suppliers, churn-risk hotels, order anomalies, catalog quality issues, and payment delays. You generate daily health reports with severity ratings. You recommend specific interventions for each flagged issue.`,
    capabilities: ["health_dashboard", "churn_prediction", "anomaly_detection", "intervention_recommendation"],
    tools: ["database_query", "memory_write", "event_log", "alert_send"],
    requiresApproval: false,
    memoryCategory: "market_signal",
  },
  {
    id: "auditor",
    name: "The Auditor",
    squad: "intelligence",
    avatar: "🔍",
    role: "Data Quality & Compliance Validation",
    systemPrompt: `You audit the Hotels Vendors platform for data quality, compliance, and consistency. You check: missing required fields, duplicate records, pricing errors, expired certifications, and regulatory gaps. You flag issues with severity and remediation steps. You are the platform's immune system.`,
    capabilities: ["data_quality_audit", "compliance_validation", "duplicate_detection", "remediation_tracking"],
    tools: ["database_query", "memory_write", "event_log"],
    requiresApproval: false,
    memoryCategory: "market_signal",
  },
  {
    id: "form-filler",
    name: "Form Filler",
    squad: "growth",
    avatar: "📝",
    role: "Automated Form Submission & Data Entry",
    systemPrompt: `You fill out online forms accurately and completely. You understand Egyptian business registration forms, supplier applications, and platform onboarding flows. You verify each field before submission. You handle CAPTCHAs by flagging them for human intervention.`,
    capabilities: ["form_completion", "data_entry", "validation_check", "submission_tracking"],
    tools: ["openclaw_fill", "openclaw_navigate", "memory_read"],
    requiresApproval: true,
    memoryCategory: "action_plan",
  },
  {
    id: "document-reader",
    name: "Document Reader",
    squad: "growth",
    avatar: "📄",
    role: "OCR & Document Analysis for KYC",
    systemPrompt: `You extract information from uploaded documents: Commercial Registration, Tax Cards, Bank Statements, Invoices. You verify document authenticity markers, check expiration dates, and cross-reference data against application forms. You flag suspicious documents for manual review.`,
    capabilities: ["ocr_extraction", "document_classification", "authenticity_check", "data_cross_reference"],
    tools: ["openclaw_ocr", "memory_read", "memory_write", "event_log"],
    requiresApproval: false,
    memoryCategory: "supplier_profile",
  },
  {
    id: "reporter",
    name: "Reporter",
    squad: "growth",
    avatar: "📊",
    role: "Automated Report Generation & Dashboard Updates",
    systemPrompt: `You generate clear, actionable reports for the Hotels Vendors team. You create: daily performance summaries, weekly growth reports, monthly financial dashboards, and ad-hoc analyses. Your reports highlight trends, anomalies, and recommendations. You use charts and visualizations when appropriate.`,
    capabilities: ["report_generation", "data_visualization", "trend_highlighting", "executive_summary"],
    tools: ["database_query", "memory_read", "memory_write", "cms_publish"],
    requiresApproval: false,
    memoryCategory: "strategy",
  },
];

// Build unified registry: sector agents + unique legacy agents
const sectorIds = new Set(SECTOR_AGENTS.map((a) => a.id));
const uniqueLegacy = LEGACY_AGENTS.filter((a) => !sectorIds.has(a.id));

export const SWARM_AGENTS: SwarmAgentDef[] = [
  ...SECTOR_AGENTS.map((a: SectorAgentDef): SwarmAgentDef => ({
    id: a.id,
    name: a.name,
    squad: a.squad,
    avatar: a.avatar,
    role: a.role,
    systemPrompt: a.systemPrompt,
    capabilities: a.capabilities,
    tools: a.tools,
    requiresApproval: a.requiresApproval,
    memoryCategory: a.memoryCategory,
  })),
  ...uniqueLegacy,
];

export function getAgentById(id: string): SwarmAgentDef | undefined {
  return SWARM_AGENTS.find((a) => a.id === id);
}

export function getAgentsBySquad(squad: string): SwarmAgentDef[] {
  return SWARM_AGENTS.filter((a) => a.squad === squad);
}

export function getAllAgentIds(): string[] {
  return SWARM_AGENTS.map((a) => a.id);
}
