import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  apiRoute,
  authenticate,
  validateBody,
  success,
  requirePermission,
} from "@/lib/api-utils";

const LeadUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  legalName: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  governorate: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(),
  status: z.enum([
    "DISCOVERED", "ENRICHED", "CONTACTED", "RESPONDED", "QUALIFIED",
    "MEETING_SCHEDULED", "PROPOSAL_SENT", "NEGOTIATING", "CONVERTED", "LOST", "PAUSED",
  ]).optional(),
  priority: z.coerce.number().min(1).max(10).optional(),
  enrichment: z.string().optional(),
  trustSignals: z.string().optional(),
}).partial();

export const GET = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "lead:read");

  const lead = await prisma.lead.findFirst({
    where: { id: params.id, tenantId: auth.tenantId },
    include: {
      outreachLogs: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!lead) {
    return success({ error: "Lead not found" }, 404);
  }

  return success({ lead });
});

export const PATCH = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "lead:update");

  const body = await request.json();
  const data = validateBody(LeadUpdateSchema, body);

  const lead = await prisma.lead.updateMany({
    where: { id: params.id, tenantId: auth.tenantId },
    data,
  });

  if (lead.count === 0) {
    return success({ error: "Lead not found" }, 404);
  }

  const updated = await prisma.lead.findUnique({ where: { id: params.id } });
  return success({ lead: updated });
});

export const DELETE = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "lead:delete");

  await prisma.lead.deleteMany({
    where: { id: params.id, tenantId: auth.tenantId },
  });

  return success({ deleted: true });
});
