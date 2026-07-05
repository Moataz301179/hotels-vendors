import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.hotelsvendors.com";
  
  const integrationInfo = {
    success: true,
    service: "HotelsVendors Paymob Integration",
    version: "1.0.0",
    status: "LIVE",
    environment: process.env.NODE_ENV || "production",
    
    endpoints: {
      callback: `${baseUrl}/api/v1/payments/paymob-callback`,
      deposit: `${baseUrl}/api/v1/payments/deposit`,
      createIntent: `${baseUrl}/api/v1/payments/create-intent`,
      init: `${baseUrl}/api/init`,
    },
    
    supportedFeatures: [
      "DEPOSIT_20_PERCENT",
      "ESCROW_RELEASE",
      "PAYMENT_INTENT",
      "HMAC_VERIFICATION",
      "CALLBACK_HANDLING"
    ],
    
    currencies: ["EGP"],
    paymentMethods: ["CARD", "WALLET", "BANK_TRANSFER"],
    
    paymob: {
      configured: !!(process.env.PAYMOB_API_KEY && process.env.PAYMOB_INTEGRATION_ID),
      iframeConfigured: !!process.env.PAYMOB_IFRAME_ID,
      hmacConfigured: !!process.env.PAYMOB_HMAC_SECRET,
    },
    
    compliance: {
      callbackAuth: "HMAC + Order Matching",
      tenantIsolation: true,
      auditLogging: true,
      rateLimiting: "financial",
    },
    
    timestamp: new Date().toISOString(),
    message: "Paymob integration ready for review.",
  };

  return NextResponse.json(integrationInfo, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store",
      "X-Paymob-Integration": "hotels-vendors",
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ success: true, received: body });
}
