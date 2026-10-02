import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

/**
 * Login is handled by Clerk at /sign-in.
 * This endpoint redirects to Clerk's sign-in flow.
 */
export const POST = async (request: NextRequest) => {
  redirect("/sign-in");
};
