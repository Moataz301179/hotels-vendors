/**
 * Referral Handoff — pilot email handoff to Oliv.
 *
 * The Oliv pilot (per Reymon Rawhy, 14 Jul 2026) is a REFERRAL model with NO
 * technical loop yet. We do not call Oliv's API or receive webhooks in the
 * pilot — we send a structured referral packet to Oliv's partnerships inbox
 * and let them onboard the hotel/supplier offline. Phase 2 will replace this
 * with the embedded finance technical loop (already-present-but-dormant:
 * OlivFinanceAdapter, /api/v1/oliv/payout-callback, anti-bypass tokens).
 *
 * This module is the single place that knows:
 *   - Oliv's partnerships email (OLIV_REFERRAL_EMAIL env, default partnerships@oliv.finance)
 *   - The platform-ops CC (PLATFORM_OPS_EMAIL env, default ops@hotelsvendors.com)
 *   - The referral packet format (template)
 *
 * The sendReferralToOliv entrypoint is idempotent via the APPROVED-stage guard.
 */

import { sendEmail } from "@/lib/notifications/email";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/api-utils";
import type { EligibilityResult } from "@/lib/referral/eligibility";

/** Oliv partnerships inbox. Override with Reymon's direct email in production. */
const OLIV_REFERRAL_EMAIL =
  process.env.OLIV_REFERRAL_EMAIL ?? "partnerships@oliv.finance";

/** Platform ops — CC'd on every referral so the team has a record. */
const PLATFORM_OPS_EMAIL =
  process.env.PLATFORM_OPS_EMAIL ?? "ops@hotelsvendors.com";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://hotelsvendors.com";

export interface ReferralHandoffInput {
  referralId: string;
  entityName: string;
  entityType: "HOTEL" | "SUPPLIER";
  taxId?: string | null;
  financingType: string;
  eligibility: EligibilityResult;
  sourceUrl: string;
}

