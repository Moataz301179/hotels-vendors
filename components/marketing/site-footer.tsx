import Link from "next/link";

/* Footer — Bold Typography: black body, mono labels, vermillion hover,
   5-column grid collapsing to 2 on mobile. No Oliv references. */

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse catalog", href: "/marketplace" },
      { label: "Categories", href: "/categories" },
      { label: "Request for quote", href: "/rfq" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Financing",
    links: [
      { label: "Financing & liquidity", href: "/financing" },
      { label: "Invoice factoring", href: "/factoring-service" },
      { label: "Yield calculator", href: "/yield-calculator" },
      { label: "FRA shield", href: "/fra-shield" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Overview", href: "/platform" },
      { label: "Integrations", href: "/erp-integrations" },
      { label: "ETA compliance", href: "/eta-compliance" },
      { label: "Partner Portal", href: "/partners" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
  },
];

export function SiteFooter({ ar = false }: { ar?: boolean }) {
  return (
    <footer className="border-t border-[#262626] bg-[#0A0A0A] text-[#FAFAFA]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10">
          {/* Brand block */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3" dir="ltr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-white.svg" alt="HotelsVendors" width={30} height={30} className="object-contain" />
              <span className="font-semibold uppercase text-[13px] tracking-[0.22em]">HotelsVendors</span>
            </Link>
            <p className="mt-5 text-[13px] leading-[1.7] text-[#737373] max-w-[34ch]">
              {ar
                ? "منصة المشتريات والتمويل لقطاع الضيافة المصري. أسعار ثابتة، تمويل مدمج، وفوترة إلكترونية متوافقة."
                : "The procurement and fintech operating system for Egyptian hospitality. Fixed prices, embedded factoring, compliant e-invoicing."}
            </p>
            <p className="mt-6 font-mono text-[11px] tracking-[0.15em] uppercase text-[#737373]">
              Cairo, Egypt
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#737373] mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label + l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-[#A3A3A3] hover:text-[#FF3D00] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[#262626] flex flex-col md:flex-row justify-between gap-4">
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#737373]">
            {ar
              ? "© 2026 ريتورانتس للتسويق الإلكتروني · جميع الحقوق محفوظة"
              : "© 2026 Returants for E-Marketing · All rights reserved"}
          </p>
          <div className="flex gap-8">
            <Link href="/terms" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#737373] hover:text-[#FAFAFA] transition-colors">
              {ar ? "الشروط" : "Terms"}
            </Link>
            <Link href="/privacy" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#737373] hover:text-[#FAFAFA] transition-colors">
              {ar ? "الخصوصية" : "Privacy"}
            </Link>
            <Link href="/compliance" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#737373] hover:text-[#FAFAFA] transition-colors">
              {ar ? "الامتثال" : "Compliance"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
