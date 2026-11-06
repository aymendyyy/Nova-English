import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ManualCheckIn } from "@/components/dashboard/manual-checkin";

type PageProps = {
  searchParams: Promise<{ session?: string }>;
};

export default async function ManualCheckInPage({ searchParams }: PageProps) {
  await requireRole("organizer");

  const { session: selectedId } = await searchParams;
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("id, title, starts_at")
    .eq("status", "ongoing")
    .order("starts_at", { ascending: false });

  if (error) {
    console.error("[manual-check-in sessions]", error.message);
  }

  const selectedSession =
    sessions?.find((session) => session.id === selectedId) ?? sessions?.[0];

  let members: Array<{
    member_id: string;
    full_name: string | null;
    student_id: string | null;
    attendance_status: string;
    checked_in_at: string | null;
    checkin_method: string | null;
  }> = [];

  let rosterError: string | null = null;

  if (selectedSession) {
    const { data, error: rpcError } = await supabase.rpc("get_session_roster", {
      p_session_id: selectedSession.id,
    });

    if (rpcError) {
      console.error("[manual-check-in roster]", rpcError.message);
      rosterError = "Could not load the member list.";
    } else {
      members = data ?? [];
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Manual Check-in</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record member attendance without scanning a QR code.
        </p>
      </header>

      {!sessions?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">No ongoing sessions</h2>
          <p className="mt-2 text-sm text-gray-500">
            Change a scheduled session to Ongoing before recording attendance.
          </p>
          <Link
            href="/dashboard/sessions"
            className="mt-4 inline-block text-sm font-medium text-[#263F99] hover:underline"
          >
            View sessions →
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select session
            </label>
            <form
              action="/dashboard/manual-checkin"
              method="GET"
              className="flex flex-col gap-3 sm:flex-row"
            >
              <select
                name="session"
                defaultValue={selectedSession?.id}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#263F99]"
              >
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.title}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="rounded-lg bg-[#263F99] px-5 py-3 text-sm font-medium text-white hover:bg-[#1d327c]"
              >
                Select Session
              </button>
            </form>

            <p className="mt-3 text-xs text-gray-500">
              {new Date(selectedSession!.starts_at).toLocaleString()}
            </p>
          </div>

          {rosterError ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {rosterError}
            </div>
          ) : (
            <ManualCheckIn
              key={selectedSession!.id}
              sessionId={selectedSession!.id}
              members={members}
            />
          )}
        </>
      )}
    </div>
  );
}
