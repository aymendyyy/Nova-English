import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Users, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import { MembersTable } from "@/components/dashboard/members-table";

export default async function MembersPage() {
  await requireRole("admin");

  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      student_id,
      academic_level,
      specialization,
      faculty,
      role_code,
      is_active,
      created_at
    `,
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[members] query failed:", error.message);
  }

  const rows = members ?? [];
  const activeCount = rows.filter((m) => m.is_active).length;
  const inactiveCount = rows.length - activeCount;

  const stats = [
    {
      label: "Members loaded",
      value: rows.length,
      icon: Users,
    },
    {
      label: "Active accounts",
      value: activeCount,
      icon: UserCheck,
    },
    {
      label: "Inactive accounts",
      value: inactiveCount,
      icon: UserX,
    },
  ];

  return <MembersTable members={rows} />;
}
