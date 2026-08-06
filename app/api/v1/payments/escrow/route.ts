import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, requireIdempotencyKey, audit, success, error } from "@/lib/api-utils";
import { createEscrowDeposit, releaseEscrowToken, getEscrowStatus } from "@/lib/payments/paymob-escrow";
import { z } from "zod";

const CreateSchema = z.object({
  invoiceId: z.string().cuid(),
});

const ReleaseSchema = z.object({
  invoiceId: z.string().cuid(),
  releaseType: z.enum(["DUE_DATE", "EARLY_PAYMENT", "MANUAL"]),
  funderId: z.string().optional(),
  coApproverId: z.string().cuid(),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "payment:write");

  const body = await request.json();
  const data = CreateSchema.parse(body);

  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
    include: { hotel: true, supplier: true },
  });

  if (!invoice || invoice.tenantId !== auth.tenantId) {
    return error("Invoice not found", 404);
  }

  await requireIdempotencyKey(request, {
    userId: auth.userId,
    action: "ESCROW_CREATE",
    amount: Number(invoice.total),
  });

  const result = await createEscrowDeposit({
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    amount: Number(invoice.total),
    hotelId: invoice.hotelId,
    supplierId: invoice.supplierId,
    hotelName: invoice.hotel?.name || "Hotel",
    supplierName: invoice.supplier?.name || "Supplier",
    dueDate: invoice.dueDate,
    etaUuid: invoice.etaUuid,
    tenantId: auth.tenantId,
  });

  await audit({
    entityType: "ESCROW",
    entityId: invoice.id,
    action: "ESCROW_CREATE",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { invoiceId: invoice.id, amount: Number(invoice.total) },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success(result);
}, { rateLimit: "financial" });

export const PUT = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "payment:release");

  const body = await request.json();
  const data = ReleaseSchema.parse(body);

  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
  });

  if (!invoice || invoice.tenantId !== auth.tenantId) {
    return error("Invoice not found", 404);
  }

  await requireIdempotencyKey(request, {
    userId: auth.userId,
    action: "ESCROW_RELEASE",
    amount: Number(invoice.total),
  });

  const result = await releaseEscrowToken({
    invoiceId: data.invoiceId,
    releaseType: data.releaseType,
    funderId: data.funderId,
    approverId: auth.userId,
    coApproverId: data.coApproverId,
  });

  await audit({
    entityType: "ESCROW",
    entityId: data.invoiceId,
    action: "ESCROW_RELEASE",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { invoiceId: data.invoiceId, releaseType: data.releaseType },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success(result);
}, { rateLimit: "financial" });

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get("invoiceId");

  if (!invoiceId) {
    return error("Provide ?invoiceId= parameter", 400);
  }

  const status = await getEscrowStatus(invoiceId);
  return success(status);
});
