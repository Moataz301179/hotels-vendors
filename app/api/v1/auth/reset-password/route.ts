import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

/**
 * Password reset is handled by Clerk at /forgot-password.
 * This endpoint redirects to Clerk's forgot-password flow.
 */
export const POST = async (request: NextRequest) => {
  redirect("/forgot-password");
};
