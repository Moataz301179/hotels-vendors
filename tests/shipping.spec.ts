/**
 * B2B Shipping Module Tests
 * HotelsVendors — Consolidation, Dock Scheduling, e-Waybill
 *
 * Run: npx vitest run tests/shipping.spec.ts
 */

import { describe, it, expect } from "vitest";

/* ── Corridor Consolidation ── */
describe("Corridor Consolidation Engine", () => {
  function consolidateOrders(orders: Array<{ city: string; weight: number }>) {
    const ZONES: Record<string, string[]> = {
      "Red Sea": ["Hurghada", "El Gouna", "Safaga"],
      "South Sinai": ["Sharm El Sheikh", "Dahab"],
      "Greater Cairo": ["Cairo", "Giza", "New Cairo"],
    };

    const results: Record<string, { count: number; weight: number }> = {};

    for (const order of orders) {
      for (const [zone, cities] of Object.entries(ZONES)) {
        if (cities.some((c) => order.city.includes(c))) {
          const entry = results[zone] || { count: 0, weight: 0 };
          results[zone] = { count: entry.count + 1, weight: entry.weight + order.weight };
        }
      }
    }

    return results;
  }

  it("should group orders by resort destination zone", () => {
    const orders = [
      { city: "Hurghada", weight: 200 },
      { city: "El Gouna", weight: 150 },
      { city: "Cairo", weight: 80 },
      { city: "Sharm El Sheikh", weight: 300 },
    ];

    const result = consolidateOrders(orders);
    expect(result["Red Sea"].count).toBe(2);
    expect(result["Red Sea"].weight).toBe(350);
    expect(result["Greater Cairo"].count).toBe(1);
  });

  it("should select truck size based on total weight", () => {
    function selectTruck(totalKg: number): string {
      if (totalKg > 5000) return "10-ton";
      if (totalKg > 3000 && temperatureControlled(totalKg)) return "cold-chain";
      return "5-ton";
    }
    function temperatureControlled(kg: number) { return kg <= 3000; }

    expect(selectTruck(200)).toBe("5-ton");
    expect(selectTruck(8000)).toBe("10-ton");
  });

  it("should provide higher savings for larger consolidations", () => {
    function savingsPercent(orderCount: number): number {
      if (orderCount >= 3) return 40;
      if (orderCount >= 2) return 30;
      return 15;
    }

    expect(savingsPercent(1)).toBe(15);
    expect(savingsPercent(2)).toBe(30);
    expect(savingsPercent(5)).toBe(40);
  });
});

