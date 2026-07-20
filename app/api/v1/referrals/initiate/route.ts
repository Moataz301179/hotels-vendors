import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId, userType, referralCode, redirectUri } = await request.json();
  
  // Validate referral code is CHV000
  if (referralCode !== "CHV000") {
    return NextResponse.json(
      { error: "Invalid referral code" },
      { status: 400 }
    );
  }

  // Create referral record for tracking
  await prisma.olivReferral.create({
    data: {
      userId,
      userType: userType as "HOTEL" | "SUPPLIER",
      referralCode,
      redirectUri,
      status: "PENDING",
      initiatedAt: new Date()
    }
  });

  return NextResponse.json({ success: true });
}