export function referralHandoffTemplate(p: ReferralHandoffInput): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `HotelsVendors × Oliv Referral — ${p.entityType} ${p.entityName} (${p.financingType})`;
  const facility = p.eligibility.recommendedFacility;
  const facilityLine = facility
    ? `Limit: ${facility.limitEgp.toLocaleString()} EGP · Tenor: ${facility.tenorDays}d · Advance: ${(facility.advanceRate * 100).toFixed(0)}% · Discount: ${(facility.discountRate * 100).toFixed(2)}%`
    : "Not recommended — see ineligible reasons below";

  const flagSection = (label: string, items: string[], color: string) =>
    items.length === 0
      ? ""
      : `<li style="color: ${color};">${label}: ${items.join("; ")}</li>`;

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <h2 style="color: #c41e3a;">HotelsVendors × Oliv — New Referral</h2>
      <p>Hello Oliv Partnerships team,</p>
      <p>This is a referral under the HotelsVendors × Oliv pilot agreement (Jul 2026). Please review the pre-qualified lead below and reach out to onboard.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Referral ID</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace;">${p.referralId}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Entity type</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${p.entityType}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Entity name</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${p.entityName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Tax ID</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${p.taxId ?? "—"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Financing type</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${p.financingType}</td></tr>
      </table>

      <h3 style="margin-top: 24px;">Pre-qualification verdict (HotelsVendors)</h3>
      <p>
        <strong>Grade:</strong> ${p.eligibility.grade} &nbsp;·&nbsp;
        <strong>Score:</strong> ${p.eligibility.score} &nbsp;·&nbsp;
        <strong>Risk level:</strong> ${p.eligibility.riskLevel}
      </p>
      <p style="background: #f6f6f6; padding: 10px 14px; border-radius: 6px;"><strong>Recommended facility:</strong> ${facilityLine}</p>

      <h4 style="margin-top: 20px;">Flags</h4>
      <ul style="list-style: none; padding-left: 0;">
        ${flagSection("🟢 Green", p.eligibility.flags.green, "#16a34a")}
        ${flagSection("🟠 Amber", p.eligibility.flags.amber, "#d97706")}
        ${flagSection("🔴 Red", p.eligibility.flags.red, "#dc2626")}
      </ul>

      ${
        p.eligibility.ineligibleReasons.length > 0
          ? `<h4 style="margin-top: 20px; color: #dc2626;">Ineligible reasons</h4><ul>${p.eligibility.ineligibleReasons.map((r) => `<li>${r}</li>`).join("")}</ul>`
          : ""
      }

      <p style="margin-top: 24px;">
        <a href="${p.sourceUrl}" style="display: inline-block; padding: 12px 24px; background: #c41e3a; color: white; text-decoration: none; border-radius: 6px;">View referral on HotelsVendors</a>
      </p>

      <p style="margin-top: 24px; font-size: 12px; color: #666;">
        This referral was generated under the HotelsVendors × Oliv pilot agreement (Jul 2026).<br>
        Reply to this email or contact ${PLATFORM_OPS_EMAIL} to confirm onboarding status.
      </p>
    </div>
  `;

  // Plain-text fallback for clients that don't render HTML
  const text = [
    subject,
    "",
    `Referral ID: ${p.referralId}`,
    `Entity: ${p.entityType} — ${p.entityName}`,
    `Tax ID: ${p.taxId ?? "—"}`,
    `Financing type: ${p.financingType}`,
    "",
    "Pre-qualification verdict:",
    `  Grade: ${p.eligibility.grade}  Score: ${p.eligibility.score}  Risk: ${p.eligibility.riskLevel}`,
    `  Recommended facility: ${facilityLine}`,
    "",
    `Source: ${p.sourceUrl}`,
    "",
    "This referral was generated under the HotelsVendors × Oliv pilot agreement (Jul 2026).",
  ].join("\n");

  return { subject, html, text };
}

/**
 * Send a referral handoff email to Oliv. Idempotent via the APPROVED-stage
 * guard — only referrals the admin has explicitly approved can be sent.
 * Records the Resend message id + send timestamp on the Referral row, then
 * writes a tamper-proof audit log entry.
 */
export async function sendReferralToOliv(
  referralId: string,
  senderUserId: string,
  senderIp: string | null,
): Promise<{ messageId: string; to: string }> {
  const referral = await prisma.referral.findUniqueOrThrow({
    where: { id: referralId },
  });

  if (referral.stage !== "APPROVED") {
    throw new Error(
      `Referral ${referralId} must be in APPROVED stage to send (current: ${referral.stage})`,
    );
  }

  const eligibility: EligibilityResult = {
    eligible: referral.eligible ?? false,
    grade: referral.grade ?? "—",
    score: referral.score ?? 0,
    riskLevel: referral.riskLevel ?? "—",
    flags: (referral.eligibilityFlags as EligibilityResult["flags"]) ?? {
      red: [],
      amber: [],
      green: [],
    },
    recommendedFacility:
      (referral.recommendedFacility as EligibilityResult["recommendedFacility"]) ??
      undefined,
    ineligibleReasons: referral.ineligibleReasons ?? [],
  };

  const sourceUrl = `${APP_URL}/admin/referrals/pipeline?referral=${referralId}`;

  const tpl = referralHandoffTemplate({
    referralId: referral.id,
    entityName: referral.entityName,
    entityType: referral.entityType,
    taxId: referral.entityTaxId,
    financingType: referral.financingType,
    eligibility,
    sourceUrl,
  });

  const { id: messageId } = await sendEmail({
    to: [OLIV_REFERRAL_EMAIL, PLATFORM_OPS_EMAIL, referral.entityEmail],
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });

  await prisma.referral.update({
    where: { id: referralId },
    data: {
      stage: "REFERRED",
      handoffEmailTo: OLIV_REFERRAL_EMAIL,
      handoffEmailSentAt: new Date(),
      handoffMessageId: messageId,
    },
  });

  await audit({
    entityType: "REFERRAL",
    entityId: referralId,
    action: "REFERRAL_SENT_TO_OLIV",
    tenantId: referral.tenantId,
    actorId: senderUserId,
    actorRole: "ADMIN",
    afterState: { messageId, to: OLIV_REFERRAL_EMAIL, cc: [PLATFORM_OPS_EMAIL, referral.entityEmail] },
    ipAddress: senderIp,
  });

  return { messageId, to: OLIV_REFERRAL_EMAIL };
}
