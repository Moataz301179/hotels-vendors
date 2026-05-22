/**
 * ETA Mock Callback Receiver
 * Simulates receiving a callback from the Egyptian Tax Authority.
 * Useful for testing webhook handling without real ETA credentials.
 */

import { NextRequest } from "next/server";
import { apiRoute, success, ApiError } from "@/lib/api-utils";
import { processCallback } from "@/lib/eta/client";

export const POST = apiRoute(async (request: NextRequest) => {
  const body = await request.json();

  if (!body.uuid || !body.status) {
    throw new ApiError("Missing uuid or status", 400);
  }

  await processCallback({
    uuid: body.uuid,
    status: body.status,
    dateTimeValidated: body.dateTimeValidated || new Date().toISOString(),
    rejectionReasons: body.rejectionReasons,
  });

  return success({ processed: true, uuid: body.uuid, status: body.status });
});
