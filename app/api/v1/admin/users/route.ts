import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate, requirePermission, validateBody, success, error, audit } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(["DEPARTMENT_HEAD", "PROCUREMENT_MANAGER", "FINANCIAL_CONTROLLER", "GM", "OWNER", "ADMIN"]).optional(),
  platformRole: z.enum(["HOTEL", "SUPPLIER", "FACTORING", "SHIPPING", "ADMIN"]).optional(),
  hotelId: z.string().optional(),
  supplierId: z.string().optional(),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const search = request.nextUrl.searchParams.get("search") || "";
  const role = request.nextUrl.searchParams.get("role") || undefined;
  const status = request.nextUrl.searchParams.get("status") || undefined;
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20", 10);
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role) where.platformRole = role;
  if (status) where.status = status;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        tenant: { select: { id: true, name: true, slug: true } },
        assignedRole: { select: { id: true, name: true } },
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        platformRole: u.platformRole,
        status: u.status,
        tenant: u.tenant,
        assignedRole: u.assignedRole,
        hotel: u.hotel,
        supplier: u.supplier,
        lastActive: u.lastActive,
        createdAt: u.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const body = await request.json();
  const data = validateBody(CreateUserSchema, body);

  // ── Seat enforcement: check tenant-level limit ──
  const tenant = await prisma.tenant.findUnique({
    where: { id: auth.tenantId },
    select: { id: true, maxUsers: true, seatCount: true },
  });

  if (!tenant) {
    return error("Tenant not found", 404);
  }

  const currentUserCount = await prisma.user.count({
    where: { tenantId: auth.tenantId },
  });

  // Use seatCount if set, otherwise maxUsers
  const tenantMax = tenant.seatCount ?? tenant.maxUsers ?? 5;
  if (currentUserCount >= tenantMax) {
    return error(
      `Seat limit reached (${currentUserCount}/${tenantMax}). Upgrade your plan to add more users.`,
      403
    );
  }

  // ── Hotel-level seat enforcement (if user is assigned to a hotel) ──
  if (data.hotelId) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: data.hotelId },
      select: { id: true, maxUsers: true, tenantId: true },
    });

    if (!hotel) {
      return error("Hotel not found", 404);
    }

    if (hotel.tenantId !== auth.tenantId) {
      return error("Hotel does not belong to your tenant", 403);
    }

    const hotelUserCount = await prisma.user.count({
      where: { hotelId: data.hotelId },
    });

    const hotelMax = hotel.maxUsers ?? 10;
    if (hotelUserCount >= hotelMax) {
      return error(
        `Hotel seat limit reached (${hotelUserCount}/${hotelMax}). Increase the hotel's user limit to add more users.`,
        403
      );
    }
  }

  // ── Supplier-level seat enforcement (if user is assigned to a supplier) ──
  if (data.supplierId) {
    const supplier = await prisma.supplier.findUnique({
      where: { id: data.supplierId },
      select: { id: true, tenantId: true },
    });

    if (!supplier) {
      return error("Supplier not found", 404);
    }

    if (supplier.tenantId !== auth.tenantId) {
      return error("Supplier does not belong to your tenant", 403);
    }

    const invoSubscription = await prisma.invoSubscription.findUnique({
      where: { supplierId: data.supplierId },
      select: { maxUsers: true },
    });

    if (invoSubscription) {
      const supplierUserCount = await prisma.user.count({
        where: { supplierId: data.supplierId },
      });

      const supplierMax = invoSubscription.maxUsers ?? 3;
      if (supplierUserCount >= supplierMax) {
        return error(
          `Supplier seat limit reached (${supplierUserCount}/${supplierMax}). Upgrade the supplier's INVO plan to add more users.`,
          403
        );
      }
    }
  }

  // ── Create the user ──
  const passwordHash = await hashPassword(data.password);

  // Get or create a role for this user
  const roleName = data.role || "DEPARTMENT_HEAD";
  let userRole = await prisma.role.findFirst({
    where: { tenantId: auth.tenantId, name: roleName },
  });

  if (!userRole) {
    userRole = await prisma.role.create({
      data: {
        name: roleName,
        tenantId: auth.tenantId,
        isGlobal: false,
      },
    });
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash,
      role: roleName as "DEPARTMENT_HEAD",
      platformRole: data.platformRole || "HOTEL",
      tenantId: auth.tenantId,
      roleId: userRole.id,
      hotelId: data.hotelId || null,
      supplierId: data.supplierId || null,
    },
  });

  await audit({
    entityType: "USER",
    entityId: user.id,
    action: "USER_CREATED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      email: user.email,
      name: user.name,
      role: user.role,
      platformRole: user.platformRole,
      hotelId: user.hotelId,
      supplierId: user.supplierId,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      platformRole: user.platformRole,
      hotelId: user.hotelId,
      supplierId: user.supplierId,
      createdAt: user.createdAt,
    },
    seats: {
      tenantUsed: currentUserCount + 1,
      tenantMax,
      tenantRemaining: tenantMax - (currentUserCount + 1),
    },
  }, 201);
});
