/**
 * WhatsApp Notification Broker — Hotels Vendors
 *
 * Modular notification helper for B2B WhatsApp Business API payloads.
 * Supports order confirmations, ETA rejection alerts, and credit approval notices.
 *
 * Uses the WhatsApp Cloud API (Graph API v18.0) with a permanent token.
 * Falls back to Twilio WhatsApp if WHATSAPP_PROVIDER=twilio.
 */

// ─── Configuration ────────────────────────────────────────────────

const WHATSAPP_PROVIDER = process.env.WHATSAPP_PROVIDER || "meta";
const WHATSAPP_TOKEN = process.env.WHATSAPP_BEARER_TOKEN || "";
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
const WHATSAPP_BUSINESS_ID = process.env.WHATSAPP_BUSINESS_ID || "";

// Twilio fallback
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || "";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsvendors.com";

// ─── Types ────────────────────────────────────────────────────────

interface WhatsAppRecipient {
  phone: string; // E.164 format: +201234567890
  name?: string;
}

interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─── Core Sender ───────────────────────────────────────────────────

async function sendViaMeta(
  to: string,
  templateName: string,
  languageCode: string,
  components: Record<string, unknown>[]
): Promise<WhatsAppResult> {
  const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: `Meta API error: ${err}` };
  }

  const data = await res.json();
  return { success: true, messageId: data.messages?.[0]?.id };
}

async function sendViaTwilio(
  to: string,
  body: string
): Promise<WhatsAppResult> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      From: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
      To: `whatsapp:${to}`,
      Body: body,
    }).toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: `Twilio error: ${err}` };
  }

  const data = await res.json();
  return { success: true, messageId: data.sid };
}

async function sendWhatsAppMessage(
  to: string,
  templateName: string,
  languageCode: string,
  components: Record<string, unknown>[],
  fallbackBody: string
): Promise<WhatsAppResult> {
  if (WHATSAPP_PROVIDER === "twilio") {
    return sendViaTwilio(to, fallbackBody);
  }
  return sendViaMeta(to, templateName, languageCode, components);
}

// ─── Notification Functions ───────────────────────────────────────

/**
 * sendOrderConfirmation
 *
 * Notifies a hotel procurement contact that their PO has been confirmed
 * by the supplier and is being prepared for dispatch.
 */
export async function sendOrderConfirmation(params: {
  to: string;
  hotelName: string;
  supplierName: string;
  orderNumber: string;
  totalAmount: number;
  currency?: string;
  estimatedDelivery?: string;
}): Promise<WhatsAppResult> {
  const { to, hotelName, supplierName, orderNumber, totalAmount, currency = "EGP", estimatedDelivery } = params;

  const totalFormatted = totalAmount.toLocaleString("en-EG", {
    style: "currency",
    currency,
  });

  const deliveryText = estimatedDelivery
    ? `\n📅 Est. Delivery: ${estimatedDelivery}`
    : "";

  return sendWhatsAppMessage(
    to,
    "order_confirmation",
    "en",
    [
      {
        type: "body",
        parameters: [
          { type: "text", text: hotelName },
          { type: "text", text: supplierName },
          { type: "text", text: orderNumber },
          { type: "text", text: totalFormatted },
        ],
      },
    ],
    `✅ *Order Confirmed — HotelsVendors*\n\n` +
      `Hotel: ${hotelName}\n` +
      `Supplier: ${supplierName}\n` +
      `Order: ${orderNumber}\n` +
      `Total: ${totalFormatted}` +
      deliveryText +
      `\n\nTrack: ${APP_URL}/orders/${orderNumber}`
  );
}

/**
 * sendEtaRejectionAlert
 *
 * Alerts a supplier that their ETA invoice submission was rejected
 * by the Egyptian Tax Authority, with the rejection reason.
 */
export async function sendEtaRejectionAlert(params: {
  to: string;
  supplierName: string;
  invoiceNumber: string;
  rejectionReason: string;
  etaUuid?: string;
}): Promise<WhatsAppResult> {
  const { to, supplierName, invoiceNumber, rejectionReason, etaUuid } = params;

  const uuidText = etaUuid ? `\nETA UUID: ${etaUuid}` : "";

  return sendWhatsAppMessage(
    to,
    "eta_rejection_alert",
    "en",
    [
      {
        type: "body",
        parameters: [
          { type: "text", text: supplierName },
          { type: "text", text: invoiceNumber },
          { type: "text", text: rejectionReason },
        ],
      },
    ],
      `⚠️ *ETA Invoice Rejected*\n\n` +
      `Supplier: ${supplierName}\n` +
      `Invoice: ${invoiceNumber}` +
      uuidText +
      `\n\n*Reason:* ${rejectionReason}\n\n` +
      `Please correct and resubmit via:\n${APP_URL}/dashboard/eta`
  );
}

/**
 * sendCreditApprovalNotice
 *
 * Notifies a hotel that their factoring credit line has been approved
 * by a licensed partner, with the approved limit and terms.
 */
export async function sendCreditApprovalNotice(params: {
  to: string;
  hotelName: string;
  factoringPartner: string;
  approvedLimit: number;
  currency?: string;
  interestRate?: number;
  validUntil?: string;
}): Promise<WhatsAppResult> {
  const {
    to,
    hotelName,
    factoringPartner,
    approvedLimit,
    currency = "EGP",
    interestRate,
    validUntil,
  } = params;

  const limitFormatted = approvedLimit.toLocaleString("en-EG", {
    style: "currency",
    currency,
  });

  const rateText = interestRate ? `\n📊 Interest Rate: ${(interestRate * 100).toFixed(2)}%` : "";
  const validText = validUntil ? `\n⏳ Valid Until: ${validUntil}` : "";

  return sendWhatsAppMessage(
    to,
    "credit_approval_notice",
    "en",
    [
      {
        type: "body",
        parameters: [
          { type: "text", text: hotelName },
          { type: "text", text: factoringPartner },
          { type: "text", text: limitFormatted },
        ],
      },
    ],
      `🏦 *Credit Line Approved — HotelsVendors*\n\n` +
      `Hotel: ${hotelName}\n` +
      `Partner: ${factoringPartner}\n` +
      `Approved Limit: ${limitFormatted}` +
      rateText +
      validText +
      `\n\nAccess your dashboard:\n${APP_URL}/dashboard/factoring`
  );
}

// ─── Export ────────────────────────────────────────────────────────

export const whatsappBroker = {
  sendOrderConfirmation,
  sendEtaRejectionAlert,
  sendCreditApprovalNotice,
};
