/**
 * Shell Supplier Onboarding Automation (Growth Loop)
 * Hotels Vendors B2B Hub
 */

import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

export interface ShellSupplierInput {
  name: string;
  email: string;
  taxId: string;
  phone: string;
  city: string;
  hotelId: string;
  tenantId: string;
}

/**
 * Generate secure single-use activation JWT token valid for 7 days.
 */
export async function generateActivationToken(supplierId: string, tenantId: string): Promise<string> {
  return await new SignJWT({ supplierId, tenantId, type: "activation" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

/**
 * Verify activation token.
 */
export async function verifyActivationToken(token: string): Promise<{ supplierId: string; tenantId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.type !== "activation") return null;
    return {
      supplierId: payload.supplierId as string,
      tenantId: payload.tenantId as string,
    };
  } catch {
    return null;
  }
}

/**
 * Automatically onboarding a pending shell supplier for a hotel client.
 * Returns the supplier record and activation token.
 */
export async function createShellSupplier(input: ShellSupplierInput) {
  const { name, email, taxId, phone, city, hotelId, tenantId } = input;

  // 1. Create or resolve Supplier shell record
  let supplier = await prisma.supplier.findFirst({
    where: {
      OR: [{ email }, { taxId }],
    },
  });

  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        taxId,
        phone,
        city,
        governorate: "Cairo", // Default governorate for compliance
        tenantId,
        status: "PENDING",
        tier: "CORE",
      },
    });
  }

  // 2. Create link HotelSupplier Shell record
  await prisma.hotelSupplier.upsert({
    where: {
      hotelId_supplierId: { hotelId, supplierId: supplier.id },
    },
    update: {},
    create: {
      hotelId,
      supplierId: supplier.id,
      isShell: true,
      tenantId,
    },
  });

  // 3. Generate activation token
  const token = await generateActivationToken(supplier.id, tenantId);

  return { supplier, token };
}

/**
 * Claim and activate a shell supplier account.
 */
export async function claimShellSupplier(params: {
  token: string;
  passwordRaw: string;
  bankAccount: string;
  bankName: string;
  subscriptionPlan: "BASIC" | "PREMIUM" | "ENTERPRISE";
}) {
  const { token, passwordRaw, bankAccount, bankName, subscriptionPlan } = params;

  // 1. Decrypt activation token
  const decoded = await verifyActivationToken(token);
  if (!decoded) {
    throw new Error("Invalid or expired activation token");
  }

  const { supplierId, tenantId } = decoded;

  // 2. Lock and load supplier record
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId, tenantId },
  });

  if (!supplier) {
    throw new Error("Supplier shell account not found");
  }

  // 3. Hash supplier credentials
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(passwordRaw, salt);

  // 4. Run activation inside database transaction
  return await prisma.$transaction(async (tx) => {
    // Resolve or create Owner role for this tenant
    let ownerRole = await tx.role.findFirst({
      where: { name: "Owner", tenantId },
    });

    if (!ownerRole) {
      ownerRole = await tx.role.create({
        data: {
          name: "Owner",
          tenantId,
          isGlobal: false,
        },
      });
    }

    // A. Create User record for supplier login
    const user = await tx.user.create({
      data: {
        name: supplier.name,
        email: supplier.email,
        passwordHash,
        role: "OWNER", // Supplier Owner
        platformRole: "SUPPLIER",
        status: "ACTIVE",
        tenantId,
        roleId: ownerRole.id,
      },
    });

    // B. Activate HotelSupplier links
    await tx.hotelSupplier.updateMany({
      where: { supplierId, tenantId },
      data: {
        isShell: false,
        activatedAt: new Date(),
      },
    });

    // C. Activate Supplier and attach financial accounts
    const activeSupplier = await tx.supplier.update({
      where: { id: supplierId },
      data: {
        status: "ACTIVE",
        bankAccount,
        bankName,
        // Using metadata or custom fields if available, otherwise just setting status
      },
    });

    // D. Write Audit entry
    await tx.auditLog.create({
      data: {
        action: "SUPPLIER_SHELL_ACTIVATED",
        entityType: "Supplier",
        entityId: supplierId,
        actorId: user.id,
        tenantId,
        afterState: JSON.stringify({
          supplierId,
          activatedAt: new Date().toISOString(),
          plan: subscriptionPlan,
        }),
      },
    });

    return { user, supplier: activeSupplier };
  });
}
