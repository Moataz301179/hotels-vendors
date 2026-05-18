import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit, requirePermission } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invoice:factor");

  const body = await request.json();
  const { invoiceIds, hotelId } = body;

  if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
    return error("Missing or empty invoiceIds array", 400);
  }

  if (!hotelId) {
    return error("Missing hotelId parameter", 400);
  }

  // Fetch target property-level supplier invoices
  const invoices = await prisma.invoice.findMany({
    where: {
      id: { in: invoiceIds },
      tenantId: auth.tenantId,
    },
  });

  if (invoices.length !== invoiceIds.length) {
    return error("One or more target supplier invoices were not found in this tenant context", 404);
  }

  // Enforce hotel boundary matching
  for (const inv of invoices) {
    if (inv.hotelId !== hotelId) {
      return error(`Invoice ${inv.invoiceNumber} does not match the target Hotel entity boundary`, 422);
    }
  }

  // Sum subtotal, VAT, and totals
  const subtotal = invoices.reduce((sum, inv) => sum + inv.subtotal, 0);
  const vatAmount = invoices.reduce((sum, inv) => sum + inv.vatAmount, 0);
  const total = invoices.reduce((sum, inv) => sum + inv.total, 0);

  const invoiceNumber = `CI-HOTEL-${Date.now()}`;
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30-day tenor

  // Create Master Consolidated Invoice record
  const consolidated = await prisma.consolidatedInvoice.create({
    data: {
      invoiceNumber,
      status: "DRAFT",
      subtotal,
      vatAmount,
      total,
      dueDate,
      hotelId,
      tenantId: auth.tenantId,
    },
  });

  // Atomically update all underlying child records with the master key
  await prisma.invoice.updateMany({
    where: { id: { in: invoiceIds } },
    data: {
      consolidatedInvoiceId: consolidated.id,
      factoringStatus: "AVAILABLE", // Mark as eligible for early-liquidation locks
    },
  });

  // Write CONSOLIDATED_INVOICE_ORIGINATED audit transition
  await audit({
    entityType: "CONSOLIDATED_INVOICE",
    entityId: consolidated.id,
    action: "CONSOLIDATED_INVOICE_ORIGINATED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: "ORIGINATOR",
    afterState: {
      invoiceIds,
      total,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    message: "Receivables successfully aggregated into a Master Consolidated Invoice asset.",
    consolidatedInvoice: consolidated,
  });
});
