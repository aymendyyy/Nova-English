
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import QRCode from "qrcode";
import { MemberCard } from "@/components/dashboard/member-card";

export default async function MyCardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: profile, error: profileError }, { data: token, error: qrError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, student_id, academic_level, role_code")
        .eq("id", user.id)
        .single(),

      supabase.rpc("get_or_create_member_qr_token", {
        p_member_id: null,
      }),
    ]);

  if (profileError || !profile) {
    throw new Error("Could not load your member profile.");
  }

  if (qrError || !token) {
    console.error("[my-card] QR generation failed:", qrError?.message);
    throw new Error("Could not generate your member QR code.");
  }

  const qrDataUrl = await QRCode.toDataURL(token, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 600,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  const roleLabels: Record<string, string> = {
    member: "Student",
    organizer: "Organizer",
    admin: "Admin",
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#D71F3B]">
          NOVA Membership
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[#263F99]">
          My Member Card
        </h1>
        <p className="mt-2 text-slate-500">
          Your personal NOVA membership card and attendance QR code.
        </p>
      </div>

      <MemberCard
        fullName={profile.full_name || user.fullName}
        studentId={profile.student_id || ""}
        academicLevel={profile.academic_level || ""}
        role={roleLabels[profile.role_code] || "Member"}
        qrDataUrl={qrDataUrl}
      />
    </div>
  );
}
