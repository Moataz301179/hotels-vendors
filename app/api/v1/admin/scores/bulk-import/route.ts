/**
 * Admin Bulk Score Import API
 * POST — Parse CSV/JSON and import company scores in bulk.
 *
 * Expected CSV columns:
 *   supplier_tax_id,source,score_value,score_label,risk_tier,credit_limit,expires_at,report_url
 *
 * Or JSON body: { scores: [{ supplierTaxId, source, scoreValue, ... }] }
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  ApiError,
} from "@/lib/api-utils";
import { recordCompanyScore } from "@/lib/compliance/scoring";
import { prisma } from "@/lib/prisma";

interface ScoreRow {
  supplierTaxId: string;
  source: string;
  scoreValue: number;
  scoreLabel?: string;
  riskTier?: string;
  creditLimit?: number;
  expiresAt?: string;
  reportUrl?: string;
}

function parseCsv(csvText: string): ScoreRow[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s/g, "_"));
  const rows: ScoreRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parse (no quoted commas support for MVP)
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });

    if (!row.supplier_tax_id || !row.source || row.score_value === undefined) continue;

    rows.push({
      supplierTaxId: row.supplier_tax_id,
      source: row.source.toUpperCase(),
      scoreValue: parseFloat(row.score_value),
      scoreLabel: row.score_label || undefined,
      riskTier: row.risk_tier?.toUpperCase() || undefined,
      creditLimit: row.credit_limit ? parseFloat(row.credit_limit) : undefined,
      expiresAt: row.expires_at || undefined,
      reportUrl: row.report_url || undefined,
    });
  }

  return rows;
}

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:read");

  const contentType = request.headers.get("content-type") || "";
  let rows: ScoreRow[] = [];

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) throw new ApiError("No file uploaded", 400);
    const text = await file.text();
    rows = parseCsv(text);
  } else if (contentType.includes("application/json")) {
    const body = await request.json();
    if (body.scores && Array.isArray(body.scores)) {
      rows = body.scores.map((s: any) => ({
        supplierTaxId: s.supplierTaxId || s.supplier_tax_id,
        source: (s.source || "").toUpperCase(),
        scoreValue: parseFloat(s.scoreValue || s.score_value),
        scoreLabel: s.scoreLabel || s.score_label,
        riskTier: (s.riskTier || s.risk_tier || "").toUpperCase(),
        creditLimit: s.creditLimit || s.credit_limit ? parseFloat(s.creditLimit || s.credit_limit) : undefined,
        expiresAt: s.expiresAt || s.expires_at,
        reportUrl: s.reportUrl || s.report_url,
      }));
    }
  } else {
    throw new ApiError("Unsupported content type. Use multipart/form-data or application/json", 400);
  }

  if (rows.length === 0) {
    throw new ApiError("No valid score rows found", 400);
  }

  const results = {
    total: rows.length,
    created: 0,
    skipped: 0,
    errors: [] as { row: number; taxId: string; error: string }[],
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const supplier = await prisma.supplier.findFirst({
        where: { taxId: row.supplierTaxId, tenantId: auth.tenantId },
        select: { id: true, name: true },
      });

      if (!supplier) {
        results.errors.push({ row: i + 2, taxId: row.supplierTaxId, error: "Supplier not found" });
        continue;
      }

      // Validate source
      const validSources = ["I_SCORE", "DUN_BRADSTREET", "GAFI", "MANUAL", "PLATFORM_INTERNAL"];
      if (!validSources.includes(row.source)) {
        results.errors.push({ row: i + 2, taxId: row.supplierTaxId, error: `Invalid source: ${row.source}` });
        continue;
      }

      // Validate risk tier
      const validTiers = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
      const riskTier = row.riskTier && validTiers.includes(row.riskTier) ? row.riskTier as any : undefined;

      await recordCompanyScore({
        supplierId: supplier.id,
        source: row.source as any,
        scoreValue: row.scoreValue,
        scoreLabel: row.scoreLabel,
        riskTier,
        creditLimit: row.creditLimit,
        reportUrl: row.reportUrl,
        expiresAt: row.expiresAt ? new Date(row.expiresAt) : undefined,
        tenantId: auth.tenantId,
      });

      results.created++;
    } catch (err: any) {
      results.errors.push({ row: i + 2, taxId: row.supplierTaxId, error: err.message });
    }
  }

  results.skipped = results.total - results.created - results.errors.length;

  return success(results);
});
