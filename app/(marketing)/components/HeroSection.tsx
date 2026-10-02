import Link from "next/link";
import { ArrowRight, CircleDollarSign, Factory, ShieldCheck, Truck, Building2, Activity, Search, Receipt } from "lucide-react";

const actors = [
  { label: "Hotels", icon: Building2, detail: "Spend + demand" },
  { label: "Suppliers", icon: Factory, detail: "Supply + pricing" },
  { label: "Carriers", icon: Truck, detail: "Delivery + routes" },
  { label: "Funders", icon: CircleDollarSign, detail: "External liquidity" },
];

const stages = ["Signal", "Evidence", "Leak / Need", "Opportunity", "Action", "Outcome"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F7F8FA] px-4 pb-16 pt-28 text-[#0F172A] md:px-8 md:pb-20 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(37,99,235,.10),transparent_34%),radial-gradient(circle_at_20%_85%,rgba(13,148,136,.07),transparent_30%)]" />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D9DEE7] bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.18em] text-[#2563EB]">
              <Activity size={12} /> Virtual Shadow
            </div>
            <h1 className="max-w-2xl text-[clamp(42px,6vw,72px)] font-semibold leading-[.98] tracking-[-.055em]">
              Find the money leaks before they become expensive.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-7 text-[#596579]">
              HotelsVendors watches procurement signals across hotels, suppliers, carriers and funders — then turns evidence into a clear next action.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sign-in" className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,.18)] hover:bg-[#1D4ED8]">
                Open the workspace <ArrowRight size={15} />
              </Link>
              <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] hover:bg-[#F1F5F9]">
                Browse live supply
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {actors.map(({ label, icon: Icon, detail }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[11px] text-[#596579]">
                  <Icon size={13} className="text-[#0D9488]" /> <b className="text-[#0F172A]">{label}</b> {detail}
                </span>
              ))}
            </div>
          </div>

          <div className="relative rounded-[28px] border border-[#DDE3EC] bg-[#0D1420] p-3 shadow-[0_28px_80px_rgba(15,23,42,.16)]">
            <div className="rounded-[20px] border border-white/10 bg-[#111A28] p-4 md:p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#6B7A90]">Virtual Shadow workspace</p>
                  <p className="mt-1 text-sm font-semibold text-white">Procurement signal map</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#36D6B5]/20 bg-[#36D6B5]/10 px-2.5 py-1 text-[10px] text-[#7CE8D2]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#36D6B5]" /> monitoring
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-[1.05fr_.95fr]">
                <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-[#7F8DA1]"><Search size={13} /> Detected signal</div>
                  <div className="mt-4 flex items-start gap-3">
                    <div className="rounded-xl bg-[#2563EB]/15 p-2.5"><Receipt size={17} className="text-[#6EA8FF]" /></div>
                    <div>
                      <p className="text-sm font-semibold text-white">Procurement variance</p>
                      <p className="mt-1 text-[11px] leading-5 text-[#8D9AAF]">Evidence-linked review, not a guessed saving.</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
                    {["Evidence attached", "Need classified", "Supplier options", "Action ready"].map((item, i) => (
                      <div key={item} className="flex items-center gap-2 rounded-lg bg-white/[.035] px-3 py-2 text-[11px] text-[#B7C1CF]">
                        <span className={i < 2 ? "h-1.5 w-1.5 rounded-full bg-[#36D6B5]" : "h-1.5 w-1.5 rounded-full bg-[#4B5A70]"} /> {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                  <div className="text-[10px] uppercase tracking-[.16em] text-[#7F8DA1]">Network lanes</div>
                  <div className="mt-4 space-y-2">
                    {actors.map(({ label, icon: Icon }) => (
                      <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0B121D] px-3 py-3">
                        <span className="flex items-center gap-2 text-xs text-white"><Icon size={14} className="text-[#36D6B5]" />{label}</span>
                        <span className="text-[10px] text-[#6F7E92]">connected</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0B121D] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[.16em] text-[#7F8DA1]">Decision chain</span>
                  <ShieldCheck size={14} className="text-[#36D6B5]" />
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {stages.map((stage, i) => (
                    <div key={stage} className="rounded-lg border border-white/10 px-2 py-2.5">
                      <span className="text-[9px] text-[#36D6B5]">0{i + 1}</span>
                      <p className="mt-1 text-[10px] font-medium text-[#DCE4EF]">{stage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