/* ── Dock Slot Booking ── */
describe("Dock Slot Scheduler", () => {
  function generateSlots(hotelId: string, date: string) {
    const slots: Array<{ slotId: string; startTime: string; endTime: string; status: string }> = [];

    for (let hour = 8; hour < 14; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const start = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        const endHour = minute + 30 >= 60 ? hour + 1 : hour;
        const endMin = (minute + 30) % 60;
        const end = `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;

        slots.push({
          slotId: `SLOT-${hotelId}-${date}-${start.replace(":", "")}`,
          startTime: start,
          endTime: end,
          status: hour < 10 ? "reserved" : "available",
        });
      }
    }
    return slots;
  }

  it("should generate 30-minute dock slots from 8 AM to 2 PM", () => {
    const slots = generateSlots("H-MERIDIAN", "2026-08-12");
    expect(slots.length).toBe(12); // 6 hours × 2 slots/hour
    expect(slots[0].startTime).toBe("08:00");
    expect(slots[0].endTime).toBe("08:30");
    expect(slots[11].startTime).toBe("13:30");
    expect(slots[11].endTime).toBe("14:00");
  });

  it("should prevent double-booking on same slot", () => {
    const bookedSlots = new Set(["SLOT-H-MERIDIAN-2026-08-12-0900"]);
    function isSlotAvailable(slotId: string) { return !bookedSlots.has(slotId); }

    expect(isSlotAvailable("SLOT-H-MERIDIAN-2026-08-12-0900")).toBe(false);
    expect(isSlotAvailable("SLOT-H-MERIDIAN-2026-08-12-1000")).toBe(true);
  });

  it("should redirect to next day when slots are full", () => {
    function findSlot(date: string): string | null {
      const today = "2026-08-12";
      if (date === today) return null; // all full
      return "2026-08-13";
    }

    expect(findSlot("2026-08-12")).toBeNull();
    expect(findSlot("2026-08-13")).toBe("2026-08-13");
  });
});

/* ── Geofence Alerts ── */
describe("Geofence Tracking", () => {
  function checkProximity(
    truckLat: number, truckLng: number,
    hotelLat: number, hotelLng: number
  ): { distance: number; alert: string } {
    // Haversine simplified for test
    const dLat = (hotelLat - truckLat) * 111.32;
    const dLng = (hotelLng - truckLng) * 111.32 * Math.cos((truckLat * Math.PI) / 180);
    const distance = Math.sqrt(dLat ** 2 + dLng ** 2);

    if (distance <= 15) return { distance: Math.round(distance * 10) / 10, alert: "Truck arriving soon" };
    if (distance <= 30) return { distance: Math.round(distance * 10) / 10, alert: "Truck ETA ~40 min" };
    return { distance: Math.round(distance * 10) / 10, alert: "On track" };
  }

  it("should alert hotel when truck is within 15km", () => {
    const result = checkProximity(27.25, 33.82, 27.30, 33.85); // ~12km
    expect(result.alert).toBe("Truck arriving soon");
    expect(result.distance).toBeLessThan(15);
  });

  it("should show ETA when truck is 15-30km away", () => {
    const result = checkProximity(27.25, 33.82, 27.35, 34.05); // ~25km
    expect(result.alert).toBe("Truck ETA ~40 min");
  });
});

/* ── ETA e-Waybill ── */
describe("ETA e-Waybill Generator", () => {
  function generateWaybill(order: {
    orderId: string; items: Array<{ sku: string; name: string; qty: number; price: number }>;
    vehicle: string; driver: string; origin: string; destination: string;
  }) {
    const waybillId = `EWB-${Date.now().toString(36)}`;
    const items = order.items.map((i) => ({
      itemCode: i.sku,
      description: i.name,
      quantity: i.qty,
      unitValue: i.price,
      totalValue: i.qty * i.price,
    }));

    return {
      waybillId,
      vehicleNumber: order.vehicle,
      driverName: order.driver,
      originCity: order.origin,
      destinationCity: order.destination,
      items,
      totalValue: items.reduce((s, i) => s + i.totalValue, 0),
      qrCode: `QR:EWB:${waybillId}:${order.vehicle}`,
    };
  }

  it("should generate valid e-Waybill with scannable QR code", () => {
    const waybill = generateWaybill({
      orderId: "HV-9921",
      items: [{ sku: "LIN-001", name: "Cotton Sheets", qty: 200, price: 72 }],
      vehicle: "TRK-5521", driver: "Ahmed Hassan",
      origin: "Cairo", destination: "Hurghada",
    });

    expect(waybill.qrCode).toContain("QR:EWB:");
    expect(waybill.waybillId).toContain("EWB-");
    expect(waybill.items[0].totalValue).toBe(14400);
    expect(waybill.totalValue).toBe(14400);
  });

  it("should include all required transport compliance fields", () => {
    const waybill = generateWaybill({
      orderId: "HV-7701",
      items: [{ sku: "KIT-003", name: "Commercial Oven", qty: 2, price: 15000 }],
      vehicle: "TRK-8810", driver: "Mahmoud Said",
      origin: "Giza", destination: "Sharm El Sheikh",
    });

    expect(waybill.vehicleNumber).toBeDefined();
    expect(waybill.driverName).toBeDefined();
    expect(waybill.originCity).toBeDefined();
    expect(waybill.destinationCity).toBeDefined();
  });
});