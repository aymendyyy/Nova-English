import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata: Metadata = {
  title: "Dashboard — NOVA English Club",
  robots: { index: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Real authorization boundary: runs on the server for every dashboard page.
  const user = await requireUser();

  return (
    <DashboardShell
      user={{ fullName: user.fullName, email: user.email, role: user.role }}
    >
      {children}
    </DashboardShell>
  );
}
