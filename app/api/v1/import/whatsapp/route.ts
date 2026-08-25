import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { parseWhatsAppExport } from "@/lib/import/whatsapp-parser";

/**
 * POST /api/v1/import/whatsapp
 * Body: { content: string (raw chat export text), supplierId?: string, dryRun?: boolean }
 *
 * dryRun=true (default) → parse + preview only, nothing persisted.
 * dryRun=false → creates historical Orders (status DELIVERED, orderNumber prefix WA-)
 * with the ORIGINAL message dates, so forecasts and analytics start from the user's
 * real history. Low-confidence orders are skipped and reported for review.
 * Items are linked to catalog SKUs only when a name match exists; unmatched items
 * are skipped (honest import — no fabricated catalog rows).
 */
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const BodySchema = z.object({
    content: z.string().min(50).max(2_000_000),
    supplierId: z.string().optional(),
    dryRun: z.boolean().default(true),
  });
  const { content, supplierId, dryRun } = BodySchema.parse(await request.json());

  const result = parseWhatsAppExport(content);
  if (!result.orders.length) {
    return success({
      ...result,
      imported: 0,
      message: "No order-like messages found. Make sure you exported the chat that contains the orders.",
    });
  }

  if (dryRun) {
    return success({ ...result, imported: 0, preview: result.orders.slice(0, 20) });
  }

  const supplier = supplierId
    ? await prisma.supplier.findFirst({ where: { id: supplierId, tenantId: auth.tenantId } })
    : await prisma.supplier.findFirst({ where: { tenantId: auth.tenantId } });
  if (!supplier) return error("No supplier linked to your organization. Link a supplier first or pass supplierId.", 400);

  const requester = await prisma.user.findFirst({ where: { tenantId: auth.tenantId }, select: { id: true } });
  if (!requester) return error("No user in tenant", 400);

  const hotel = await prisma.hotel.findFirst({ where: { tenantId: auth.tenantId }, select: { id: true } });
  if (!hotel) return error("No hotel linked to your organization", 400);

  // Pre-resolve SKU matches in one query per distinct name prefix (bounded)
  const confident = result.orders.filter((o) => o.confidence >= 0.7 && o.items.length > 0);
  const names = Array.from(new Set(confident.flatMap((o) => o.items.map((i) => i.name.slice(0, 20))))).slice(0, 200);
  const skuByPrefix = new Map<string, string>();
  for (const n of names) {
    const prod = await prisma.product.findFirst({
      where: { tenantId: auth.tenantId, deletedAt: null, name: { contains: n, mode: "insensitive" } },
      select: { id: true, name: true },
    });
    if (prod) skuByPrefix.set(n, prod.id);
  }

  let imported = 0;
  for (const o of confident) {
    const d = new Date(o.date);
    const orderNumber = `WA-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${Date.now().toString().slice(-8)}-${imported}`;
    const subtotal = o.totalAmount ?? o.items.reduce((s, i) => s + (i.lineTotal ?? 0), 0);
    const items = o.items
      .map((i) => ({ item: i, productId: skuByPrefix.get(i.name.slice(0, 20)) }))
      .filter((x) => x.productId)
      .map((x) => ({
        productId: x.productId!,
        quantity: x.item.quantity ?? 1,
        unitPrice: x.item.unitPrice,
        total: x.item.lineTotal,
      }));
    if (!items.length) continue; // honest: skip orders with no catalog-matched lines
    try {
      await prisma.order.create({
        data: {
          orderNumber,
          status: "DELIVERED",
          hotelId: hotel.id,
          supplierId: supplier.id,
          requesterId: requester.id,
          tenantId: auth.tenantId,
          createdAt: d,
          updatedAt: d,
          subtotal,
          total: subtotal,
          items: { create: items },
        },
      });
      imported++;
    } catch {
      // skip malformed order, continue
    }
  }

  return success({
    ...result,
    imported,
    skippedLowConfidence: result.orders.length - confident.length,
    message: `Imported ${imported} historical orders with original dates. ${result.reviewNeeded} need review.`,
  });
});
