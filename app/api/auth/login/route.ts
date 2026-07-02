import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth"
import { ok, error, unauthorized } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return error("Email and password are required")
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
      include: { Tenant: true },
    })

    if (!user || !user.passwordHash) {
      return unauthorized("Invalid email or password")
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return unauthorized("Invalid email or password")
    }

    if (!user.emailVerifiedAt) {
      return error(
        "Please verify your email before logging in. Check your inbox for the verification link.",
        403,
      )
    }

    if (user.status !== "ACTIVE") {
      return error("Your account has been deactivated. Contact support.", 403)
    }

    const token = generateToken(user)
    await setAuthCookie(token)

    return ok({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        companyName: user.companyName,
        platformRole: user.platformRole,
        isVerified: !!user.emailVerifiedAt,
      },
      tenant: {
        id: user.tenantId,
        name: user.Tenant.name,
        maxUsers: user.Tenant.maxUsers,
        seatCount: user.Tenant.seatCount,
      },
    })
  } catch (err) {
    console.error("[LOGIN]", err)
    return error("An unexpected error occurred. Please try again.", 500)
  }
}
