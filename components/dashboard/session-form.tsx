"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  createSessionAction,
  type SessionFormState,
} from "@/app/dashboard/sessions/actions";

const initialState: SessionFormState = {};

export function SessionForm() {
  const [state, action, pending] = useActionState(
    createSessionAction,
    initialState
  );

  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  return (
    <form
      action={action}
      onSubmit={(event) => {
        const form = event.currentTarget;

        const start = new Date(startsAt);
        const end = new Date(endsAt);

        if (
          !startsAt ||
          !endsAt ||
          Number.isNaN(start.getTime()) ||
          Number.isNaN(end.getTime())
        ) {
          event.preventDefault();
          return;
        }

        const startInput = form.elements.namedItem(
          "starts_at_iso"
        ) as HTMLInputElement;

        const endInput = form.elements.namedItem(
          "ends_at_iso"
        ) as HTMLInputElement;

        startInput.value = start.toISOString();
        endInput.value = end.toISOString();
      }}
      className="space-y-6"
    >
      <input type="hidden" name="starts_at_iso" />
      <input type="hidden" name="ends_at_iso" />

      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Session title *
        </label>
        <input
          name="title"
          required
          maxLength={150}
          placeholder="e.g. English Speaking Session"
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#263F99]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          maxLength={2000}
          placeholder="Describe this session..."
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#263F99]"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Session type *
          </label>
          <select
            name="session_type"
            required
            defaultValue="regular"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
          >
            <option value="regular">Regular Session</option>
            <option value="event">Event</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Status *
          </label>
          <select
            name="status"
            required
            defaultValue="draft"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          name="location"
          maxLength={200}
          placeholder="e.g. Faculty of Science and Technology"
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#263F99]"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Start date and time *
          </label>
          <input
            type="datetime-local"
            required
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            End date and time *
          </label>
          <input
            type="datetime-local"
            required
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
        <Link
          href="/dashboard/sessions"
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#263F99] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d327c] disabled:opacity-50"
        >
          {pending ? "Creating..." : "Create Session"}
        </button>
      </div>
    </form>
  );
}