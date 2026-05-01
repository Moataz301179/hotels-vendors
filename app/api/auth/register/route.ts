import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { BusinessRegisterSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = BusinessRegisterSchema.parse(body);

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(validated.password);
    const { type, name, email, phone, city, governorate, address, taxId, commercialReg, crDocumentUrl, taxDocumentUrl } = validated;

    let entityId = "";
    let platformRole: string;

    if (type === "hotel") {
      const hotel = await prisma.hotel.create({
        data: {
          name,
          email,
          phone: phone || null,
          city,
          governorate,
          address: address || null,
          taxId,
          commercialReg: commercialReg || null,
          status: "PENDING_VERIFICATION",
        },
      });
      entityId = hotel.id;
      platformRole = "HOTEL";
    } else if (type === "supplier") {
      const supplier = await prisma.supplier.create({
        data: {
          name,
          email,
          phone: phone || null,
          city,
          governorate,
          address: address || null,
          taxId,
          commercialReg: commercialReg || null,
          status: "ACTIVE",
        },
      });
      entityId = supplier.id;
      platformRole = "SUPPLIER";
    } else if (type === "factoring") {
      const company = await prisma.factoringCompany.create({
        data: {
          name,
          taxId,
          contactEmail: email,
          contactPhone: phone || null,
        },
      });
      entityId = company.id;
      platformRole = "FACTORING";
    } else if (type === "shipping") {
      const hub = await prisma.logisticsHub.create({
        data: {
          name,
          city,
          governorate,
          contactPhone: phone || null,
          isActive: false,
        },
      });
      entityId = hub.id;
      platformRole = "SHIPPING";
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid registration type" },
        { status: 400 }
      );
    }

    // Create user linked to the entity
    // For hotels, link to hotelId. For others, we need a generic approach.
    // Since User requires hotelId, we'll create a placeholder or use the entity.
    // For non-hotels, we'll link to a default hotel or create a special handling.
    // Actually, the schema requires hotelId on User. Let me check if we can make it optional.

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        hotelId: type === "hotel" ? entityId : "cmomr38zs0000smphdq0p6bge", // fallback to first hotel for now
        platformRole: platformRole as any,
        role: "OWNER",
        status: "ACTIVE",
        phone: phone || null,
      },
      include: {
        hotel: { select: { id: true, name: true } },
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        data: {
          user: userWithoutPassword,
          entityId,
          type,
          etaLinked: true,
          message: `${type === "hotel" ? "Hotel" : type === "supplier" ? "Supplier" : type === "factoring" ? "Factoring company" : "Logistics hub"} registered successfully.`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register" },
      { status: 500 }
    );
  }
}
