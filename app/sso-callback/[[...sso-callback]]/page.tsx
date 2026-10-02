import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <AuthenticateWithRedirectCallback redirectUrl="/dashboard" />
    </main>
  );
}
