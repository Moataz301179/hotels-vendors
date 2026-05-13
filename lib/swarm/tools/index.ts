/**
 * Standard Tool Implementations for Grok Brain
 * Each tool is a function that Grok can invoke via native function calling
 */

import { ToolDefinition, ToolRegistry } from "../grok-brain";
import { prisma } from "@/lib/prisma";
import { executeLLM } from "../model-router";

// ── OpenClaw Browser Automation Tools ──────────────────────────

const OPENCLAW_BASE = process.env.OPENCLAW_URL || "http://hv-openclaw:8000";

async function callOpenClaw(endpoint: string, payload: unknown): Promise<unknown> {
  const res = await fetch(`${OPENCLAW_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenClaw ${endpoint}: HTTP ${res.status} — ${text}`);
  }
  return res.json();
}

export const openclawNavigateTool: ToolDefinition = {
  name: "openclaw_navigate",
  description: "Navigate a headless browser to a URL and optionally take a screenshot. Use this to visit websites, check competitor pages, verify supplier sites, or extract page content.",
  parameters: {
    type: "object",
    properties: {
      url: { type: "string", description: "The URL to navigate to" },
      waitFor: { type: "string", description: "CSS selector to wait for before considering page loaded" },
      screenshot: { type: "boolean", description: "Whether to take a screenshot" },
      timeout: { type: "number", description: "Max wait time in milliseconds" },
    },
    required: ["url"],
  },
  handler: async (args) => {
    const { url, waitFor, screenshot, timeout } = args as Record<string, unknown>;
    return callOpenClaw("/navigate", {
      url,
      wait_for_selector: waitFor || "body",
      take_screenshot: screenshot ?? false,
      timeout_ms: timeout || 30_000,
    });
  },
};

export const openclawExtractTool: ToolDefinition = {
  name: "openclaw_extract",
  description: "Extract structured data from a webpage using CSS selectors. Use this to scrape prices, product listings, contact info, or any structured data from a page.",
  parameters: {
    type: "object",
    properties: {
      url: { type: "string", description: "URL of the page to extract data from" },
      selectors: {
        type: "object",
        description: "Map of field names to CSS selectors, e.g. {\"price\": \".price\", \"title\": \"h1\"}",
      },
      listSelector: { type: "string", description: "If extracting a list, the CSS selector for each item container" },
      maxItems: { type: "number", description: "Maximum number of list items to extract" },
    },
    required: ["url", "selectors"],
  },
  handler: async (args) => {
    const { url, selectors, listSelector, maxItems } = args as Record<string, unknown>;
    return callOpenClaw("/extract", {
      url,
      selectors,
      list_selector: listSelector,
      max_items: maxItems || 50,
    });
  },
};

export const openclawDeepScrapeTool: ToolDefinition = {
  name: "openclaw_deep_scrape",
  description: "Deep scrape a paginated or infinite-scroll listing page. Use this for competitor catalog scraping, hotel directory harvesting, or supplier list building.",
  parameters: {
    type: "object",
    properties: {
      url: { type: "string", description: "Starting URL" },
      itemSelector: { type: "string", description: "CSS selector for each listing item" },
      nextButtonSelector: { type: "string", description: "CSS selector for the next page button" },
      maxPages: { type: "number", description: "Maximum pages to scrape (default 10)" },
      fields: {
        type: "object",
        description: "Map of field names to CSS selectors within each item",
      },
    },
    required: ["url", "itemSelector", "fields"],
  },
  handler: async (args) => {
    const { url, itemSelector, nextButtonSelector, maxPages, fields } = args as Record<string, unknown>;
    return callOpenClaw("/deep-scrape", {
      url,
      item_selector: itemSelector,
      next_button_selector: nextButtonSelector,
      max_pages: maxPages || 10,
      fields,
    });
  },
};

export const openclawSmartNavigateTool: ToolDefinition = {
  name: "openclaw_smart_navigate",
  description: "LLM-guided browser automation. Describe a goal (e.g. 'Find the pricing page and extract all plan prices') and the browser will navigate, click, and extract autonomously. Use for complex multi-step web tasks.",
  parameters: {
    type: "object",
    properties: {
      url: { type: "string", description: "Starting URL" },
      goal: { type: "string", description: "High-level goal description in natural language" },
      maxSteps: { type: "number", description: "Maximum browser actions (default 15)" },
      returnData: { type: "boolean", description: "Whether to return extracted data (default true)" },
    },
    required: ["url", "goal"],
  },
  handler: async (args) => {
    const { url, goal, maxSteps, returnData } = args as Record<string, unknown>;
    return callOpenClaw("/smart-navigate", {
      url,
      goal,
      max_steps: maxSteps || 15,
      return_data: returnData ?? true,
    });
  },
};

