import { NextRequest } from "next/server";
import { etaClient } from "@/lib/eta/client";
import { apiRoute, success, error } from "@/lib/api-utils";
import { z } from "zod";

const CallbackSchema = z.object({
  uuid: z.string().min(1),
  status: z.enum(["Submitted", "Valid", "Invalid", "Rejected", "Cancelled"]),
  dateTimeValidated: z.string().optional(),
  rejectionReasons: z.array(z.object({ error: z.string(), errorCode: z.string() })).optional(),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const body = await request.json();
  const data = CallbackSchema.parse(body);

  try {
    await etaClient.processCallback(data);
    return success({ message: "Callback processed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return error(`Callback processing failed: ${message}`, 502);
  }
});
