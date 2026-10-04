"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Skeleton } from "@/components/ui";

type Opportunity = {
  sku:string; productName:string; category:string; unitOfMeasure:string; hotelCount:number;
  requestedQuantity:number; weightedUnitPrice:number; deliveryFrom:string|null; deliveryTo:string|null;
  volumeDealSignal:"HIGH"|"MEDIUM"|"LOW";
};
type Payload = { data?: { demand:Opportunity[]; summary:{opportunities:number; aggregatedQuantity:number; currentSpend:number; highSignal:number} }; error?:string };

export default function DemandAggregationPage() {
  const [data,setData] = useState<Payload["data"]>(); const [error,setError] = useState<string>();
  useEffect(()=>{ fetch("/api/v1/demand/aggregate?days=30&minHotels=2").then(async r=>{const b=await r.json() as Payload; if(!r.ok||b.error) throw new Error(b.error||"Unable to load demand"); setData(b.data);}).catch(e=>setError(e.message)); },[]);
  return <main className="space-y-6 p-6">
    <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Market Compass</p><h1 className="text-3xl font-semibold tracking-tight">Aggregated Hotel Demand</h1><p className="mt-2 max-w-3xl text-sm text-muted-foreground">Combine recurring hotel demand into comparable volume so HotelsVendors can negotiate supplier deals instead of treating every order as an isolated purchase.</p></div>
    {error && <Card><CardContent className="pt-6 text-sm text-destructive">{error}</CardContent></Card>}
    {!data && !error && <Skeleton className="h-32 w-full" />}
    {data && <><div className="grid gap-4 md:grid-cols-4"><Metric label="Deal opportunities" value={data.summary.opportunities}/><Metric label="Aggregated units" value={data.summary.aggregatedQuantity.toLocaleString()}/><Metric label="Current spend" value={"EGP "+data.summary.currentSpend.toLocaleString()}/><Metric label="High-volume signals" value={data.summary.highSignal}/></div>
    <Card><CardHeader><CardTitle>Demand signals ready for supplier negotiation</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="px-3 py-3">Product</th><th className="px-3 py-3">Hotels</th><th className="px-3 py-3">Volume</th><th className="px-3 py-3">Avg. price</th><th className="px-3 py-3">Demand window</th><th className="px-3 py-3">Signal</th></tr></thead><tbody>{data.demand.map(item=><tr key={item.sku} className="border-b last:border-0"><td className="px-3 py-4"><div className="font-medium">{item.productName}</div><div className="text-xs text-muted-foreground">{item.sku} · {item.category}</div></td><td className="px-3 py-4">{item.hotelCount}</td><td className="px-3 py-4">{item.requestedQuantity.toLocaleString()} {item.unitOfMeasure}</td><td className="px-3 py-4">EGP {item.weightedUnitPrice.toLocaleString()}</td><td className="px-3 py-4">{formatDate(item.deliveryFrom)}{item.deliveryTo ? " → "+formatDate(item.deliveryTo) : ""}</td><td className="px-3 py-4"><Badge variant={item.volumeDealSignal==="HIGH" ? "default" : "secondary"}>{item.volumeDealSignal}</Badge></td></tr>)}</tbody></table></div>{!data.demand.length && <p className="py-10 text-center text-sm text-muted-foreground">No cross-hotel demand signal yet. More verified orders will unlock aggregation opportunities.</p>}</CardContent></Card></>}
  </main>;
}
function Metric({label,value}:{label:string;value:string|number}) { return <Card><CardContent className="pt-6"><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div></CardContent></Card>; }
function formatDate(value:string|null) { return value ? new Date(value).toLocaleDateString("en-EG",{day:"2-digit",month:"short"}) : "Flexible"; }
