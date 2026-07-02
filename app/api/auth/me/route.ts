import { prisma } from "@/lib/prisma"
import { getAuthUser, clearAuthCookie } from "@/lib/auth"
import { ok, unauthorized } from "@/lib/api-response"

export async function GET() {
  try {
    const payload = await getAuthUser()
    if (!payload) {
      return unauthorized()
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { Tenant: true },
    })

    if (!user) {
      return unauthorized("User not found")
    }

    return ok({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        companyName: user.companyName,
        phone: user.phone,
        platformRole: user.platformRole,
        accountType: user.accountType,
        isVerified: !!user.emailVerifiedAt,
        status: user.status,
        createdAt: user.createdAt,
      },
      tenant: {
        id: user.tenantId,
        name: user.Tenant.name,
        slug: user.Tenant.slug,
        taxId: user.Tenant.taxId,
        maxUsers: user.Tenant.maxUsers,
        seatCount: user.Tenant.seatCount,
        rating: user.Tenant.rating,
      },
    })
  } catch (err) {
    console.error("[ME]", err)
    return unauthorized()
  }
}

export async function POST() {
  await clearAuthCookie()
  return ok({ message: "Logged out" })
}
