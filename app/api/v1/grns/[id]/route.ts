import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { apiRoute, authenticate, validateBody, success, error, audit, requirePermission } from "@/lib/api-utils";

const GrnUpdateSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    receivedQuantity: z.number().min(0).optional(),
    rejectedQuantity: z.number().min(0).optional(),
  })).optional(),
  status: z.enum(["DRAFT", "PENDING_VERIFICATION", "VERIFIED", "DISPUTED", "SUPPLIER_CONFIRMED", "CANCELLED"]).optional(),
  signatureUrl: z.string().optional(),
  photoUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const GET = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "grn:read");
  const { id } = await ctx.params;

  const grn = await prisma.grn.findFirst({
    where: { id, tenantId: auth.tenantId },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          supplier: { select: { name: true } },
        },
      },
      grnItems: {
        include: {
          product: { select: { id: true, name: true, sku: true } },
        },
      },
    },
  });

  if (!grn) return error("GRN not found", 404);

  return success({ grn });
});

export const PATCH = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "grn:update");
  const { id } = await ctx.params;
  const body = await request.json();
  const data = validateBody(GrnUpdateSchema, body);

  const grn = await prisma.grn.findFirst({
    where: { id, tenantId: auth.tenantId },
  });

  if (!grn) return error("GRN not found", 404);

  // Update items if provided
  if (data.items && data.items.length > 0) {
    await Promise.all(
      data.items.map((item) =>
        prisma.grnItem.update({
          where: { id: item.id },
          data: {
            ...(item.receivedQuantity !== undefined ? { receivedQuantity: item.receivedQuantity } : {}),
            ...(item.rejectedQuantity !== undefined ? { rejectedQuantity: item.rejectedQuantity } : {}),
          },
        })
      )
    );
  }

  // Update GRN fields
  const updateData: Record<string, unknown> = {};
  if (data.status) updateData.status = data.status;
  if (data.signatureUrl) {
    updateData.signatureUrl = data.signatureUrl;
    updateData.signedAt = new Date();
    updateData.signedById = auth.userId;
  }
  if (data.photoUrl) updateData.photoUrl = data.photoUrl;
  if (data.notes) updateData.notes = data.notes;

  if (Object.keys(updateData).length > 0) {
    await prisma.grn.update({
      where: { id },
      data: updateData,
    });
  }

  // If status changed to VERIFIED, also update order items' receivedQuantity
  if (data.status === "VERIFIED" && data.items) {
    await Promise.all(
      data.items.map((item) =>
        prisma.grnItem.findUnique({ where: { id: item.id } }).then((gi) => {
          if (gi) {
            return prisma.orderItem.update({
              where: { id: gi.orderItemId },
              data: { receivedQuantity: item.receivedQuantity ?? gi.receivedQuantity },
            });
          }
        })
      )
    );
  }

  const updated = await prisma.grn.findFirst({
    where: { id, tenantId: auth.tenantId },
    include: {
      order: { select: { id: true, orderNumber: true } },
      grnItems: { include: { product: { select: { id: true, name: true } } } },
    },
  });

  await audit({
    entityType: "GRN",
    entityId: id,
    action: data.status === "VERIFIED" ? "GRN_VERIFIED" : data.status === "DISPUTED" ? "GRN_DISPUTED" : "GRN_UPDATED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    beforeState: { status: grn.status },
    afterState: { status: data.status || grn.status },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ grn: updated });
});
