import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const FactoringRequestSchema = z.object({
  invoiceId: z.string().min(1).optional(),
  consolidatedInvoiceId: z.string().min(1).optional(),
  factoringCompanyId: z.string().min(1),
  requestedAmount: z.number().positive(),
}).refine((data) => data.invoiceId || data.consolidatedInvoiceId, {
  message: "Either invoiceId or consolidatedInvoiceId is required",
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "factoring:request");
  const body = await request.json();
  const data = FactoringRequestSchema.parse(body);

  // Check eligibility
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { role: true },
  });
  if (!user) return error("User not found", 404);

  const eligibility = await prisma.authorityRule.findFirst({
    where: {
      tenantId: auth.tenantId,
      role: user.role as any,
      canRequestFactoring: true,
      isActive: true,
    },
  });

  if (!eligibility) {
    return error("Your role is not authorized to request factoring", 403);
  }

  const factoringRequest = await prisma.factoringRequest.create({
    data: {
      invoiceId: data.invoiceId,
      consolidatedInvoiceId: data.consolidatedInvoiceId,
      factoringCompanyId: data.factoringCompanyId,
      requestedAmount: data.requestedAmount,
      tenantId: auth.tenantId,
      status: "PENDING",
    },
  });

  await audit({
    entityType: "FACTORING_REQUEST",
    entityId: factoringRequest.id,
    action: "FACTORING_REQUESTED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      requestedAmount: data.requestedAmount,
      factoringCompanyId: data.factoringCompanyId,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    factoringRequest,
    message: "Factoring request submitted. Awaiting review.",
  }, 201);
});
