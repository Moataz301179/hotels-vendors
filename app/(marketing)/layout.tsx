import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fintech-shell min-h-screen bg-[#0c0c12]">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
