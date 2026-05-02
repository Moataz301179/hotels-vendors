/**
 * Agent Pulse SSE Endpoint
 * Hotels Vendors — Real-time Admin Dashboard Feed
 *
 * Server-Sent Events for unidirectional real-time updates.
 * Vercel Edge compatible. Auto-reconnect.
 */

import { NextRequest } from "next/server";
import { authenticate, requirePermission } from "@/lib/api-utils";
import { createPulseStream } from "@/lib/intelligence/sse-pulse";

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:read");

  const stream = createPulseStream();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
