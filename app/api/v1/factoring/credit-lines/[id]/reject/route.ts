import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "factoring:fund");
  const { id } = await params;
  const body = await request.json();
  await prisma.creditLineApplication.update({
    where: { id },
    data: { status: "REJECTED", rejectedReason: body.reason },
  });
  return success({ id, status: "REJECTED" });
});
