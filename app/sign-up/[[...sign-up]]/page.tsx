import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#36D6B5",
            colorBackground: "#10151D",
            colorText: "#F4F7FA",
            colorTextSecondary: "#8E9AAA",
            colorInputBackground: "#080B10",
            colorInputText: "#F4F7FA",
            borderRadius: "12px",
          },
          elements: {
            card: "border border-[#E2E8F0] shadow-2xl",
            headerTitle: "text-[#0F172A]",
            headerSubtitle: "text-[#64748B]",
            formButtonPrimary: "bg-[#36D6B5] text-[#080B10] hover:bg-[#36D6B5]/90",
            formFieldInput: "border-[#E2E8F0] bg-[#F8FAFC]",
            footerActionLink: "text-[#0D9488]",
          },
        }}
      />
    </main>
  );
}
