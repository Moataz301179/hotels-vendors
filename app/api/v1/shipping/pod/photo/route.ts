import { NextRequest } from "next/server";
import { apiRoute, authenticate, ApiError } from "@/lib/api-utils";
import { readPrivatePodPhoto } from "@/lib/logistics/private-pod-storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** Serve POD evidence only to authenticated users in the stop's tenant. */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  if (auth.platformRole !== "SHIPPING" && auth.platformRole !== "ADMIN") throw new ApiError("Forbidden", 403);
  const stopId = new URL(request.url).searchParams.get("stopId");
  if (!stopId) throw new ApiError("stopId query param required", 400);

  const stop = await prisma.tripStop.findFirst({
    where: { id: stopId, tenantId: auth.tenantId, deletedAt: null },
    select: { podPhotoUrl: true },
  });
  if (!stop) throw new ApiError("Trip stop not found", 404);
  if (!stop.podPhotoUrl?.startsWith("private-pod:")) {
    throw new ApiError("No private delivery photo is available", 404);
  }

  const photo = await readPrivatePodPhoto(stop.podPhotoUrl);
  if (!photo) throw new ApiError("Delivery photo not found", 404);

  return new Response(new Uint8Array(photo.bytes), {
    headers: {
      "Content-Type": photo.contentType,
      "Content-Length": String(photo.bytes.byteLength),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}, { rateLimit: "api" });
