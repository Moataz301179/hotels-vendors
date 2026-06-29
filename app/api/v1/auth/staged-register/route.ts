import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { apiRoute, validateBody, success, error, audit } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/redis";
import { sendEmail, welcomeTemplate, emailVerificationTemplate } from "@/lib/notifications/email";
import { sendOtpSms } from "@/lib/sms";
import { randomInt, randomBytes } from "crypto";
import { z } from "zod";

const StagedRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  platformRole: z.enum(["HOTEL", "SUPPLIER", "FACTORING", "SHIPPING"]),
  password: z.string().min(8).optional(),
});

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function generateSecurePassword(): string {
  // Generate a 16-char random password (user will reset later)
  const length = 16;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  const bytes = randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

export const POST = apiRoute(async (request: NextRequest) => {
  // Rate limit: 5 registrations per hour per IP
  const clientIp =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rateLimit = await checkRateLimit(`staged-register:${clientIp}`, 3600, 5);
  if (!rateLimit.allowed) {
    return error("Too many registration attempts. Please try again later.", 429);
  }

  const body = await request.json();
  const data = validateBody(StagedRegisterSchema, body);

  // Check if email already exists
  const existingUser = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (existingUser) {
    return error("An account with this email already exists.", 409);
  }

  // Use provided password or generate one
  const password = data.password || generateSecurePassword();
  const passwordHash = await hashPassword(password);

  // Generate tenant slug
  const tenantSlug = `${data.platformRole.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const uniquePlaceholder = `PENDING-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // 1. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: `${data.name}'s Tenant`,
      slug: tenantSlug,
      type:
        data.platformRole === "HOTEL"
          ? "HOTEL_GROUP"
          : data.platformRole === "SUPPLIER"
            ? "SUPPLIER"
            : data.platformRole === "FACTORING"
              ? "FACTORING_COMPANY"
              : "SHIPPING_PROVIDER",
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
    phone: data.phone,
    passwordHash,
    platformRole: data.platformRole,
    role: "OWNER" as const,
    tenantId: tenant.id,
    roleId: ownerRole.id,
    accountType: "INDIVIDUAL" as const,
  };

  // 3. Create platform-specific entity + user with entity link
  let user: { id: string; email: string; name: string; platformRole: string; phone: string | null };

  if (data.platformRole === "HOTEL") {
    const hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        taxId: uniquePlaceholder,
        city: "Cairo",
        governorate: "Cairo",
        email: data.email,
        phone: data.phone,
        tenantId: tenant.id,
      },
    });
    user = await prisma.user.create({
      data: { ...userBase, hotelId: hotel.id },
      select: { id: true, email: true, name: true, platformRole: true, phone: true },
    });
  } else if (data.platformRole === "SUPPLIER") {
    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        taxId: uniquePlaceholder,
        email: data.email,
        city: "Cairo",
        governorate: "Cairo",
        phone: data.phone,
        tenantId: tenant.id,
        status: "PENDING_VERIFICATION",
        tier: "CORE",
      },
    });
    user = await prisma.user.create({
      data: { ...userBase, supplierId: supplier.id },
      select: { id: true, email: true, name: true, platformRole: true, phone: true },
    });
  } else if (data.platformRole === "FACTORING") {
    const factoringCompany = await prisma.factoringCompany.create({
      data: {
        name: data.name,
        taxId: uniquePlaceholder,
        contactEmail: data.email,
        contactPhone: data.phone,
        tenantId: tenant.id,
        status: "PENDING_VERIFICATION",
      },
    });
    user = await prisma.user.create({
      data: { ...userBase, factoringCompanyId: factoringCompany.id },
      select: { id: true, email: true, name: true, platformRole: true, phone: true },
    });
  } else {
    // SHIPPING — create Carrier record
    const carrier = await prisma.carrier.create({
      data: {
        name: data.name,
        contactEmail: data.email,
        contactPhone: data.phone,
        tenantId: tenant.id,
        status: "PENDING_VERIFICATION",
      },
    });
    user = await prisma.user.create({
      data: { ...userBase, carrierId: carrier.id },
      select: { id: true, email: true, name: true, platformRole: true, phone: true },
    });
  }

  // 4. Generate 6-digit OTP
  const otpCode = String(randomInt(100000, 999999));

  // Invalidate any existing unverified tokens for this phone
  await prisma.phoneVerificationToken.deleteMany({
    where: { userId: user.id, verified: false },
  });

  // Store token with 10-minute expiry
  await prisma.phoneVerificationToken.create({
    data: {
      userId: user.id,
      phone: data.phone,
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // 5. Generate email verification token
  const verifyToken = generateToken();
  await prisma.emailVerificationToken.create({
    data: {
      email: data.email,
      token: verifyToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  // 6. Send welcome + verification emails (non-blocking)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hotels-vendors.com";

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
    console.error("[StagedRegister] Failed to send welcome email to", data.email);
  }

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
    console.error("[StagedRegister] Failed to send verification email to", data.email);
  }

  // Send OTP via SMS (non-blocking)
  sendOtpSms(data.phone, otpCode).catch((err) =>
    console.error("[StagedRegister] SMS failed:", err)
  );

  // 7. Audit log
  await audit({
    entityType: "USER",
    entityId: user.id,
    action: "STAGED_REGISTER",
    tenantId: tenant.id,
    actorId: user.id,
    actorRole: user.platformRole,
    afterState: {
      email: user.email,
      platformRole: user.platformRole,
      tenantId: tenant.id,
      phone: data.phone,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  const isDev = process.env.NODE_ENV === "development";

  return success(
    {
      userId: user.id,
      phone: data.phone,
      ...(isDev ? { devCode: otpCode } : {}),
    },
    201
  );
});
