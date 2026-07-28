import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const REFERRAL_CODE = "CHV000";

function generateReferralId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HV-${REFERRAL_CODE}-${ts}-${rand}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId") || "";
    const invoiceId = searchParams.get("invoiceId") || "";
    const amount = searchParams.get("amount") || "";
    const supplierId = searchParams.get("supplierId") || "";

    const referralId = generateReferralId();

    const companyName = orderId
      ? `Order ${orderId} - Oliv CTA`
      : "Oliv CTA Click";

    await prisma.leadCapture.create({
      data: {
        companyName,
        email: `${referralId}@track.hotelsvendors.com`,
        sector: "HOTEL",
        role: "SUPPLIER",
        message: JSON.stringify({
          referralCode: REFERRAL_CODE,
          referralId,
          orderId,
          invoiceId,
          amount,
          supplierId,
          clickedAt: new Date().toISOString(),
        }),
        source: "OLIV_CTA_CLICK",
        status: "new",
      },
    });

    const olivParams = new URLSearchParams({
      ref: referralId,
      source: "hotelsvendors",
    });
    if (orderId) olivParams.set("order", orderId);
    if (amount) olivParams.set("amount", amount);
    if (invoiceId) olivParams.set("invoice", invoiceId);
    if (supplierId) olivParams.set("supplier", supplierId);

    const olivUrl = orderId
      ? `https://oliv.finance/apply?${olivParams.toString()}`
      : `https://oliv.finance/#register?ref=${referralId}&source=hotelsvendors`;

    return NextResponse.redirect(olivUrl, 302);
  } catch (error) {
    console.error("[Oliv Click] Error:", error);
    const fallbackUrl = `https://oliv.finance/apply?ref=FALLBACK&source=hotelsvendors`;
    return NextResponse.redirect(fallbackUrl, 302);
  }
}
