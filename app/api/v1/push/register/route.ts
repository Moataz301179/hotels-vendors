import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success } from "@/lib/api-utils";

const RegisterSchema = z.object({
  token: z.string().min(10).max(500),
  platform: z.enum(["ios", "android", "web"]),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const data = RegisterSchema.parse(body);

  await prisma.pushToken.upsert({
    where: { token: data.token },
    update: { userId: auth.userId, tenantId: auth.tenantId, platform: data.platform, deletedAt: null },
    create: {
      userId: auth.userId,
      tenantId: auth.tenantId,
      token: data.token,
      platform: data.platform,
    },
  });

  return success({ registered: true });
});
