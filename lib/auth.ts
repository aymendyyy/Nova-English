
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasMinRole, isRole, type Role } from "@/lib/roles";

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
};

export const getCurrentUser = cache(
  async (): Promise<CurrentUser | null> => {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role_code, is_active")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error(
        "[auth] could not load profile:",
        profileError?.message
      );
      return null;
    }

    return {
      id: user.id,
      email: user.email ?? "",
      fullName: profile.full_name || user.email || "NOVA member",
      role: isRole(profile.role_code)
        ? profile.role_code
        : "member",
      isActive: Boolean(profile.is_active),
    };
  }
);

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!user.isActive) redirect("/login?error=inactive");

  return user;
}

export async function requireRole(min: Role): Promise<CurrentUser> {
  const user = await requireUser();

  if (!hasMinRole(user.role, min)) {
    redirect("/dashboard");
  }

  return user;
}
