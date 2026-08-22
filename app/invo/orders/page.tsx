export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";

async function fetchOrders() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("v_procurement_status").select("*").limit(100);
  return data || [];
}

export default async function InvoiceOrders() {
  const orders = await fetchOrders();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Invoice Orders</h1>
        <p className="text-sm text-foreground-secondary mt-1">Procurement order pipeline</p>
      </div>
      {orders.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-foreground-secondary">
          No orders data available (Supabase not configured)
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-surface-raised">
                <th className="text-left p-4 font-medium">Order</th>
                <th className="text-left p-4 font-medium">Supplier</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-b hover:bg-surface-raised/50">
                  <td className="p-4 font-mono text-sm">{o.order_number}</td>
                  <td className="p-4">{o.supplier_name}</td>
                  <td className="p-4">{o.procurement_state}</td>
                  <td className="p-4 text-right font-mono">{o.face_value?.toLocaleString("en-EG")} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
