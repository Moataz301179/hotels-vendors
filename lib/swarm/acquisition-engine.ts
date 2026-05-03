/**
 * Acquisition Engine — Autonomous Supplier Discovery Pipeline
 *
 * Pipeline stages:
 *   1. DISCOVER  → OpenClaw scrapes directory → raw data
 *   2. ENRICH    → Agent0/Grok categorizes + generates profile
 *   3. DEDUPE    → Check against existing leads/suppliers
 *   4. STORE     → Save to Lead model
 *   5. SCORE     → Calculate priority based on signals
 *   6. OUTREACH  → Draft personalized message (approval-gated)
 *
 * Each stage is a SwarmJob with full audit trail.
 */

import { prisma } from "@/lib/prisma";
import { executeLLM } from "./model-router";
import { getMemoryContext, storeMemory } from "./memory";
import { recordSwarmEvent } from "./monitoring";
import { addSwarmJob } from "./scheduler";
import {
  SUPPLIER_SOURCES,
  type SupplierSource,
  mapFieldsToLead,
} from "./supplier-sources";

const OPENCLAW_URL = process.env.OPENCLAW_URL || "http://localhost:8000";
const AGENT0_URL = process.env.AGENT0_URL || "http://localhost:9000";

// ── Types ──

export interface AcquisitionRun {
  id: string;
  sourceIds: string[];
  maxLeadsPerSource: number;
  options: {
    autoEnrich: boolean;
    autoOutreach: boolean;
    dryRun: boolean;
  };
}

export interface AcquisitionResult {
  runId: string;
  sourceId: string;
  discovered: number;
  enriched: number;
  deduped: number;
  stored: number;
  scored: number;
  outreachDrafted: number;
  errors: string[];
  durationMs: number;
}

// ── Stage 1: DISCOVER (OpenClaw Scraping) ──

