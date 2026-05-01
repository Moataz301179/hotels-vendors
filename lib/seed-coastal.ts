import { prisma } from "./prisma";

async function seedCoastal() {
  console.log("🌊 Seeding coastal differentiation data...");

  // Find existing coastal hotel or create one
  let coastalHotel = await prisma.hotel.findFirst({
    where: { tier: "COASTAL" },
  });

  if (!coastalHotel) {
    coastalHotel = await prisma.hotel.create({
      data: {
        name: "Red Sea Coral Resort",
        legalName: "Red Sea Coral Resorts SAE",
        taxId: "100-456-789",
        commercialReg: "CR-2021-003",
        address: "Shark Bay, Sharm El-Sheikh",
        city: "Sharm El-Sheikh",
        governorate: "South Sinai",
        phone: "+20 69 360 1000",
        email: "procurement@redseacoral.com",
        starRating: 5,
        roomCount: 280,
        tier: "COASTAL",
        creditLimit: 2000000,
        creditUsed: 320000,
      },
    });
  }

  // ── Factoring Companies ──
  const alexFactoring = await prisma.factoringCompany.upsert({
    where: { taxId: "300-111-222" },
    update: {},
    create: {
      name: "Alexandria Factoring",
      legalName: "Alexandria Factoring Company SAE",
      taxId: "300-111-222",
      contactEmail: "info@alexfactoring.com",
      contactPhone: "+20 3 555 0100",
      status: "ACTIVE",
      maxFacility: 5000000,
      interestRate: 0.025,
      rate: 0.02,
    },
  });

  const redSeaCapital = await prisma.factoringCompany.upsert({
    where: { taxId: "300-222-333" },
    update: {},
    create: {
      name: "Red Sea Capital",
      legalName: "Red Sea Capital for Factoring SAE",
      taxId: "300-222-333",
      contactEmail: "info@redseacapital.com",
      contactPhone: "+20 65 555 0200",
      status: "ACTIVE",
      maxFacility: 8000000,
      interestRate: 0.022,
      rate: 0.018,
    },
  });

  // ── Credit Facilities ──
  for (const facility of [
    {
      hotelId: coastalHotel.id,
      factoringCompanyId: alexFactoring.id,
      limit: 1500000,
      utilized: 400000,
      interestRate: 0.025,
      status: "ACTIVE" as const,
      approvedAt: new Date("2026-01-15"),
      expiresAt: new Date("2027-01-15"),
    },
    {
      hotelId: coastalHotel.id,
      factoringCompanyId: redSeaCapital.id,
      limit: 2500000,
      utilized: 800000,
      interestRate: 0.022,
      status: "ACTIVE" as const,
      approvedAt: new Date("2026-02-01"),
      expiresAt: new Date("2027-02-01"),
    },
  ]) {
    const existing = await prisma.creditFacility.findFirst({
      where: { hotelId: facility.hotelId, factoringCompanyId: facility.factoringCompanyId },
    });
    if (!existing) {
      await prisma.creditFacility.create({ data: facility });
    }
  }

  // ── Logistics Hubs ──
  const sharmHub = await prisma.logisticsHub.upsert({
    where: { id: "hub-sharm-001" },
    update: {},
    create: {
      id: "hub-sharm-001",
      name: "Shark-Breaker Sharm",
      code: "SB-SHM",
      city: "Sharm El-Sheikh",
      governorate: "South Sinai",
      address: "Nabq Bay Logistics Zone",
      lat: 27.9158,
      lng: 34.3299,
      type: "CONSOLIDATION",
      operatingHours: "06:00 - 22:00",
      contactPhone: "+20 69 360 2000",
      isActive: true,
    },
  });

  const hurghadaHub = await prisma.logisticsHub.upsert({
    where: { id: "hub-hurghada-001" },
    update: {},
    create: {
      id: "hub-hurghada-001",
      name: "Shark-Breaker Hurghada",
      code: "SB-HRG",
      city: "Hurghada",
      governorate: "Red Sea",
      address: "Industrial Zone, North Hurghada",
      lat: 27.2579,
      lng: 33.8116,
      type: "CROSS_DOCK",
      operatingHours: "05:00 - 23:00",
      contactPhone: "+20 65 355 1000",
      isActive: true,
    },
  });

  const marsaAlamHub = await prisma.logisticsHub.upsert({
    where: { id: "hub-marsa-001" },
    update: {},
    create: {
      id: "hub-marsa-001",
      name: "Shark-Breaker Marsa Alam",
      code: "SB-MAL",
      city: "Marsa Alam",
      governorate: "Red Sea",
      address: "Port Ghalib Logistics Center",
      lat: 25.0674,
      lng: 34.8803,
      type: "LAST_MILE",
      operatingHours: "07:00 - 21:00",
      contactPhone: "+20 11 2222 3333",
      isActive: true,
    },
  });

  // ── Properties & Outlets ──
  const mainProperty = await prisma.property.upsert({
    where: { id: "prop-coastal-main" },
    update: {},
    create: {
      id: "prop-coastal-main",
      hotelId: coastalHotel.id,
      name: "Red Sea Coral - Main Building",
      city: "Sharm El-Sheikh",
      governorate: "South Sinai",
      address: "Shark Bay",
      roomCount: 200,
    },
  });

  const beachProperty = await prisma.property.upsert({
    where: { id: "prop-coastal-beach" },
    update: {},
    create: {
      id: "prop-coastal-beach",
      hotelId: coastalHotel.id,
      name: "Red Sea Coral - Beach Villas",
      city: "Sharm El-Sheikh",
      governorate: "South Sinai",
      address: "Nabq Bay",
      roomCount: 80,
    },
  });

  for (const outlet of [
    {
      propertyId: mainProperty.id,
      name: "Main Kitchen",
      type: "KITCHEN" as const,
      managerName: "Chef Omar",
      managerPhone: "+20 10 1111 2222",
      operatingHours: "05:00 - 23:00",
    },
    {
      propertyId: mainProperty.id,
      name: "Beach Bar",
      type: "BEACH_GRILL" as const,
      managerName: "Sara Mahmoud",
      managerPhone: "+20 10 3333 4444",
      operatingHours: "10:00 - 02:00",
    },
    {
      propertyId: mainProperty.id,
      name: "Pool Restaurant",
      type: "MAIN_RESTAURANT" as const,
      managerName: "Khaled Ibrahim",
      managerPhone: "+20 10 5555 6666",
      operatingHours: "07:00 - 22:00",
    },
    {
      propertyId: beachProperty.id,
      name: "Spa Café",
      type: "SPA_CAFE" as const,
      managerName: "Nour Hassan",
      managerPhone: "+20 10 7777 8888",
      operatingHours: "08:00 - 20:00",
    },
    {
      propertyId: beachProperty.id,
      name: "Villa Mini-Bar",
      type: "MINI_BAR" as const,
      managerName: "Amr Fathy",
      managerPhone: "+20 10 9999 0000",
      operatingHours: "24/7",
    },
  ]) {
    const existing = await prisma.outlet.findFirst({
      where: { propertyId: outlet.propertyId, name: outlet.name },
    });
    if (!existing) {
      await prisma.outlet.create({ data: outlet });
    }
  }

  // ── Trips & Stops ──
  const trip1 = await prisma.trip.create({
    data: {
      tripNumber: "TRIP-2026-0501-A",
      hubId: sharmHub.id,
      driverName: "Mahmoud El-Sayed",
      driverPhone: "+20 10 1234 5678",
      vehiclePlate: "س ن ب 1234",
      scheduledDate: new Date("2026-05-02T06:00:00"),
      departureDate: new Date("2026-05-02T06:30:00"),
      status: "IN_TRANSIT",
    },
  });

  for (const stop of [
    {
      tripId: trip1.id,
      hotelId: coastalHotel.id,
      stopOrder: 1,
      stopNumber: 1,
      estimatedArrival: new Date("2026-05-02T08:00:00"),
      eta: new Date("2026-05-02T08:00:00"),
      status: "DELIVERED" as const,
    },
    {
      tripId: trip1.id,
      hotelId: coastalHotel.id,
      stopOrder: 2,
      stopNumber: 2,
      estimatedArrival: new Date("2026-05-02T10:30:00"),
      eta: new Date("2026-05-02T10:30:00"),
      status: "PENDING" as const,
    },
  ]) {
    await prisma.tripStop.create({ data: stop });
  }

  const trip2 = await prisma.trip.create({
    data: {
      tripNumber: "TRIP-2026-0501-B",
      hubId: hurghadaHub.id,
      driverName: "Ahmed Khaled",
      driverPhone: "+20 11 9876 5432",
      vehiclePlate: "س ر ص 5678",
      scheduledDate: new Date("2026-05-03T05:00:00"),
      status: "SCHEDULED",
    },
  });

  for (const stop of [
    {
      tripId: trip2.id,
      hotelId: coastalHotel.id,
      stopOrder: 1,
      stopNumber: 1,
      estimatedArrival: new Date("2026-05-03T09:00:00"),
      eta: new Date("2026-05-03T09:00:00"),
      status: "PENDING" as const,
    },
  ]) {
    await prisma.tripStop.create({ data: stop });
  }

  console.log("✅ Coastal seed completed!");
  console.log(`   Hotels: 1 (COASTAL)`);
  console.log(`   Factoring Companies: 2`);
  console.log(`   Credit Facilities: 2`);
  console.log(`   Logistics Hubs: 3`);
  console.log(`   Properties: 2`);
  console.log(`   Outlets: 5`);
  console.log(`   Trips: 2`);
}

seedCoastal()
  .catch((e) => {
    console.error("❌ Coastal seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
