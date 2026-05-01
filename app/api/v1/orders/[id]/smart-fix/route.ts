import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSmartFixes } from "@/lib/fintech/risk-engine";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { hotel: true },
  });

  if (!order) {
    return error("Order not found", 404);
  }

  if (auth.platformRole === "HOTEL" && order.hotelId !== auth.tenantId) {
    return error("Forbidden", 403);
  }

  const fixes = await generateSmartFixes(id, order.hotelId, order.total);

  await audit({
    entityType: "ORDER",
    entityId: id,
    action: "GENERATE_SMART_FIXES",
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { fixCount: fixes.length, hotelRiskTier: order.hotel.riskTier },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ fixes });
});