export async function discoverFromSource(
  source: SupplierSource,
  maxLeads: number = 50,
  jobId?: string
): Promise<Record<string, string | null>[]> {
  const start = Date.now();
  const results: Record<string, string | null>[] = [];

  try {
    // Step 1: Navigate and deep scrape
    const scrapePayload = {
      url: source.url,
      item_selector: source.itemSelector,
      fields: Object.fromEntries(
        Object.entries(source.fields).map(([k, v]) => [k, v.selector])
      ),
      pagination: source.pagination
        ? {
            next_selector: source.pagination.nextSelector || "",
            max_pages: source.pagination.maxPages,
          }
        : undefined,
      infinite_scroll: source.pagination?.type === "infinite_scroll",
      timeout: 45000,
    };

    const res = await fetch(`${OPENCLAW_URL}/deep-scrape`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scrapePayload),
    });

    if (!res.ok) {
      throw new Error(`OpenClaw scrape failed: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    const items = data.data?.items || [];

    // Map raw fields to normalized lead data
    for (const item of items.slice(0, maxLeads)) {
      const mapped = mapFieldsToLead(item, source);
      mapped._sourceId = source.id;
      mapped._sourceUrl = source.url;
      mapped._sourceName = source.name;
      mapped._region = source.region;
      mapped._category = source.category;
      results.push(mapped);
    }

    await recordSwarmEvent("acquisition_discovered", "INFO", {
      sourceId: source.id,
      discovered: results.length,
      durationMs: Date.now() - start,
      jobId,
    });

    return results;
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    await recordSwarmEvent("acquisition_discover_failed", "ERROR", {
      sourceId: source.id,
      error: err,
      jobId,
    });
    throw error;
  }
}

// ── Stage 2: ENRICH (Agent0/Grok) ──

export async function enrichLead(
  raw: Record<string, string | null>,
  jobId?: string
): Promise<Record<string, unknown>> {
  const name = raw.name || raw.legalName || "Unknown";
  const category = raw._category || "Mixed";

  const systemPrompt = `You are a B2B supplier intelligence analyst for the Egyptian hospitality market.
Your task: analyze a raw supplier discovery record and produce a structured enrichment profile.

Rules:
- NEVER fabricate data. If uncertain, use null or "unknown".
- Infer the hospitality category from the supplier name and raw category.
- Assign a priority score (1-10) based on: industrial zone proximity, category relevance, signal quality.
- Generate a concise business description in both English and Arabic.
- Output ONLY valid JSON. No markdown, no prose.`;

  const userPrompt = `Analyze this supplier discovery record and produce a structured enrichment profile.

Raw Data:
${JSON.stringify(raw, null, 2)}

Output JSON structure:
{
  "hospitalityCategory": "F&B|Linens|Chemicals|Engineering|Amenities|Uniforms|FF&E|Mixed",
  "subCategories": ["string"],
  "estimatedEmployees": "1-10|11-50|51-200|201-500|500+",
  "estimatedRevenue": "<1M|1M-5M|5M-20M|20M-100M|>100M EGP/year",
  "businessModel": "manufacturer|distributor|importer|wholesaler|retailer",
  "qualityTier": "budget|standard|premium|luxury",
  "servesHotels": true,
  "servesRestaurants": true,
  "servesCatering": true,
  "hasExportCapability": false,
  "etaComplianceLikelihood": "low|medium|high",
  "priorityScore": 7,
  "confidence": 0.75,
  "descriptionEn": "string",
  "descriptionAr": "string",
  "outreachAngle": "string — personalized angle for first contact",
  "redFlags": ["string"],
  "recommendedNextAction": "string"
}`;

  try {
    const result = await executeLLM(systemPrompt, userPrompt, {
      temperature: 0.2,
      maxTokens: 2048,
    });

    // Extract JSON from response
    const content = result.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const enrichment = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    // Store in memory for future retrieval
    await storeMemory({
      agentId: "lead-enricher",
      agentName: "Lead Enricher",
      content: `Enrichment for ${name} (source: ${raw._sourceId}, confidence: ${enrichment.confidence}): ${JSON.stringify(enrichment)}`,
      memoryType: "SUPPLIER_PROFILE",
      category: "supplier",
      jobId,
    });

    await recordSwarmEvent("acquisition_enriched", "INFO", {
      leadName: name,
      priorityScore: enrichment.priorityScore,
      jobId,
    });

    return enrichment;
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    await recordSwarmEvent("acquisition_enrich_failed", "ERROR", {
      leadName: name,
      error: err,
      jobId,
    });
    // Return minimal enrichment on failure so pipeline continues
    return {
      hospitalityCategory: category,
      priorityScore: 5,
      confidence: 0.3,
      descriptionEn: `Supplier discovered from ${raw._sourceName}`,
      outreachAngle: "Introduce Hotels Vendors platform for hospitality procurement",
    };
  }
}

// ── Stage 3: DEDUPE ──

export async function deduplicateLead(
  raw: Record<string, string | null>,
  tenantId: string
): Promise<{ isDuplicate: boolean; existingLeadId?: string; reason: string }> {
  const name = raw.name || raw.legalName;
  const phone = raw.phone;
  const email = raw.email;

  // Check by exact email
  if (email) {
    const existing = await prisma.lead.findFirst({
      where: { email, tenantId },
    });
    if (existing) {
      return { isDuplicate: true, existingLeadId: existing.id, reason: "email_match" };
    }
  }

  // Check by exact phone
  if (phone) {
    const existing = await prisma.lead.findFirst({
      where: { phone, tenantId },
    });
    if (existing) {
      return { isDuplicate: true, existingLeadId: existing.id, reason: "phone_match" };
    }
  }

  // Check by normalized name similarity (fuzzy)
  if (name) {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, "");
    const existing = await prisma.lead.findMany({
      where: {
        tenantId,
        name: { contains: name.substring(0, Math.min(name.length, 10)) },
      },
      take: 10,
    });

    for (const lead of existing) {
      const existingNormalized = lead.name
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]/g, "");
      // Simple similarity: shared substring of 80%
      const minLen = Math.min(normalizedName.length, existingNormalized.length);
      if (minLen > 5) {
        const shared = longestCommonSubstring(normalizedName, existingNormalized);
        if (shared.length / minLen > 0.8) {
          return { isDuplicate: true, existingLeadId: lead.id, reason: "name_similarity" };
        }
      }
    }
  }

  // Check against existing suppliers
  if (email) {
    const existingSupplier = await prisma.supplier.findFirst({
      where: { email, tenantId },
    });
    if (existingSupplier) {
      return { isDuplicate: true, reason: "existing_supplier_email" };
    }
  }

  return { isDuplicate: false, reason: "new" };
}

function longestCommonSubstring(a: string, b: string): string {
  const matrix: number[][] = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));
  let maxLen = 0;
  let endIndex = 0;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
        if (matrix[i][j] > maxLen) {
          maxLen = matrix[i][j];
          endIndex = i;
        }
      }
    }
  }

  return a.substring(endIndex - maxLen, endIndex);
}

// ── Stage 4: STORE ──

export async function storeLead(
  raw: Record<string, string | null>,
  enrichment: Record<string, unknown>,
  tenantId: string,
  jobId?: string
): Promise<string> {
  const name = (raw.name || raw.legalName || "Unknown Supplier").substring(0, 200);
  const city = raw.city || "Unknown";
  const governorate = raw.governorate || null;

  const lead = await prisma.lead.create({
    data: {
      entityType: "SUPPLIER",
      name,
      legalName: raw.legalName || name,
      website: raw.website || null,
      email: raw.email || null,
      phone: raw.phone || null,
      city,
      governorate,
      address: raw.address || null,
      category: String(enrichment.hospitalityCategory || raw._category || "Mixed"),
      source: "scraped",
      sourceUrl: raw._sourceUrl || null,
      discoveredBy: "lead-scout",
      enrichment: JSON.stringify(enrichment),
      trustSignals: JSON.stringify({
        hasWebsite: !!raw.website,
        hasPhone: !!raw.phone,
        hasEmail: !!raw.email,
        hasAddress: !!raw.address,
        sourceQuality: raw._sourceId,
      }),
      status: "DISCOVERED",
      priority: Number(enrichment.priorityScore) || 5,
      tenantId,
    },
  });

  await recordSwarmEvent("acquisition_stored", "INFO", {
    leadId: lead.id,
    leadName: name,
    city,
    jobId,
  });

  return lead.id;
}

// ── Stage 5: SCORE ──

export async function scoreLead(leadId: string): Promise<number> {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return 0;

  let score = lead.priority || 5;

  // Boost for complete contact info
  if (lead.email && lead.phone) score += 1;
  if (lead.website) score += 1;

  // Boost for high-priority regions
  if (["6th_of_october", "10th_of_ramadan", "new_cairo", "sheikh_zayed"].includes(lead.city?.toLowerCase() || "")) {
    score += 1;
  }

  // Boost for hospitality-specific categories
  if (["F&B", "Linens", "Chemicals", "Amenities"].includes(lead.category || "")) {
    score += 1;
  }

  // Cap at 10
  score = Math.min(10, score);

  await prisma.lead.update({
    where: { id: leadId },
    data: { priority: score },
  });

  return score;
}

// ── Stage 6: OUTREACH DRAFT ──

export async function draftOutreach(
  leadId: string,
  tenantId: string,
  jobId?: string
): Promise<{ subject: string; body: string; channel: string } | null> {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || !lead.email) return null;

  const enrichment = lead.enrichment ? JSON.parse(lead.enrichment) : {};
  const outreachAngle = enrichment.outreachAngle || "Reduce procurement costs through digital marketplace";

  const systemPrompt = `You are an elite B2B outreach specialist for Hotels Vendors, a digital procurement marketplace for Egyptian hospitality.
You write personalized, compelling outreach messages that get responses.
Rules:
- NEVER use generic templates. Reference specific details about the recipient.
- Write in professional Arabic and English.
- Keep emails under 150 words.
- Include ONE clear call-to-action.
- Mention the Egyptian hospitality market context.`;

  const userPrompt = `Draft an outreach email to this supplier:

Name: ${lead.name}
City: ${lead.city}
Category: ${lead.category}
Discovery source: ${lead.sourceUrl || "industrial directory"}
Business description: ${enrichment.descriptionEn || "Hospitality supplier"}
Outreach angle: ${outreachAngle}

Write:
1. Subject line (compelling, under 60 chars)
2. Email body (personalized, under 150 words, Arabic + English)
3. Recommended channel: email or whatsapp

Output ONLY valid JSON:
{
  "subject": "string",
  "body": "string",
  "channel": "email|whatsapp"
}`;

  try {
    const result = await executeLLM(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 1024,
    });

    const content = result.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const draft = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (draft) {
      // Create outreach log entry (DRAFT status, requires approval)
      await prisma.outreachLog.create({
        data: {
          channel: draft.channel || "email",
          messageType: "welcome",
          subject: draft.subject,
          body: draft.body,
          leadId: lead.id,
          leadName: lead.name,
          recipientEmail: lead.email,
          recipientPhone: lead.phone,
          sentByAgent: "outreach-agent",
          agentName: "Outreach Agent",
          jobId,
          autoSent: false,
          status: "DRAFT",
        },
      });

      // Update lead status
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: "CONTACTED", lastContactAt: new Date(), contactCount: { increment: 1 } },
      });

      await recordSwarmEvent("acquisition_outreach_drafted", "INFO", {
        leadId,
        leadName: lead.name,
        channel: draft.channel,
        jobId,
      });
    }

    return draft;
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    await recordSwarmEvent("acquisition_outreach_draft_failed", "ERROR", {
      leadId,
      error: err,
      jobId,
    });
    return null;
  }
}

// ── Full Pipeline Run ──

export async function runAcquisition(
  config: AcquisitionRun,
  tenantId: string
): Promise<AcquisitionResult[]> {
  const results: AcquisitionResult[] = [];

  for (const sourceId of config.sourceIds) {
    const source = SUPPLIER_SOURCES.find((s) => s.id === sourceId);
    if (!source) {
      results.push({
        runId: config.id,
        sourceId,
        discovered: 0,
        enriched: 0,
        deduped: 0,
        stored: 0,
        scored: 0,
        outreachDrafted: 0,
        errors: ["Source not found"],
        durationMs: 0,
      });
      continue;
    }

    const start = Date.now();
    const result: AcquisitionResult = {
      runId: config.id,
      sourceId,
      discovered: 0,
      enriched: 0,
      deduped: 0,
      stored: 0,
      scored: 0,
      outreachDrafted: 0,
      errors: [],
      durationMs: 0,
    };

    try {
      // Stage 1: Discover
      const rawLeads = await discoverFromSource(source, config.maxLeadsPerSource, config.id);
      result.discovered = rawLeads.length;

      if (config.options.dryRun) {
        result.durationMs = Date.now() - start;
        results.push(result);
        continue;
      }

      for (const raw of rawLeads) {
        try {
          // Stage 2: Enrich
          let enrichment: Record<string, unknown> = {};
          if (config.options.autoEnrich) {
            enrichment = await enrichLead(raw, config.id);
            result.enriched++;
          }

          // Stage 3: Dedupe
          const dedupe = await deduplicateLead(raw, tenantId);
          if (dedupe.isDuplicate) {
            result.deduped++;
            continue;
          }

          // Stage 4: Store
          const leadId = await storeLead(raw, enrichment, tenantId, config.id);
          result.stored++;

          // Stage 5: Score
          await scoreLead(leadId);
          result.scored++;

          // Stage 6: Outreach draft
          if (config.options.autoOutreach) {
            const draft = await draftOutreach(leadId, tenantId, config.id);
            if (draft) result.outreachDrafted++;
          }
        } catch (itemError) {
          const err = itemError instanceof Error ? itemError.message : String(itemError);
          result.errors.push(err);
        }
      }
    } catch (sourceError) {
      const err = sourceError instanceof Error ? sourceError.message : String(sourceError);
      result.errors.push(err);
    }

    result.durationMs = Date.now() - start;
    results.push(result);

    await recordSwarmEvent("acquisition_source_complete", "INFO", {
      runId: config.id,
      sourceId,
      ...result,
    });
  }

  return results;
}

// ── Quick Discovery (single source, no enrichment) ──

export async function quickDiscover(
  sourceId: string,
  maxLeads: number = 20
): Promise<Record<string, string | null>[]> {
  const source = SUPPLIER_SOURCES.find((s) => s.id === sourceId);
  if (!source) throw new Error(`Source not found: ${sourceId}`);
  return discoverFromSource(source, maxLeads);
}
