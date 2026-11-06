
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { QrScanner } from "@/components/dashboard/qr-scanner";

export default async function ScanPage() {
  await requireRole("organizer");

  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("id, title, starts_at")
    .eq("status", "ongoing")
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("[scan] sessions query failed:", error.message);
    throw new Error("Could not load ongoing sessions.");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#D71F3B]">
          Attendance
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[#263F99]">
          QR Scanner
        </h1>
        <p className="mt-2 text-slate-500">
          Scan member cards to record session attendance.
        </p>
      </div>

      {!sessions?.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="font-semibold text-slate-900">
            No ongoing sessions
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Create or start a session before scanning member cards.
          </p>
        </div>
      ) : (
        <QrScanner sessions={sessions} />
      )}
    </div>
  );
}
