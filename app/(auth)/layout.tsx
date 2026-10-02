import { Suspense } from "react";
import { AuthLeftPanel } from "@/components/auth/auth-left-panel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-foreground font-sans">
      <div className="flex min-h-screen">
        <Suspense fallback={<aside className="hidden lg:block w-[480px] shrink-0 border-r border-[#E2E8F0] bg-[#F8FAFC]" />}>
          <AuthLeftPanel />
        </Suspense>
        <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}