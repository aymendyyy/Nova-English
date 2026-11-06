import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LOGO_WHITE } from "@/lib/brand";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — NOVA English Club",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  const user = await getCurrentUser();
  if (user?.isActive) redirect("/dashboard");

  const notice =
    error === "inactive"
      ? "This account is not active. Ask a NOVA admin to activate it."
      : undefined;

  return (
    <main className="grid min-h-dvh place-items-center bg-nova-ice px-5 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <span className="rounded-xl bg-nova-blue px-5 py-3">
            <img src={LOGO_WHITE} alt="NOVA English Club" className="h-7 w-auto" />
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in
          </h1>
          <p className="mb-7 mt-1.5 text-sm text-slate-500">
            Use the account created for you by the NOVA team.
          </p>
          <LoginForm next={next ?? "/dashboard"} notice={notice} />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <a href="/" className="font-medium text-nova-blue hover:underline">
            Back to the NOVA website
          </a>
        </p>
      </div>
    </main>
  );
}
