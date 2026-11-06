"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({
  next,
  notice,
}: {
  next: string;
  notice?: string;
}) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const message = state.error ?? notice;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[15px] text-slate-900 outline-none transition focus:border-nova-blue focus:ring-2 focus:ring-nova-blue/25"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[15px] text-slate-900 outline-none transition focus:border-nova-blue focus:ring-2 focus:ring-nova-blue/25"
        />
      </div>

      {message && (
        <p
          role="alert"
          className="rounded-lg border border-nova-red/30 bg-nova-red/5 px-3.5 py-2.5 text-sm text-nova-red"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-lg bg-nova-blue text-[15px] font-semibold text-white transition hover:bg-[#1f3382] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-blue disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
