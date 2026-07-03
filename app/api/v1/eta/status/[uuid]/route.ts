import { NextRequest } from "next/server";
import { etaClient } from "@/lib/eta/client";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ uuid: string }> }) => {
  const auth = await authenticate(request);
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { uuid } = resolved;

  const invoice = await prisma.invoice.findUnique({
    where: { etaUuid: uuid },
    select: { id: true, hotelId: true, supplierId: true },
  });

  if (invoice) {
    if (auth.platformRole === "HOTEL" && invoice.hotelId !== auth.tenantId) {
      return error("Forbidden", 403);
    }
    if (auth.platformRole === "SUPPLIER" && invoice.supplierId !== auth.tenantId) {
      return error("Forbidden", 403);
    }
  }

  try {
    const status = await etaClient.getInvoiceStatus(uuid);
    const record = status ? await etaClient.getInvoice(uuid) : null;

    return success({ uuid, status, record });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return error(`ETA status check failed: ${message}`, 502);
  }
});
