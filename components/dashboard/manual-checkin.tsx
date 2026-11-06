"use client";

import { useMemo, useState, useTransition } from "react";
import { manualCheckIn } from "@/app/dashboard/manual-checkin/actions";

type Member = {
  member_id: string;
  full_name: string | null;
  student_id: string | null;
  attendance_status: string;
  checked_in_at: string | null;
  checkin_method: string | null;
};

export function ManualCheckIn({
  sessionId,
  members,
}: {
  sessionId: string;
  members: Member[];
}) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return members.filter((member) => {
      return (
        (member.full_name ?? "").toLowerCase().includes(query) ||
        (member.student_id ?? "").toLowerCase().includes(query)
      );
    });
  }, [members, search]);

  function handleCheckIn(memberId: string) {
    setFeedback(null);
    setProcessingId(memberId);

    startTransition(async () => {
      const result = await manualCheckIn(sessionId, memberId);

      setFeedback(result);
      setProcessingId(null);

      if (result.success) {
        // Refresh server data after a successful check-in.
        window.location.reload();
      }
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Registered members
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a member to record their attendance manually.
        </p>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name or Student ID..."
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#263F99]"
      />

      {feedback && (
        <div
          className={`rounded-lg p-3 text-sm ${
            feedback.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {filteredMembers.map((member) => {
          const isPresent = member.attendance_status === "present";

          return (
            <div
              key={member.member_id}
              className="flex flex-col gap-3 border-b border-gray-100 p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {member.full_name || "Unknown member"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Student ID: {member.student_id || "—"}
                </p>
                {isPresent && (
                  <p className="mt-1 text-xs text-green-700">
                    Present · {member.checkin_method || "—"}
                  </p>
                )}
              </div>

              {isPresent ? (
                <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                  Already present
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleCheckIn(member.member_id)}
                  className="rounded-lg bg-[#263F99] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d327c] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingId === member.member_id
                    ? "Checking in..."
                    : "Mark Present"}
                </button>
              )}
            </div>
          );
        })}

        {filteredMembers.length === 0 && (
          <p className="p-8 text-center text-sm text-gray-500">
            No members found.
          </p>
        )}
      </div>
    </div>
  );
}