"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  updateSessionAction,
  type EditSessionState,
} from "@/app/dashboard/sessions/[id]/actions";

type Session = {
  id: string;
  title: string;
  description: string | null;
  session_type: string;
  status: string;
  location: string | null;
  starts_at: string;
  ends_at: string;
};

export function EditSessionForm({ session }: { session: Session }) {
  const action = updateSessionAction.bind(null, session.id);

  const [state, formAction, pending] = useActionState(
    action,
    {} as EditSessionState
  );

  const toLocalDateTime = (value: string) => {
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  const [startsAt, setStartsAt] = useState(
    toLocalDateTime(session.starts_at)
  );
  const [endsAt, setEndsAt] = useState(
    toLocalDateTime(session.ends_at)
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        const form = event.currentTarget;

        if (!startsAt || !endsAt) {
          event.preventDefault();
          return;
        }

        const start = new Date(startsAt);
        const end = new Date(endsAt);

        if (Number.isNaN(start.getTime()) || end <= start) {
          event.preventDefault();
          return;
        }

        (form.elements.namedItem("starts_at_iso") as HTMLInputElement).value =
          start.toISOString();

        (form.elements.namedItem("ends_at_iso") as HTMLInputElement).value =
          end.toISOString();
      }}
      className="space-y-5"
    >
      <input type="hidden" name="starts_at_iso" />
      <input type="hidden" name="ends_at_iso" />

      {state.error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Field label="Session title">
        <input
          name="title"
          required
          maxLength={150}
          defaultValue={session.title}
          className={inputClass}
        />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          rows={3}
          maxLength={2000}
          defaultValue={session.description ?? ""}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Session type">
          <select
            name="session_type"
            defaultValue={session.session_type}
            className={inputClass}
          >
            <option value="regular">Regular Session</option>
            <option value="event">Event</option>
          </select>
        </Field>

        <Field label="Status">
          <select
            name="status"
            defaultValue={session.status}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>
      </div>

      <Field label="Location">
        <input
          name="location"
          maxLength={200}
          defaultValue={session.location ?? ""}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date and time">
          <input
            type="datetime-local"
            required
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="End date and time">
          <input
            type="datetime-local"
            required
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <Link
          href={`/dashboard/sessions/${session.id}`}
          className="rounded-lg border px-4 py-2.5 text-sm"
        >
          Cancel
        </Link>

        <button
          disabled={pending}
          className="rounded-lg bg-[#263F99] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#263F99]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}