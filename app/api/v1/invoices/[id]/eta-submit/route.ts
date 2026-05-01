import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { etaClient } from "@/lib/eta/client";
import { validateForSubmission } from "@/lib/eta/validator";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { hotel: true, supplier: true, order: { include: { items: { include: { product: true } } } } },
  });

  if (!invoice) {
    return error("Invoice not found", 404);
  }

  if (auth.platformRole === "HOTEL" && invoice.hotelId !== auth.tenantId) {
    return error("Forbidden", 403);
  }
  if (auth.platformRole === "SUPPLIER" && invoice.supplierId !== auth.tenantId) {
    return error("Forbidden", 403);
  }

  const validation = await validateForSubmission(id);
  if (!validation.valid) {
    return error(`ETA submission validation failed: ${validation.message}`, 422);
  }

  // Build ETA payload
  const payload = {
    issuer: {
      type: "B" as const,
      id: invoice.supplier.taxId,
      name: invoice.supplier.name,
      address: {
        country: "EG",
        governate: invoice.supplier.governorate,
        regionCity: invoice.supplier.city,
        street: invoice.supplier.address || "Unknown",
        buildingNumber: "1",
      },
    },
    receiver: {
      type: "B" as const,
      id: invoice.hotel.taxId,
      name: invoice.hotel.name,
      address: {
        country: "EG",
        governate: invoice.hotel.governorate,
        regionCity: invoice.hotel.city,
        street: invoice.hotel.address || "Unknown",
        buildingNumber: "1",
      },
    },
    documentType: "I" as const,
    documentTypeVersion: "1.0" as const,
    dateIssued: invoice.issueDate.toISOString(),
    internalId: invoice.invoiceNumber,
    purchaseOrderReference: invoice.order.orderNumber,
    payment: { terms: "Net 30" },
    delivery: { approach: "By Truck", terms: "DAP" },
    invoiceLines: invoice.order.items.map((item) => ({
      description: item.product.name,
      itemType: "EGS" as const,
      itemCode: item.product.sku,
      unitType: item.product.unitOfMeasure,
      quantity: item.quantity,
      internalCode: item.product.sku,
      salesTotal: item.total,
      total: item.total,
      valueDifference: 0,
      totalTaxableFees: 0,
      netTotal: item.total,
      itemsDiscount: 0,
      discount: { amount: 0 },
      taxableItems: [
        { taxType: "T1" as const, amount: item.total * 0.14, subType: "V001", rate: 14 },
      ],
    })),
    totalSalesAmount: invoice.subtotal,
    netAmount: invoice.subtotal,
    taxTotals: [{ taxType: "T1" as const, amount: invoice.vatAmount }],
    totalAmount: invoice.total,
  };

  // Submit in background — fire and return accepted
  // In production, use a queue. Here we await for simplicity.
  try {
    const result = await etaClient.submitInvoice(payload);

    await prisma.invoice.update({
      where: { id },
      data: {
        etaUuid: result.uuid,
        etaStatus: "SUBMITTING",
        submissionLog: JSON.stringify({ submissions: [result] }),
        status: "SUBMITTED",
      },
    });

    await audit({
      entityType: "INVOICE",
      entityId: id,
      action: "ETA_SUBMIT",
      actorId: auth.userId,
      actorRole: auth.platformRole,
      afterState: { etaUuid: result.uuid, status: "SUBMITTED" },
      ipAddress: request.headers.get("x-forwarded-for") || null,
      userAgent: request.headers.get("user-agent"),
    });

    return success({ message: "Invoice submitted to ETA", etaUuid: result.uuid, submissionId: result.submissionId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown ETA error";
    await audit({
      entityType: "INVOICE",
      entityId: id,
      action: "ETA_SUBMIT_FAILED",
      actorId: auth.userId,
      actorRole: auth.platformRole,
      afterState: { error: message },
      ipAddress: request.headers.get("x-forwarded-for") || null,
      userAgent: request.headers.get("user-agent"),
    });
    return error(`ETA submission failed: ${message}`, 502);
  }
});
