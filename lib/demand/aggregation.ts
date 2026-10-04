import { prisma } from "@/lib/prisma";

const EXCLUDED = ["DRAFT", "REJECTED", "CANCELLED"] as const;

export type DemandAggregate = {
  productId: string; sku: string; productName: string; category: string; unitOfMeasure: string;
  supplierCount: number; hotelCount: number; propertyCount: number; requestedQuantity: number;
  currentSpend: number; weightedUnitPrice: number; deliveryFrom: string | null; deliveryTo: string | null;
  locations: string[]; volumeDealSignal: "HIGH" | "MEDIUM" | "LOW";
};

export async function aggregateHotelDemand(tenantId: string, options?: { days?: number; minHotels?: number }): Promise<DemandAggregate[]> {
  const days = Math.min(Math.max(options?.days ?? 30, 7), 180);
  const minHotels = Math.max(options?.minHotels ?? 2, 1);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const items = await prisma.orderItem.findMany({
    where: { deletedAt: null, order: { tenantId, createdAt: { gte: since }, status: { notIn: EXCLUDED } } },
    select: {
      quantity: true, unitPrice: true,
      product: { select: { id: true, sku: true, name: true, category: true, unitOfMeasure: true } },
      order: { select: { hotelId: true, deliveryDate: true, property: { select: { city: true, governorate: true } }, supplierId: true } },
    },
  });

  const groups = new Map<string, { productId:string; sku:string; productName:string; category:string; unitOfMeasure:string; hotels:Set<string>; properties:Set<string>; suppliers:Set<string>; locations:Set<string>; quantity:number; spend:number; dates:Date[] }>();

  for (const item of items) {
    const p = item.product;
    const g = groups.get(p.id) ?? { productId:p.id, sku:p.sku, productName:p.name, category:String(p.category), unitOfMeasure:p.unitOfMeasure, hotels:new Set(), properties:new Set(), suppliers:new Set(), locations:new Set(), quantity:0, spend:0, dates:[] };
    const qty = Number(item.quantity || 0);
    const price = Number(item.unitPrice || 0);
    g.quantity += qty; g.spend += qty * price; g.hotels.add(item.order.hotelId); g.suppliers.add(item.order.supplierId);
    if (item.order.property) {
      const location = [item.order.property.city, item.order.property.governorate].filter(Boolean).join(", ");
      g.locations.add(location); g.properties.add(location);
    }
    if (item.order.deliveryDate) g.dates.push(item.order.deliveryDate);
    groups.set(p.id, g);
  }

  return [...groups.values()].filter(g => g.hotels.size >= minHotels).map(g => {
    const average = g.quantity ? g.spend / g.quantity : 0;
    const signal = g.hotels.size >= 5 || g.quantity >= 500 ? "HIGH" : g.hotels.size >= 3 || g.quantity >= 200 ? "MEDIUM" : "LOW";
    return {
      productId:g.productId, sku:g.sku, productName:g.productName, category:g.category, unitOfMeasure:g.unitOfMeasure,
      supplierCount:g.suppliers.size, hotelCount:g.hotels.size, propertyCount:g.properties.size, requestedQuantity:g.quantity,
      currentSpend:Number(g.spend.toFixed(2)), weightedUnitPrice:Number(average.toFixed(2)),
      deliveryFrom:g.dates.length ? new Date(Math.min(...g.dates.map(d=>d.getTime()))).toISOString() : null,
      deliveryTo:g.dates.length ? new Date(Math.max(...g.dates.map(d=>d.getTime()))).toISOString() : null,
      locations:[...g.locations].sort(), volumeDealSignal:signal as "HIGH"|"MEDIUM"|"LOW",
    };
  }).sort((a,b)=>b.currentSpend-a.currentSpend);
}
