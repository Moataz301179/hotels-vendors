import { NextRequest } from "next/server";
import { getRiskHeatmapData } from "@/lib/fintech/risk-engine";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  if (auth.platformRole !== "ADMIN" && auth.platformRole !== "FACTORING") {
    return error("Forbidden", 403);
  }

  const data = await getRiskHeatmapData();
  return success({ heatmap: data });
});
