import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8E9AAA]">
            Virtual Shadow
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#F4F7FA]">
            From signal to measurable action.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8E9AAA]">
            HotelsVendors watches the hospitality procurement network for
            money leaks, savings opportunities, supplier demand and external
            funding signals.
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-xl border border-[#202936] bg-[#10151D] p-5"><p className="text-xs uppercase tracking-[0.18em] text-[#36D6B5]">Signal</p><p className="mt-3 text-sm leading-6 text-[#F4F7FA]">Watch procurement, supplier and cash-flow signals.</p></article>
          <article className="rounded-xl border border-[#202936] bg-[#10151D] p-5"><p className="text-xs uppercase tracking-[0.18em] text-[#36D6B5]">Detect</p><p className="mt-3 text-sm leading-6 text-[#F4F7FA]">Identify anomalies, leakage and actionable opportunities.</p></article>
          <article className="rounded-xl border border-[#202936] bg-[#10151D] p-5"><p className="text-xs uppercase tracking-[0.18em] text-[#36D6B5]">Explain</p><p className="mt-3 text-sm leading-6 text-[#F4F7FA]">Show the evidence and business impact behind a signal.</p></article>
          <article className="rounded-xl border border-[#202936] bg-[#10151D] p-5"><p className="text-xs uppercase tracking-[0.18em] text-[#36D6B5]">Opportunity</p><p className="mt-3 text-sm leading-6 text-[#F4F7FA]">Route savings, supplier or funding opportunities.</p></article>
          <article className="rounded-xl border border-[#202936] bg-[#10151D] p-5"><p className="text-xs uppercase tracking-[0.18em] text-[#36D6B5]">Action</p><p className="mt-3 text-sm leading-6 text-[#F4F7FA]">Let the authorized actor decide and execute.</p></article>
          <article className="rounded-xl border border-[#202936] bg-[#10151D] p-5"><p className="text-xs uppercase tracking-[0.18em] text-[#36D6B5]">Outcome</p><p className="mt-3 text-sm leading-6 text-[#F4F7FA]">Record the result for the network intelligence layer.</p></article>
        </section>

        <section className="mt-8 rounded-xl border border-[#202936] bg-[#10151D] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8E9AAA]">
                Intelligence workspace
              </p>
              <h2 className="mt-2 text-xl font-medium text-[#F4F7FA]">
                No unsupported performance numbers
              </h2>
            </div>
            <span className="rounded-full border border-[#202936] px-3 py-1 text-xs text-[#8E9AAA]">
              Live data only
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#8E9AAA]">
            Signals appear here when they are backed by connected HotelsVendors
            data. The interface does not invent savings, transaction volume,
            response times or network statistics.
          </p>
        </section>
      </div>
    </main>
  );
}
