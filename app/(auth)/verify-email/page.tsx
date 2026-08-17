import { redirect } from "next/navigation";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const params = new URLSearchParams();

  const token = searchParams?.token;
  const email = searchParams?.email;

  if (typeof token === "string" && token) {
    params.set("token", token);
  }
  if (typeof email === "string" && email) {
    params.set("email", email);
  }

  redirect(`/verify${params.toString() ? `?${params.toString()}` : ""}`);
}
