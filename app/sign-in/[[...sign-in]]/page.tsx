import { SignIn } from "@clerk/nextjs";
import { BrandLogo } from "@/components/layout/brand-logo";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-[#DDE3EC] bg-white shadow-[0_24px_80px_rgba(15,23,42,.10)] lg:grid-cols-[.9fr_1.1fr]">
          <section className="hidden bg-[#0D1420] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <BrandLogo variant="dark" size="md" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#36D6B5]">Virtual Shadow</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.04em]">Your procurement workspace starts here.</h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#9AA7B8]">Sign in to access your role-scoped workspace. HotelsVendors never grants access across tenants or roles by client-side claims.</p>
            </div>
            <p className="text-[10px] uppercase tracking-[.16em] text-[#66758A]">Hotels · Suppliers · Carriers · Funders</p>
          </section>
          <section className="flex items-center justify-center p-6 sm:p-10">
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/dashboard"
              appearance={{
                variables: {
                  colorPrimary: "#2563EB",
                  colorBackground: "#FFFFFF",
                  colorText: "#0F172A",
                  colorTextSecondary: "#64748B",
                  colorInputBackground: "#F8FAFC",
                  colorInputText: "#0F172A",
                  borderRadius: "12px",
                },
                elements: {
                  card: "w-full border-0 shadow-none",
                  headerTitle: "text-[#0F172A]",
                  headerSubtitle: "text-[#64748B]",
                  formButtonPrimary: "bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
                  formFieldInput: "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A]",
                  footerActionLink: "text-[#2563EB]",
                },
              }}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
