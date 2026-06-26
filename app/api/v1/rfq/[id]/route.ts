/**
 * RFQ Single-Record API
 *
 * GET — Fetch one RFQ with items + responses (tenant-scoped)
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(
  async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
    const auth = await authenticate(request);

    const resolved = await params;
    if (!resolved) return error("Missing parameter", 400);
    const { id } = resolved;

    const rfq = await prisma.rfqRequest.findUnique({
      where: { id },
      include: {
        hotel: { select: { id: true, name: true, city: true } },
        items: {
          orderBy: { createdAt: "asc" },
          include: {
            responses: {
              include: {
                rfqResponse: {
                  select: { id: true, supplierId: true, status: true },
                },
              },
            },
          },
        },
        responses: {
          orderBy: { createdAt: "desc" },
          include: {
            supplier: { select: { id: true, name: true, tier: true, city: true } },
            items: {
              include: {
                rfqItem: { select: { id: true, productName: true } },
              },
            },
          },
        },
        selectedResponse: {
          select: { id: true, supplier: { select: { id: true, name: true } } },
        },
      },
    });

    if (!rfq || rfq.tenantId !== auth.tenantId) {
      return error("RFQ not found", 404);
    }

    return success({ rfq });
  }
);