export const openclawUseSkillTool: ToolDefinition = {
  name: "openclaw_use_skill",
  description: "Execute an OpenClaw AfrexAI skill to run a pre-built browser automation procedure. Skills available: afrexai-business-automation (supplier discovery, competitor price tracking, hotel enrichment), afrexai-prospect-research (research hotels/suppliers from a name), afrexai-competitor-analysis (analyze competitor digital presence and pricing), afrexai-crm (lead nurturing, reorder reminders, churn prevention), afrexai-daily-briefing (platform pulse, market compass). Use this when you need a multi-step structured procedure rather than a single action.",
  parameters: {
    type: "object",
    properties: {
      skill: { type: "string", description: "Skill name: afrexai-business-automation | afrexai-prospect-research | afrexai-competitor-analysis | afrexai-crm | afrexai-daily-briefing" },
      procedure: { type: "string", description: "Procedure name within the skill (optional — defaults to first procedure)" },
      params: { type: "object", description: "Parameters for the skill procedure — e.g. {name: 'Fairmont Nile City', city: 'Cairo'} or {url: 'https://suplyd.app'}" },
      sessionId: { type: "string", description: "Session ID for persistent browser state (optional)" },
      screenshot: { type: "boolean", description: "Take screenshots during execution (default false)" },
    },
    required: ["skill"],
  },
  handler: async (args) => {
    const { skill, procedure, params, sessionId, screenshot } = args as Record<string, unknown>;
    return callOpenClaw("/skills/execute", {
      skill,
      procedure: procedure || undefined,
      params: params || {},
      session_id: sessionId || undefined,
      screenshot: screenshot ?? false,
    });
  },
};

// ── Database Query Tools ───────────────────────────────────────

export const dbQueryTool: ToolDefinition = {
  name: "db_query",
  description: "Query the Hotels Vendors database for hotels, suppliers, orders, products, or leads. Returns read-only data. NEVER use this for mutations.",
  parameters: {
    type: "object",
    properties: {
      entity: {
        type: "string",
        description: "Entity type to query",
        enum: ["hotel", "supplier", "order", "product", "lead", "invoice", "creditFacility", "user"],
      },
      filters: {
        type: "object",
        description: "Filter conditions as Prisma where clauses, e.g. {status: 'ACTIVE', city: 'Cairo'}",
      },
      fields: {
        type: "array",
        items: { type: "string" },
        description: "Fields to return (default: id, name, createdAt)",
      },
      limit: { type: "number", description: "Max results (default 20, max 100)" },
      orderBy: { type: "string", description: "Field to order by" },
    },
    required: ["entity"],
  },
  handler: async (args) => {
    const { entity, filters = {}, fields, limit = 20, orderBy } = args as Record<string, unknown>;
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

    const select: Record<string, boolean> = {};
    if (Array.isArray(fields) && fields.length > 0) {
      for (const f of fields) select[f as string] = true;
    }

    const order = orderBy ? { [orderBy as string]: "desc" as const } : undefined;

    switch (entity) {
      case "hotel":
        return prisma.hotel.findMany({
          where: filters as any,
          select: Object.keys(select).length > 0 ? select : { id: true, name: true, city: true, governorate: true, starRating: true, roomCount: true, status: true, createdAt: true },
          take: safeLimit,
          orderBy: order,
        });
      case "supplier":
        return prisma.supplier.findMany({
          where: filters as any,
          select: Object.keys(select).length > 0 ? select : { id: true, name: true, city: true, governorate: true, tier: true, status: true, rating: true, createdAt: true },
          take: safeLimit,
          orderBy: order,
        });
      case "order":
        return prisma.order.findMany({
          where: filters as any,
          select: Object.keys(select).length > 0 ? select : { id: true, orderNumber: true, status: true, total: true, createdAt: true, hotelId: true, supplierId: true },
          take: safeLimit,
          orderBy: order,
        });
      case "product":
        return prisma.product.findMany({
          where: filters as any,
          select: Object.keys(select).length > 0 ? select : { id: true, sku: true, name: true, category: true, unitPrice: true, stockQuantity: true, status: true },
          take: safeLimit,
          orderBy: order,
        });
      case "lead":
        return prisma.lead.findMany({
          where: filters as any,
          select: Object.keys(select).length > 0 ? select : { id: true, name: true, entityType: true, city: true, status: true, priority: true, tier: true },
          take: safeLimit,
          orderBy: order,
        });
      case "invoice":
        return prisma.invoice.findMany({
          where: filters as any,
          select: Object.keys(select).length > 0 ? select : { id: true, invoiceNumber: true, status: true, total: true, paymentStatus: true, createdAt: true },
          take: safeLimit,
          orderBy: order,
        });
      case "creditFacility":
        return prisma.creditFacility.findMany({
          where: filters as any,
          select: Object.keys(select).length > 0 ? select : { id: true, limit: true, utilized: true, status: true, interestRate: true },
          take: safeLimit,
          orderBy: order,
        });
      case "user":
        return prisma.user.findMany({
          where: filters as any,
          select: Object.keys(select).length > 0 ? select : { id: true, email: true, name: true, role: true, status: true },
          take: safeLimit,
          orderBy: order,
        });
      default:
        return { error: `Unknown entity: ${entity}` };
    }
  },
};

