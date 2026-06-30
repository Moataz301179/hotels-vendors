import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success, error } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "factoring:fund");
  const { id } = await params;
  const body = await request.json();
  const { approvedLimit, approvedInterestRate } = body;

  await prisma.creditLineApplication.update({
    where: { id },
    data: {
      status: "APPROVED",
      approvedLimit,
      approvedInterestRate,
      approvedAt: new Date(),
    },
  });

  return success({ id, status: "APPROVED" });
});
