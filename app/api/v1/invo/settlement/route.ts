import { NextRequest, NextResponse } from "next/server";

function requireAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const apiKey = process.env.INVO_SERVICE_KEY || "dev-key-insecure";
  return !!authHeader?.includes(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    if (!requireAuth(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { invoiceId, supplierId, amount, method } = body;

    if (!invoiceId || !supplierId || !amount) {
      return NextResponse.json(
        { success: false, error: "invoiceId, supplierId, amount required" },
        { status: 400 }
      );
    }

    // Mock settlement
    const settlementId = `set_${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: {
        settlementId,
        invoiceId,
        supplierId,
        amount,
        currency: "EGP",
        method: method || "bank_transfer",
        status: "completed",
        executedAt: new Date().toISOString(),
        receiptUrl: `https://invo.hotelsvendors.com/receipts/${settlementId}`,
        platformFee: Math.floor(amount * 0.025), // 2.5%
        netAmount: Math.floor(amount * 0.975),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