export const dbCountTool: ToolDefinition = {
  name: "db_count",
  description: "Count records in the database. Useful for analytics, dashboards, and quick checks.",
  parameters: {
    type: "object",
    properties: {
      entity: {
        type: "string",
        description: "Entity to count",
        enum: ["hotel", "supplier", "order", "product", "lead", "invoice", "user", "creditFacility"],
      },
      filters: {
        type: "object",
        description: "Filter conditions",
      },
    },
    required: ["entity"],
  },
  handler: async (args) => {
    const { entity, filters = {} } = args as Record<string, unknown>;
    switch (entity) {
      case "hotel": return { count: await prisma.hotel.count({ where: filters as any }) };
      case "supplier": return { count: await prisma.supplier.count({ where: filters as any }) };
      case "order": return { count: await prisma.order.count({ where: filters as any }) };
      case "product": return { count: await prisma.product.count({ where: filters as any }) };
      case "lead": return { count: await prisma.lead.count({ where: filters as any }) };
      case "invoice": return { count: await prisma.invoice.count({ where: filters as any }) };
      case "user": return { count: await prisma.user.count({ where: filters as any }) };
      case "creditFacility": return { count: await prisma.creditFacility.count({ where: filters as any }) };
      default: return { error: `Unknown entity: ${entity}` };
    }
  },
};

export const dbAggregateTool: ToolDefinition = {
  name: "db_aggregate",
  description: "Run aggregation queries (sum, avg, min, max) on order totals, invoice amounts, or other numeric fields.",
  parameters: {
    type: "object",
    properties: {
      entity: { type: "string", description: "Entity to aggregate", enum: ["order", "invoice", "creditFacility"] },
      field: { type: "string", description: "Numeric field to aggregate, e.g. 'total'" },
      operation: { type: "string", description: "Aggregation type", enum: ["sum", "avg", "min", "max", "count"] },
      filters: { type: "object", description: "Filter conditions" },
    },
    required: ["entity", "field", "operation"],
  },
  handler: async (args) => {
    const { entity, field, operation, filters = {} } = args as Record<string, unknown>;
    const where = filters as any;

    if (entity === "order") {
      if (operation === "sum") return { result: await prisma.order.aggregate({ _sum: { [field as string]: true }, where }) };
      if (operation === "avg") return { result: await prisma.order.aggregate({ _avg: { [field as string]: true }, where }) };
      if (operation === "count") return { result: await prisma.order.count({ where }) };
    }
    if (entity === "invoice") {
      if (operation === "sum") return { result: await prisma.invoice.aggregate({ _sum: { [field as string]: true }, where }) };
      if (operation === "avg") return { result: await prisma.invoice.aggregate({ _avg: { [field as string]: true }, where }) };
    }
    return { error: "Unsupported entity/operation combination" };
  },
};

// ── Communication Tools ────────────────────────────────────────

export const emailSendTool: ToolDefinition = {
  name: "email_send",
  description: "Send an email to a hotel, supplier, or lead. Use for outreach, approvals, alerts, or follow-ups.",
  parameters: {
    type: "object",
    properties: {
      to: { type: "string", description: "Recipient email address" },
      subject: { type: "string", description: "Email subject line" },
      body: { type: "string", description: "Email body (HTML or plain text)" },
      fromName: { type: "string", description: "Sender name (default: Hotels Vendors)" },
    },
    required: ["to", "subject", "body"],
  },
  handler: async (args) => {
    const { to, subject, body, fromName } = args as Record<string, unknown>;
    // Placeholder — integrate with Resend/SendGrid/SES
    return {
      queued: true,
      to,
      subject,
      from: fromName || "Hotels Vendors",
      note: "Email queued for sending via transactional email provider",
    };
  },
};

