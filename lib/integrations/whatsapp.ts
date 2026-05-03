/**
 * WhatsApp / Twilio Integration
 * Sends WhatsApp messages to hotels and suppliers
 * Used by the Outreach Agent and Onboarding Guide
 */

import { prisma } from "@/lib/prisma";
import { recordSwarmEvent } from "@/lib/swarm/monitoring";

interface WhatsAppMessage {
  to: string; // E.164 format: +201234567890
  body: string;
  templateName?: string; // For Twilio templates
  templateData?: Record<string, string>;
}

interface WhatsAppResult {
  success: boolean;
  messageSid?: string;
  error?: string;
  deliveredAt?: Date;
}

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., whatsapp:+14155238886

/**
 * Send a WhatsApp message via Twilio
 */
export async function sendWhatsApp(
  message: WhatsAppMessage,
  metadata: {
    agentId: string;
    agentName: string;
    leadId?: string;
    jobId?: string;
  }
): Promise<WhatsAppResult> {
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
    return {
      success: false,
      error: "Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER",
    };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");

    const params = new URLSearchParams();
    params.append("From", TWILIO_WHATSAPP_NUMBER);
    params.append("To", `whatsapp:${message.to}`);
    params.append("Body", message.body);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = data.message || `Twilio error: ${res.status}`;
      await logOutreach("whatsapp", message, metadata, { success: false, error });
      return { success: false, error };
    }

    await logOutreach("whatsapp", message, metadata, {
      success: true,
      messageSid: data.sid,
    });

    return {
      success: true,
      messageSid: data.sid,
      deliveredAt: new Date(),
    };
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    await logOutreach("whatsapp", message, metadata, { success: false, error: err });
    return { success: false, error: err };
  }
}

/**
 * Send bulk WhatsApp messages (with rate limiting)
 */
export async function sendBulkWhatsApp(
  messages: Array<WhatsAppMessage & { metadata: { agentId: string; agentName: string; leadId?: string; jobId?: string } }>,
  delayMs: number = 1000
): Promise<WhatsAppResult[]> {
  const results: WhatsAppResult[] = [];
  for (const msg of messages) {
    const result = await sendWhatsApp(msg, msg.metadata);
    results.push(result);
    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return results;
}

/**
 * Log every WhatsApp message to the OutreachLog table
 */
async function logOutreach(
  channel: string,
  message: WhatsAppMessage,
  metadata: { agentId: string; agentName: string; leadId?: string; jobId?: string },
  result: { success: boolean; messageSid?: string; error?: string }
): Promise<void> {
  try {
    await prisma.outreachLog.create({
      data: {
        channel,
        messageType: "welcome",
        body: message.body.substring(0, 500),
        recipientPhone: message.to,
        sentByAgent: metadata.agentId,
        agentName: metadata.agentName,
        jobId: metadata.jobId,
        status: result.success ? "SENT" : "FAILED",
        sentAt: result.success ? new Date() : undefined,
        autoSent: true,
      },
    });
  } catch (e) {
    console.error("[WhatsApp] Failed to log outreach:", e);
  }

  if (!result.success) {
    await recordSwarmEvent("whatsapp_failed", "WARNING", {
      agentId: metadata.agentId,
      leadId: metadata.leadId,
      error: result.error,
    });
  }
}

/**
 * Format Egyptian phone number to E.164
 */
export function formatEgyptianPhone(phone: string): string | null {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Egyptian numbers: 01xxxxxxxxx -> +201xxxxxxxxx
  if (digits.length === 11 && digits.startsWith("01")) {
    return `+20${digits.substring(1)}`;
  }

  // Already has country code
  if (digits.length === 12 && digits.startsWith("20")) {
    return `+${digits}`;
  }

  if (digits.length === 13 && digits.startsWith("+20")) {
    return digits;
  }

  return null;
}

/**
 * Check if Twilio is configured
 */
export function isWhatsAppConfigured(): boolean {
  return Boolean(TWILIO_SID && TWILIO_TOKEN && TWILIO_WHATSAPP_NUMBER);
}
