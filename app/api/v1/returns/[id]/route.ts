import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "return:read");
  const { id } = await ctx.params;

  const returnRequest = await prisma.returnRequest.findFirst({
    where: { id, tenantId: auth.tenantId },
    include: {
      order: { select: { id: true, orderNumber: true, status: true } },
      items: {
        include: {
          orderItem: { include: { product: { select: { id: true, name: true, sku: true } } } },
        },
      },
      creditNote: true,
    },
  });

  if (!returnRequest) return error("Return request not found", 404);
  return success({ returnRequest });
});
