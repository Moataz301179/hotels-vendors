import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SupplierCreateSchema } from "@/lib/zod";
import { ZodError } from "zod";
import { checkRateLimit } from "@/lib/redis";

/**
 * POST /api/v1/supplier/onboard
 * Public endpoint for supplier self-registration.
 * Creates a Supplier with PENDING status for admin review.
 */
export async function POST(request: NextRequest) {
  // Rate limit: 3 registrations per hour per IP
  const clientIp =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rateLimit = await checkRateLimit(
    `supplier_onboard:${clientIp}`,
    3600,
    3
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many registration attempts. Please try again later.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Validate with Zod
    const validated = SupplierCreateSchema.parse(body);

    // Check for existing supplier with same email or taxId
    const existing = await prisma.supplier.findFirst({
      where: {
        OR: [{ email: validated.email }, { taxId: validated.taxId }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            existing.email === validated.email
              ? "A supplier with this email already exists"
              : "A supplier with this Tax ID already exists",
        },
        { status: 409 }
      );
    }

    // Find or create a default tenant for unauthenticated onboarding
    let tenant = await prisma.tenant.findFirst({
      where: { slug: "default" },
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: "Default Tenant",
          slug: "default",
          status: "ACTIVE",
          taxId: "000000000",
          type: "HOTEL_GROUP",
        },
      });
    }

    // Create the supplier with PENDING status
    const supplier = await prisma.supplier.create({
      data: {
        ...validated,
        tenantId: tenant.id,
        status: "PENDING",
        tier: "CORE",
      },
    });

    // Create an audit log entry
    await prisma.auditLog.create({
      data: {
        action: "SUPPLIER_ONBOARDING_SUBMITTED",
        entityType: "Supplier",
        entityId: supplier.id,
        actorId: "system",
        tenantId: tenant.id,
        afterState: JSON.stringify({
          supplierName: supplier.name,
          email: supplier.email,
          taxId: supplier.taxId,
          city: supplier.city,
        }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: supplier.id,
          name: supplier.name,
          status: supplier.status,
          message:
            "Your application has been submitted successfully and is pending review.",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error("Supplier onboarding error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process application" },
      { status: 500 }
    );
  }
}
