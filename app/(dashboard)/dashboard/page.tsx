import Link from "next/link";
import { Activity, ArrowRight, Building2, CircleDollarSign, Factory, Truck } from "lucide-react";

const ACTORS = [
  { label: "Hotels", icon: Building2, text: "Demand, spend and procurement signals" },
  { label: "Suppliers", icon: Factory, text: "Supply, pricing and fulfilment signals" },
  { label: "Carriers", icon: Truck, text: "Delivery and route signals" },
  { label: "Funders", icon: CircleDollarSign, text: "External funding and cash-flow signals" },
];

const STAGES = ["Signal", "Detect", "Explain", "Opportunity", "Action", "Outcome"];

const LANES = [
  { title: "Money Leaks", desc: "Price variance, duplication, abnormal consumption and missed savings.", href: "/hotel/spend" },
  { title: "Savings Opportunities", desc: "Turn a verified leak into a supplier comparison or procurement action.", href: "/hotel/catalog" },
  { title: "Supplier Opportunities", desc: "Match real hospitality demand with suppliers that can act on it.", href: "/supplier" },
  { title: "Funding Signals", desc: "Surface external funding signals without HV funding or approving the facility.", href: "/funders" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-full bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="border-b border-[#E2E8F0] pb-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#0D9488]">Virtual Shadow</p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-[#0F172A] sm:text-5xl">
                See where the money moves.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#64748B]">
                One intelligence layer watching the hospitality network for signals,
                evidence, opportunities and actions — without inventing business outcomes.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] px-3 py-2 text-xs text-[#64748B]">
              <Activity size={14} className="text-[#0D9488]" />
              Waiting for connected signals
            </div>
          </div>
        </section>

        <section className="grid gap-px border-x border-b border-[#E2E8F0] bg-[#E2E8F0] md:grid-cols-4">
          {ACTORS.map(({ label, icon: Icon, text }) => (
            <div key={label} className="bg-[#F8FAFC] p-5">
              <Icon size={18} className="text-[#0D9488]" />
              <h2 className="mt-4 text-sm font-medium text-[#0F172A]">{label}</h2>
              <p className="mt-1 text-xs leading-5 text-[#64748B]">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#64748B]">Intelligence loop</p>
              <h2 className="mt-2 text-xl font-medium text-[#0F172A]">From signal to outcome</h2>
            </div>
          </div>
          <div className="mt-7 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {STAGES.map((stage, index) => (
              <div key={stage} className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3">
                  <span className="text-[10px] text-[#0D9488]">0{index + 1}</span>
                  <p className="mt-1 text-sm text-[#0F172A]">{stage}</p>
                </div>
                {index < STAGES.length - 1 && <ArrowRight size={14} className="hidden text-[#64748B] lg:block" />}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-2">
          {LANES.map((lane) => (
            <article key={lane.title} className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#0D9488]">Opportunity lane</p>
              <h2 className="mt-3 text-lg font-medium text-[#0F172A]">{lane.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#64748B]">{lane.desc}</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#E2E8F0] pt-4">
                <span className="text-xs text-[#64748B]">No verified signal yet</span>
                <Link href={lane.href} className="inline-flex items-center gap-2 text-xs font-medium text-[#0D9488]">
                  Open workflow <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
