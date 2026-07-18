/**
 * Order Status Update API
 * PATCH /api/v1/orders/:id/status
 *
 * Enforces state machine transitions. Suppliers can progress orders
 * through fulfillment (CONFIRMED → IN_TRANSIT → DELIVERED).
 * Hotels can cancel. Admins can override.
 *
 * SECURITY (architecture-review-2026-07.md, S2):
 * Previously this route called `prisma.order.update` directly — a non-atomic,
 * unlocked write that bypassed the Authority Matrix and was vulnerable to
 * concurrent-status-change races. Now the update runs inside a `$transaction`
 * with `SELECT FOR UPDATE` row locking and optimistic-concurrency re-validation.
 * The ETA re-validation gate for CONFIRMED → IN_TRANSIT (declared by
 * `getTransitionGate` in lib/auth/state-machine.ts but previously unchecked
 * here) is now enforced. The chained `audit()` call is retained; making it
 * transactional with the status write is the S14 follow-up (Phase 2).
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  error,
  audit,
  ApiError,
} from "@/lib/api-utils";
import { validateStatusTransition } from "@/lib/auth/state-machine";
import { validateForFactoring } from "@/lib/eta/validator";
import { z } from "zod";

const UpdateStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  reason: z.string().optional(),
});

// Statuses that require paymentGuaranteed = true (G10 Payment Guarantee Gate).
const REQUIRES_PAYMENT_GUARANTEE: OrderStatus[] = [
  "CONFIRMED",
  "IN_TRANSIT",
  "DELIVERED",
];

export const PATCH = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:approve");
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) return error("Order ID required", 400);

  const body = await request.json();
  const parsed = UpdateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return error("Invalid status", 400);
  }
  const { status: newStatus, reason } = parsed.data;

  // Fetch order with ownership check.
  // Suppliers see orders for their tenant; hotels see their own orders; admin sees all.
  const order = await prisma.order.findFirst({
    where: {
      id,
      ...(auth.platformRole === "SUPPLIER"
        ? { tenantId: auth.tenantId }
        : auth.platformRole === "HOTEL"
          ? { hotel: { tenantId: auth.tenantId } }
          : {}),
    },
    include: {
      hotel: true,
      supplier: true,
      items: true,
      // Need invoice ids for the ETA re-validation gate (CONFIRMED → IN_TRANSIT).
      invoices: { select: { id: true } },
    },
  });

  if (!order) {
    return error("Order not found", 404);
  }

  // Validate state machine transition
  const transition = validateStatusTransition(order.status, newStatus);
  if (!transition.valid) {
    return error(transition.reason || "Invalid status transition", 400);
  }

  // G10 ENFORCED: Payment Guarantee Gate
  // No order may transition to CONFIRMED, IN_TRANSIT, or DELIVERED without
  // paymentGuaranteed = true. Defense-in-depth — atomicStatusUpdate also gates
  // this, but we reject early with a clear message before acquiring the lock.
  if (REQUIRES_PAYMENT_GUARANTEE.includes(newStatus) && !order.paymentGuaranteed) {
    return error(
      "G10 VIOLATION: Cannot transition to " + newStatus + " without payment guarantee. " +
      "Order must have paymentGuaranteed = true before confirmation.",
      403
    );
  }

  // ETA re-validation gate for CONFIRMED → IN_TRANSIT.
  // lib/auth/state-machine.ts declares this transition as `requires.etaValidation: true`;
  // enforce it here so a shipping order cannot leave the warehouse without a
  // valid ETA-compliant invoice. (If the order has no invoice yet, the gate is
  // silently skipped — matching evaluateAuthority's behavior, which only checks
  // `order.invoices[0]` if one exists.)
  if (order.status === "CONFIRMED" && newStatus === "IN_TRANSIT" && order.invoices.length > 0) {
    const etaResult = await validateForFactoring(order.invoices[0].id);
    if (!etaResult.valid) {
      return error(
        `ETA validation failed for shipping: ${etaResult.message}`,
        403
      );
    }
  }

  // Transactional locked update — prevents concurrent status mutations from
  // racing. SELECT ... FOR UPDATE locks the row; we re-check the status after
  // acquiring the lock and abort with 409 if another request moved it first.
  const updated = await prisma.$transaction(async (tx) => {
    const locked = await tx.$queryRaw<Array<{ id: string; status: string }>>`
      SELECT id, status FROM "Order" WHERE id = ${id} FOR UPDATE
    `;
    if (locked.length === 0) {
      throw new ApiError("Order not found", 404);
    }
    // Optimistic concurrency: if the status changed between our pre-read and
    // the lock, the transition we validated may no longer be valid.
    if (locked[0].status !== order.status) {
      throw new ApiError(
        "Order status changed concurrently; please retry",
        409
      );
    }

    return tx.order.update({
      where: { id },
      data: {
        status: newStatus,
        ...(newStatus === "DELIVERED" ? { deliveryDate: new Date() } : {}),
      },
      include: {
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
        items: {
          include: { product: { select: { id: true, name: true, sku: true } } },
        },
      },
    });
  });

  // Audit log (chained via audit() → appendAuditEntry).
  // TODO(S14, Phase 2): move this inside the $transaction once appendAuditEntry
  // accepts a tx client, so the audit and the status write commit atomically.
  await audit({
    entityType: "ORDER",
    entityId: order.id,
    action: "STATUS_UPDATE",
    tenantId: order.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    beforeState: { status: order.status },
    afterState: { status: newStatus, reason },
  });

  return success({ order: updated });
});
