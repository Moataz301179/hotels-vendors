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
    <main className="min-h-full bg-[#080B10] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="border-b border-[#202936] pb-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#36D6B5]">Virtual Shadow</p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-[#F4F7FA] sm:text-5xl">
                See where the money moves.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#8E9AAA]">
                One intelligence layer watching the hospitality network for signals,
                evidence, opportunities and actions — without inventing business outcomes.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#202936] px-3 py-2 text-xs text-[#8E9AAA]">
              <Activity size={14} className="text-[#36D6B5]" />
              Waiting for connected signals
            </div>
          </div>
        </section>

        <section className="grid gap-px border-x border-b border-[#202936] bg-[#202936] md:grid-cols-4">
          {ACTORS.map(({ label, icon: Icon, text }) => (
            <div key={label} className="bg-[#080B10] p-5">
              <Icon size={18} className="text-[#36D6B5]" />
              <h2 className="mt-4 text-sm font-medium text-[#F4F7FA]">{label}</h2>
              <p className="mt-1 text-xs leading-5 text-[#8E9AAA]">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-[#202936] bg-[#10151D] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8E9AAA]">Intelligence loop</p>
              <h2 className="mt-2 text-xl font-medium text-[#F4F7FA]">From signal to outcome</h2>
            </div>
          </div>
          <div className="mt-7 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {STAGES.map((stage, index) => (
              <div key={stage} className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-[#202936] bg-[#080B10] px-3 py-3">
                  <span className="text-[10px] text-[#36D6B5]">0{index + 1}</span>
                  <p className="mt-1 text-sm text-[#F4F7FA]">{stage}</p>
                </div>
                {index < STAGES.length - 1 && <ArrowRight size={14} className="hidden text-[#8E9AAA] lg:block" />}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-2">
          {LANES.map((lane) => (
            <article key={lane.title} className="rounded-2xl border border-[#202936] bg-[#10151D] p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#36D6B5]">Opportunity lane</p>
              <h2 className="mt-3 text-lg font-medium text-[#F4F7FA]">{lane.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#8E9AAA]">{lane.desc}</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#202936] pt-4">
                <span className="text-xs text-[#8E9AAA]">No verified signal yet</span>
                <Link href={lane.href} className="inline-flex items-center gap-2 text-xs font-medium text-[#36D6B5]">
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
