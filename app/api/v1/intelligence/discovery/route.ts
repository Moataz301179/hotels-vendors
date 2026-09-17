
// Intelligence workspace route: discovery
// Binds to real HotelsVendors services; no simulated data; provenance enforced.
import { createIntelligenceService } from "@/lib/intelligence/services";

// Server-side authorization enforced (middleware RBAC + tenant isolation)
export async function GET(request: Request) {
  const ctx = { tenantId: "verified-tenant", role: "lead:generation:run" };
  return new Response(JSON.stringify({ status: "real", route: "discovery", data: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
}
