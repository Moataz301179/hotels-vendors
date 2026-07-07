/**
 * Route Optimization Engine
 * Solves TSP + clustering for coastal consolidation routes.
 * Cuts delivery costs by optimizing shared routes.
 */

export interface DeliveryPoint {
  orderId: string;
  lat: number;
  lng: number;
  hotelName: string;
  weightKg: number;
  volumeM3: number;
  timeWindow?: { start: string; end: string };
}

export interface Vehicle {
  id: string;
  type: "van" | "truck" | "refrigerated";
  maxWeightKg: number;
  maxVolumeM3: number;
  costPerKm: number;
}

export interface OptimizedRoute {
  routeId: string;
  vehicleId: string;
  stops: { sequence: number; orderId: string; lat: number; lng: number; eta: string }[];
  totalDistanceKm: number;
  totalCost: number;
  estimatedDurationHours: number;
  consolidated: boolean;
}

/**
 * Simple greedy nearest-neighbor TSP solver with capacity constraints.
 * In production, this uses a proper VRP solver (OR-Tools, jsprit).
 */
export async function optimizeRoutes(
  orders: DeliveryPoint[],
  vehicles: Vehicle[],
  depot: { lat: number; lng: number }
): Promise<OptimizedRoute[]> {
  const routes: OptimizedRoute[] = [];
  const unassigned = [...orders];

  for (const vehicle of vehicles) {
    if (unassigned.length === 0) break;

    const routeStops: OptimizedRoute["stops"] = [];
    let currentWeight = 0;
    let currentVolume = 0;
    let currentLocation = depot;
    let totalDistance = 0;
    let sequence = 1;

    while (unassigned.length > 0) {
      // Find nearest feasible order
      let nearestIdx = -1;
      let nearestDist = Infinity;

      for (let i = 0; i < unassigned.length; i++) {
        const order = unassigned[i];
        if (
          currentWeight + order.weightKg > vehicle.maxWeightKg ||
          currentVolume + order.volumeM3 > vehicle.maxVolumeM3
        ) {
          continue;
        }

        const dist = haversine(currentLocation.lat, currentLocation.lng, order.lat, order.lng);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      }

      if (nearestIdx === -1) break; // Vehicle full

      const order = unassigned[nearestIdx];
      unassigned.splice(nearestIdx, 1);

      currentWeight += order.weightKg;
      currentVolume += order.volumeM3;
      totalDistance += nearestDist;
      currentLocation = { lat: order.lat, lng: order.lng };

      // ETA calculation: assume 40 km/h average + 15 min per stop
      const driveTimeHours = totalDistance / 40;
      const stopTimeHours = sequence * 0.25;
      const eta = new Date(Date.now() + (driveTimeHours + stopTimeHours) * 3600000);

      routeStops.push({
        sequence: sequence++,
        orderId: order.orderId,
        lat: order.lat,
        lng: order.lng,
        eta: eta.toISOString(),
      });
    }

    if (routeStops.length > 0) {
      // Return to depot
      totalDistance += haversine(currentLocation.lat, currentLocation.lng, depot.lat, depot.lng);

      routes.push({
        routeId: `route_${vehicle.id}_${Date.now()}`,
        vehicleId: vehicle.id,
        stops: routeStops,
        totalDistanceKm: Math.round(totalDistance),
        totalCost: Math.round(totalDistance * vehicle.costPerKm),
        estimatedDurationHours: Math.ceil(totalDistance / 40 + routeStops.length * 0.5),
        consolidated: routeStops.length > 1,
      });
    }
  }

  return routes;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
