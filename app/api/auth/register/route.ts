import { NextRequest, NextResponse } from "next/server";

// DEPRECATED: Use /api/v1/auth/register instead
export async function POST(request: NextRequest) {
  // Forward to v1 endpoint
  const body = await request.json();
  const res = await fetch(new URL("/api/v1/auth/register", request.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