// ── Memory / Knowledge Tools ───────────────────────────────────

export const memoryWriteTool: ToolDefinition = {
  name: "memory_write",
  description: "Store a piece of knowledge or insight for future reference. Use this to remember competitor prices, hotel preferences, market trends, or any fact you discover that might be useful later.",
  parameters: {
    type: "object",
    properties: {
      key: { type: "string", description: "Unique identifier for this memory, e.g. 'competitor_maxab_pricing_2026'" },
      category: { type: "string", description: "Category: hotel, supplier, market, competitor, strategy, insight" },
      content: { type: "string", description: "The actual content to store" },
      confidence: { type: "number", description: "How confident you are in this memory (0.0-1.0)" },
      expiresDays: { type: "number", description: "How many days until this memory expires (default 30)" },
    },
    required: ["key", "category", "content"],
  },
  handler: async (args) => {
    const { key, category, content, confidence = 0.8, expiresDays = 30 } = args as Record<string, unknown>;
    const expiresAt = new Date(Date.now() + (expiresDays as number) * 24 * 60 * 60 * 1000);

    await prisma.swarmMemory.upsert({
      where: { memoryType_key_tenantId: { memoryType: "INSIGHT", key: key as string, tenantId: "platform" } },
      update: { content: content as string, category: category as string, confidence: confidence as number, expiresAt },
      create: {
        memoryType: "INSIGHT",
        key: key as string,
        category: category as string,
        content: content as string,
        confidence: confidence as number,
        expiresAt,
        agentId: "grok-brain",
        agentName: "grok-brain",
        tenantId: "platform",
      },
    });

    return { stored: true, key, category, expiresAt: expiresAt.toISOString() };
  },
};

export const memoryReadTool: ToolDefinition = {
  name: "memory_read",
  description: "Retrieve stored memories or insights by key or category. Use this to recall previously discovered information about competitors, hotels, suppliers, or market conditions.",
  parameters: {
    type: "object",
    properties: {
      key: { type: "string", description: "Exact key to retrieve (optional — if omitted, searches by category)" },
      category: { type: "string", description: "Filter by category" },
      limit: { type: "number", description: "Max results (default 10)" },
    },
    required: [],
  },
  handler: async (args) => {
    const { key, category, limit = 10 } = args as Record<string, unknown>;

    const where: any = { tenantId: "platform" };
    if (key) where.key = { contains: key as string, mode: "insensitive" };
    if (category) where.category = category as string;

    const memories = await prisma.swarmMemory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(50, Number(limit)),
    });

    return { memories: memories.map((m) => ({ key: m.key, category: m.category, content: m.content, confidence: m.confidence, createdAt: m.createdAt })) };
  },
};

// ── Intelligence / Analysis Tools ──────────────────────────────

export const analyzeCompetitorTool: ToolDefinition = {
  name: "analyze_competitor",
  description: "Analyze a competitor by visiting their website and extracting key business information. Returns pricing, features, positioning, and market signals.",
  parameters: {
    type: "object",
    properties: {
      url: { type: "string", description: "Competitor website URL" },
      focus: {
        type: "string",
        description: "What to focus on: pricing, features, positioning, team, funding",
        enum: ["pricing", "features", "positioning", "team", "funding", "all"],
      },
    },
    required: ["url"],
  },
  handler: async (args) => {
    const { url, focus = "all" } = args as Record<string, unknown>;

    // Step 1: Navigate and extract structured data
    const pageData = await callOpenClaw("/navigate", {
      url,
      wait_for_selector: "body",
      take_screenshot: false,
      timeout_ms: 30_000,
    });

    // Step 2: Use LLM to analyze the extracted content
    const analysisPrompt = `Analyze this competitor webpage data and extract structured intelligence.
FOCUS: ${focus}

PAGE DATA:
${JSON.stringify(pageData, null, 2).slice(0, 8000)}

Output JSON with:
{
  "companyName": "...",
  "tagline": "...",
  "pricing": { "hasPricingPage": true/false, "plans": [{"name":"...","price":"..."}] },
  "features": ["..."],
  "positioning": "...",
  "targetMarket": "...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "threatLevel": "LOW|MEDIUM|HIGH",
  "notes": "..."
}`;

    const result = await executeLLM(
      "You are a competitive intelligence analyst for Hotels Vendors.",
      analysisPrompt,
      { preferredModel: "xai", temperature: 0.2, maxTokens: 2000 }
    );

    try {
      return JSON.parse(result.content.replace(/```json?\s*|```/g, "").trim());
    } catch {
      return { rawAnalysis: result.content, pageData };
    }
  },
};

