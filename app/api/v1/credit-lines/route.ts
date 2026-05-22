/**
 * Hotel Credit Lines API
 * POST — Apply for or create a credit line
 * GET — List credit lines
 * PATCH — Update status (admin/NBFI)
 */

import { NextRequest } from "next/server";
import { apiRoute, authenticate, requirePermission, success, ApiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { auditHotelEligibility, createCreditLine, repayDraw } from "@/lib/payments/hotel-credit";

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const body = await request.json();

  // Hotel applies for credit line
  if (body.action === "apply") {
    if (!body.hotelId || !body.requestedLimit || !body.nbfiPartnerId) {
      throw new ApiError("hotelId, requestedLimit, and nbfiPartnerId required", 400);
    }

    const decision = await auditHotelEligibility({
      hotelId: body.hotelId,
      tenantId: auth.tenantId,
      nbfiPartnerId: body.nbfiPartnerId,
      requestedLimit: body.requestedLimit,
      tenorDays: body.tenorDays || 60,
    });

    return success({
      decision,
      message: decision.approved
        ? `Pre-approved for EGP ${decision.approvedLimit} at ${(decision.interestRate * 100).toFixed(1)}% APR`
        : decision.reason,
    });
  }

  // Admin/NBFI creates the credit line after approval
  if (body.action === "create") {
    await requirePermission(auth, "admin:manage_payments");

    if (!body.hotelId || !body.approvedLimit || !body.interestRate) {
      throw new ApiError("hotelId, approvedLimit, and interestRate required", 400);
    }

    const line = await createCreditLine({
      hotelId: body.hotelId,
      tenantId: auth.tenantId,
      nbfiPartnerId: body.nbfiPartnerId,
      approvedLimit: body.approvedLimit,
      interestRate: body.interestRate,
      tenorDays: body.tenorDays || 60,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });

    return success(line, 201);
  }

  // Repay a draw
  if (body.action === "repay") {
    if (!body.drawId || !body.amount) {
      throw new ApiError("drawId and amount required", 400);
    }

    const result = await repayDraw(body.drawId, body.amount, body.type);
    return success(result);
  }

  throw new ApiError("Invalid action. Use apply, create, or repay", 400);
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get("hotelId");
  const status = searchParams.get("status");

  const lines = await prisma.hotelCreditLine.findMany({
    where: {
      tenantId: auth.tenantId,
      ...(hotelId && { hotelId }),
      ...(status && { status: status as any }),
    },
    include: { draws: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  return success(lines);
});
