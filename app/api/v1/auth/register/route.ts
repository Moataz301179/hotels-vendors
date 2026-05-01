import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { BusinessRegisterSchema } from "@/lib/zod";
import { apiRoute, validateBody, success, audit } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest) => {
  const body = await request.json();
  const data = validateBody(BusinessRegisterSchema, body);

  const passwordHash = await hashPassword(data.password);

  let hotel;
  let supplier;
  let factoringCompany;
  let tenantId = "";

  const userBase = {
    email: data.email,
    name: data.name,
    passwordHash,
    platformRole: data.type.toUpperCase() as "HOTEL" | "SUPPLIER" | "FACTORING" | "SHIPPING" | "ADMIN",
    role: "OWNER" as const,
  };

  if (data.type === "hotel") {
    hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        taxId: data.taxId,
        city: data.city,
        governorate: data.governorate,
        address: data.address,
        commercialReg: data.commercialReg,
        email: data.email,
      },
    });
    tenantId = hotel.id;
    await prisma.user.create({
      data: { ...userBase, hotelId: hotel.id },
    });
  } else if (data.type === "supplier") {
    supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        taxId: data.taxId,
        email: data.email,
        city: data.city,
        governorate: data.governorate,
        address: data.address,
        commercialReg: data.commercialReg,
        phone: data.phone,
      },
    });
    tenantId = supplier.id;
    await prisma.user.create({
      data: { ...userBase, hotelId: "system" },
    });
  } else if (data.type === "factoring") {
    factoringCompany = await prisma.factoringCompany.create({
      data: {
        name: data.name,
        taxId: data.taxId,
        contactEmail: data.email,
        contactPhone: data.phone,
      },
    });
    tenantId = factoringCompany.id;
    await prisma.user.create({
      data: { ...userBase, hotelId: "system" },
    });
  } else {
    await prisma.user.create({
      data: { ...userBase, hotelId: "system" },
    });
    tenantId = "system";
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("User creation failed");
  }

  const token = await createSession(user.id, user.platformRole, tenantId);

  await audit({
    entityType: "USER",
    entityId: user.id,
    action: "REGISTER",
    actorId: user.id,
    actorRole: user.platformRole,
    afterState: { email: user.email, platformRole: user.platformRole, type: data.type },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, platformRole: user.platformRole },
    hotel,
    supplier,
    factoringCompany,
    tenantId,
  }, 201);
});
