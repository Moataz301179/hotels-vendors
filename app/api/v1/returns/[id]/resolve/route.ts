import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReturnResolveSchema } from "@/lib/zod";
import { apiRoute, authenticate, validateBody, success, error, audit, requirePermission } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "return:resolve");
  const { id } = await ctx.params;
  const body = await request.json();
  const data = validateBody(ReturnResolveSchema, body);

  const returnRequest = await prisma.returnRequest.findFirst({
    where: { id, tenantId: auth.tenantId },
    include: { items: true, order: { include: { invoices: { take: 1, orderBy: { createdAt: "desc" } } } } },
  });
  if (!returnRequest) return error("Return request not found", 404);
  if (!["PENDING_SUPPLIER_RESPONSE", "PARTIALLY_ACCEPTED", "UNDER_INVESTIGATION"].includes(returnRequest.status)) {
    return error(`Cannot resolve return in status: ${returnRequest.status}`, 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    if (data.itemActions) {
      for (const action of data.itemActions) {
        const updateData: Record<string, unknown> = {};
        if (action.action === "APPROVE") {
          updateData.status = "APPROVED";
          updateData.approvedQuantity = returnRequest.items.find((i) => i.id === action.returnItemId)?.quantity;
        } else if (action.action === "REJECT") {
          updateData.status = "REJECTED";
          updateData.rejectedReason = action.rejectedReason;
        } else if (action.action === "PARTIAL_APPROVE") {
          updateData.status = "PARTIALLY_APPROVED";
          updateData.approvedQuantity = action.approvedQuantity;
        }
        await tx.returnItem.update({
          where: { id: action.returnItemId },
          data: updateData,
        });
      }
    }

    let newStatus: string;
    if (data.resolution === "REJECTED") {
      newStatus = "SUPPLIER_REJECTED";
    } else if (["FULL_RETURN", "PARTIAL_RETURN", "REPLACEMENT"].includes(data.resolution)) {
      newStatus = "SUPPLIER_ACCEPTED";
    } else if (data.resolution === "CREDIT_NOTE" || data.resolution === "REFUND") {
      newStatus = "RESOLVED";
    } else {
      newStatus = "SUPPLIER_ACCEPTED";
    }

    const updated = await tx.returnRequest.update({
      where: { id },
      data: {
        status: newStatus,
        resolution: data.resolution,
        resolvedAt: new Date(),
        resolvedById: auth.userId,
      },
      include: {
        items: { include: { orderItem: { include: { product: { select: { id: true, name: true } } } } } },
      },
    });

    if (data.resolution === "CREDIT_NOTE" && returnRequest.order.invoices.length > 0) {
      const invoice = returnRequest.order.invoices[0];
      const creditNoteNumber = `CN-${Date.now()}`;
      let subtotal = 0;

      for (const item of updated.items) {
        const qty = item.approvedQuantity || item.quantity;
        subtotal += Number(item.orderItem.unitPrice) * qty;
      }
      const vatAmount = subtotal * 0.14;
      const total = subtotal + vatAmount;

      const creditNote = await tx.creditNote.create({
        data: {
          creditNoteNumber,
          returnRequestId: id,
          invoiceId: invoice.id,
          supplierId: returnRequest.order.supplierId,
          hotelId: returnRequest.hotelId,
          tenantId: auth.tenantId,
          status: "ISSUED",
          subtotal,
          vatAmount,
          total,
          currency: "EGP",
        },
      });

      await tx.returnRequest.update({
        where: { id },
        data: { creditNoteId: creditNote.id },
      });
    }

    for (const item of updated.items) {
      if (["APPROVED", "PARTIALLY_APPROVED"].includes(item.status)) {
        const qty = item.approvedQuantity || item.quantity;
        await tx.orderItem.update({
          where: { id: item.orderItemId },
          data: {
            returnedQuantity: { increment: qty },
            returnReason: item.reason,
          },
        });
      }
    }

    return updated;
  });

  await audit({
    entityType: "RETURN_REQUEST",
    entityId: id,
    action: "RESOLVE_RETURN",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { resolution: data.resolution, status: result.status },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ returnRequest: result });
});
