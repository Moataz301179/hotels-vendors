/**
 * Webhook Delivery Engine
 * Delivers notifications to partner URLs with HMAC signature verification,
 * retries, and exponential backoff via BullMQ.
 */

import { Queue, Worker } from "bullmq";
import { getRedisConnection } from "@/lib/queues/connection";
import { prisma } from "@/lib/prisma";
import { createHmac } from "crypto";

// ── Queue ──

export const webhookQueue = new Queue("webhook-delivery", {
  connection: getRedisConnection(),
});

export interface WebhookJobPayload {
  subscriptionId: string;
  url: string;
  event: string;
  payload: Record<string, unknown>;
  secret?: string | null;
  headers?: string | null;
  tenantId: string;
  attempt?: number;
}

// ── Enqueue ──

export async function enqueueWebhookDelivery(payload: WebhookJobPayload) {
  return webhookQueue.add("deliver-webhook", payload, {
    attempts: 5,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 500 },
    removeOnFail: { count: 100 },
  });
}

// ── Worker ──

export function createWebhookWorker(): Worker {
  return new Worker<WebhookJobPayload>(
    "webhook-delivery",
    async (job) => {
      const { subscriptionId, url, event, payload, secret, headers, tenantId } = job.data;

      const body = JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data: payload,
      });

      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Webhook-Event": event,
        "X-Webhook-Id": job.id || "unknown",
        "X-Webhook-Attempt": String((job.attemptsMade || 0) + 1),
        ...(headers ? JSON.parse(headers) : {}),
      };

      if (secret) {
        const signature = createHmac("sha256", secret).update(body).digest("hex");
        requestHeaders["X-Webhook-Signature"] = `sha256=${signature}`;
      }

      const startTime = Date.now();
      let responseText = "";
      let statusCode = 0;

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: requestHeaders,
          body,
        });

        responseText = await res.text();
        statusCode = res.status;

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${responseText.slice(0, 200)}`);
        }

        // Success — update subscription stats
        await prisma.webhookSubscription.update({
          where: { id: subscriptionId },
          data: {
            lastSuccessAt: new Date(),
            failureCount: 0,
          },
        });

        await logWebhookDelivery({
          tenantId,
          url,
          event,
          payload: body,
          status: "DELIVERED",
          response: `${statusCode} in ${Date.now() - startTime}ms`,
        });

        return { delivered: true, statusCode };
      } catch (err: any) {
        // Update failure stats
        await prisma.webhookSubscription.update({
          where: { id: subscriptionId },
          data: {
            lastFailureAt: new Date(),
            failureCount: { increment: 1 },
          },
        });

        await logWebhookDelivery({
          tenantId,
          url,
          event,
          payload: body,
          status: "FAILED",
          error: err.message,
          response: `${statusCode} ${responseText.slice(0, 200)}`,
        });

        throw err; // Let BullMQ retry
      }
    },
    { connection: getRedisConnection(), concurrency: 5 }
  );
}

// ── Helpers ──

async function logWebhookDelivery(params: {
  tenantId: string;
  url: string;
  event: string;
  payload: string;
  status: string;
  response?: string;
  error?: string;
}) {
  return prisma.deliveryLog.create({
    data: {
      tenantId: params.tenantId,
      channel: "webhook",
      recipient: params.url,
      type: params.event,
      payload: params.payload,
      status: params.status,
      response: params.response,
      error: params.error,
      sentAt: params.status === "DELIVERED" ? new Date() : undefined,
      failedAt: params.status === "FAILED" ? new Date() : undefined,
    },
  });
}

// ── Trigger from notification engine ──

export async function triggerWebhooks(params: {
  tenantId: string;
  event: string;
  payload: Record<string, unknown>;
}) {
  const subs = await prisma.webhookSubscription.findMany({
    where: {
      tenantId: params.tenantId,
      active: true,
    },
  });

  const eventMatch = (subEvents: string) =>
    subEvents.split(",").some((e) => e.trim() === params.event || e.trim() === "*");

  for (const sub of subs) {
    if (!eventMatch(sub.events)) continue;

    // Disable after 20 consecutive failures
    if (sub.failureCount >= 20) {
      await prisma.webhookSubscription.update({
        where: { id: sub.id },
        data: { active: false },
      });
      continue;
    }

    await enqueueWebhookDelivery({
      subscriptionId: sub.id,
      url: sub.url,
      event: params.event,
      payload: params.payload,
      secret: sub.secret,
      headers: sub.headers,
      tenantId: params.tenantId,
    });
  }
}
