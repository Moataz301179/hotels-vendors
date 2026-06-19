import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { z } from "zod";

const TrackSchema = z.object({
  bannerId: z.string().min(1),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const { bannerId } = TrackSchema.parse(body);

  const banner = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!banner) return error("Banner not found", 404);

  const updated = await prisma.banner.update({
    where: { id: bannerId },
    data: { clickCount: { increment: 1 } },
  });

  return success({ clickCount: updated.clickCount, targetUrl: updated.targetUrl });
});
