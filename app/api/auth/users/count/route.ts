import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { ok, unauthorized } from "@/lib/api-response"

export async function GET() {
  try {
    const payload = await getAuthUser()
    if (!payload) {
      return unauthorized()
    }

    const [userCount, tenant] = await Promise.all([
      prisma.user.count({ where: { tenantId: payload.tenantId } }),
      prisma.tenant.findUnique({ where: { id: payload.tenantId } }),
    ])

    if (!tenant) {
      return unauthorized("Tenant not found")
    }

    const canAddMore = userCount < tenant.maxUsers

    return ok({
      currentUsers: userCount,
      maxUsers: tenant.maxUsers,
      seatsAvailable: Math.max(0, tenant.maxUsers - userCount),
      canAddMore,
      rating: tenant.rating,
    })
  } catch (err) {
    console.error("[USERS_COUNT]", err)
    return unauthorized()
  }
}
