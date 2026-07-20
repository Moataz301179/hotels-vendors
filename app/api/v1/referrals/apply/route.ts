/**
 * Referral Apply — landing page lead capture API.
 *
 * POST /api/v1/referrals/apply
 *
 * Receives qualified/unqualified lead submissions from the
 * /financing/oliv/apply landing page. Stores in the Referral
 * table for admin pipeline visibility. No authentication required
 * (public landing page). Sends internal notification email to
 * the sales team via Hostinger SMTP.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { apiRoute, success, error, audit } from "@/lib/api-utils";
import { sendEmail } from "@/lib/notifications/email";

const ApplySchema = z.object({
  companyName: z.string().min(2).max(200),
  taxUuid: z.string().min(5).max(100),
  contactName: z.string().min(2).max(100),
  contactEmail: z.string().email().max(200),
  contactPhone: z.string().max(30).optional(),
  qualified: z.boolean(),
  revenueCheck: z.boolean().nullable(),
  etaCheck: z.boolean().nullable(),
  yearsCheck: z.boolean().nullable(),
});

const SALES_EMAIL = "reem@hotelsvendors.com";
const OPS_EMAIL = "info@hotelsvendors.com";

export const POST = apiRoute(async (request: NextRequest) => {
  const body = await request.json().catch(() => ({}));
  const data = ApplySchema.parse(body);

  // Determine the referral stage based on qualification
  const stage = data.qualified ? "SUBMITTED" : "INELIGIBLE";

  // Create referral record
  const referral = await prisma.referral.create({
    data: {
      tenantId: "platform", // landing page leads go to platform tenant
      entityType: "SUPPLIER",
      entityId: `apply-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      entityName: data.companyName,
      entityEmail: data.contactEmail,
      entityTaxId: data.taxUuid,
      financingType: "FACTORING",
      stage,
      eligible: data.qualified ? null : false,
      ineligibleReasons: data.qualified
        ? []
        : [
            data.revenueCheck === false ? "Annual revenue below EGP 1.8M threshold" : null,
            data.etaCheck === false ? "No ETA tax UUID" : null,
            data.yearsCheck === false ? "Less than 2 years operating" : null,
          ].filter(Boolean) as string[],
      notes: `Source: landing page /financing/oliv/apply. Contact: ${data.contactName}, Phone: ${data.contactPhone || "N/A"}`,
    },
  });

  // Audit log
  await audit({
    entityType: "REFERRAL",
    entityId: referral.id,
    action: "REFERRAL_APPLY_SUBMITTED",
    tenantId: "platform",
    actorId: "LANDING_PAGE",
    actorRole: "PUBLIC",
    afterState: {
      companyName: data.companyName,
      qualified: data.qualified,
      stage,
      source: "landing-page",
    },
    ipAddress: request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
  });

  // Send internal notification email to sales team
  try {
    await sendEmail({
      to: [SALES_EMAIL, OPS_EMAIL],
      subject: data.qualified
        ? `✅ New Qualified Lead: ${data.companyName} — Oliv Referral`
        : `📋 New Lead (Not Yet Qualified): ${data.companyName} — Oliv Referral`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
          <h2 style="color: ${data.qualified ? "#4A7C59" : "#dc2626"};">${data.qualified ? "✅ Qualified Lead" : "📋 Lead — Not Yet Qualified"}</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.companyName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Tax UUID</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace;">${data.taxUuid}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Contact</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contactName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contactEmail}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contactPhone || "N/A"}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Qualified</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.qualified ? "Yes" : "No"}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Stage</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${stage}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Source</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">Landing Page</td></tr>
          </table>
          <p style="margin-top: 16px;">
            <a href="https://hotelsvendors.com/admin/referrals/pipeline" style="display: inline-block; padding: 12px 24px; background: #c41e3a; color: white; text-decoration: none; border-radius: 6px;">
              View in Referral Pipeline →
            </a>
          </p>
          <p style="font-size: 12px; color: #666; margin-top: 16px;">
            Referral code: <strong>CHV000</strong> | Oliv registration: https://oliv.finance/#register
          </p>
        </div>
      `,
      text: [
        data.qualified ? "QUALIFIED LEAD" : "LEAD — NOT YET QUALIFIED",
        "",
        `Company: ${data.companyName}`,
        `Tax UUID: ${data.taxUuid}`,
        `Contact: ${data.contactName}`,
        `Email: ${data.contactEmail}`,
        `Phone: ${data.contactPhone || "N/A"}`,
        `Qualified: ${data.qualified ? "Yes" : "No"}`,
        `Stage: ${stage}`,
        "",
        "View in pipeline: https://hotelsvendors.com/admin/referrals/pipeline",
      ].join("\n"),
    });
  } catch (emailErr) {
    // Email failure is non-fatal — the referral record is already created
    console.error("[Referral Apply] Failed to send notification email:", emailErr);
  }

  return success({
    referral: {
      id: referral.id,
      stage: referral.stage,
      entityName: referral.entityName,
    },
    message: data.qualified
      ? "Lead captured — proceed to Oliv with referral code CHV000"
      : "Lead captured — we'll contact you when you're eligible",
  }, 201);
});