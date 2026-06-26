/**
 * POST /api/v1/invoices/[id]/submit-eta
 *
 * Submit a single invoice to the Egyptian Tax Authority e-invoicing API.
 *
 * Auth: authenticated users with SUPPLIER or ADMIN platform role.
 * Rate limit: 10 submissions per minute per user.
 *
 * LEGAL: "Restaurants for E-Marketing operates strictly as a technical data
 * orchestrator. Zero liability for counterparty collection defaults."
 */

import { NextRequest } from "next/server";
import { ApiError } from "@/lib/api-utils";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { assertCanSubmitInvoice, InvoiceAccessError } from "@/lib/compliance/invoice-guard";
import { submitToEta } from "@/lib/compliance/eta-submit";
import { maskPII } from "@/lib/compliance/encryption";

export const POST = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);

  // Only SUPPLIER and ADMIN can submit invoices to ETA
  if (auth.platformRole !== "SUPPLIER" && auth.platformRole !== "ADMIN") {
    return error("Only suppliers and admins can submit invoices to ETA", 403);
  }

  const { id: invoiceId } = await ctx.params;

  if (!invoiceId) {
    return error("Invoice ID is required", 400);
  }

  // Compliance guard — checks ownership, status, ETA fields
  try {
    await assertCanSubmitInvoice(invoiceId, auth.userId, auth.platformRole);
  } catch (guardErr) {
    if (guardErr instanceof InvoiceAccessError) {
      return error(guardErr.message, guardErr.statusCode);
    }
    const message = guardErr instanceof Error ? guardErr.message : "Invoice access check failed";
    return error(message, 403);
  }

  // Submit to ETA
  const result = await submitToEta(invoiceId);

  if (result.success) {
    await audit({
      entityType: "INVOICE",
      entityId: invoiceId,
      action: "ETA_SUBMITTED",
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.platformRole,
      afterState: { etaUuid: result.uuid, etaStatus: "SUBMITTING" },
      ipAddress: request.headers.get("x-forwarded-for") || null,
      userAgent: request.headers.get("user-agent"),
    });

    return success(
      {
        message: "Invoice submitted to ETA successfully",
        uuid: result.uuid,
      },
      200
    );
  }

  // Submission failed — return error with liability disclaimer
  await audit({
    entityType: "INVOICE",
    entityId: invoiceId,
    action: "ETA_SUBMIT_FAILED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { error: result.error },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return error(
    `${result.error}. Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults.`,
    502
  );
}, { rateLimit: "financial" }); // 10 requests/minute — strict limit for financial operations
