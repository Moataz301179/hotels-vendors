/**
 * External Alerting — Hotels Vendors
 * HIGH FIX: Slack + email alerting for operational incidents.
 *
 * Alert levels:
 *  - CRITICAL: immediate notification (Slack + email)
 *  - HIGH: within 1 hour (Slack only)
 *  - MEDIUM: daily digest (email only)
 *
 * Environment variables:
 *  - SLACK_WEBHOOK_URL: Slack incoming webhook for alerts channel
 *  - ALERT_EMAIL_TO: Recipient email for high/critical alerts
 *  - ALERT_EMAIL_FROM: Sender email (default: alerts@hotelsvendors.com)
 *  - SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS: SMTP config for email
 *  - APP_ENV: "production" | "staging" | "development"
 */

import { logger } from "@/lib/logger";

// ── Types ──

export type AlertLevel = "CRITICAL" | "HIGH" | "MEDIUM";

export interface AlertPayload {
  level: AlertLevel;
  title: string;
  message: string;
  service?: string;
  environment?: string;
  details?: Record<string, unknown>;
  timestamp?: string;
}

// ── Slack ──

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

const LEVEL_EMOJI: Record<AlertLevel, string> = {
  CRITICAL: "🚨",
  HIGH: "⚠️",
  MEDIUM: "ℹ️",
};

const LEVEL_COLOR: Record<AlertLevel, string> = {
  CRITICAL: "#dc3545",
  HIGH: "#fd7e14",
  MEDIUM: "#0d6efd",
};

async function sendSlackAlert(payload: AlertPayload): Promise<boolean> {
  if (!SLACK_WEBHOOK_URL) {
    logger.debug("Slack webhook not configured — skipping Slack alert");
    return false;
  }

  const emoji = LEVEL_EMOJI[payload.level];
  const color = LEVEL_COLOR[payload.level];
  const env = payload.environment || process.env.APP_ENV || "production";
  const service = payload.service || "hotels-vendors";

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${emoji} [${payload.level}] ${payload.title}`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Service:*\n${service}` },
        { type: "mrkdwn", text: `*Environment:*\n${env}` },
        { type: "mrkdwn", text: `*Time:*\n${payload.timestamp || new Date().toISOString()}` },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: payload.message,
      },
    },
  ];

  if (payload.details && Object.keys(payload.details).length > 0) {
    const detailText = Object.entries(payload.details)
      .map(([k, v]) => `• *${k}:* \`${typeof v === "string" ? v : JSON.stringify(v)}\``)
      .join("\n");

    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: detailText },
    });
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attachments: [
          {
            color,
            blocks,
          },
        ],
      }),
    });

    if (!response.ok) {
      logger.error({ status: response.status }, "Slack alert failed");
      return false;
    }

    logger.info({ level: payload.level, title: payload.title }, "Slack alert sent");
    return true;
  } catch (err) {
    logger.error({ err }, "Slack alert failed");
    return false;
  }
}

// ── Email ──

async function sendEmailAlert(payload: AlertPayload): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toEmail = process.env.ALERT_EMAIL_TO;
  const fromEmail = process.env.ALERT_EMAIL_FROM || "alerts@hotelsvendors.com";

  if (!smtpHost || !toEmail) {
    logger.debug("SMTP or alert email not configured — skipping email alert");
    return false;
  }

  const env = payload.environment || process.env.APP_ENV || "production";
  const service = payload.service || "hotels-vendors";

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${LEVEL_COLOR[payload.level]}; color: white; padding: 16px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">${LEVEL_EMOJI[payload.level]} [${payload.level}] ${payload.title}</h2>
      </div>
      <div style="border: 1px solid #ddd; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Service</td><td style="padding: 8px;">${service}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Environment</td><td style="padding: 8px;">${env}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Time</td><td style="padding: 8px;">${payload.timestamp || new Date().toISOString()}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p style="white-space: pre-wrap;">${payload.message}</p>
        ${
          payload.details
            ? `<pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 13px;">${JSON.stringify(payload.details, null, 2)}</pre>`
            : ""
        }
      </div>
    </div>
  `;

  try {
    // Use nodemailer if available, otherwise log
    const nodemailer = await import("nodemailer").catch(() => null);
    if (!nodemailer) {
      logger.warn("nodemailer not installed — falling back to console for email alert");
      console.error(`[EMAIL-ALERT] [${payload.level}] ${payload.title}: ${payload.message}`);
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
    });

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: `[${payload.level}] ${service} — ${payload.title}`,
      html: htmlBody,
      text: `[${payload.level}] ${payload.title}\n\nService: ${service}\nEnvironment: ${env}\nTime: ${payload.timestamp || new Date().toISOString()}\n\n${payload.message}\n\n${payload.details ? JSON.stringify(payload.details, null, 2) : ""}`,
    });

    logger.info({ level: payload.level, title: payload.title }, "Email alert sent");
    return true;
  } catch (err) {
    logger.error({ err }, "Email alert failed");
    return false;
  }
}

// ── Public API ──

/**
 * Send an alert via all configured channels (Slack + email).
 */
export async function sendAlert(payload: AlertPayload): Promise<void> {
  const enrichedPayload: AlertPayload = {
    service: "hotels-vendors",
    environment: process.env.APP_ENV || process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // Always log locally
  logger[payload.level === "CRITICAL" ? "fatal" : payload.level === "HIGH" ? "error" : "warn"](
    { alert: enrichedPayload },
    `Alert [${payload.level}]: ${payload.title}`
  );

  // Send in parallel — don't block on failures
  await Promise.allSettled([sendSlackAlert(enrichedPayload), sendEmailAlert(enrichedPayload)]);
}

// ── Convenience functions ──

export function alertCritical(title: string, message: string, details?: Record<string, unknown>) {
  return sendAlert({ level: "CRITICAL", title, message, details });
}

export function alertHigh(title: string, message: string, details?: Record<string, unknown>) {
  return sendAlert({ level: "HIGH", title, message, details });
}

export function alertMedium(title: string, message: string, details?: Record<string, unknown>) {
  return sendAlert({ level: "MEDIUM", title, message, details });
}

// ── Pre-built alert templates ──

export const alerts = {
  databaseDown: (error?: string) =>
    alertCritical("Database Connection Lost", "PostgreSQL is unreachable. All write operations are failing.", {
      error,
    }),

  redisDown: (error?: string) =>
    alertHigh("Redis Connection Lost", "Falling back to in-memory storage. Rate limits and sessions are degraded.", {
      error,
    }),

  etaSubmissionFailed: (invoiceId: string, error: string) =>
    alertHigh("ETA Submission Failed", `Invoice ${invoiceId} moved to dead-letter queue after max retries.`, {
      invoiceId,
      error,
    }),

  healthCheckFailed: (checks: Record<string, unknown>) =>
    alertCritical("Health Check Failed", "One or more critical services are unhealthy.", checks),

  highMemoryUsage: (usageMB: number, limitMB: number) =>
    alertMedium("High Memory Usage", `Memory at ${usageMB}MB / ${limitMB}MB (${Math.round((usageMB / limitMB) * 100)}%).`, {
      usageMB,
      limitMB,
    }),

  securityIncident: (event: string, details: Record<string, unknown>) =>
    alertCritical("Security Incident", event, details),

  deployCompleted: (version: string, commit: string) =>
    alertMedium("Deployment Completed", `Version ${version} deployed from commit ${commit}.`, { version, commit }),

  deployFailed: (error: string) =>
    alertCritical("Deployment Failed", "Production deployment encountered an error.", { error }),
};
