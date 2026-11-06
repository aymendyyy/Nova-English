"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const redirectTo =
      `${window.location.origin}/auth/callback?next=/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo }
    );

    if (error) {
      setError("Unable to send the reset email. Please try again.");
    } else {
      setMessage(
        "If an account exists for this email, a password reset link has been sent."
      );
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EDF8FB] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#263F99]">
          Forgot password?
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          Enter your admin email address. We will send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full rounded-lg border p-3 outline-none focus:border-[#263F99]"
          />

          {message && (
            <p className="text-sm text-green-700">{message}</p>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#263F99] p-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-6 block text-center text-sm text-[#263F99] hover:underline"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}