import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, success, error } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest) => {
  const body = await request.json();
  const { companyName, email, sector, role, message, source } = body;

  if (!companyName || !email || !sector) {
    return error("companyName, email, and sector are required", 400);
  }

  const lead = await prisma.leadCapture.create({
    data: {
      companyName,
      email,
      sector,
      role: role || null,
      message: message || null,
      source: source || null,
    },
  });

  return success({ id: lead.id, message: "Lead captured successfully" }, 201);
});

export const GET = apiRoute(async () => {
  const leads = await prisma.leadCapture.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return success({ leads });
});
