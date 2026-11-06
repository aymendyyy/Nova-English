"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function manualCheckIn(sessionId: string, memberId: string) {
  await requireRole("organizer");

  if (!UUID_REGEX.test(sessionId) || !UUID_REGEX.test(memberId)) {
    return { success: false, message: "Invalid session or member ID." };
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc("mark_attendance_manual", {
    p_session_id: sessionId,
    p_member_id: memberId,
    p_note: "Manual check-in by organizer",
  });

  if (error) {
    console.error("[manual-check-in]", error.message);

    const message = error.message.toLowerCase();

    if (message.includes("already")) {
      return {
        success: false,
        message: "This member has already checked in.",
      };
    }

    if (message.includes("not registered")) {
      return {
        success: false,
        message: "This member is not registered for this session.",
      };
    }

    if (message.includes("not ongoing")) {
      return {
        success: false,
        message: "Manual check-in is only available for ongoing sessions.",
      };
    }

    return {
      success: false,
      message: "Could not register attendance. Please try again.",
    };
  }

  revalidatePath("/dashboard/manual-checkin");
  revalidatePath(`/dashboard/sessions/${sessionId}`);

  return {
    success: true,
    message: "Attendance registered successfully.",
  };
}
