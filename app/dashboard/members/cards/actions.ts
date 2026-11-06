
"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import QRCode from "qrcode";

export async function getMemberCard(memberId: string) {
  await requireRole("admin");

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(memberId)) {
    throw new Error("Invalid member ID.");
  }

  const supabase = await createClient();

  const [{ data: member, error: memberError }, { data: token, error: tokenError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, student_id, academic_level, role_code, is_active")
        .eq("id", memberId)
        .single(),

      supabase.rpc("get_or_create_member_qr_token", {
        p_member_id: memberId,
      }),
    ]);

  if (memberError || !member) {
    throw new Error("Could not load member profile.");
  }

  if (!member.is_active) {
    throw new Error("Cannot generate a card for an inactive member.");
  }

  if (tokenError || !token) {
    console.error("[member-cards] QR error:", tokenError?.message);
    throw new Error("Could not retrieve member QR.");
  }

  const qrDataUrl = await QRCode.toDataURL(token, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 600,
  });

  return {
    member: {
      id: member.id,
      fullName: member.full_name || "NOVA Member",
      studentId: member.student_id || "",
      academicLevel: member.academic_level || "",
      role: member.role_code,
    },
    qrDataUrl,
  };
}
