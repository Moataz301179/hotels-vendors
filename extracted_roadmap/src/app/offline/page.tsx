import { LogoFull } from "@/components/logo";
import { Btn } from "@/components/ui";
import { SiteNav } from "@/components/marketing/site-nav";

export default function OfflinePage() {
  return (
    <div className="min-h-screen relative">
      <SiteNav />
      <div className="pt-28 grid min-h-[80vh] place-items-center px-6 text-center">
        <div className="max-w-sm">
          <LogoFull />
          <h1 className="mt-6 text-2xl font-semibold">You&apos;re offline</h1>
          <p className="mt-2 text-fg-2">Reconnect to access INVO transactional layer and HV Capital orchestration.</p>
          <div className="mt-6"><Btn href="/">Retry</Btn></div>
        </div>
      </div>
    </div>
  );
}
