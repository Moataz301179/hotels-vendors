/**
 * RFQ Response API — Supplier submits a quote
 *
 * POST — Create RfqResponse + RfqItemResponse entries (SUPPLIER only, tenant-scoped)
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  apiRoute,
  authenticate,
  validateBody,
  success,
  error,
  audit,
} from "@/lib/api-utils";

// ── Schemas ────────────────────────────────────────────────────

const RfqItemResponseInputSchema = z.object({
  rfqItemId: z.string().cuid(),
  unitPrice: z.number().positive("Unit price must be positive"),
  availableQuantity: z.number().int().min(0),
  totalPrice: z.number().positive("Total price must be positive"),
  deliveryDays: z.number().int().min(0),
  notes: z.string().optional(),
  isPartial: z.boolean().default(false),
});

const CreateRfqResponseSchema = z.object({
  rfqId: z.string().cuid(),
  deliveryDays: z.number().int().min(0),
  shippingMethod: z.enum(["SUPPLIER_SELF", "PLATFORM_LOGISTICS", "THIRD_PARTY"]).default("SUPPLIER_SELF"),
  notes: z.string().optional(),
  validUntil: z.string().datetime(),
  items: z.array(RfqItemResponseInputSchema).min(1, "At least one item response is required"),
});

// ── POST: Submit Response ──────────────────────────────────────

export const POST = apiRoute(
  async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
    const auth = await authenticate(request);

    // Only SUPPLIER and ADMIN roles can respond
    if (auth.platformRole !== "SUPPLIER" && auth.platformRole !== "ADMIN") {
      return error("Only suppliers can respond to RFQs", 403);
    }

    const resolved = await params;
    if (!resolved) return error("Missing parameter", 400);
    const { id: rfqId } = resolved;

    const body = await request.json();
    const data = validateBody(CreateRfqResponseSchema, body);

    // Confirm path param matches body
    if (data.rfqId !== rfqId) {
      return error("rfqId in path must match body", 400);
    }

    // Load the RFQ (tenant-scoped)
    const rfq = await prisma.rfqRequest.findUnique({
      where: { id: rfqId },
      select: { id: true, tenantId: true, status: true, responseDeadline: true },
    });

    if (!rfq || rfq.tenantId !== auth.tenantId) {
      return error("RFQ not found", 404);
    }

    // Must be open for responses
    if (rfq.status !== "OPEN" && rfq.status !== "PUBLISHED") {
      return error(`RFQ is not open for responses (current status: ${rfq.status})`, 400);
    }

    // Deadline check
    if (new Date() > rfq.responseDeadline) {
      return error("RFQ response deadline has passed", 400);
    }

    // Resolve supplierId from auth user
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { supplierId: true },
    });

    if (!user?.supplierId) {
      return error("Supplier profile not found. Please complete supplier onboarding first.", 400);
    }

    const supplierId = user.supplierId;

    // Enforce unique (rfqId, supplierId)
    const existing = await prisma.rfqResponse.findUnique({
      where: { rfqId_supplierId: { rfqId, supplierId } },
    });

    if (existing) {
      return error(
        "You have already submitted a response to this RFQ. Use PATCH to update.",
        409
      );
    }

    // Validate all referenced items belong to this RFQ
    const validItemIds = new Set(
      (
        await prisma.rfqItem.findMany({
          where: { rfqId },
          select: { id: true },
        })
      ).map((item) => item.id)
    );

    for (const item of data.items) {
      if (!validItemIds.has(item.rfqItemId)) {
        return error(`Item ${item.rfqItemId} does not belong to this RFQ`, 400);
      }
    }

    // Verify supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      select: { id: true },
    });
    if (!supplier) {
      return error("Supplier not found", 404);
    }

    // Aggregate total from items
    const totalPrice = data.items.reduce((sum, item) => sum + item.totalPrice, 0);

    const rfqResponse = await prisma.rfqResponse.create({
      data: {
        rfqId,
        supplierId,
        status: "SUBMITTED",
        totalPrice,
        deliveryDays: data.deliveryDays,
        shippingMethod: data.shippingMethod,
        notes: data.notes,
        validUntil: new Date(data.validUntil),
        submittedAt: new Date(),
        items: {
          create: data.items.map((item) => ({
            rfqItemId: item.rfqItemId,
            unitPrice: item.unitPrice,
            availableQuantity: item.availableQuantity,
            totalPrice: item.totalPrice,
            deliveryDays: item.deliveryDays,
            notes: item.notes,
            isPartial: item.isPartial,
          })),
        },
      },
      include: {
        supplier: { select: { id: true, name: true, tier: true } },
        items: { include: { rfqItem: { select: { id: true, productName: true } } } },
      },
    });

    await audit({
      entityType: "RFQ_RESPONSE",
      entityId: rfqResponse.id,
      action: "SUBMIT_RESPONSE",
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.platformRole,
      afterState: {
        rfqId,
        supplierId,
        totalPrice,
        status: "SUBMITTED",
      },
      ipAddress: request.headers.get("x-forwarded-for") || null,
      userAgent: request.headers.get("user-agent") ?? null,
    });

    return success({ response: rfqResponse }, 201);
  }
);
