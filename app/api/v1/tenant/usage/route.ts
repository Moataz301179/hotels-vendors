import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate, success } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const tenant = await prisma.tenant.findUnique({
    where: { id: auth.tenantId },
    select: {
      id: true,
      name: true,
      slug: true,
      maxUsers: true,
      seatCount: true,
    },
  });

  if (!tenant) {
    return NextResponse.json(
      { success: false, error: "Tenant not found" },
      { status: 404 }
    );
  }

  // Count users in this tenant
  const userCount = await prisma.user.count({
    where: { tenantId: auth.tenantId },
  });

  // Count hotels, suppliers in this tenant
  const [hotelCount, supplierCount, productCount] = await Promise.all([
    prisma.hotel.count({ where: { tenantId: auth.tenantId } }),
    prisma.supplier.count({ where: { tenantId: auth.tenantId } }),
    prisma.product.count({ where: { tenantId: auth.tenantId } }),
  ]);

  // Per-hotel usage
  const hotels = await prisma.hotel.findMany({
    where: { tenantId: auth.tenantId },
    select: {
      id: true,
      name: true,
      maxUsers: true,
      _count: { select: { users: true } },
    },
  });

  // Supplier seat usage from INVO subscriptions
  const suppliers = await prisma.supplier.findMany({
    where: { tenantId: auth.tenantId },
    select: {
      id: true,
      name: true,
      _count: { select: { users: true } },
      invoSubscription: {
        select: { maxUsers: true, maxProducts: true, plan: true },
      },
    },
  });

  const tenantMaxUsers = tenant.seatCount ?? tenant.maxUsers ?? 5;

  return success({
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
    },
    usage: {
      users: {
        used: userCount,
        max: tenantMaxUsers,
        remaining: Math.max(0, tenantMaxUsers - userCount),
      },
      hotels: {
        count: hotelCount,
      },
      suppliers: {
        count: supplierCount,
      },
      products: {
        count: productCount,
      },
    },
    hotels: hotels.map((h) => ({
      id: h.id,
      name: h.name,
      maxUsers: h.maxUsers ?? 10,
      usersUsed: h._count.users,
      remaining: Math.max(0, (h.maxUsers ?? 10) - h._count.users),
    })),
    suppliers: suppliers.map((s) => ({
      id: s.id,
      name: s.name,
      plan: s.invoSubscription?.plan ?? "STARTER",
      maxUsers: s.invoSubscription?.maxUsers ?? 3,
      usersUsed: s._count.users,
      remaining: Math.max(0, (s.invoSubscription?.maxUsers ?? 3) - s._count.users),
      maxProducts: s.invoSubscription?.maxProducts ?? 100,
    })),
  });
});
