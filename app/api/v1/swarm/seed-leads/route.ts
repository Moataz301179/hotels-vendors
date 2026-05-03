import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";
import { seedKnownHotels, seedKnownSuppliers } from "@/lib/scrapers/egypt-hotel-directory";

/**
 * POST /api/v1/swarm/seed-leads
 * Seed the lead pipeline with known Egyptian hotels and suppliers
 */
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const [hotelsCreated, suppliersCreated] = await Promise.all([
    seedKnownHotels(),
    seedKnownSuppliers(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      hotelsCreated,
      suppliersCreated,
      message: `Seeded ${hotelsCreated} hotels and ${suppliersCreated} suppliers into lead pipeline`,
    },
  });
});
