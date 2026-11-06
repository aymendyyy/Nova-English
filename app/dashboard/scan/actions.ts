
"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type CheckInResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function scanMemberQr(
  sessionId: string,
  token: string
): Promise<CheckInResult> {
  await requireRole("organizer");

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(sessionId)) {
    return { success: false, message: "Invalid session." };
  }

  if (!/^[0-9a-f]{64}$/.test(token)) {
    return { success: false, message: "Invalid QR code." };
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc("mark_attendance_qr", {
    p_session_id: sessionId,
    p_token: token,
  });

  if (error) {
    const message = error.message.toLowerCase();

    if (message.includes("already been checked in")) {
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
        message: "This session is not currently open for check-in.",
      };
    }

    if (
      message.includes("invalid or revoked") ||
      message.includes("invalid qr token")
    ) {
      return {
        success: false,
        message: "Invalid or revoked QR code.",
      };
    }

    if (message.includes("inactive")) {
      return {
        success: false,
        message: "This member account is inactive.",
      };
    }

    console.error("[QR Scanner]", error.message);

    return {
      success: false,
      message: "Check-in failed. Please try again.",
    };
  }

  revalidatePath("/dashboard/scan");

  return {
    success: true,
    message: "Attendance recorded successfully!",
  };
}
