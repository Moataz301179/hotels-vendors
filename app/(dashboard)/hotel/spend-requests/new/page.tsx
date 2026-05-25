"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewSpendRequestPage() {
  const router = useRouter();
  const [hotelId, setHotelId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [preferredSupplierId, setPreferredSupplierId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: 1, unitPrice: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vat = subtotal * 0.14;
  const total = subtotal + vat;

  function addItem() {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof LineItem, value: string | number) {
    const next = [...items];
    (next[idx] as any)[field] = value;
    setItems(next);
  }

  async function submit() {
    if (!hotelId) { toast.error("Hotel is required"); return; }
    if (items.some(i => !i.description || i.quantity <= 0 || i.unitPrice <= 0)) {
      toast.error("All items must have description, quantity > 0, and unit price > 0");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/spend-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          propertyId: propertyId || undefined,
          outletId: outletId || undefined,
          preferredSupplierId: preferredSupplierId || undefined,
          deliveryDate: deliveryDate || undefined,
          costCenter: costCenter || undefined,
          items: items.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })),
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Spend request created");
        router.push(`/hotel/spend-requests/${json.data.id}`);
      } else {
        toast.error(json.error || "Failed to create");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push("/hotel/spend-requests")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">New Spend Request</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hotel ID *</Label>
            <Input value={hotelId} onChange={e => setHotelId(e.target.value)} placeholder="hotel_xxx" />
          </div>
          <div className="space-y-2">
            <Label>Property ID</Label>
            <Input value={propertyId} onChange={e => setPropertyId(e.target.value)} placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <Label>Outlet ID</Label>
            <Input value={outletId} onChange={e => setOutletId(e.target.value)} placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <Label>Preferred Supplier ID</Label>
            <Input value={preferredSupplierId} onChange={e => setPreferredSupplierId(e.target.value)} placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <Label>Delivery Date</Label>
            <Input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Cost Center</Label>
            <Input value={costCenter} onChange={e => setCostCenter(e.target.value)} placeholder="e.g. F&B-Q3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Items</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5 space-y-1">
                <Label className="text-xs">Description</Label>
                <Input value={item.description} onChange={e => updateItem(idx, "description", e.target.value)} placeholder="Item description" />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Qty</Label>
                <Input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, "quantity", parseInt(e.target.value) || 0)} />
              </div>
              <div className="col-span-3 space-y-1">
                <Label className="text-xs">Unit Price (EGP)</Label>
                <Input type="number" min={0} step="0.01" value={item.unitPrice} onChange={e => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)} />
              </div>
              <div className="col-span-1 text-right font-mono text-sm pt-5">
                {(item.quantity * item.unitPrice).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
              </div>
              <div className="col-span-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(idx)} disabled={items.length === 1}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Subtotal: {subtotal.toLocaleString("en-GB", { minimumFractionDigits: 2 })} EGP</div>
            <div className="text-sm text-muted-foreground">VAT (14%): {vat.toLocaleString("en-GB", { minimumFractionDigits: 2 })} EGP</div>
          </div>
          <div className="text-2xl font-bold">{total.toLocaleString("en-GB", { minimumFractionDigits: 2 })} EGP</div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push("/hotel/spend-requests")}>Cancel</Button>
        <Button onClick={submit} disabled={submitting}>{submitting ? "Creating..." : "Create Spend Request"}</Button>
      </div>
    </div>
  );
}
