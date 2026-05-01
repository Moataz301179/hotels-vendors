import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "Shark-Breaker Procurement Hub API",
    version: "0.1.0",
    status: "operational",
    endpoints: {
      hotels: "/api/hotels",
      suppliers: "/api/suppliers",
      products: "/api/products",
      orders: "/api/orders",
      invoices: "/api/invoices",
      users: "/api/users",
      authority: "/api/authority",
      eta: "/api/eta",
      analytics: "/api/analytics",
    },
  });
}
