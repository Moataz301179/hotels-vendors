import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "factoring:inquire");

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { supplierId: true },
  });

  if (!user?.supplierId) {
    return error("Supplier profile not found", 404);
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      supplierId: user.supplierId,
      factoringStatus: { in: ["AVAILABLE", "OFFERED"] },
      etaStatus: { in: ["ACCEPTED", "VALIDATED"] },
      paymentStatus: { notIn: ["PAID", "FACTORED"] },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      hotel: {
        select: { id: true, name: true, riskScore: true, riskTier: true },
      },
      order: {
        select: { id: true, orderNumber: true, deliveryDate: true },
      },
    },
  });

  const offers = invoices.map((inv) => {
    const amount = Number(inv.total);
    const riskScore = inv.hotel.riskScore ?? 50;
    const advanceRate = riskScore <= 30 ? 0.70 : riskScore <= 50 ? 0.80 : riskScore <= 70 ? 0.85 : 0.90;
    const feeRate = riskScore <= 30 ? 0.035 : riskScore <= 50 ? 0.025 : 0.02;
    const advanceAmount = Math.round(amount * advanceRate);
    const fee = Math.round(advanceAmount * feeRate);
    const netAmount = advanceAmount - fee;

    return {
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      hotelName: inv.hotel.name,
      hotelRiskScore: riskScore,
      total: amount,
      currency: inv.currency,
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      etaStatus: inv.etaStatus,
      factoringStatus: inv.factoringStatus,
      advanceRate,
      advanceAmount,
      fee,
      netAmount,
      repaymentDays: riskScore >= 70 ? 90 : riskScore >= 50 ? 60 : 45,
    };
  });

  return success({ offers, count: offers.length });
});

const RequestFactoringSchema = z.object({
  invoiceId: z.string().cuid(),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "factoring:request");

  const body = await request.json();
  const data = RequestFactoringSchema.parse(body);

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { supplierId: true },
  });

  if (!user?.supplierId) {
    return error("Supplier profile not found", 404);
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
    include: { hotel: true },
  });

  if (!invoice) {
    return error("Invoice not found", 404);
  }

  if (invoice.supplierId !== user.supplierId) {
    return error("Forbidden: you do not own this invoice", 403);
  }

  if (invoice.factoringStatus !== "AVAILABLE" && invoice.factoringStatus !== "OFFERED") {
    return error("Invoice is not eligible for factoring", 422);
  }

  const amount = Number(invoice.total);
  const riskScore = invoice.hotel.riskScore ?? 50;
  const advanceRate = riskScore <= 30 ? 0.70 : riskScore <= 50 ? 0.80 : riskScore <= 70 ? 0.85 : 0.90;
  const feeRate = riskScore <= 30 ? 0.035 : riskScore <= 50 ? 0.025 : 0.02;
  const advanceAmount = Math.round(amount * advanceRate);
  const fee = Math.round(advanceAmount * feeRate);

  const factoringRequest = await prisma.factoringRequest.create({
    data: {
      invoiceId: data.invoiceId,
      requestedAmount: invoice.total,
      tenantId: auth.tenantId,
      status: "PENDING",
      advanceRate,
      discountRate: feeRate,
      factoringFee: fee,
      grossAmount: invoice.total,
      disbursedAmount: advanceAmount - fee,
    },
  });

  await prisma.invoice.update({
    where: { id: data.invoiceId },
    data: {
      factoringStatus: "OFFERED",
      factoringAdvanceAmount: advanceAmount,
      factoringFee: fee,
      factoringProvider: "hotels-vendors",
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
      invoiceId: data.invoiceId,
      advanceAmount,
      fee,
      netAmount: advanceAmount - fee,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success(
    {
      factoringRequestId: factoringRequest.id,
      status: "PENDING",
      advanceAmount,
      fee,
      netAmount: advanceAmount - fee,
    },
    201
  );
});
