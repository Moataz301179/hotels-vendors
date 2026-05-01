/**
 * Email Notifications — Hotels Vendors
 * Authority Matrix alerts, order updates, factoring events
 *
 * Uses Resend (free 3,000 emails/month) with SMTP fallback
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@hotelsvendors.com";

interface EmailPayload {
  to: string[];
  subject: string;
  html: string;
  text?: string;
}

async function sendViaResend(payload: EmailPayload): Promise<{ id: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend failed: ${err}`);
  }
  return res.json();
}

export async function sendEmail(payload: EmailPayload): Promise<{ id: string }> {
  if (RESEND_API_KEY) {
    return sendViaResend(payload);
  }
  // Fallback: log to console in dev
  console.log("[Email] Would send:", payload.subject, "to", payload.to.join(", "));
  return { id: "dev-fallback" };
}

// ── Template: Approval Required ──
export function approvalRequiredTemplate(params: {
  approverName: string;
  orderId: string;
  hotelName: string;
  supplierName: string;
  total: number;
  currency: string;
  orderUrl: string;
}): { subject: string; html: string } {
  const subject = `Approval Required: Order ${params.orderId} — ${params.total.toLocaleString()} ${params.currency}`;
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <h2 style="color: #c41e3a;">Hotels Vendors — Approval Request</h2>
      <p>Hello ${params.approverName},</p>
      <p>A new purchase order requires your approval:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Order ID</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.orderId}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Hotel</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.hotelName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Supplier</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.supplierName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; color: #c41e3a; font-weight: bold;">${params.total.toLocaleString()} ${params.currency}</td></tr>
      </table>
      <a href="${params.orderUrl}" style="display: inline-block; padding: 12px 24px; background: #c41e3a; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">Review & Approve</a>
      <p style="margin-top: 24px; font-size: 12px; color: #666;">This is an automated message from Hotels Vendors Authority Matrix.</p>
    </div>
  `;
  return { subject, html };
}

// ── Template: Order Approved ──
export function orderApprovedTemplate(params: {
  requesterName: string;
  orderId: string;
  approverName: string;
  total: number;
  currency: string;
}): { subject: string; html: string } {
  const subject = `Order ${params.orderId} Approved`;
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #22c55e;">✓ Order Approved</h2>
      <p>Hello ${params.requesterName},</p>
      <p>Your order <strong>${params.orderId}</strong> has been approved by ${params.approverName}.</p>
      <p style="font-size: 18px; color: #22c55e; font-weight: bold;">${params.total.toLocaleString()} ${params.currency}</p>
      <p>The supplier will be notified to begin fulfillment.</p>
    </div>
  `;
  return { subject, html };
}

// ── Template: Factoring Disbursed ──
export function factoringDisbursedTemplate(params: {
  supplierName: string;
  invoiceId: string;
  amount: number;
  currency: string;
  partnerName: string;
}): { subject: string; html: string } {
  const subject = `💰 Factoring Funds Disbursed — ${params.invoiceId}`;
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #c41e3a;">Factoring Disbursement Complete</h2>
      <p>Hello ${params.supplierName},</p>
      <p>Your invoice has been funded through ${params.partnerName}:</p>
      <p style="font-size: 24px; color: #c41e3a; font-weight: bold;">${params.amount.toLocaleString()} ${params.currency}</p>
      <p>Funds will reach your account within 24 hours.</p>
    </div>
  `;
  return { subject, html };
}

// ── Template: Smart Fix Triggered ──
export function smartFixTemplate(params: {
  hotelName: string;
  orderId: string;
  fixType: string;
  description: string;
  actionUrl: string;
}): { subject: string; html: string } {
  const subject = `🔒 Smart Fix Applied: ${params.fixType} — Order ${params.orderId}`;
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #f59e0b;">Risk Mitigation Alert</h2>
      <p>Hello ${params.hotelName},</p>
      <p>Our AI has detected a risk pattern on your order and applied an automatic safeguard:</p>
      <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0;">
        <strong>${params.fixType}</strong><br/>
        ${params.description}
      </div>
      <a href="${params.actionUrl}" style="display: inline-block; padding: 12px 24px; background: #c41e3a; color: white; text-decoration: none; border-radius: 6px;">Resolve Now</a>
    </div>
  `;
  return { subject, html };
}
