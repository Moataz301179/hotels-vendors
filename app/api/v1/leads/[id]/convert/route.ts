import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SupplierStatus, SupplierTier } from "@prisma/client";
import {
  apiRoute,
  authenticate,
  success,
  requirePermission,
} from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "supplier:create");

  const lead = await prisma.lead.findFirst({
    where: { id: params.id, tenantId: auth.tenantId },
  });

  if (!lead) {
    return success({ error: "Lead not found" }, 404);
  }

  if (lead.status === "CONVERTED") {
    return success({ error: "Lead already converted" }, 409);
  }

  // Parse enrichment for tier/quality signals
  let enrichment: Record<string, unknown> = {};
  try {
    if (lead.enrichment) enrichment = JSON.parse(lead.enrichment);
  } catch { /* ignore parse errors */ }

  const qualityTier = String(enrichment.qualityTier || "standard").toUpperCase();
  const tierMap: Record<string, SupplierTier> = {
    BUDGET: SupplierTier.CORE,
    STANDARD: SupplierTier.CORE,
    PREMIUM: SupplierTier.PREMIER,
    LUXURY: SupplierTier.VERIFIED,
  };

  // Create supplier
  const supplier = await prisma.supplier.create({
    data: {
      tenantId: auth.tenantId,
      name: lead.name,
      legalName: lead.legalName || lead.name,
      email: lead.email || `lead_${lead.id}@placeholder.hotelsvendors.com`,
      phone: lead.phone,
      address: lead.address,
      city: lead.city || "Unknown",
      governorate: lead.governorate || lead.city || "Unknown",
      website: lead.website,
      description: String(enrichment.descriptionEn || ""),
      status: SupplierStatus.PENDING,
      tier: tierMap[qualityTier] || SupplierTier.CORE,
    },
  });

  // Update lead as converted
  await prisma.lead.update({
    where: { id: params.id },
    data: {
      status: "CONVERTED",
      convertedAt: new Date(),
      convertedToId: supplier.id,
    },
  });

  return success({
    leadId: params.id,
    supplierId: supplier.id,
    supplierName: supplier.name,
    status: "CONVERTED",
  }, 201);
});
