
import {
  Activity,
  CalendarDays,
  ClipboardCheck,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="grid size-10 place-items-center rounded-xl bg-nova-blue/10 text-nova-blue">
          <Icon size={20} />
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-nova-blue">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const now = new Date();
  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();

  const [
    membersResult,
    sessionsResult,
    attendanceResult,
    recentSessionsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),

    supabase
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("status", "scheduled")
      .gte("starts_at", now.toISOString()),

    supabase
      .from("attendance")
      .select("id", { count: "exact", head: true })
      .gte("checked_in_at", monthStart),

    supabase
      .from("sessions")
      .select(
        "id, title, session_type, status, location, starts_at"
      )
      .neq("status", "cancelled")
      .order("starts_at", { ascending: false })
      .limit(5),
  ]);

  if (membersResult.error) {
    console.error("[dashboard] members:", membersResult.error.message);
  }

  if (sessionsResult.error) {
    console.error("[dashboard] sessions:", sessionsResult.error.message);
  }

  if (attendanceResult.error) {
    console.error("[dashboard] attendance:", attendanceResult.error.message);
  }

  if (recentSessionsResult.error) {
    console.error(
      "[dashboard] recent sessions:",
      recentSessionsResult.error.message
    );
  }

  const stats = [
    {
      title: "Active members",
      value: membersResult.error
        ? "—"
        : membersResult.count ?? 0,
      description: "Currently active accounts",
      icon: Users,
    },
    {
      title: "Upcoming sessions",
      value: sessionsResult.error
        ? "—"
        : sessionsResult.count ?? 0,
      description: "Scheduled sessions ahead",
      icon: CalendarDays,
    },
    {
      title: "Attendance this month",
      value: attendanceResult.error
        ? "—"
        : attendanceResult.count ?? 0,
      description: "Recorded check-ins this month",
      icon: ClipboardCheck,
    },
    {
      title: "Your role",
      value: user.role.toUpperCase(),
      description: "Your NOVA account permissions",
      icon: Activity,
    },
  ];

  const recentSessions = recentSessionsResult.data ?? [];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-nova-red">
          NOVA English Club
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-nova-blue sm:text-4xl">
          Welcome, {user.fullName.split(" ")[0]}
        </h1>

        <p className="mt-2 text-slate-500">
          Here is an overview of your club activity.
        </p>
      </section>

      {/* Statistics */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* Recent sessions */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent sessions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest activities registered in NOVA
            </p>
          </div>

          <CalendarDays className="text-nova-blue" size={21} />
        </div>

        {recentSessionsResult.error ? (
          <div className="p-6 text-sm text-red-600">
            Unable to load sessions. Check your database permissions.
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <CalendarDays
              size={32}
              className="mx-auto text-slate-300"
            />
            <p className="mt-3 font-medium text-slate-700">
              No sessions yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Sessions will appear here when they are created.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {session.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {session.location || "Location not specified"}
                    {" · "}
                    {formatDate(session.starts_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-nova-blue/10 px-3 py-1 text-xs font-medium capitalize text-nova-blue">
                    {session.session_type}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
