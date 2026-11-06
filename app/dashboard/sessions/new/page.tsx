import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { SessionForm } from "@/components/dashboard/session-form";

export default async function NewSessionPage() {
  await requireRole("organizer");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/sessions"
          className="text-sm text-[#263F99] hover:underline"
        >
          ← Back to Sessions
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Create a Session
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new session or event to NOVA.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
        
        <SessionForm />
      </div>
    </div>
  );
}