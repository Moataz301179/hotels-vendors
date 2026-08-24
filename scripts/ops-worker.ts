/**
 * Operations Worker — heartbeat that makes the hospitality cycle EXECUTE:
 *   1. order-processing queue (Authority Matrix eval, confirm, payment gate)
 *   2. scheduled-orders runner — materializes standing hotel orders at nextRunAt
 * Run: npx tsx scripts/ops-worker.ts   (PM2: hv-ops-worker)
 */
import { createOrderWorker } from "@/lib/orders/queue";
import { prisma } from "@/lib/prisma";

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL && !process.env.REDIS_HOST) {
  console.log("[ops] Redis not configured — ops worker not started (graceful no-op).");
  process.exit(0);
}

const connection = {
  host: (REDIS_URL ? new URL(REDIS_URL).hostname : process.env.REDIS_HOST) || "localhost",
  port: REDIS_URL ? Number(new URL(REDIS_URL).port || "6379") : Number(process.env.REDIS_PORT || "6380"),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
};

/* 1. Order-processing worker (reuses canonical lib worker) */
const orderWorker = createOrderWorker();
orderWorker.on("completed", (j) => console.log(`[ops:order] done ${j.id} ${j.data.action}`));
orderWorker.on("failed", (j, err) => console.error(`[ops:order] FAIL ${j?.id}: ${err.message}`));

/* 2. Scheduled-orders runner — every 5 min, idempotent via lastRunAt */
async function runScheduledOrders(): Promise<{ created: number; skipped: number }> {
  const now = new Date();
  const due = await prisma.scheduledOrder.findMany({
    where: { status: "ACTIVE", nextRunAt: { lte: now } },
    include: { items: { include: { product: true } } },
    take: 50,
  });

  let created = 0;
  let skipped = 0;

  for (const sched of due) {
    try {
      const reqUser = await prisma.user.findFirst({
        where: { tenantId: sched.tenantId, role: { in: ["ADMIN", "HOTEL_MANAGER", "MANAGER"] } },
        select: { id: true },
      });
      if (!reqUser) { skipped++; continue; }

      const recent = await prisma.order.findFirst({
        where: {
          scheduledOrderId: sched.id,
          createdAt: { gte: sched.lastRunAt ?? new Date(now.getTime() - 23 * 3600 * 1000) },
        },
      });
      if (recent) { skipped++; continue; }

      const orderNumber = `PO-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${Date.now().toString().slice(-8)}`;
      const subtotal = sched.items.reduce(
        (sum, it) => sum + Number(it.unitPrice ?? it.product?.basePrice ?? 0) * it.quantity,
        0
      );

      const order = await prisma.order.create({
        data: {
          orderNumber,
          status: sched.autoSubmit ? "PENDING_APPROVAL" : "DRAFT",
          hotelId: sched.hotelId,
          supplierId: sched.supplierId,
          propertyId: sched.propertyId,
          outletId: sched.outletId,
          requesterId: reqUser.id,
          tenantId: sched.tenantId,
          scheduledOrderId: sched.id,
          subtotal,
          total: subtotal,
          items: {
            create: sched.items.map((it) => ({
              productId: it.productId,
              quantity: it.quantity,
              unitPrice: it.unitPrice ?? it.product?.basePrice,
              total: Number(it.unitPrice ?? it.product?.basePrice ?? 0) * it.quantity,
            })),
          },
        },
      });

      await prisma.scheduledOrder.update({
        where: { id: sched.id },
        data: { lastRunAt: now, nextRunAt: computeNextRun(sched.nextRunAt) },
      });

      created++;
      console.log(`[ops:sched] CREATED ${orderNumber} from schedule ${sched.name}`);
    } catch (err) {
      skipped++;
      console.error(`[ops:sched] FAIL schedule ${sched.id}: ${(err as Error).message}`);
    }
  }
  return { created, skipped };
}

function computeNextRun(prev: Date): Date {
  const next = new Date(prev);
  next.setDate(next.getDate() + 1);
  return next;
}

const SCHED_INTERVAL_MS = 5 * 60 * 1000;
let running = false;
setInterval(async () => {
  if (running) return;
  running = true;
  try {
    const res = await runScheduledOrders();
    if (res.created || res.skipped) console.log(`[ops:sched] tick: ${res.created} created, ${res.skipped} skipped`);
  } catch (err) {
    console.error(`[ops:sched] tick failed: ${(err as Error).message}`);
  } finally {
    running = false;
  }
}, SCHED_INTERVAL_MS);

runScheduledOrders().then((r) => console.log(`[ops] boot tick: ${r.created} created, ${r.skipped} skipped`));
console.log("[ops] worker started — order-processing + scheduled-orders every 5min");

async function shutdown() {
  await orderWorker.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
