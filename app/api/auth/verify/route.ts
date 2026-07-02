import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, error, notFound } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, email } = body

    if (!token) {
      return error("Verification token is required")
    }

    const user = await prisma.user.findFirst({
      where: {
        inviteToken: token,
        ...(email ? { email: email.toLowerCase() } : {}),
      },
    })

    if (!user) {
      return notFound("Invalid or expired verification link")
    }

    if (user.emailVerifiedAt) {
      return ok({ message: "Email already verified" })
    }

    if (user.inviteExpiresAt && user.inviteExpiresAt < new Date()) {
      return error("Verification link has expired. Please request a new one.", 410)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        inviteToken: null,
        inviteExpiresAt: null,
      },
    })

    return ok({ message: "Email verified successfully. You can now log in." })
  } catch (err) {
    console.error("[VERIFY]", err)
    return error("An unexpected error occurred", 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    if (!token) {
      return error("Verification token is required")
    }

    const user = await prisma.user.findFirst({
      where: {
        inviteToken: token,
        ...(email ? { email: email.toLowerCase() } : {}),
      },
    })

    if (!user) {
      return notFound("Invalid or expired verification link")
    }

    if (user.emailVerifiedAt) {
      return ok({ message: "Email already verified", alreadyVerified: true })
    }

    if (user.inviteExpiresAt && user.inviteExpiresAt < new Date()) {
      return error("Verification link has expired", 410)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        inviteToken: null,
        inviteExpiresAt: null,
      },
    })

    return ok({ message: "Email verified successfully. You can now log in." })
  } catch (err) {
    console.error("[VERIFY_GET]", err)
    return error("An unexpected error occurred", 500)
  }
}
