import { NextRequest } from "next/server";
import { verifyAuditChain } from "@/lib/audit/tamper-proof";
import { apiRoute, authenticate, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:reports");

  const result = await verifyAuditChain();

  if (!result.valid) {
    return success({
      valid: false,
      totalEntries: result.totalEntries,
      brokenAtIndex: result.brokenAtIndex,
      brokenEntryId: result.brokenEntryId,
      message: "AUDIT CHAIN BROKEN — possible tampering detected",
    });
  }

  return success({
    valid: true,
    totalEntries: result.totalEntries,
    message: "Audit log chain integrity verified — no tampering detected",
  });
});
