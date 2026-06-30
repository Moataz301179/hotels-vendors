/**
 * RFQ API — Request for Quote
 * Hotels Vendors Marketplace Layer
 *
 * POST — Create RfqRequest + RfqItems (HOTEL only)
 * GET  — List RFQs for the calling user's hotel
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
import { ProductCategory } from "@prisma/client";

// ── Schemas ────────────────────────────────────────────────────

const RfqItemInputSchema = z.object({
  productCategory: z.nativeEnum(ProductCategory),
  productName: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  quantity: z.number().int().positive("Quantity must be positive"),
  unitOfMeasure: z.string().default("kg"),
  qualitySpecs: z.string().optional(),
  targetPrice: z.number().positive().optional(),
  currency: z.string().default("EGP"),
});

const CreateRfqSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  responseDeadline: z.string().datetime({ message: "responseDeadline must be an ISO date" }),
  expectedDeliveryDate: z.string().datetime().optional(),
  hotelId: z.string().cuid().optional(),
  autoConvertToPo: z.boolean().default(true),
  items: z.array(RfqItemInputSchema).min(1, "At least one item is required"),
});

// ── GET: List my RFQs ──────────────────────────────────────────

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20", 10));

  // Scope by user's hotel
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { hotelId: true },
  });

  const where: Record<string, unknown> = { tenantId: auth.tenantId };
  if (auth.platformRole === "HOTEL" && user?.hotelId) {
    where.hotelId = user.hotelId;
  }
  if (status) {
    where.status = status;
  }

  const [rfqs, total] = await Promise.all([
    prisma.rfqRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        hotel: { select: { id: true, name: true } },
        _count: { select: { items: true, responses: true } },
      },
    }),
    prisma.rfqRequest.count({ where }),
  ]);

  return success({
    rfqs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

// ── POST: Create RFQ ───────────────────────────────────────────

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  // Only HOTEL and ADMIN roles can create RFQs
  if (auth.platformRole !== "HOTEL" && auth.platformRole !== "ADMIN") {
    return error("Only hotel users can create RFQs", 403);
  }

  const body = await request.json();
  const data = validateBody(CreateRfqSchema, body);

  // Resolve hotelId
  let hotelId = data.hotelId;
  if (!hotelId) {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { hotelId: true },
    });
    hotelId = user?.hotelId || undefined;
  }

  if (!hotelId) {
    return error("Hotel profile not found. Please complete hotel onboarding first.", 400);
  }

  // Verify hotel exists and belongs to caller's tenant
  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel || hotel.tenantId !== auth.tenantId) {
    return error("Hotel not found or does not belong to your tenant", 404);
  }

  // Generate RFQ number: RFQ-YYYYMMDD-XXXX
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const count = await prisma.rfqRequest.count({
    where: { createdAt: { gte: new Date(date.toISOString().slice(0, 10)) } },
  });
  const rfqNumber = `RFQ-${dateStr}-${String(count + 1).padStart(4, "0")}`;

  const rfq = await prisma.rfqRequest.create({
    data: {
      rfqNumber,
      title: data.title,
      description: data.description,
      hotelId,
      tenantId: auth.tenantId,
      createdById: auth.userId,
      responseDeadline: new Date(data.responseDeadline),
      expectedDeliveryDate: data.expectedDeliveryDate
        ? new Date(data.expectedDeliveryDate)
        : null,
      autoConvertToPo: data.autoConvertToPo,
      status: "OPEN",
      publishedAt: new Date(),
      items: {
        create: data.items.map((item) => ({
          productCategory: item.productCategory,
          productName: item.productName,
          description: item.description,
          quantity: item.quantity,
          unitOfMeasure: item.unitOfMeasure,
          qualitySpecs: item.qualitySpecs,
          targetPrice: item.targetPrice,
          currency: item.currency,
        })),
      },
    },
    include: {
      items: true,
      hotel: { select: { id: true, name: true } },
    },
  });

  await audit({
    entityType: "RFQ",
    entityId: rfq.id,
    action: "CREATE_RFQ",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { rfqNumber: rfq.rfqNumber, title: rfq.title, status: rfq.status },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent") ?? null,
  });

  return success({ rfq }, 201);
});
