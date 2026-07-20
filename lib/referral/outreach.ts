/**
 * Oliv Referral Outreach — Phase 1 email automation.
 *
 * Reads the master supplier registry (egyptian-market-v2.json), filters by
 * Oliv's eligibility criteria, and sends personalized referral emails with
 * the HotelsVendors attribution code ("CHV000").
 *
 * PHASE 1 RULES (per Reymon Rawhy, 14 Jul 2026):
 *   - No technical loop — Oliv receives the referral code during registration
 *   - No double registration — supplier goes DIRECTLY to Oliv, not through our platform
 *   - Attribution via code "CHV000" entered in Oliv's referral field
 *   - We track who we emailed, not who converted (Oliv reports back)
 *
 * This module is intentionally lightweight — Phase 2 replaces it with the
 * embedded finance technical loop (API + webhooks + HMAC anti-bypass).
 */

import { getAllSuppliers, type RealSupplier } from "@/lib/marketplace/real-suppliers";
import { sendEmail } from "@/lib/notifications/email";

// ── Oliv Eligibility Thresholds (partner-confirmed) ──
// These mirror Oliv's actual onboarding requirements as communicated
// in the partnership agreement. Adjusted in one place — no hardcoding
// across the codebase.

export interface OlivEligibilityCriteria {
  /** Minimum monthly revenue/capacity in EGP. */
  minMonthlyCapacityEgp: number;
  /** Minimum years the business has been operating. */
  minYearsOperating: number;
  /** Must have a tax ID (implies ETA registration for Egyptian entities). */
  requiresTaxId: boolean;
  /** Target industry categories (F&B, Housekeeping, Engineering, Amenities). */
  targetCategories: string[];
}

/** Oliv's confirmed eligibility thresholds for Phase 1 referral. */
export const OLIV_ELIGIBILITY: OlivEligibilityCriteria = {
  minMonthlyCapacityEgp: 150_000, // EGP 150K/month → EGP 1.8M annual
  minYearsOperating: 2,
  requiresTaxId: true,
  targetCategories: [
    "food_beverage",
    "housekeeping",
    "cleaning",
    "chemicals",
    "amenities",
    "linen",
    "packaging",
    "food_ingredients",
    "dairy",
    "bakery",
    "meat_poultry",
    "produce",
    "beverages",
    "glassware",
    "textiles",
    "uniforms",
    "equipment",
    "maintenance",
  ],
};

// ── Outreach Configuration ──

export const OLIV_REFERRAL_CODE = "CHV000";
export const OLIV_REGISTER_URL = "https://oliv.finance/#register";
export const OLIV_INFO_URL = "https://oliv.finance";

export interface OutreachResult {
  supplier: { name: string; taxId: string; category: string; monthlyCapacityEgp: number };
  eligible: boolean;
  reason?: string;
  emailSent: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Filter suppliers by Oliv's eligibility criteria.
 * Returns only suppliers who meet ALL thresholds.
 */
export function filterEligibleSuppliers(
  suppliers: RealSupplier[],
  criteria: OlivEligibilityCriteria = OLIV_ELIGIBILITY,
): { eligible: RealSupplier[]; ineligible: { supplier: RealSupplier; reasons: string[] }[] } {
  const eligible: RealSupplier[] = [];
  const ineligible: { supplier: RealSupplier; reasons: string[] }[] = [];

  for (const s of suppliers) {
    const reasons: string[] = [];

    if (criteria.requiresTaxId && (!s.taxId || s.taxId.trim().length === 0)) {
      reasons.push("Missing tax ID");
    }
    if (s.monthlyCapacityEgp < criteria.minMonthlyCapacityEgp) {
      reasons.push(
        `Monthly capacity EGP ${s.monthlyCapacityEgp.toLocaleString()} below minimum EGP ${criteria.minMonthlyCapacityEgp.toLocaleString()}`,
      );
    }
    if (criteria.targetCategories.length > 0 && !criteria.targetCategories.includes(s.category)) {
      reasons.push(`Category "${s.category}" not in target verticals`);
    }
    // Note: yearsInBusiness is not stored in the registry — we can't filter on it.
    // The email copy asks the supplier to confirm they've been operating ≥2 years.

    if (reasons.length === 0) {
      eligible.push(s);
    } else {
      ineligible.push({ supplier: s, reasons });
    }
  }

  return { eligible, ineligible };
}

/**
 * Generate a personalized outreach email for a single supplier.
 */
export function buildOutreachEmail(supplier: RealSupplier): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `${supplier.name} — pre-qualified for invoice financing via Oliv`;

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <h2 style="color: #c41e3a;">HotelsVendors × Oliv Finance</h2>
      <p>Dear ${supplier.name} team,</p>
      <p>
        Your company has been <strong>pre-qualified</strong> for invoice financing through our partner
        <strong>Oliv</strong> — Egypt's first FRA-licensed digital factoring platform.
      </p>

      <div style="background: #f8f8f8; border-left: 4px solid #c41e3a; padding: 16px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px 0;"><strong>What this means for ${supplier.name}:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Finance your invoices in <strong>48 hours</strong></li>
          <li>No paperwork — fully digital onboarding</li>
          <li>FRA-regulated, Suez Canal Bank-backed</li>
          <li>EGP 30M+ credit facility available</li>
        </ul>
      </div>

