import { NextRequest } from "next/server";
import { generateDynamicTcpReport } from "@/lib/finance/savings-calculator";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ orderId: string }> }) => {
  const auth = await authenticate(request);
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { orderId } = resolved;

  const report = await generateDynamicTcpReport(orderId);

  return success({ report });
});
