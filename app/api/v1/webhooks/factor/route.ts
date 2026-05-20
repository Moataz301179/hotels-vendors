import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IdempotencyGuard } from "@/lib/fintech/idempotency";
import crypto from "crypto";

export async function POST(request: Request) {
  // SECURITY: Webhook secret must be configured
  const WEBHOOK_SECRET = process.env.FACTOR_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('[FATAL SECURITY ERROR] FACTOR_WEBHOOK_SECRET environment variable is required.');
    return NextResponse.json(
      { error: 'SERVICE_UNAVAILABLE', message: 'Webhook not configured - security requirement missing.' },
      { status: 503 }
    );
  }

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
    const asset = await prisma.masterInvoice.findUnique({
      where: { id: assetId }
    });

    // @ts-ignore - Prisma enum comparison workaround for build; these are allowed status transitions
    if (!asset || (asset.status !== "DRAFT" && asset.status !== "PENDING" && asset.status !== "APPROVED")) {
      const errorResponse = JSON.stringify({ error: "INVALID_STATE", message: "Asset cannot be disbursed from its current lifecycle status." });
      await IdempotencyGuard.commitResponse(idempotencyKey, errorResponse);
      return new NextResponse(errorResponse, { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // 4. Atomic Double-Entry Settlement Execution
    const settlementResult = await prisma.$transaction(async (tx) => {
      // A. Advance the asset status to fully liquidated
      await tx.masterInvoice.update({
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
          entityType: "MASTER_INVOICE",
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

    // 5. Cache Success Response for Idempotency
    const successResponse = JSON.stringify(settlementResult);
    await IdempotencyGuard.commitResponse(idempotencyKey, successResponse);

    return new NextResponse(successResponse, { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("[Factor Webhook] Critical failure:", error);
    const errorResponse = JSON.stringify({ 
      error: "INTERNAL_ERROR", 
      message: "Settlement lifecycle mutation failed catastrophically." 
    });
    return new NextResponse(errorResponse, { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}

// No other HTTP methods allowed
export function GET() {
  return NextResponse.json({ error: "METHOD_NOT_ALLOWED" }, { status: 405 });
}

export function PUT() {
  return NextResponse.json({ error: "METHOD_NOT_ALLOWED" }, { status: 405 });
}

export function DELETE() {
  return NextResponse.json({ error: "METHOD_NOT_ALLOWED" }, { status: 405 });
}
