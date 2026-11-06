"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function readField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateMemberProfile(formData: FormData) {
  await requireRole("admin");

  const memberId = readField(formData, "member_id");
  const fullName = readField(formData, "full_name");
  const phone = readField(formData, "phone");
  const academicLevel = readField(formData, "academic_level");
  const specialization = readField(formData, "specialization");
  const faculty = readField(formData, "faculty");

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(memberId) || !fullName) {
    redirect("/dashboard/members?error=invalid");
  }

  if (
    fullName.length > 100 ||
    phone.length > 20 ||
    academicLevel.length > 50 ||
    specialization.length > 100 ||
    faculty.length > 100
  ) {
    redirect("/dashboard/members?error=invalid");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      academic_level: academicLevel || null,
      specialization: specialization || null,
      faculty: faculty || null,
    })
    .eq("id", memberId)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[members] profile update failed:", error?.message);
    redirect("/dashboard/members?error=update");
  }

  revalidatePath("/dashboard/members");
  redirect("/dashboard/members?updated=1");
}
