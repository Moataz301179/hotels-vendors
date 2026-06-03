/**
 * Swarm Monitoring & Event System
 * Tracks agent health, alerts on exceptions, generates dashboards
 */

import { prisma } from "@/lib/prisma";

interface EventInput {
  eventType: string;
  severity: "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  squad?: string;
  agentId?: string;
  jobId?: string;
  leadId?: string;
  message?: string;
  payload?: Record<string, unknown>;
}

/**
 * Record a swarm event to the database
 */
export async function recordSwarmEvent(
  eventType: string,
  severity: EventInput["severity"],
  context: {
    squad?: string;
    agentId?: string;
    jobId?: string;
    leadId?: string;
    [key: string]: unknown;
  } = {}
): Promise<void> {
  const { squad, agentId, jobId, leadId, ...rest } = context;

  await prisma.swarmEvent.create({
    data: {
      eventType,
      severity,
      squad: squad || null,
      agentId: agentId || null,
      jobId: jobId || null,
      leadId: leadId || null,
      message: context.message as string || eventType,
      payload: JSON.stringify(rest),
    },
  });

  // Console logging for immediate visibility
  const emoji = {
    DEBUG: "🔍",
    INFO: "ℹ️",
    WARNING: "⚠️",
    ERROR: "❌",
    CRITICAL: "🚨",
  }[severity];

  console.log(`[SwarmEvent] ${emoji} ${severity} | ${eventType} | ${squad || "-"} | ${agentId || "-"}`);

  // Alert on critical events
  if (severity === "CRITICAL" || severity === "ERROR") {
    await sendAlert(eventType, severity, context);
  }
}

/**
 * Send alert for critical events
 * (Hook into your notification system — email, Slack, WhatsApp)
 */
async function sendAlert(
  eventType: string,
  severity: string,
  context: Record<string, unknown>
): Promise<void> {
  // TODO: Integrate with your notification channel
  // For now, log aggressively
  console.error(`\n🚨 SWARM ALERT 🚨`);
  console.error(`Type: ${eventType}`);
  console.error(`Severity: ${severity}`);
  console.error(`Context:`, JSON.stringify(context, null, 2));
  console.error(`Time: ${new Date().toISOString()}`);
  console.error(`🚨 END ALERT 🚨\n`);
}

/**
 * Get swarm health dashboard data
 */
export async function getSwarmHealth(hours: number = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const [
    totalJobs,
    completedJobs,
    failedJobs,
    pendingJobs,
    waitingApproval,
    events,
    modelHealth,
  ] = await Promise.all([
    prisma.swarmJob.count({ where: { createdAt: { gte: since } } }),
    prisma.swarmJob.count({ where: { status: "COMPLETED", createdAt: { gte: since } } }),
    prisma.swarmJob.count({ where: { status: "FAILED", createdAt: { gte: since } } }),
    prisma.swarmJob.count({ where: { status: { in: ["PENDING", "SCHEDULED"] } } }),
    prisma.swarmJob.count({ where: { status: "WAITING_APPROVAL" } }),
    prisma.swarmEvent.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.modelHealth.findMany(),
  ]);

  const successRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

  const eventsBySeverity = events.reduce(
    (acc, e) => {
      acc[e.severity] = (acc[e.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    summary: {
      totalJobs,
      completedJobs,
      failedJobs,
      pendingJobs,
      waitingApproval,
      successRate,
    },
    eventsBySeverity,
    recentEvents: events.slice(0, 20),
    modelHealth,
  };
}

/**
 * Get squad performance metrics
 */
export async function getSquadPerformance(hours: number = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const jobs = await prisma.swarmJob.groupBy({
    by: ["squad", "status"],
    where: { createdAt: { gte: since } },
    _count: { id: true },
  });

  const squadStats: Record<
    string,
    { total: number; completed: number; failed: number; avgDurationMs: number }
  > = {};

  for (const job of jobs) {
    const squad = job.squad;
    if (!squadStats[squad]) {
      squadStats[squad] = { total: 0, completed: 0, failed: 0, avgDurationMs: 0 };
    }
    squadStats[squad].total += job._count.id;
    if (job.status === "COMPLETED") squadStats[squad].completed += job._count.id;
    if (job.status === "FAILED") squadStats[squad].failed += job._count.id;
  }

  // Calculate average durations
  const durations = await prisma.swarmJob.groupBy({
    by: ["squad"],
    where: { status: "COMPLETED", durationMs: { not: null }, createdAt: { gte: since } },
    _avg: { durationMs: true },
  });

  for (const d of durations) {
    if (squadStats[d.squad]) {
      squadStats[d.squad].avgDurationMs = Math.round(d._avg.durationMs || 0);
    }
  }

  return squadStats;
}

/**
 * Acknowledge a critical event
 */
export async function acknowledgeEvent(eventId: string, userId: string): Promise<void> {
  await prisma.swarmEvent.update({
    where: { id: eventId },
    data: {
      acknowledgedAt: new Date(),
      acknowledgedBy: userId,
      alertSent: true,
    },
  });
}
