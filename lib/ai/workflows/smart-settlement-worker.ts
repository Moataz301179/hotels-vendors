/**
 * Smart Settlement Worker
 * Polls for delivered-but-unsettled orders and routes them through settlement.
 * Lazy-imports Prisma to avoid webpack tracing Node built-ins at compile time.
 */

import type { PrismaClient } from "@prisma/client";
import { processSettlements, type SettlementOrder } from "./smart-settlement";

const POLL_INTERVAL_MS = 60_000;
const BATCH_SIZE = 50;

let timer: ReturnType<typeof setInterval> | null = null;
let running = false;
let prisma: PrismaClient | null = null;

async function getPrisma(): Promise<PrismaClient> {
  if (!prisma) {
    const { prisma: p } = await import("@/lib/prisma");
    prisma = p;
  }
  return prisma;
}

async function tick(): Promise<void> {
  if (running) return;
  running = true;

  try {
    const db = await getPrisma();
    const dueOrders = await db.order.findMany({
      where: {
        status: "DELIVERED",
      },
      take: BATCH_SIZE,
      include: {
        invoices: true,
        supplier: true,
      },
    });

    if (dueOrders.length === 0) return;

    const orders: SettlementOrder[] = dueOrders.map((o) => ({
      orderId: o.id,
      invoiceId: o.invoices?.[0]?.id ?? "",
      supplierId: o.supplierId,
      supplierName: o.supplier?.name ?? "Unknown",
      amountCents: Math.round((o.total ?? 0) * 100),
      deliveredAt: o.deliveryDate?.toISOString() ?? new Date().toISOString(),
      termsDays: 60,
      factoringEligible: false,
    }));

    const results = await processSettlements(orders);

    for (const r of results) {
      if (r.status === "settled") {
        await db.order
          .update({ where: { id: r.orderId }, data: { paymentGuaranteeSetAt: new Date() } })
          .catch(() => undefined);
      }
    }
  } catch (err) {
    console.error("[SmartSettlementWorker] tick failed:", err);
  } finally {
    running = false;
  }
}

export async function startSmartSettlementWorker(): Promise<void> {
  if (timer) return;
  await tick();
  timer = setInterval(() => {
    void tick();
  }, POLL_INTERVAL_MS);
}

export function stopSmartSettlementWorker(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
