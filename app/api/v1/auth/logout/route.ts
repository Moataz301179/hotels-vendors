import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

/**
 * Logout is handled by Clerk.
 * This endpoint redirects to the sign-in page.
 */
export const POST = async (request: NextRequest) => {
  redirect("/sign-in");
};
