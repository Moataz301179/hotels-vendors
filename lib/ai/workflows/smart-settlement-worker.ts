/**
 * Smart Settlement Worker
 * Polls for delivered-but-unsettled orders and routes them through settlement.
 */

import { prisma } from "@/lib/prisma";
import { processSettlements, type SettlementOrder } from "./smart-settlement";

const POLL_INTERVAL_MS = 60_000;
const BATCH_SIZE = 50;

let timer: ReturnType<typeof setInterval> | null = null;
let running = false;

async function tick(): Promise<void> {
  if (running) return;
  running = true;

  try {
    const dueOrders = await prisma.order.findMany({
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
      amountCents: Math.round((o.total?.toNumber() ?? 0) * 100),
      deliveredAt: o.deliveryDate?.toISOString() ?? new Date().toISOString(),
      termsDays: 60,
      factoringEligible: false,
    }));

    const results = await processSettlements(orders);

    for (const r of results) {
      if (r.status === "settled") {
        await prisma.order
          .update({ where: { id: r.orderId }, data: { paymentGuaranteeSetAt: new Date() } })
          .catch(() => undefined);
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
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
