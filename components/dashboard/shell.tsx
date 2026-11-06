"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { LOGO_WHITE } from "@/lib/brand";
import { NAV_ITEMS } from "@/lib/nav";
import { ROLE_LABEL, hasMinRole, type Role } from "@/lib/roles";
import { signOut } from "@/app/dashboard/actions";

type ShellUser = { fullName: string; email: string; role: Role };

export function DashboardShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const items = NAV_ITEMS.filter((item) => hasMinRole(user.role, item.minRole));

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-dvh bg-nova-ice">
      {/* Mobile overlay */}
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-nova-blue text-white transition-transform duration-200 motion-reduce:transition-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <img src={LOGO_WHITE} alt="NOVA English Club" className="h-6 w-auto" />
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="rounded-md p-1.5 text-white/80 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => {
            const Icon = item.icon;
            const base =
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium";

            if (!item.ready) {
              return (
                <span
                  key={item.href}
                  aria-disabled="true"
                  className={`${base} cursor-not-allowed text-white/45`}
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/70">
                    Soon
                  </span>
                </span>
              );
            }

            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`${base} transition-colors ${
                  active
                    ? "bg-white text-nova-blue"
                    : "text-white/85 hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur sm:px-8">
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-900">
                {user.fullName}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <span className="rounded-full bg-nova-blue/10 px-2.5 py-1 text-xs font-semibold text-nova-blue">
              {ROLE_LABEL[user.role]}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-nova-red hover:text-nova-red"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
