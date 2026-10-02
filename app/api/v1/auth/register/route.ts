import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

/**
 * Registration is handled by Clerk at /sign-up.
 * This endpoint redirects to Clerk's sign-up flow.
 */
export const POST = async (request: NextRequest) => {
  redirect("/sign-up");
};
