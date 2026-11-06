"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type SessionFormState = {
  error?: string;
};

export async function createSessionAction(
  _prevState: SessionFormState,
  formData: FormData
): Promise<SessionFormState> {
  const user = await requireRole("organizer");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sessionType = String(formData.get("session_type") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const startsAt = String(formData.get("starts_at_iso") ?? "");
  const endsAt = String(formData.get("ends_at_iso") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!title) {
    return { error: "Session title is required." };
  }

  if (!["regular", "event"].includes(sessionType)) {
    return { error: "Invalid session type." };
  }

  if (!["draft", "scheduled"].includes(status)) {
    return { error: "Invalid session status." };
  }

  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);

  if (
    !startsAt ||
    !endsAt ||
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return { error: "Please provide valid start and end dates." };
  }

  if (endDate <= startDate) {
    return { error: "The end time must be after the start time." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("sessions").insert({
    title,
    description: description || null,
    session_type: sessionType,
    status,
    location: location || null,
    starts_at: startDate.toISOString(),
    ends_at: endDate.toISOString(),
    created_by: user.id,
  });

  if (error) {
    console.error("[create-session]", error.message);
    return { error: "Could not create the session. Please try again." };
  }

  revalidatePath("/dashboard/sessions");
  return {};
}