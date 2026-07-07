import { AuthLeftPanel } from "@/components/auth/auth-left-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex">
      {/* Left Panel — Brand, social proof, value props (desktop only) */}
      <AuthLeftPanel />

      {/* Right Panel — Auth forms */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 w-full max-w-xl mx-6 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
