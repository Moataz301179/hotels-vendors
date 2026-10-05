import { NextRequest } from "next/server";
import { z } from "zod";
import { apiRoute, authenticate, success, ApiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { deletePrivatePodPhoto, storePrivatePodPhoto } from "@/lib/logistics/private-pod-storage";

export const runtime = "nodejs";

const PodSchema = z.object({
  stopId: z.string().min(1),
  photoUrl: z.string().url().refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  }).optional(),
  signatureUrl: z.string().url().optional(),
  notes: z.string().max(500).optional(),
  receivedBy: z.string().trim().min(1).max(120).optional(),
  status: z.enum(["POD_CAPTURED", "FAILED"]).default("POD_CAPTURED"),
});

function readFormString(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  return typeof value === "string" ? value : undefined;
}

/**
 * POST /api/v1/shipping/pod — Submit proof-of-delivery or report a failed stop.
 * Multipart requests store camera evidence outside the public release directory.
 */
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  if (auth.platformRole !== "SHIPPING" && auth.platformRole !== "ADMIN") throw new ApiError("Forbidden", 403);
  const contentType = request.headers.get("content-type") ?? "";
  let validated: z.infer<typeof PodSchema>;
  let photoFile: File | undefined;

  if (contentType.toLowerCase().includes("multipart/form-data")) {
    const form = await request.formData();
    const photo = form.get("photo");
    const receivedBy = readFormString(form, "receivedBy")?.trim();
    validated = PodSchema.parse({
      stopId: readFormString(form, "stopId"),
      receivedBy: receivedBy || undefined,
      notes: readFormString(form, "notes"),
      status: readFormString(form, "status") ?? "POD_CAPTURED",
    });

    if (validated.status === "POD_CAPTURED") {
      if (!(photo instanceof File)) {
        throw new ApiError("A delivery photo is required", 400);
      }
      photoFile = photo;
    } else if (photo instanceof File && photo.size > 0) {
      throw new ApiError("Photos are only accepted for completed deliveries", 400);
    }
  } else {
    validated = PodSchema.parse(await request.json());
  }

  const stop = await prisma.tripStop.findFirst({
    where: { id: validated.stopId, tenantId: auth.tenantId, deletedAt: null },
    include: { trip: { select: { id: true, tripNumber: true, status: true } } },
  });
  if (!stop) throw new ApiError("Trip stop not found", 404);

  let photoReference: string | undefined;
  if (photoFile) {
    try {
      photoReference = (await storePrivatePodPhoto(photoFile)).reference;
    } catch (error) {
      throw new ApiError(error instanceof Error ? error.message : "Invalid delivery photo", 400);
    }
  }

  const noteParts = [
    validated.receivedBy ? "Received by: " + validated.receivedBy : undefined,
    validated.notes,
  ].filter(Boolean);
  const savedNotes = noteParts.length > 0 ? noteParts.join("\n").slice(0, 500) : undefined;

  const updated = await (async () => {
    try {
      return await prisma.$transaction(async (tx) => {
        const updatedStop = await tx.tripStop.update({
          where: { id: validated.stopId },
          data: {
            ...(photoReference ? { podPhotoUrl: photoReference } : validated.photoUrl ? { podPhotoUrl: validated.photoUrl } : {}),
            ...(validated.signatureUrl ? { signatureUrl: validated.signatureUrl } : {}),
            ...(savedNotes !== undefined ? { notes: savedNotes } : {}),
            status: validated.status,
            ...(validated.status === "POD_CAPTURED" ? { actualArrival: new Date(), arrivedAt: new Date() } : {}),
          },
          include: {
            trip: { select: { id: true, tripNumber: true } },
            hotel: { select: { id: true, name: true } },
          },
        });

        const allStops = await tx.tripStop.findMany({
          where: { tripId: stop.tripId, deletedAt: null },
        });
        const allCaptured = allStops.every((item) => item.status === "POD_CAPTURED" || item.status === "DELIVERED");
        if (allCaptured && stop.trip.status !== "COMPLETED") {
          await tx.trip.update({
            where: { id: stop.tripId },
            data: { status: "COMPLETED", completedAt: new Date() },
          });
        }
        return { stop: updatedStop, tripComplete: allCaptured };
      });
    } catch (error) {
      if (photoReference) await deletePrivatePodPhoto(photoReference).catch(() => undefined);
      throw error;
    }
  })();

  return success({
    ...updated,
    message: validated.status === "FAILED"
      ? "Delivery failure recorded"
      : updated.tripComplete
        ? "All stops delivered — trip auto-completed"
        : "Proof of delivery saved",
  });
}, { rateLimit: "api" });

/**
 * GET /api/v1/shipping/pod?tripId=xxx — Get POD status for a trip.
 */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  if (auth.platformRole !== "SHIPPING" && auth.platformRole !== "ADMIN") throw new ApiError("Forbidden", 403);
  const tripId = new URL(request.url).searchParams.get("tripId");
  if (!tripId) throw new ApiError("tripId query param required", 400);

  const stops = await prisma.tripStop.findMany({
    where: { tripId, tenantId: auth.tenantId, deletedAt: null },
    select: {
      id: true,
      stopNumber: true,
      status: true,
      podPhotoUrl: true,
      signatureUrl: true,
      actualArrival: true,
      notes: true,
      hotel: { select: { name: true } },
    },
    orderBy: { stopOrder: "asc" },
  });
  const total = stops.length;
  const captured = stops.filter((item) => item.status === "POD_CAPTURED" || item.status === "DELIVERED").length;

  return success({
    tripId,
    totalStops: total,
    capturedStops: captured,
    percentComplete: total > 0 ? Math.round((captured / total) * 100) : 0,
    stops,
  });
}, { rateLimit: "api" });
