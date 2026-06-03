import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  apiRoute,
  authenticate,
  requirePermission,
  validateBody,
} from "@/lib/api-utils";
import {
  OPENCLAW_GATEWAY_URL,
  OPENCLAW_AUTOMATION_URL,
} from "@/lib/integrations/openclaw";

const ProxySchema = z.object({
  target: z.enum(["gateway", "automation"]).default("automation"),
  endpoint: z.string().min(1),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("POST"),
  body: z.record(z.string(), z.unknown()).optional(),
});

/**
 * POST /api/v1/openclaw/proxy
 * Proxies a request to the OpenClaw gateway or automation engine.
 * Requires: admin:manage_platform
 */
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const payload = validateBody(ProxySchema, await request.json());

  const baseUrl =
    payload.target === "gateway"
      ? OPENCLAW_GATEWAY_URL
      : OPENCLAW_AUTOMATION_URL;

  const url = `${baseUrl}${payload.endpoint}`;

  const res = await fetch(url, {
    method: payload.method,
    headers: { "Content-Type": "application/json" },
    body: payload.body ? JSON.stringify(payload.body) : undefined,
    signal: AbortSignal.timeout(30000),
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  return NextResponse.json({
    success: res.ok,
    status: res.status,
    data,
  });
});
