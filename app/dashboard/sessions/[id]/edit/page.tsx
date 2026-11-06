import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { EditSessionForm } from "@/components/dashboard/edit-session-form";

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("organizer");

  const { id } = await params;

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    notFound();
  }

  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .select(
      "id, title, description, session_type, status, location, starts_at, ends_at",
    )
    .eq("id", id)
    .single();

  if (error || !session) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={`/dashboard/sessions/${id}`}
          className="text-sm text-[#263F99] hover:underline"
        >
          ← Back to Session
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">Edit Session</h1>

        <p className="mt-1 text-sm text-gray-500">
          Update session information and status.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
        <EditSessionForm session={session} />
      </div>
    </div>
  );
}
