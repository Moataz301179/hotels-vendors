import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { apiRoute, success, error } from "@/lib/api-utils";

export const POST = apiRoute(async (_request: NextRequest) => {
  const { userId } = await auth();
  if (!userId) {
    return error("Unauthorized", 401);
  }

  return success({
    message: "Session refreshed by Clerk",
    userId,
  });
});
