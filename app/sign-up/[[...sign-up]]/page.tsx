import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080B10] px-4 py-10">
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
            card: "border border-[#202936] shadow-2xl",
            headerTitle: "text-[#F4F7FA]",
            headerSubtitle: "text-[#8E9AAA]",
            formButtonPrimary: "bg-[#36D6B5] text-[#080B10] hover:bg-[#36D6B5]/90",
            formFieldInput: "border-[#202936] bg-[#080B10]",
            footerActionLink: "text-[#36D6B5]",
          },
        }}
      />
    </main>
  );
}
