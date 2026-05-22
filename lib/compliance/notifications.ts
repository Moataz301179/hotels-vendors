/**
 * Notification Engine
 * Creates and manages notifications for score changes, ETA events,
 * certificate expirations, and factoring status updates.
 */

import { prisma } from "@/lib/prisma";
import type { NotificationType, NotificationPriority } from "@prisma/client";

export interface NotificationInput {
  userId?: string;
  tenantId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  priority?: NotificationPriority;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a notification.
 */
export async function createNotification(input: NotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      tenantId: input.tenantId,
      type: input.type,
      title: input.title,
      message: input.message,
      entityType: input.entityType,
      entityId: input.entityId,
      priority: input.priority || "MEDIUM",
      actionUrl: input.actionUrl,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });
}

/**
 * Get notifications for a user (unread first, then read).
 */
export async function getUserNotifications(userId: string, limit = 50) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: [
      { readAt: { sort: "asc", nulls: "first" } },
      { createdAt: "desc" },
    ],
    take: limit,
  });
}

/**
 * Get unread count for a user.
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, readAt: null },
  });
}

/**
 * Mark notifications as read.
 */
export async function markAsRead(notificationIds: string[], userId: string) {
  return prisma.notification.updateMany({
    where: { id: { in: notificationIds }, userId },
    data: { readAt: new Date() },
  });
}

/**
 * Mark all as read for a user.
 */
export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}

// ── Score Change Notifications ──

const SCORE_CHANGE_THRESHOLD = 10; // notify if score changes by 10+ points
const TIER_CHANGE_ALWAYS_NOTIFY = true; // always notify if risk tier changes

/**
 * Check if a score change warrants a notification and create one if so.
 */
export async function notifyOnScoreChange(
  supplierId: string,
  tenantId: string,
  newScore: { scoreValue: number; riskTier?: string | null; source: string }
) {
  // Find previous score from same source
  const previous = await prisma.companyScore.findFirst({
    where: {
      supplierId,
      source: newScore.source as any,
      NOT: { assessedAt: { gte: new Date(Date.now() - 60000) } }, // not the one we just created
    },
    orderBy: { assessedAt: "desc" },
    select: { scoreValue: true, riskTier: true },
  });

  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    select: { name: true, taxId: true },
  });

  if (!supplier) return;

  const prevValue = previous?.scoreValue ?? null;
  const prevTier = previous?.riskTier ?? null;
  const newTier = newScore.riskTier ?? null;

  const scoreDelta = prevValue !== null ? Math.abs(newScore.scoreValue - prevValue) : 0;
  const tierChanged = prevTier !== null && prevTier !== newTier;

  // Determine if notification is warranted
  let shouldNotify = false;
  let priority: NotificationPriority = "MEDIUM";
  let title = "";
  let message = "";

  if (tierChanged && TIER_CHANGE_ALWAYS_NOTIFY) {
    shouldNotify = true;
    priority = newTier === "CRITICAL" || newTier === "HIGH" ? "CRITICAL" : "HIGH";
    title = `Risk tier changed for ${supplier.name}`;
    message = `${supplier.name} (${supplier.taxId}) risk tier moved from ${prevTier} to ${newTier} based on ${newScore.source.replace(/_/g, " ")}. Score: ${newScore.scoreValue}.`;
  } else if (prevValue !== null && scoreDelta >= SCORE_CHANGE_THRESHOLD) {
    shouldNotify = true;
    priority = scoreDelta >= 25 ? "HIGH" : "MEDIUM";
    const direction = newScore.scoreValue > prevValue ? "improved" : "declined";
    title = `Score ${direction} for ${supplier.name}`;
    message = `${supplier.name} (${supplier.taxId}) score ${direction} by ${scoreDelta} points (${prevValue} → ${newScore.scoreValue}) via ${newScore.source.replace(/_/g, " ")}.`;
  }

  if (!shouldNotify) return;

  // Find users who should be notified (admins + supplier users)
  const adminUsers = await prisma.user.findMany({
    where: {
      tenantId,
      OR: [{ platformRole: "ADMIN" }, { supplierId }],
    },
    select: { id: true },
  });

  for (const user of adminUsers) {
    await createNotification({
      userId: user.id,
      tenantId,
      type: "SCORE_CHANGED",
      title,
      message,
      entityType: "SUPPLIER",
      entityId: supplierId,
      priority,
      actionUrl: `/admin/compliance/scores`,
      metadata: {
        previousScore: prevValue,
        newScore: newScore.scoreValue,
        previousTier: prevTier,
        newTier,
        source: newScore.source,
        supplierName: supplier.name,
        supplierTaxId: supplier.taxId,
      },
    });
  }
}

/**
 * Notify when a certificate is expiring soon.
 */
export async function notifyCertificateExpiring(
  certificateId: string,
  tenantId: string,
  daysUntilExpiry: number
) {
  const cert = await prisma.supplierCertificate.findUnique({
    where: { id: certificateId },
    include: { Supplier: { select: { name: true, taxId: true } } },
  });

  if (!cert || !cert.Supplier) return;

  const users = await prisma.user.findMany({
    where: {
      tenantId,
      OR: [{ platformRole: "ADMIN" }, { supplierId: cert.supplierId }],
    },
    select: { id: true },
  });

  for (const user of users) {
    await createNotification({
      userId: user.id,
      tenantId,
      type: "CERTIFICATE_EXPIRING",
      title: `e-Seal expires in ${daysUntilExpiry} days`,
      message: `${cert.Supplier.name}'s ${cert.provider || "digital"} certificate expires on ${cert.expiresAt?.toLocaleDateString("en-GB")}. Renew to avoid ETA submission failures.`,
      entityType: "SUPPLIER_CERTIFICATE",
      entityId: certificateId,
      priority: daysUntilExpiry <= 7 ? "CRITICAL" : daysUntilExpiry <= 30 ? "HIGH" : "MEDIUM",
      actionUrl: `/supplier/compliance`,
    });
  }
}
