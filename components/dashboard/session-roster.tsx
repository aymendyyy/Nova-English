"use client";

import { useMemo, useState } from "react";

type RosterMember = {
  member_id: string;
  full_name: string | null;
  student_id: string | null;
  attendance_status: string;
  checked_in_at: string | null;
  checkin_method: string | null;
  marked_by: string | null;
};

export function SessionRoster({ members }: { members: RosterMember[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const name = member.full_name?.toLowerCase() ?? "";
      const studentId = member.student_id?.toLowerCase() ?? "";
      const query = search.toLowerCase();

      // An unmarked member remains pending, including completed sessions.
      const status =
        member.attendance_status === "absent"
          ? "pending"
          : member.attendance_status;

      const matchesSearch = name.includes(query) || studentId.includes(query);

      const matchesFilter = filter === "all" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [members, search, filter]);

  function getStatus(member: RosterMember) {
    return member.attendance_status;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Attendance roster
          </h2>
          <p className="text-sm text-gray-500">
            {filteredMembers.length} of {members.length} members
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or student ID..."
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#263F99]"
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#263F99]"
          >
            <option value="all">All members</option>
            <option value="present">Present</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Check-in time</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredMembers.map((member) => {
              const status = getStatus(member);

              return (
                <tr key={member.member_id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {member.full_name || "Unknown member"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {member.student_id || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        status === "present"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {status === "present" ? "Present" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-500">
                    {member.checkin_method || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {member.checked_in_at
                      ? new Date(member.checked_in_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              );
            })}

            {filteredMembers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
