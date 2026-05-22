import { NextRequest } from "next/server";
import { apiRoute, success } from "@/lib/api-utils";

export const GET = apiRoute(async (_request: NextRequest) => {
  return success({
    mockMode: process.env.ETA_MOCK_MODE === "true",
    apiUrl: process.env.ETA_API_URL || "https://api.preprod.invoicing.eta.gov.eg",
  });
});
