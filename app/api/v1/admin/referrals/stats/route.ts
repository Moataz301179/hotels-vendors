import { NextRequest } from "next/server";
import { apiRoute, authenticate, requirePermission, success } from "@/lib/api-utils";
import { getReferralStats } from "@/lib/referral/pipeline";

/**
 * GET /api/v1/admin/referrals/stats
 *
 * Pipeline counts by stage + by entity type + conversion rate. Used by the
 * admin pipeline page's stats strip.
 */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:read");
  const stats = await getReferralStats();
  return success({ stats });
});
