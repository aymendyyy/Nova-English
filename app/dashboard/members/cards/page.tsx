
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MemberCardsManager } from "@/components/dashboard/member-cards-manager";

export default async function MemberCardsPage() {
  await requireRole("admin");

  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, full_name, student_id, academic_level, role_code")
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[member-cards] query failed:", error.message);
    throw new Error("Could not load member cards.");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#D71F3B]">
          Administration
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[#263F99]">
          Member Cards
        </h1>
        <p className="mt-2 text-slate-500">
          Generate, preview and print NOVA membership cards.
        </p>
      </div>

      <MemberCardsManager members={members ?? []} />
    </div>
  );
}
