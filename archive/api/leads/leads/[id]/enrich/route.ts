import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiRoute,
  authenticate,
  success,
  requirePermission,
} from "@/lib/api-utils";
import { enrichLead } from "@/lib/swarm/acquisition-engine";

export const POST = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "lead:update");

  const lead = await prisma.lead.findFirst({
    where: { id: params.id, tenantId: auth.tenantId },
  });

  if (!lead) {
    return success({ error: "Lead not found" }, 404);
  }

  // Build raw data from lead
  const raw: Record<string, string | null> = {
    name: lead.name,
    legalName: lead.legalName,
    email: lead.email,
    phone: lead.phone,
    city: lead.city,
    governorate: lead.governorate,
    address: lead.address,
    website: lead.website,
    category: lead.category,
    _sourceId: lead.source,
    _sourceUrl: lead.sourceUrl,
    _sourceName: lead.source,
    _region: lead.city || "national",
    _category: lead.category || "Mixed",
  };

  const enrichment = await enrichLead(raw, params.id);

  await prisma.lead.update({
    where: { id: params.id },
    data: {
      enrichment: JSON.stringify(enrichment),
      status: "ENRICHED",
      priority: Number(enrichment.priorityScore) || lead.priority,
    },
  });

  return success({ leadId: params.id, enrichment, status: "ENRICHED" });
});
