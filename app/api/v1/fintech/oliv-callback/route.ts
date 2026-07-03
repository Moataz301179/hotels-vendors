import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, success, error, audit } from "@/lib/api-utils";
import { olivFinanceAdapter } from "@/lib/fintech/oliv-bridge";

export const dynamic = "force-dynamic";

/**
 * Oliv Finance Webhook Callback
 *
 * Receives async events from Oliv Finance:
 * - funding.disbursed
 * - funding.settled
 * - funding.defaulted
 * - funding.disputed
 * - hotel.payment_received
 *
 * Oliv sends a Bearer token in Authorization header for authentication.
 */

export const POST = apiRoute(async (request: NextRequest) => {
  // 1. Verify Oliv webhook auth token — mandatory, fail closed
  const olivWebhookToken = process.env.OLIV_WEBHOOK_TOKEN;
  if (!olivWebhookToken) {
    console.error("[Oliv Callback] OLIV_WEBHOOK_TOKEN not configured — rejecting all webhooks");
    return error("Webhook not configured", 503);
  }
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${olivWebhookToken}`) {
    return error("Unauthorized", 401);
  }

  const payload = await request.json();

  // 2. Normalize payload through Oliv adapter
  const result = await olivFinanceAdapter.handleWebhook(payload);
  if (!result.processed) {
    return error("Webhook processing failed", 400);
  }

  const olivFundingId = result.partnerFundingId;
  if (!olivFundingId) {
    console.warn("[Oliv Callback] Missing funding_id in payload");
    return success({ acknowledged: true, matched: false, reason: "missing_funding_id" });
  }

  // 3. Find FactoringRequest by Oliv funding_id stored in partnerResponse
  const factoringRequests = await prisma.factoringRequest.findMany({
    where: {
      factoringCompanyId: "oliv_finance",
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const matchedRequest = factoringRequests.find((fr) => {
    try {
      const parsed = JSON.parse(fr.partnerResponse || "{}");
      return parsed.factoringRequestId === olivFundingId;
    } catch {
      return false;
    }
  });

  if (!matchedRequest) {
    console.warn("[Oliv Callback] Unmatched funding_id:", olivFundingId);
    return success({ acknowledged: true, matched: false, reason: "unmatched_funding_id" });
  }

  // 4. Map Oliv event to FactoringRequestStatus
  let newStatus: "DISBURSED" | "SETTLED" | "DEFAULTED" | "UNDER_REVIEW" = matchedRequest.status as "DISBURSED" | "SETTLED" | "DEFAULTED" | "UNDER_REVIEW";
  let actionLabel = "OLIV_STATUS_UPDATE";

  switch (result.eventType) {
    case "funding.disbursed":
      newStatus = "DISBURSED";
      actionLabel = "OLIV_DISBURSED";
      break;
    case "funding.settled":
      newStatus = "SETTLED";
      actionLabel = "OLIV_SETTLED";
      break;
    case "funding.defaulted":
      newStatus = "DEFAULTED";
      actionLabel = "OLIV_DEFAULTED";
      break;
    case "hotel.payment_received":
      // Hotel paid Oliv — update settled if not already
      if (matchedRequest.status !== "SETTLED") {
        newStatus = "SETTLED";
        actionLabel = "OLIV_HOTEL_PAID";
      }
      break;
    default:
      actionLabel = `OLIV_${result.eventType}`;
  }

  // 5. Update FactoringRequest
  const updateData: Record<string, unknown> = { status: newStatus };

  if (result.updates.disbursedAt) {
    updateData.disbursedAt = new Date(result.updates.disbursedAt as string);
  }
  if (result.updates.settledAt) {
    updateData.settledAt = new Date(result.updates.settledAt as string);
  }
  if (result.updates.defaultedAt) {
    updateData.status = "DEFAULTED";
  }
  if (result.updates.hotelPaidAt) {
    updateData.hotelPaidAt = new Date(result.updates.hotelPaidAt as string);
  }

  await prisma.factoringRequest.update({
    where: { id: matchedRequest.id },
    data: updateData,
  });

  // 6. Update linked Invoice if settled
  if (newStatus === "SETTLED" && matchedRequest.invoiceId) {
    await prisma.invoice.update({
      where: { id: matchedRequest.invoiceId },
      data: {
        paymentStatus: "PAID",
        paidDate: new Date(),
        factoringStatus: "PAID",
      },
    });
  }

  // 7. Audit log
  await audit({
    entityType: "FactoringRequest",
    entityId: matchedRequest.id,
    action: actionLabel,
    tenantId: matchedRequest.tenantId,
    actorId: "oliv",
    actorRole: "SYSTEM",
    afterState: {
      olivFundingId,
      eventType: result.eventType,
      status: newStatus,
      updates: result.updates,
    },
  });

  return success({
    acknowledged: true,
    matched: true,
    factoringRequestId: matchedRequest.id,
    newStatus,
    eventType: result.eventType,
  });
});
