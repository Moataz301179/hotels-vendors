import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const checks: Record<string, { status: "ok" | "error"; latencyMs: number; message?: string }> = {};

  // Database check
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: "ok", latencyMs: Date.now() - dbStart };
  } catch (error) {
    checks.database = { status: "error", latencyMs: Date.now() - dbStart, message: "Connection failed" };
    logger.error({ error }, "Health check: database connection failed");
  }

  // Redis check
  const redisStart = Date.now();
  try {
    const redis = getRedis();
    if (!redis) {
      checks.redis = { status: "ok", latencyMs: 0, message: "No Redis URL configured (using memory fallback)" };
    } else {
      await redis.ping();
      checks.redis = { status: "ok", latencyMs: Date.now() - redisStart };
    }
  } catch (error) {
    checks.redis = { status: "error", latencyMs: Date.now() - redisStart, message: "Connection failed" };
    logger.error({ error }, "Health check: redis connection failed");
  }

  const allHealthy = Object.values(checks).every((c) => c.status === "ok");
  const totalLatency = Date.now() - start;

  // Failure alerting: notify owner (Telegram/WhatsApp via configurable webhook)
  // when a critical dependency is down — solo-founder-ops, no paid monitoring needed.
  if (!allHealthy) {
    const failing = Object.entries(checks).filter(([, c]) => c.status === "error").map(([k]) => k);
    const alertUrl = process.env.HEALTH_ALERT_WEBHOOK; // Telegram bot API / WhatsApp / Slack hook
    if (alertUrl) {
      const payload = {
        text: `⚠️ [HotelsVendors] health alert ${new Date().toISOString()}\nfailed: ${failing.join(", ")}\nchecks: ${JSON.stringify(checks)}`,
      };
      fetch(alertUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
    }
  }

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      latencyMs: totalLatency,
      checks,
    },
    { status: allHealthy ? 200 : 503 }
  );
}
