import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { apiRoute, success, error } from "@/lib/api-utils";
import { sendEmail, passwordResetConfirmationTemplate } from "@/lib/notifications/email";

export const POST = apiRoute(async (request: NextRequest) => {
  const body = await request.json();
  const { token, password } = body;

  if (!token || typeof token !== "string") {
    return error("Reset token is required", 400);
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return error("Password must be at least 6 characters", 400);
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return error("Invalid or expired reset token", 400);
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    return error("Reset token has expired. Please request a new one.", 400);
  }

  const user = await prisma.user.findFirst({
    where: { email: resetToken.email },
  });

  if (!user) {
    return error("User not found", 404);
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

  // Send confirmation email
  try {
    const confirmation = passwordResetConfirmationTemplate({
      name: user.name,
    });
    await sendEmail({
      to: [user.email],
      subject: confirmation.subject,
      html: confirmation.html,
    });
  } catch {
    console.error("[ResetPassword] Failed to send confirmation email to", user.email);
  }

  // Auto-login: create session
  const sessionToken = await createSession(user.id, user.platformRole, user.tenantId);

  return success({
    message: "Password reset successfully",
    token: sessionToken,
    user: { id: user.id, email: user.email, name: user.name, platformRole: user.platformRole },
  });
});
