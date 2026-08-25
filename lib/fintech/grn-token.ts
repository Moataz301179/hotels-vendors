/**
 * GRN QR Cross-Verification — anti-fraud delivery confirmation.
 *
 * CONFIRMED order → server signs a delivery token (HMAC over orderId+expiry).
 * Supplier shows the QR (token) at the hotel door. Hotel scans →
 * GET /api/v1/grn/verify?token=… → returns the PO lines to receive.
 * POST /api/v1/grn/verify { token, lines } → creates GRN + line items,
 * flags discrepancies, and (on full accept) moves order → DELIVERED
 * (which auto-generates the invoice via the existing status route logic).
 *
 * The token is unguessable, time-boxed, and bound to one order: a driver
 * cannot reuse an old QR, and a hotel cannot receive against a wrong PO.
 */
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

const GRN_SECRET = process.env.HOTELSVENDORS_HMAC_SECRET || process.env.SESSION_SECRET || "";

export interface GrnDeliveryToken {
  orderId: string;
  exp: number; // unix seconds
  sig: string;
}

function sign(payload: string): string {
  return createHmac("sha256", GRN_SECRET).update(payload).digest("base64url");
}

/** Build the QR payload for a confirmed order. Valid 14 days. */
export function createDeliveryToken(orderId: string): string {
  const exp = Math.floor(Date.now() / 1000) + 14 * 24 * 3600;
  const payload = `${orderId}.${exp}`;
  return `hvgrn:${payload}.${sign(payload)}`;
}

/** Validate a scanned token; returns orderId or null. Constant-time sig check. */
export function validateDeliveryToken(token: string): string | null {
  if (!token.startsWith("hvgrn:")) return null;
  const parts = token.slice(6).split(".");
  if (parts.length !== 3) return null;
  const [orderId, expStr, sig] = parts;
  const payload = `${orderId}.${expStr}`;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expStr) < Math.floor(Date.now() / 1000)) return null; // expired
  return orderId;
}

/** Fetch the order + expected lines for the receiving screen. */
export async function getOrderForReceiving(orderId: string, tenantId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, tenantId },
    select: {
      id: true, orderNumber: true, status: true, total: true,
      supplier: { select: { name: true } },
      items: {
        select: {
          id: true, quantity: true, receivedQuantity: true,
          product: { select: { id: true, name: true, sku: true } },
        },
      },
    },
  });
}
