import { NextRequest } from "next/server";
import { adminOverride } from "@/lib/auth/authority-matrix";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const OverrideSchema = z.object({
  orderId: z.string().cuid(),
  reason: z.string().min(20),
  waivePaymentGuarantee: z.boolean().default(false),
  authorizerId: z.string().cuid(),
  coAuthorizerId: z.string().cuid(),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const data = OverrideSchema.parse(body);

  if (auth.platformRole !== "ADMIN") {
    return error("Forbidden: Admin only", 403);
  }

  const result = await adminOverride({
    orderId: data.orderId,
    action: "ADMIN_OVERRIDE",
    reason: data.reason,
    waivePaymentGuarantee: data.waivePaymentGuarantee,
    authorizerId: data.authorizerId,
    coAuthorizerId: data.coAuthorizerId,
  });

  if (!result.success) {
    return error(result.error || "Override failed", 400);
  }

  await audit({
    entityType: "ORDER",
    entityId: data.orderId,
    action: "ADMIN_OVERRIDE",
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { waived: data.waivePaymentGuarantee, reason: data.reason },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ message: "Admin override applied successfully" });
});
