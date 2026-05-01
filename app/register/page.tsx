import { Suspense } from "react";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0c0e12]">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
