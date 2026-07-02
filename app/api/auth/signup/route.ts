import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateVerificationToken, generateToken, setAuthCookie } from "@/lib/auth"
import { sendVerificationEmail } from "@/lib/email"
import { validateTaxId } from "@/lib/tax-id"
import { ok, error } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, companyName, taxId, phone, platformRole } = body

    if (!email || !password || !name || !companyName) {
      return error("Email, password, name, and company name are required")
    }

    if (password.length < 8) {
      return error("Password must be at least 8 characters")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return error("Invalid email address")
    }

    const existingUser = await prisma.user.findFirst({ where: { email: email.toLowerCase() } })
    if (existingUser) {
      return error("An account with this email already exists")
    }

    if (taxId) {
      const validation = validateTaxId(taxId)
      if (!validation.valid) {
        return error(validation.message!)
      }
      const existingTaxId = await prisma.tenant.findUnique({ where: { taxId } })
      if (existingTaxId) {
        return error("This Tax ID is already registered")
      }
    }

    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + Date.now().toString(36)

    const passwordHash = await hashPassword(password)
    const verifyToken = generateVerificationToken()
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()
      const tenant = await tx.tenant.create({
        data: {
          id: `tenant_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
          name: companyName,
          slug,
          taxId: taxId || null,
          type: "HOTEL_GROUP",
          status: "ACTIVE",
          maxUsers: 5,
          seatCount: 5,
          updatedAt: now,
        },
      })

      const role = await tx.role.create({
        data: {
          id: `role_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
          name: "Owner",
          tenantId: tenant.id,
          isGlobal: false,
          updatedAt: now,
        },
      })

      const roleEnum = (platformRole?.toUpperCase() === "SUPPLIER" ? "SUPPLIER" : "HOTEL") as "HOTEL" | "SUPPLIER"

      const user = await tx.user.create({
        data: {
          id: `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
          email: email.toLowerCase(),
          name,
          companyName,
          phone: phone || null,
          passwordHash,
          platformRole: roleEnum,
          accountType: "BUSINESS",
          status: "ACTIVE",
          tenantId: tenant.id,
          roleId: role.id,
          inviteToken: verifyToken,
          inviteExpiresAt: verifyExpires,
        },
      })

      return { tenant, user, role }
    })

    const emailSent = await sendVerificationEmail(result.user.email, verifyToken)

    const token = generateToken(result.user)
    await setAuthCookie(token)

    return ok({
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        companyName: result.user.companyName,
        platformRole: result.user.platformRole,
        isVerified: false,
      },
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        maxUsers: result.tenant.maxUsers,
      },
      emailSent,
      message: emailSent
        ? "Account created. Please check your email to verify."
        : "Account created. Email sending is not configured. Your verification token is included for development.",
      verifyToken: process.env.NODE_ENV === "development" ? verifyToken : undefined,
    })
  } catch (err) {
    console.error("[SIGNUP]", err)
    return error("An unexpected error occurred. Please try again.", 500)
  }
}
