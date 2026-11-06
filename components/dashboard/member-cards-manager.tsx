
"use client";

import { useMemo, useState } from "react";
import { Search, CreditCard, Loader2 } from "lucide-react";
import { getMemberCard } from "@/app/dashboard/members/cards/actions";
import { MemberCard } from "@/components/dashboard/member-card";

type Member = {
  id: string;
  full_name: string | null;
  student_id: string | null;
  academic_level: string | null;
  role_code: string;
};

type CardData = Awaited<ReturnType<typeof getMemberCard>>;

export function MemberCardsManager({
  members,
}: {
  members: Member[];
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CardData | null>(null);
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return members.filter((member) =>
      [member.full_name, member.student_id].some((value) =>
        value?.toLowerCase().includes(term)
      )
    );
  }, [members, search]);

  async function previewCard(memberId: string) {
    setLoadingId(memberId);
    setError("");
    setSelected(null);

    try {
      const card = await getMemberCard(memberId);
      setSelected(card);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load member card."
      );
    } finally {
      setLoadingId("");
    }
  }

  const roleLabels: Record<string, string> = {
    member: "Student",
    organizer: "Organizer",
    admin: "Student",
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-semibold text-slate-900">Members</h2>
          <p className="mt-1 text-sm text-slate-500">
            {members.length} active members
          </p>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or student ID..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm outline-none focus:border-[#263F99]"
            />
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {member.full_name || "Unnamed member"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {member.student_id || "No Student ID"} · {member.academic_level || "—"}
                </p>
              </div>

              <button
                type="button"
                disabled={!!loadingId}
                onClick={() => previewCard(member.id)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#263F99] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {loadingId === member.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                Preview
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="p-8 text-center text-sm text-slate-500">
              No members found.
            </p>
          )}
        </div>
      </section>

      <section className="min-w-0">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {selected ? (
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-slate-900">Card preview</h2>
              <p className="mt-1 text-sm text-slate-500">
                {selected.member.fullName}
              </p>
            </div>

            <MemberCard
              fullName={selected.member.fullName}
              studentId={selected.member.studentId}
              academicLevel={selected.member.academicLevel}
              role={roleLabels[selected.member.role] || "Student"}
              qrDataUrl={selected.qrDataUrl}
            />
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <CreditCard className="h-10 w-10 text-slate-300" />
            <h3 className="mt-3 font-semibold text-slate-800">
              Select a member
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Choose a member to generate or preview their NOVA card.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
