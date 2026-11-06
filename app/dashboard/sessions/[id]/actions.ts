"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type EditSessionState = {
  error?: string;
};

export async function updateSessionAction(
  sessionId: string,
  _prevState: EditSessionState,
  formData: FormData
): Promise<EditSessionState> {
  await requireRole("organizer");

  if (!UUID_REGEX.test(sessionId)) {
    return { error: "Invalid session ID." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const sessionType = String(formData.get("session_type") ?? "");
  const status = String(formData.get("status") ?? "");
  const startsAt = String(formData.get("starts_at_iso") ?? "");
  const endsAt = String(formData.get("ends_at_iso") ?? "");

  if (!title || title.length > 150) {
    return { error: "Enter a title between 1 and 150 characters." };
  }

  if (!["regular", "event"].includes(sessionType)) {
    return { error: "Invalid session type." };
  }

  if (
    !["draft", "scheduled", "ongoing", "completed", "cancelled"].includes(
      status
    )
  ) {
    return { error: "Invalid session status." };
  }

  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (
    !startsAt ||
    !endsAt ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return { error: "Please provide valid dates. End must be after start." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("sessions")
    .update({
      title,
      description: description || null,
      location: location || null,
      session_type: sessionType,
      status,
      starts_at: start.toISOString(),
      ends_at: end.toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    console.error("[update-session]", error.message);
    return { error: "Could not update this session. Please try again." };
  }

  revalidatePath("/dashboard/sessions");
  revalidatePath(`/dashboard/sessions/${sessionId}`);

  redirect(`/dashboard/sessions/${sessionId}`);
}