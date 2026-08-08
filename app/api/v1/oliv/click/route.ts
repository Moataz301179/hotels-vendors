import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const REFERRAL_CODE = "CHV000";

/* Real, verified live destinations for the Oliv app (not the dead /apply API path). */
const OLIV_PLAY_STORE = "https://play.google.com/store/apps/details?id=finance.oliv.oliv&referrer=utm_source%3Dhotelsvendors%26ref%3DCHV000";
const OLIV_APP_STORE = "https://apps.apple.com/us/app/oliv-finance/id6475942316";
const OLIV_WEB = "https://oliv.finance/";

function detectPlatform(userAgent: string): "android" | "ios" | "web" {
  const ua = userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "web";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId") || "";
    const invoiceId = searchParams.get("invoiceId") || "";
    const amount = searchParams.get("amount") || "";
    const supplierId = searchParams.get("supplierId") || "";

    const leadId = `OLIV-${Date.now().toString(36).toUpperCase()}`;

    const companyName = orderId ? `Order ${orderId} - Oliv CTA` : "Oliv CTA Click";

    // Server-side attribution is ALWAYS recorded before any redirect, so the
    // CHV000 referral + commission is captured regardless of where the user lands.
    await prisma.leadCapture.create({
      data: {
        companyName,
        email: `${leadId}@track.hotelsvendors.com`,
        sector: "HOTEL",
        role: "SUPPLIER",
        message: JSON.stringify({
          referralCode: REFERRAL_CODE,
          leadId,
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

    // Route to the correct, VALID destination based on device.
    const ua = request.headers.get("user-agent") || "";
    const platform = detectPlatform(ua);

    const target = platform === "android" ? OLIV_PLAY_STORE
      : platform === "ios" ? OLIV_APP_STORE
      : OLIV_WEB;

    return NextResponse.redirect(target, 302);
  } catch (error) {
    console.error("[Oliv Click] Error:", error);
    // Safe fallback: never send users to the broken /apply path.
    return NextResponse.redirect(OLIV_WEB, 302);
  }
}
