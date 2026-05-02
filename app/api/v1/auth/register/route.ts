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

  const platformRole = data.type.toUpperCase() as "HOTEL" | "SUPPLIER" | "FACTORING" | "SHIPPING" | "ADMIN";

  // 1. Create Tenant first — every entity belongs to a tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: data.name,
      slug: `${data.type}-${data.taxId}`,
      type: platformRole === "HOTEL" ? "HOTEL_GROUP" :
            platformRole === "SUPPLIER" ? "SUPPLIER" :
            platformRole === "FACTORING" ? "FACTORING_COMPANY" :
            platformRole === "SHIPPING" ? "SHIPPING_PROVIDER" : "PLATFORM",
      taxId: data.taxId,
    },
  });

  // 2. Create a default Owner role for this tenant
  const ownerRole = await prisma.role.create({
    data: {
      name: "Owner",
      tenantId: tenant.id,
      isGlobal: false,
    },
  });

  const userBase = {
    email: data.email,
    name: data.name,
    passwordHash,
    platformRole,
    role: "OWNER" as const,
    tenantId: tenant.id,
    roleId: ownerRole.id,
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
        tenantId: tenant.id,
      },
    });
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
        tenantId: tenant.id,
      },
    });
    await prisma.user.create({
      data: { ...userBase, supplierId: supplier.id },
    });
  } else if (data.type === "factoring") {
    factoringCompany = await prisma.factoringCompany.create({
      data: {
        name: data.name,
        taxId: data.taxId,
        contactEmail: data.email,
        contactPhone: data.phone,
        tenantId: tenant.id,
      },
    });
    await prisma.user.create({
      data: { ...userBase, factoringCompanyId: factoringCompany.id },
    });
  } else {
    await prisma.user.create({
      data: userBase,
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("User creation failed");
  }

  const token = await createSession(user.id, user.platformRole, tenant.id);

  await audit({
    entityType: "USER",
    entityId: user.id,
    action: "REGISTER",
    tenantId: tenant.id,
    actorId: user.id,
    actorRole: user.platformRole,
    afterState: { email: user.email, platformRole: user.platformRole, type: data.type, tenantId: tenant.id },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, platformRole: user.platformRole },
    hotel,
    supplier,
    factoringCompany,
    tenantId: tenant.id,
  }, 201);
});
