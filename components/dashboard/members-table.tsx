
"use client";

import { useMemo, useState } from "react";
import { Search, Eye, X, Users } from "lucide-react";

type Member = {
  id: string;
  full_name: string | null;
  student_id: string | null;
  academic_level: string | null;
  specialization: string | null;
  faculty: string | null;
  role_code: string;
  is_active: boolean;
  created_at: string;
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  organizer: "Organizer",
  member: "Member",
};

export function MembersTable({ members }: { members: Member[] }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const levels = useMemo(
    () =>
      Array.from(
        new Set(
          members
            .map((member) => member.academic_level)
            .filter((level): level is string => Boolean(level))
        )
      ).sort(),
    [members]
  );

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !term ||
        [
          member.full_name,
          member.student_id,
          member.specialization,
          member.faculty,
        ].some((value) => value?.toLowerCase().includes(term));

      const matchesRole =
        roleFilter === "all" || member.role_code === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && member.is_active) ||
        (statusFilter === "inactive" && !member.is_active);

      const matchesLevel =
        levelFilter === "all" || member.academic_level === levelFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus &&
        matchesLevel
      );
    });
  }, [members, search, roleFilter, statusFilter, levelFilter]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5">
        <div>
          <h2 className="font-semibold text-slate-900">All members</h2>
          <p className="mt-1 text-sm text-slate-500">
            {filteredMembers.length} of {members.length} members
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or student ID..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#263F99] focus:ring-2 focus:ring-[#263F99]/10"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#263F99]"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
            <option value="member">Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#263F99]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#263F99]"
          >
            <option value="all">All academic levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Member</th>
              <th className="px-5 py-4 font-semibold">Student ID</th>
              <th className="px-5 py-4 font-semibold">Academic level</th>
              <th className="px-5 py-4 font-semibold">Role</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 text-right font-semibold">Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-4 font-medium text-slate-900">
                  {member.full_name || "Unnamed member"}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {member.student_id || "—"}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {member.academic_level || "—"}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-[#263F99]/10 px-3 py-1 text-xs font-semibold text-[#263F99]">
                    {roleLabels[member.role_code] || member.role_code}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      member.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {member.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-[#263F99] transition hover:bg-[#263F99]/10"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <Users className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                  <p className="font-medium text-slate-700">
                    No members found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-details-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#D71F3B]">
                  Member profile
                </p>
                <h3
                  id="member-details-title"
                  className="mt-1 text-xl font-bold text-[#263F99]"
                >
                  {selectedMember.full_name || "Unnamed member"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                aria-label="Close details"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail label="Student ID" value={selectedMember.student_id} />
              <Detail label="Academic level" value={selectedMember.academic_level} />
              <Detail label="Specialization" value={selectedMember.specialization} />
              <Detail label="Faculty" value={selectedMember.faculty} />
              <Detail
                label="Role"
                value={roleLabels[selectedMember.role_code] || selectedMember.role_code}
              />
              <Detail
                label="Account status"
                value={selectedMember.is_active ? "Active" : "Inactive"}
              />
              <Detail
                label="Joined"
                value={new Date(selectedMember.created_at).toLocaleDateString()}
              />
            </div>

            <button
              onClick={() => setSelectedMember(null)}
              className="mt-6 w-full rounded-xl bg-[#263F99] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#20347f]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}
