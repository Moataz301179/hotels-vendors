import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  apiRoute,
  authenticate,
  validateBody,
  validateQuery,
  success,
  requirePermission,
} from "@/lib/api-utils";

// ── Schemas ──

const LeadQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum([
    "DISCOVERED", "ENRICHED", "CONTACTED", "RESPONDED", "QUALIFIED",
    "MEETING_SCHEDULED", "PROPOSAL_SENT", "NEGOTIATING", "CONVERTED", "LOST", "PAUSED",
  ]).optional(),
  entityType: z.enum(["HOTEL", "SUPPLIER", "FACTOR", "LOGISTICS"]).optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["priority", "createdAt", "lastContactAt", "name"]).default("priority"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const LeadCreateSchema = z.object({
  entityType: z.enum(["HOTEL", "SUPPLIER", "FACTOR", "LOGISTICS"]).default("SUPPLIER"),
  name: z.string().min(2),
  legalName: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  governorate: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(),
  source: z.string().default("manual"),
  sourceUrl: z.string().optional(),
  priority: z.coerce.number().min(1).max(10).default(5),
});

// ── Routes ──

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "lead:read");

  const query = validateQuery(LeadQuerySchema, request.nextUrl.searchParams);
  const tenantId = auth.tenantId;

  const where: Record<string, unknown> = { tenantId };

  if (query.status) where.status = query.status;
  if (query.entityType) where.entityType = query.entityType;
  if (query.category) where.category = { contains: query.category, mode: "insensitive" };
  if (query.city) where.city = { contains: query.city, mode: "insensitive" };
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
      { phone: { contains: query.search } },
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { [query.sortBy]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return success({
    leads,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  });
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "lead:create");

  const body = await request.json();
  const data = validateBody(LeadCreateSchema, body);

  const lead = await prisma.lead.create({
    data: {
      ...data,
      tenantId: auth.tenantId,
      discoveredBy: auth.userId,
      status: "DISCOVERED",
    },
  });

  return success({ lead }, 201);
});
