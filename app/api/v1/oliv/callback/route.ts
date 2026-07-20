import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const olivUserId = searchParams.get("hv_user_id");
  const status = searchParams.get("status"); // 'approved', 'pending', 'rejected'
  
  if (!olivUserId) {
    return NextResponse.json(
      { error: "Missing user ID" },
      { status: 400 }
    );
  }

  // Update user with Oliv status
  await prisma.user.update({
    where: { id: olivUserId },
    data: { 
      olivStatus: status ?? "PENDING",
      olivLastSync: new Date()
    }
  });

  // Redirect back to your platform with status
  const redirectUrl = new URL("/dashboard", request.url);
  redirectUrl.searchParams.set("olivStatus", status ?? "PENDING");
  
  return NextResponse.redirect(redirectUrl);
}