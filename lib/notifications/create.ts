import { prisma } from "@/lib/prisma";

export type NotificationType =
  | "ORDER_CREATED"
  | "ORDER_APPROVED"
  | "ORDER_REJECTED"
  | "ORDER_CONFIRMED_BY_SUPPLIER"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "ORDER_DISPUTED"
  | "ORDER_CANCELLED"
  | "RFQ_PUBLISHED"
  | "RFX_RESPONSE_RECEIVED"
  | "RFX_AWARDED"
  | "OTP_GENERATED"
  | "DELIVERY_CONFIRMED"
  | "DELIVERY_FAILED"
  | "INVOICE_SUBMITTED"
  | "INVOICE_VALIDATED"
  | "INVOICE_DISPUTED"
  | "INVOICE_PAID"
  | "FACTORING_REQUESTED"
  | "FACTORING_BID_RECEIVED"
  | "FACTORING_ACCEPTED"
  | "FACTORING_DISBURSED"
  | "RETURN_REQUESTED"
  | "RETURN_APPROVED";

type Priority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

interface CreateNotificationInput {
  userId: string;
  tenantId: string;
  type: NotificationType;
  title: string;
  body: string;
  priority?: Priority;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
}

export async function createNotification(input: CreateNotificationInput): Promise<void> {
  await prisma.notification.create({
    data: {
      userId: input.userId,
      tenantId: input.tenantId,
      type: input.type,
      title: input.title,
      body: input.body,
      priority: input.priority ?? "NORMAL",
      entityType: input.entityType,
      entityId: input.entityId,
      actionUrl: input.actionUrl,
    },
  });
}

export async function notifyStakeholders(
  inputs: CreateNotificationInput[]
): Promise<void> {
  if (inputs.length === 0) return;
  await prisma.notification.createMany({ data: inputs });
}

export async function notifyOrderStakeholders(
  orderId: string,
  tenantId: string,
  type: "ORDER_APPROVED" | "ORDER_REJECTED" | "ORDER_CANCELLED",
  actorName: string,
  orderNumber: string,
  reason?: string
): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId, tenantId },
    select: {
      hotelId: true,
      supplierId: true,
      requesterId: true,
      hotel: { select: { name: true } },
      supplier: { select: { name: true } },
    },
  });
  if (!order) return;

  const verb = type === "ORDER_APPROVED" ? "approved" : type === "ORDER_REJECTED" ? "rejected" : "cancelled";
  const title = `Order ${verb}`;
  const body = `Order ${orderNumber} was ${verb} by ${actorName}${reason ? `: ${reason}` : ""}`;
  const userIds: string[] = [];

  if (order.hotelId) {
    const hotelUsers = await prisma.user.findMany({
      where: { tenantId, hotelId: order.hotelId },
      select: { id: true },
    });
    for (const u of hotelUsers) userIds.push(u.id);
  }

  if (order.supplierId) {
    const supplierUsers = await prisma.user.findMany({
      where: { tenantId, supplierId: order.supplierId },
      select: { id: true },
    });
    for (const u of supplierUsers) {
      if (!userIds.includes(u.id)) userIds.push(u.id);
    }
  }

  if (order.requesterId && !userIds.includes(order.requesterId)) {
    userIds.push(order.requesterId);
  }

  const notifications = userIds.map((uid) => ({
    userId: uid,
    tenantId,
    type,
    title,
    body,
    priority: "NORMAL" as Priority,
    entityType: "ORDER" as const,
    entityId: orderId,
    actionUrl: `/dashboard/orders/${orderId}`,
  }));

  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
  }
}