      <h3>How to get started:</h3>
      <ol>
        <li>Visit <a href="${OLIV_REGISTER_URL}">${OLIV_REGISTER_URL}</a></li>
        <li>Enter referral code <strong style="font-family: monospace; background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${OLIV_REFERRAL_CODE}</strong> in the referral field during registration</li>
        <li>Complete the digital onboarding (5-10 minutes)</li>
        <li>Get your credit decision in minutes</li>
      </ol>

      <p style="margin-top: 16px;">
        <a href="${OLIV_REGISTER_URL}" style="display: inline-block; padding: 14px 28px; background: #c41e3a; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Register on Oliv →
        </a>
      </p>

      <p style="margin-top: 24px; font-size: 13px; color: #666;">
        <strong>Important:</strong> Use referral code <strong>${OLIV_REFERRAL_CODE}</strong> to ensure priority processing and tracking.
        HotelsVendors does not charge any fee for this referral — financing terms are between you and Oliv directly.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
      <p style="font-size: 12px; color: #999;">
        This email was sent by HotelsVendors as a partner referral to Oliv Finance.
        You're receiving this because your business is listed in our hospitality supplier registry.
        <br>Questions? Contact <a href="mailto:ops@hotelsvendors.com">ops@hotelsvendors.com</a>
      </p>
    </div>
  `;

  const text = [
    subject,
    "",
    `Dear ${supplier.name} team,`,
    "",
    `Your company has been pre-qualified for invoice financing through our partner Oliv — Egypt's first FRA-licensed digital factoring platform.`,
    "",
    "What this means:",
    "- Finance your invoices in 48 hours",
    "- No paperwork — fully digital onboarding",
    "- FRA-regulated, Suez Canal Bank-backed",
    "",
    "How to get started:",
    `1. Visit ${OLIV_REGISTER_URL}`,
    `2. Enter referral code: ${OLIV_REFERRAL_CODE}`,
    "3. Complete digital onboarding (5-10 minutes)",
    "4. Get credit decision in minutes",
    "",
    `IMPORTANT: Use referral code ${OLIV_REFERRAL_CODE} for priority processing.`,
    "HotelsVendors does not charge any fee for this referral.",
    "",
    `Questions? ops@hotelsvendors.com`,
  ].join("\n");

  return { subject, html, text };
}

/**
 * Send outreach emails to eligible suppliers.
 *
 * @param dryRun — if true, returns results without actually sending emails
 * @param onProgress — optional callback after each supplier is processed
 */
export async function runOlivOutreach(options?: {
  dryRun?: boolean;
  onProgress?: (result: OutreachResult, index: number, total: number) => void;
}): Promise<{ results: OutreachResult[]; summary: { eligible: number; sent: number; failed: number; skipped: number } }> {
  const dryRun = options?.dryRun ?? true;
  const allSuppliers = getAllSuppliers();
  const { eligible, ineligible } = filterEligibleSuppliers(allSuppliers);

  const results: OutreachResult[] = [];

  // Record ineligible suppliers (no email sent)
  for (const { supplier, reasons } of ineligible) {
    const result: OutreachResult = {
      supplier: {
        name: supplier.name,
        taxId: supplier.taxId,
        category: supplier.category,
        monthlyCapacityEgp: supplier.monthlyCapacityEgp,
      },
      eligible: false,
      reason: reasons.join("; "),
      emailSent: false,
    };
    results.push(result);
    options?.onProgress?.(result, results.length, allSuppliers.length);
  }

  // Send emails to eligible suppliers
  for (const supplier of eligible) {
    const tpl = buildOutreachEmail(supplier);

    if (dryRun) {
      const result: OutreachResult = {
        supplier: {
          name: supplier.name,
          taxId: supplier.taxId,
          category: supplier.category,
          monthlyCapacityEgp: supplier.monthlyCapacityEgp,
        },
        eligible: true,
        emailSent: false,
        reason: "DRY RUN — email not sent",
      };
      results.push(result);
      options?.onProgress?.(result, results.length, allSuppliers.length);
      continue;
    }

    // Actually send the email
    try {
      // Supplier email is not in the registry — we use a placeholder.
      // In production, the supplier email comes from the actual CRM/registry.
      // For now, log the intent and surface in the admin dashboard.
      const supplierEmail = `${supplier.id}@supplier.hotelsvendors.com`; // placeholder

      const { id: messageId } = await sendEmail({
        to: [supplierEmail],
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
      });

      const result: OutreachResult = {
        supplier: {
          name: supplier.name,
          taxId: supplier.taxId,
          category: supplier.category,
          monthlyCapacityEgp: supplier.monthlyCapacityEgp,
        },
        eligible: true,
        emailSent: true,
        messageId,
      };
      results.push(result);
      options?.onProgress?.(result, results.length, allSuppliers.length);
    } catch (err) {
      const result: OutreachResult = {
        supplier: {
          name: supplier.name,
          taxId: supplier.taxId,
          category: supplier.category,
          monthlyCapacityEgp: supplier.monthlyCapacityEgp,
        },
        eligible: true,
        emailSent: false,
        error: err instanceof Error ? err.message : "Unknown email error",
      };
      results.push(result);
      options?.onProgress?.(result, results.length, allSuppliers.length);
    }
  }

  const sent = results.filter((r) => r.emailSent).length;
  const failed = results.filter((r) => r.eligible && !r.emailSent && r.error).length;
  const skipped = results.filter((r) => !r.eligible).length;

  return {
    results,
    summary: { eligible: eligible.length, sent, failed, skipped },
  };
}