export const scoreHotelCreditTool: ToolDefinition = {
  name: "score_hotel_credit",
  description: "Run the Hotels Vendors proprietary credit scoring engine on a hotel's financial data. Returns a 0-1000 score, grade, risk level, recommended limit, and factoring fee.",
  parameters: {
    type: "object",
    properties: {
      hotelId: { type: "string", description: "Hotel ID to score (if already in database)" },
      annualRevenue: { type: "number", description: "Annual revenue in EGP" },
      netProfit: { type: "number", description: "Net profit in EGP" },
      totalAssets: { type: "number", description: "Total assets in EGP" },
      currentAssets: { type: "number", description: "Current assets in EGP" },
      totalLiabilities: { type: "number", description: "Total liabilities in EGP" },
      currentLiabilities: { type: "number", description: "Current liabilities in EGP" },
      bankBalance: { type: "number", description: "Current bank balance in EGP" },
      monthlyPurchases: { type: "number", description: "Average monthly procurement spend in EGP" },
      avgPaymentDays: { type: "number", description: "Average days to pay suppliers" },
      existingDebt: { type: "number", description: "Total existing debt in EGP" },
      properties: { type: "number", description: "Number of hotel properties" },
      rooms: { type: "number", description: "Total room count" },
      governorate: { type: "string", description: "Primary governorate" },
      brand: { type: "string", description: "Hotel brand name" },
      propertyDeed: { type: "boolean", description: "Has property deed collateral" },
      bankGuarantee: { type: "boolean", description: "Has bank guarantee" },
      personalGuarantee: { type: "boolean", description: "Has personal guarantee" },
    },
    required: [],
  },
  handler: async (args) => {
    const { HotelScoreEngine } = await import("@/lib/fintech/scoring/hotel-score-engine");

    const financials = {
      annualRevenue: Number(args.annualRevenue) || 0,
      netProfit: Number(args.netProfit) || 0,
      totalAssets: Number(args.totalAssets) || 0,
      currentAssets: Number(args.currentAssets) || 0,
      totalLiabilities: Number(args.totalLiabilities) || 0,
      currentLiabilities: Number(args.currentLiabilities) || 0,
      bankBalance: Number(args.bankBalance) || 0,
      monthlyPurchases: Number(args.monthlyPurchases) || 0,
      avgPaymentDays: Number(args.avgPaymentDays) || 0,
      existingDebt: Number(args.existingDebt) || 0,
    };

    const profile = {
      properties: Number(args.properties) || 1,
      rooms: Number(args.rooms) || 0,
      governorate: (args.governorate as string) || "Unknown",
      brand: (args.brand as string) || null,
      yearsInOperation: 5,
    };

    const collateral = {
      propertyDeed: Boolean(args.propertyDeed),
      bankGuarantee: Boolean(args.bankGuarantee),
      personalGuarantee: Boolean(args.personalGuarantee),
      equipmentCollateral: false,
      depositAmount: 0,
    };

    const market = {
      sectorInflation: 12,
      avgPaymentDelayTrend: 5,
      tourismOccupancyRate: 65,
      seasonalFactor: 1.0,
    };

    return HotelScoreEngine.calculateScore(financials, profile, collateral, market);
  },
};

// ── Registry Builder ───────────────────────────────────────────

export function buildStandardToolRegistry(): ToolRegistry {
  const registry = new ToolRegistry();

  // OpenClaw / Browser automation
  registry.register(openclawNavigateTool);
  registry.register(openclawExtractTool);
  registry.register(openclawDeepScrapeTool);
  registry.register(openclawSmartNavigateTool);
  registry.register(openclawUseSkillTool);

  // Database
  registry.register(dbQueryTool);
  registry.register(dbCountTool);
  registry.register(dbAggregateTool);

  // Communications
  registry.register(emailSendTool);

  // Memory
  registry.register(memoryWriteTool);
  registry.register(memoryReadTool);

  // Intelligence
  registry.register(analyzeCompetitorTool);
  registry.register(scoreHotelCreditTool);

  return registry;
}
