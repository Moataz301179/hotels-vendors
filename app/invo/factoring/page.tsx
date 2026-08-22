export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";

async function fetchFactoring() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("v_invoice_pipeline").select("*").eq("factoring_eligible", true).limit(50);
  return data || [];
}

export default async function InvoiceFactoring() {
  const invoices = await fetchFactoring();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Factoring Eligible</h1>
        <p className="text-sm text-foreground-secondary mt-1">Invoices ready for liquidity injection</p>
      </div>
      {invoices.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-foreground-secondary">
          No factoring data available (Supabase not configured)
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-surface-raised">
                <th className="text-left p-4 font-medium">Invoice</th>
                <th className="text-left p-4 font-medium">Supplier</th>
                <th className="text-left p-4 font-medium">Amount</th>
                <th className="text-left p-4 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-b hover:bg-surface-raised/50">
                  <td className="p-4 font-mono text-sm">{inv.invoice_number}</td>
                  <td className="p-4">{inv.supplier_name}</td>
                  <td className="p-4 font-mono">{inv.face_value?.toLocaleString("en-EG")} EGP</td>
                  <td className="p-4">{inv.risk_band}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
