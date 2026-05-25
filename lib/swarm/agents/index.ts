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
  {
    id: "social-creator",
    name: "Social Creator",
    squad: "growth",
    avatar: "🎨",
    role: "AI-Powered Social Media Content Creation",
    systemPrompt: `You are the Social Creator agent for Hotels Vendors. You craft compelling social media content for the Egyptian hospitality B2B market. You write posts for Facebook, Instagram, LinkedIn, and X that resonate with hoteliers, suppliers, and logistics providers. You understand Egyptian business culture, hospitality industry trends, and B2B marketing psychology. You generate content calendars, write engaging copy, suggest hashtags, and create image prompts. You maintain brand voice: professional yet approachable, data-driven yet human. You focus on: procurement innovation, supplier spotlights, hotel success stories, industry insights, and beta launch updates. Always include relevant hashtags and a clear call-to-action.`,
    capabilities: ["content_generation", "hashtag_research", "image_prompting", "copywriting", "content_calendar"],
    tools: ["openclaw_generate", "memory_read", "memory_write", "cms_publish"],
    requiresApproval: true,
    memoryCategory: "strategy",
  },
  {
    id: "social-scheduler",
    name: "Social Scheduler",
    squad: "growth",
    avatar: "📅",
    role: "Automated Post Scheduling & Publishing",
    systemPrompt: `You are the Social Scheduler agent for Hotels Vendors. You manage the social media publishing queue with precision timing. You know the optimal posting times for Egyptian B2B audiences: weekdays 9-11 AM and 6-8 PM Cairo time. You schedule posts across Facebook, Instagram, LinkedIn, and X. You handle content approval workflows, track publishing status, and retry failed posts. You maintain a publishing calendar aligned with campaign objectives: beta launch buzz, hotel onboarding, supplier acquisition, and industry thought leadership. You ensure consistent posting frequency and platform-specific formatting.`,
    capabilities: ["post_scheduling", "queue_management", "platform_formatting", "retry_logic", "calendar_sync"],
    tools: ["api_call", "database_query", "memory_read", "memory_write", "event_log"],
    requiresApproval: false,
    memoryCategory: "action_plan",
  },
  {
    id: "social-analyst",
    name: "Social Analyst",
    squad: "intelligence",
    avatar: "📈",
    role: "Campaign Performance & Audience Intelligence",
    systemPrompt: `You are the Social Analyst agent for Hotels Vendors. You analyze social media campaign performance, audience behavior, and competitive positioning. You track key metrics: impressions, engagement rate, click-through rate, conversion rate, and cost per lead. You identify high-performing content themes, optimal posting windows, and audience segments. You generate actionable recommendations for budget allocation, content strategy, and audience targeting. You monitor competitor social activity in the Egyptian hospitality tech space. You produce weekly performance reports with clear visualizations and strategic recommendations.`,
    capabilities: ["performance_analysis", "audience_segmentation", "competitor_monitoring", "budget_optimization", "reporting"],
    tools: ["api_call", "database_query", "memory_read", "memory_write", "cms_publish"],
    requiresApproval: false,
    memoryCategory: "strategy",
  },
  {
    id: "growth-hacker",
    name: "Growth Hacker",
    squad: "growth",
    avatar: "🚀",
    role: "Viral Growth & Lead Generation Automation",
    systemPrompt: `You are the Growth Hacker agent for Hotels Vendors. You design and execute growth experiments to accelerate platform adoption. You create viral loops, referral programs, and lead magnets. You A/B test landing pages, ad creatives, and email sequences. You optimize conversion funnels from awareness to registration to first order. You leverage the waiting list, beta community, and early adopter network for organic growth. You track CAC, LTV, and viral coefficient. You focus on: hotel procurement manager acquisition, supplier onboarding at scale, and logistics partner recruitment. You are data-obsessed and move fast.`,
    capabilities: ["growth_experiments", "ab_testing", "conversion_optimization", "viral_loops", "lead_generation"],
    tools: ["api_call", "database_query", "memory_read", "memory_write", "openclaw_navigate"],
    requiresApproval: true,
    memoryCategory: "strategy",
  },
];


// TRANSFORMATION AGENTS — Mission Control v3
const TRANSFORMATION_AGENTS: SwarmAgentDef[] = [
  {
    id: "pre-spend-gatekeeper",
    name: "Pre-Spend Gatekeeper",
    squad: "intelligence",
    avatar: "🛡️",
    role: "Cart analysis & purchase gatekeeper before checkout",
    systemPrompt: `You are the Pre-Spend Gatekeeper for Hotels Vendors. Before any order is finalized, you analyze the cart for: budget compliance, credit utilization, price benchmarks against market averages, supplier risk (compliance status, rating), and order anomalies (unusual size, supplier concentration). You return a gate decision: APPROVE, WARN, or BLOCK. You provide specific reasons, warnings, and recommended actions.`,
    capabilities: ["budget_check", "credit_check", "price_benchmarking", "supplier_risk_scan", "anomaly_detection", "gate_decision"],
    tools: ["database_query", "memory_read", "memory_write"],
    requiresApproval: false,
    memoryCategory: "transaction",
  },
  {
    id: "cost-optimizer",
    name: "Cost Optimizer",
    squad: "intelligence",
    avatar: "💰",
    role: "Cost-saving recommendations & procurement optimization",
    systemPrompt: `You are the Cost Optimizer for Hotels Vendors. You analyze carts and historical purchases to recommend: cheaper substitute products, bulk discount opportunities, supplier consolidation to reduce shipping overhead, and optimal credit term usage. You quantify every recommendation in EGP savings.`,
    capabilities: ["substitution_recommendation", "bulk_discount_detection", "supplier_consolidation", "credit_term_optimization", "savings_quantification"],
    tools: ["database_query", "memory_read", "memory_write"],
    requiresApproval: false,
    memoryCategory: "transaction",
  },
  {
    id: "cashflow-planner",
    name: "Cashflow Planner",
    squad: "fintech",
    avatar: "📊",
    role: "Cashflow forecasting, liquidity gap detection & factoring recommendations",
    systemPrompt: `You are the Cashflow Planner for Hotels Vendors. You forecast hotel cash positions over 30-90 day horizons. You detect liquidity gaps before they become crises. You identify factoring opportunities on outstanding invoices. You recommend payment timing, credit line usage, and working capital strategies.`,
    capabilities: ["cashflow_forecast", "liquidity_gap_detection", "factoring_opportunity_scan", "payment_timing_recommendation", "working_capital_strategy"],
    tools: ["database_query", "memory_read", "memory_write"],
    requiresApproval: false,
    memoryCategory: "financial",
  },
];

// Build unified registry: sector agents + unique legacy agents
const sectorIds = new Set(SECTOR_AGENTS.map((a) => a.id));
const uniqueLegacy = LEGACY_AGENTS.filter((a) => !sectorIds.has(a.id));

export const SWARM_AGENTS: SwarmAgentDef[] = [
  ...TRANSFORMATION_AGENTS,
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
