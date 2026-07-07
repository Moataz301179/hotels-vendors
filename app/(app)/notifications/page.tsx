import { requireUser } from "@/lib/session";
import { Topbar } from "@/components/app/topbar";
import { Badge } from "@/components/ui";
import { BellRing, Truck, ReceiptText, Wallet, AlertTriangle, ClipboardCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const notes = [
  { icon: Truck, tone: "info" as const, title: "Carrier assigned", body: "SwiftLog accepted route for ORD-CAI-884. ETA delivery window: tomorrow 10:00–13:00." },
  { icon: ClipboardCheck, tone: "success" as const, title: "GRN ready", body: "Kitchen equipment delivery was marked delivered. Receiving team can create GRN and variance report." },
  { icon: ReceiptText, tone: "warning" as const, title: "ETA invoice pending", body: "Supplier invoice uploaded but ETA UUID is not yet recorded. Settlement remains on hold." },
  { icon: Wallet, tone: "brand" as const, title: "Factoring offer available", body: "Approved invoice eligible for same-day payout through funder desk at indicative 2.2% fee." },
  { icon: AlertTriangle, tone: "danger" as const, title: "Approval breach risk", body: "Order value exceeds department monthly spend threshold. Finance director approval required." },
];

export default async function NotificationsPage() {
  const user = await requireUser();
  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={user.orgType ?? "hotel"} title="Notifications" />
      <main className="mx-auto w-full max-w-4xl flex-1 p-5 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface"><BellRing className="h-5 w-5 text-[var(--brand)]" /></div>
          <div><h2 className="font-semibold">Operational alerts</h2><p className="text-sm text-muted">Status changes, compliance holds, AI alerts and payment events.</p></div>
        </div>
        <div className="card divide-y divide-border overflow-hidden">
          {notes.map((n) => (
            <div key={n.title} className="flex gap-4 p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-2"><n.icon className="h-5 w-5 text-[var(--brand)]" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{n.title}</h3><Badge tone={n.tone}>new</Badge></div>
                <p className="mt-1 text-sm leading-6 text-muted">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
