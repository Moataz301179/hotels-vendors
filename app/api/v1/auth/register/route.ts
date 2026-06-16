import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { BusinessRegisterSchema } from "@/lib/zod";
import { apiRoute, validateBody, success, error, audit } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/redis";
import { sendEmail, welcomeTemplate, emailVerificationTemplate } from "@/lib/notifications/email";
import { randomBytes } from "crypto";

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export const POST = apiRoute(async (request: NextRequest) => {
  // Rate limit: 3 registrations per hour per IP
  const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const rateLimit = await checkRateLimit(`register:${clientIp}`, 3600, 3);
  if (!rateLimit.allowed) {
    return error("Too many registration attempts. Please try again later.", 429);
  }

  const body = await request.json();
  const data = validateBody(BusinessRegisterSchema, body);

  const passwordHash = await hashPassword(data.password);

  let hotel;
  let supplier;
  let factoringCompany;

  const platformRole = data.type.toUpperCase() as "HOTEL" | "SUPPLIER" | "FACTORING" | "SHIPPING" | "ADMIN";
  const isIndividual = data.accountType === "individual";
  const accountType = isIndividual ? "INDIVIDUAL" : "BUSINESS";

  // Generate tenant slug — no longer depends on taxId
  const tenantSlug = `${data.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const uniquePlaceholder = `PENDING-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // 1. Create Tenant first — every entity belongs to a tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: data.name,
      slug: tenantSlug,
      type: platformRole === "HOTEL" ? "HOTEL_GROUP" :
            platformRole === "SUPPLIER" ? "SUPPLIER" :
            platformRole === "FACTORING" ? "FACTORING_COMPANY" :
            platformRole === "SHIPPING" ? "SHIPPING_PROVIDER" : "PLATFORM",
      taxId: data.taxId || null,
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
    accountType: accountType as "INDIVIDUAL" | "BUSINESS",
  };

  if (data.type === "hotel") {
    hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        taxId: data.taxId || uniquePlaceholder,
        city: data.city || "Cairo",
        governorate: data.governorate || "Cairo",
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
        taxId: data.taxId || uniquePlaceholder,
        email: data.email,
        city: data.city || "Cairo",
        governorate: data.governorate || "Cairo",
        address: data.address,
        commercialReg: data.commercialReg,
        phone: data.phone,
        tenantId: tenant.id,
        status: "ACTIVE", // Auto-approve for testing
        tier: "CORE",
      },
    });
    await prisma.user.create({
      data: { ...userBase, supplierId: supplier.id },
    });
  } else if (data.type === "factoring") {
    factoringCompany = await prisma.factoringCompany.create({
      data: {
        name: data.name,
        taxId: data.taxId || uniquePlaceholder,
        contactEmail: data.email,
        contactPhone: data.phone,
        tenantId: tenant.id,
        status: "ACTIVE",
      },
    });
    await prisma.user.create({
      data: { ...userBase, factoringCompanyId: factoringCompany.id },
    });
  } else {
    // Shipping or individual — create user only, no entity yet
    await prisma.user.create({
      data: userBase,
    });
  }

  const user = await prisma.user.findFirst({
    where: { email: data.email, tenantId: tenant.id },
  });

  if (!user) {
    throw new Error("User creation failed");
  }

  // Generate email verification token
  const verifyToken = generateToken();
  await prisma.emailVerificationToken.create({
    data: {
      email: data.email,
      token: verifyToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hotels-vendors.com";

  // Send welcome email
  try {
    const welcome = welcomeTemplate({
      name: data.name,
      loginUrl: `${baseUrl}/login`,
    });
    await sendEmail({
      to: [data.email],
      subject: welcome.subject,
      html: welcome.html,
    });
  } catch {
    // Non-blocking: log but don't fail registration
    console.error("[Register] Failed to send welcome email to", data.email);
  }

  // Send verification email
  try {
    const verification = emailVerificationTemplate({
      name: data.name,
      verificationUrl: `${baseUrl}/verify-email?token=${verifyToken}`,
    });
    await sendEmail({
      to: [data.email],
      subject: verification.subject,
      html: verification.html,
    });
  } catch {
    console.error("[Register] Failed to send verification email to", data.email);
  }

  const token = await createSession(user.id, user.platformRole, tenant.id);

  await audit({
    entityType: "USER",
    entityId: user.id,
    action: "REGISTER",
    tenantId: tenant.id,
    actorId: user.id,
    actorRole: user.platformRole,
    afterState: { email: user.email, platformRole: user.platformRole, type: data.type, accountType, tenantId: tenant.id },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, platformRole: user.platformRole, accountType: user.accountType },
    hotel,
    supplier,
    factoringCompany,
    tenantId: tenant.id,
  }, 201);
});
