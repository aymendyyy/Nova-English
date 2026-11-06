import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function SessionsPage() {
  await requireRole("organizer");

  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select(
      `
      id,
      title,
      description,
      session_type,
      status,
      location,
      starts_at,
      ends_at
    `,
    )
    .order("starts_at", { ascending: false });

  if (error) {
    console.error("Sessions query error:", error.message);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/sessions/new"
        className="inline-flex items-center rounded-lg bg-[#263F99] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1d327c]"
      >
        + Create Session
      </Link>
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage sessions and monitor member attendance.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load sessions: {error.message}
        </div>
      ) : !sessions?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">No sessions yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sessions will appear here once they are created.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <article
              key={session.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#EDF8FB] px-3 py-1 text-xs font-medium capitalize text-[#263F99]">
                  {session.session_type}
                </span>

                <span className="text-xs font-medium capitalize text-gray-500">
                  {session.status}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                {session.title}
              </h2>

              <p className="mt-2 line-clamp-2 min-h-10 text-sm text-gray-500">
                {session.description || "No description provided."}
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <p>📅 {new Date(session.starts_at).toLocaleString()}</p>

                {session.location && <p>📍 {session.location}</p>}
              </div>

              <Link
                href={`/dashboard/sessions/${session.id}`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#263F99] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d327c]"
              >
                View attendance →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
