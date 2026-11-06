import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SessionRoster } from "@/components/dashboard/session-roster";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionDetailsPage({ params }: PageProps) {
  await requireRole("organizer");

  const { id } = await params;

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    notFound();
  }

  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select(
      "id, title, description, status, session_type, location, starts_at, ends_at",
    )
    .eq("id", id)
    .single();

  if (sessionError || !session) {
    notFound();
  }

  const [
    { data: rosterData, error: rosterError },
    { data: summaryData, error: summaryError },
  ] = await Promise.all([
    supabase.rpc("get_session_roster", { p_session_id: id }),
    supabase.rpc("get_session_summary", { p_session_id: id }),
  ]);

  const roster = rosterData ?? [];
  const summary = Array.isArray(summaryData) ? summaryData[0] : summaryData;

  if (rosterError || summaryError || !summary) {
    console.error("Session attendance error:", {
      rosterError,
      summaryError,
    });

    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/sessions"
          className="text-sm text-[#263F99] hover:underline"
        >
          ← Back to Sessions
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Could not load attendance data. Check the RPC permissions and database
          functions, then try again.
        </div>
      </div>
    );
  }

  // Absence is manual: do not treat an unmarked member as absent.
  const totalRegistered = Number(summary.total_registered ?? roster.length);
  const totalPresent = Number(summary.total_present ?? 0);
  const totalPending = Math.max(0, totalRegistered - totalPresent);
  const attendanceRate =
    totalRegistered > 0
      ? Math.round((totalPresent / totalRegistered) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/sessions"
        className="text-sm text-[#263F99] hover:underline"
      >
        ← Back to Sessions
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#EDF8FB] px-3 py-1 text-xs font-medium capitalize text-[#263F99]">
              {session.session_type}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
              {session.status}
            </span>
          </div>

          <Link
            href={`/dashboard/sessions/${session.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <span>✏️</span>
            Edit Session
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>

        {session.description && (
          <p className="max-w-2xl text-sm text-gray-500">
            {session.description}
          </p>
        )}

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
          {session.location && <span>📍 {session.location}</span>}
          <span>{new Date(session.starts_at).toLocaleString()}</span>
        </div>
      </header>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Registered" value={totalRegistered} />
        <StatCard label="Present" value={totalPresent} />
        <StatCard label="Pending" value={totalPending} />
        <StatCard label="Attendance rate" value={`${attendanceRate}%`} />
      </section>

      <SessionRoster members={roster} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
