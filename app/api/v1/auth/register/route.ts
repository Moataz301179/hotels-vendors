import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { BusinessRegisterSchema, MobileRegisterSchema } from "@/lib/zod";
import { apiRoute, validateBody, success, error, audit } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/redis";
import { sendEmail, welcomeTemplate, emailVerificationTemplate } from "@/lib/notifications/email";
import { randomBytes, createHash } from "crypto";
import { verifyOtp } from "@/lib/auth/otp";
import { normalizePhone, isValidEgyptianPhone, phoneToIdentifier } from "@/lib/auth/phone";
import { createSessionPair } from "@/lib/session";

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const POST = apiRoute(async (request: NextRequest) => {
  // Rate limit: 3 registrations per hour per IP
  const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const rateLimit = await checkRateLimit(`register:${clientIp}`, 3600, 3);
  if (!rateLimit.allowed) {
    return error("Too many registration attempts. Please try again later.", 429);
  }

  const body = await request.json();

  // Detect if mobile-style registration (has phone + otpCode)
  const isMobileRegistration = body.phone && body.otpCode;
  const schema = isMobileRegistration ? MobileRegisterSchema : BusinessRegisterSchema;
  const data = validateBody(
    schema as z.ZodSchema<{
      type?: "hotel" | "supplier" | "factoring" | "shipping";
      role?: "HOTEL" | "SUPPLIER" | "FACTORING" | "SHIPPING";
      name: string;
      email?: string;
      password: string;
      phone?: string;
      otpCode?: string;
      city?: string;
      governorate?: string;
      address?: string;
      taxId?: string;
      commercialReg?: string;
      marketingConsent?: boolean;
      termsAccepted: true;
      accountType?: "individual" | "business";
    }>,
    body
  );

  // Handle phone validation for mobile registration
  let normalizedPhone: string | null = null;
  if (data.phone) {
    normalizedPhone = normalizePhone(data.phone);
    if (!isValidEgyptianPhone(normalizedPhone)) {
      return error("Invalid Egyptian mobile number format", 400);
    }
  }

  // Mobile registration: verify OTP first
  if (isMobileRegistration) {
    const verifyResult = await verifyOtp(normalizedPhone!, data.otpCode!, "REGISTER");
    if (!verifyResult.success) {
      return error("Invalid or expired code", 400);
    }
  }

  // Check if email is already registered (only if email is provided and not a placeholder)
  const emailToUse = data.email || (normalizedPhone ? phoneToIdentifier(normalizedPhone) : null);
  if (emailToUse && !emailToUse.endsWith("@hotelsvendors.local")) {
    const existingUser = await prisma.user.findUnique({
      where: { email: emailToUse },
    });
    if (existingUser) {
      return error("An account with this email already exists. Please login or use a different email.", 409);
    }
  }

  // Check if phone is already registered
  if (normalizedPhone) {
    const existingPhoneUser = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });
    if (existingPhoneUser) {
      return error("An account with this mobile number already exists.", 409);
    }
  }

  const passwordHash = await hashPassword(data.password);

  let hotel;
  let supplier;
  let factoringCompany;

  // Map mobile role to legacy type
  let type = data.type;
  if (!type && data.role) {
    type = data.role.toLowerCase() as "hotel" | "supplier" | "factoring" | "shipping";
  }

  const platformRole = (type?.toUpperCase() || data.role || "HOTEL") as "HOTEL" | "SUPPLIER" | "FACTORING" | "SHIPPING" | "ADMIN";
  const isIndividual = data.accountType === "individual";
  const accountType = isIndividual ? "INDIVIDUAL" : "BUSINESS";

  // Generate tenant slug
  const tenantSlug = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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

  // Determine city/governorate with defaults
  const city = data.city || "Cairo";
  const governorate = data.governorate || "Cairo";

  const userBase = {
    email: emailToUse!,
    name: data.name,
    passwordHash,
    platformRole,
    role: "OWNER" as const,
    tenantId: tenant.id,
    roleId: ownerRole.id,
    accountType: accountType as "INDIVIDUAL" | "BUSINESS",
    marketingConsent: data.marketingConsent ?? false,
    termsAcceptedAt: new Date(),
    privacyPolicyVersion: process.env.PRIVACY_POLICY_VERSION || "1.0",
    phone: normalizedPhone,
    phoneVerifiedAt: isMobileRegistration ? new Date() : null,
  };

  if (type === "hotel") {
    hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        taxId: data.taxId || uniquePlaceholder,
        city,
        governorate,
        address: data.address,
        commercialReg: data.commercialReg,
        email: emailToUse!,
        tenantId: tenant.id,
      },
    });
    await prisma.user.create({
      data: { ...userBase, hotelId: hotel.id },
    });
  } else if (type === "supplier") {
    supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        taxId: data.taxId || uniquePlaceholder,
        email: emailToUse!,
        city,
        governorate,
        address: data.address,
        commercialReg: data.commercialReg,
        phone: normalizedPhone,
        tenantId: tenant.id,
        status: "ACTIVE",
        tier: "CORE",
      },
    });
    await prisma.user.create({
      data: { ...userBase, supplierId: supplier.id },
    });
  } else if (type === "factoring") {
    factoringCompany = await prisma.factoringCompany.create({
      data: {
        name: data.name,
        taxId: data.taxId || uniquePlaceholder,
        contactEmail: emailToUse!,
        contactPhone: normalizedPhone,
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

  const user = await prisma.user.findUnique({
    where: { email: emailToUse! },
  });

  if (!user) {
    throw new Error("User creation failed");
  }

  // Generate email verification token (only for real emails, not placeholders)
  const isPlaceholderEmail = emailToUse?.endsWith("@hotelsvendors.local");
  let verifyToken: string | null = null;
  let verifyTokenHash: string | null = null;

  if (!isPlaceholderEmail) {
    verifyToken = generateToken();
    verifyTokenHash = hashToken(verifyToken);
    await prisma.emailVerificationToken.create({
      data: {
        email: emailToUse!,
        token: verifyTokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsvendors.com";

  // Send welcome email (skip for placeholder emails)
  if (!isPlaceholderEmail) {
    try {
      const welcome = welcomeTemplate({
        name: data.name,
        loginUrl: `${baseUrl}/login`,
      });
      await sendEmail({
        to: [emailToUse!],
        subject: welcome.subject,
        html: welcome.html,
      });
    } catch {
      console.error("[Register] Failed to send welcome email to", emailToUse);
    }

    // Send verification email
    if (verifyToken) {
      try {
        const verification = emailVerificationTemplate({
          name: data.name,
          verificationUrl: `${baseUrl}/verify-email?token=${verifyToken}`,
        });
        await sendEmail({
          to: [emailToUse!],
          subject: verification.subject,
          html: verification.html,
        });
      } catch {
        console.error("[Register] Failed to send verification email to", emailToUse);
      }
    }
  }

  await audit({
    entityType: "USER",
    entityId: user.id,
    action: "REGISTER",
    tenantId: tenant.id,
    actorId: user.id,
    actorRole: user.platformRole,
    afterState: { email: user.email, platformRole: user.platformRole, type, accountType, tenantId: tenant.id, phone: normalizedPhone },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  // Issue session pair for mobile (so user lands logged in)
  const { accessToken, refreshToken } = await createSessionPair(user.id, user.platformRole, user.tenantId || user.hotelId || "legacy");

  // Build response user object matching mobile app expectations
  const userResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    platformRole: user.platformRole,
    tenantId: user.tenantId,
    phone: user.phone,
    phoneVerifiedAt: user.phoneVerifiedAt,
    supplierId: user.supplierId,
    hotelId: user.hotelId,
  };

  return success({
    message: isMobileRegistration ? "Registration successful" : "Registration successful. Please check your email to verify your account before logging in.",
    accessToken,
    refreshToken,
    user: userResponse,
    hotel,
    supplier,
    factoringCompany,
    tenantId: tenant.id,
  }, 201);
});