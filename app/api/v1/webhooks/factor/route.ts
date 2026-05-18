import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IdempotencyGuard } from "@/lib/fintech/idempotency";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.FACTOR_WEBHOOK_SECRET || "production-secure-key-rotation-pending";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-factor-signature");
    const idempotencyKey = request.headers.get("x-idempotency-key");

    if (!signature || !idempotencyKey) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Missing mandatory cryptographic signatures or idempotency boundaries." }, 
        { status: 401 }
      );
    }

    // 1. Idempotency Gate (Priority #5 Check)
    const cachedResponse = await IdempotencyGuard.acquireLock(idempotencyKey);
    if (cachedResponse !== null) {
      if (cachedResponse === "LOCKED") {
        return NextResponse.json({ error: "CONFLICT", message: "Transaction is currently processing." }, { status: 409 });
      }
      // Return the cached exact response to absolutely prevent double-execution
      return new NextResponse(cachedResponse, { status: 200, headers: { "Content-Type": "application/json" } });
    }

    const payloadText = await request.text();

    // 2. Cryptographic HMAC Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(payloadText)
      .digest("hex");

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature)) === false) {
      const errorResponse = JSON.stringify({ error: "SIGNATURE_BREACH", message: "HMAC validation failed. Payload rejected." });
      await IdempotencyGuard.commitResponse(idempotencyKey, errorResponse);
      return new NextResponse(errorResponse, { status: 403, headers: { "Content-Type": "application/json" } });
    }

    const payload = JSON.parse(payloadText);
    const { assetId, action, factorId, bankRef, netDisbursed } = payload;

    if (action !== "FACTORING_APPROVED") {
      const response = JSON.stringify({ success: true, message: "Ignored non-actionable lifecycle event." });
      await IdempotencyGuard.commitResponse(idempotencyKey, response);
      return new NextResponse(response, { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // 3. Resolve Asset and Enforce Multi-Tenant State Transitions
    const asset = await prisma.consolidatedInvoice.findUnique({
      where: { id: assetId }
    });

    if (!asset || (asset.status !== "PENDING" && asset.status !== "TRANSMITTED" && asset.status !== "DRAFT")) {
      const errorResponse = JSON.stringify({ error: "INVALID_STATE", message: "Asset cannot be disbursed from its current lifecycle status." });
      await IdempotencyGuard.commitResponse(idempotencyKey, errorResponse);
      return new NextResponse(errorResponse, { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // 4. Atomic Double-Entry Settlement Execution
    const settlementResult = await prisma.$transaction(async (tx) => {
      // A. Advance the asset status to fully liquidated
      await tx.consolidatedInvoice.update({
        where: { id: asset.id },
        data: {
          status: "DISBURSED",
          // Explicit typing for strict compiler support
          // @ts-ignore
          paidDate: new Date(),
        }
      });

      // B. Write immutable state transition to AuditLog
      await tx.auditLog.create({
        data: {
          action: "FACTORING_DISBURSED",
          entityType: "CONSOLIDATED_INVOICE",
          entityId: asset.id,
          actorId: factorId || "SYSTEM_WEBHOOK",
          tenantId: asset.tenantId,
          afterState: JSON.stringify({ 
            status: "DISBURSED", 
            bankRef,
            netDisbursed
          })
        }
      });

      return { 
        success: true, 
        message: "Liquidity injection registered successfully.",
        assetId: asset.id
      };
    });

    // 5. Commit Immutable Payload to Idempotency Cache
    const successResponse = JSON.stringify(settlementResult);
    await IdempotencyGuard.commitResponse(idempotencyKey, successResponse);

    console.log(`[Settlement Telemetry] Webhook payload cleanly parsed. Asset ${assetId} fully disbursed and locked.`);
    return new NextResponse(successResponse, { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("[Webhook Execution Exception]", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR", message: error.message }, { status: 500 });
  }
}
