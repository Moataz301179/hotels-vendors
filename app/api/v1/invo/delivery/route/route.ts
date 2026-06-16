import { NextRequest, NextResponse } from "next/server";

function requireAuth(request: NextRequest): { authorized: boolean; error?: string } {
  const authHeader = request.headers.get("authorization");
  const apiKey = process.env.INVO_SERVICE_KEY;
  if (!apiKey) {
    return { authorized: false, error: "Service key not configured" };
  }
  if (!authHeader?.includes(apiKey)) {
    return { authorized: false, error: "Unauthorized" };
  }
  return { authorized: true };
}

export async function POST(request: NextRequest) {
  try {
    if (!requireAuth(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderIds, vehicleType, consolidate } = body;

    const mockStops = (orderIds || ["ord_1", "ord_2"]).map((id: string, idx: number) => ({
      orderId: id,
      sequence: idx + 1,
      location: { lat: 30.04 + idx * 0.1, lng: 31.23 + idx * 0.1 },
      eta: new Date(Date.now() + (idx + 1) * 3600000).toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        routeId: `route_${Date.now()}`,
        stops: mockStops,
        estimatedDuration: mockStops.length * 2, // hours
        vehicleType: vehicleType || "van",
        consolidate: consolidate ?? true,
        driverAssigned: true,
        driverName: "Ahmed K.",
        driverPhone: "+20 10X XXX XXXX",
        trackingUrl: `https://invo.hotelsvendors.com/track/route_${Date.now()}`,
        status: "assigned",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
