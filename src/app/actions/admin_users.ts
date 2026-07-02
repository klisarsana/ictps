"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export type AppRole = "karyawan" | "coach" | "admin";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  created_at: string;
}

export async function getAllUsersAction(): Promise<{ success?: boolean; data?: UserRow[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized. Please log in." };
    }

    if (user.user_metadata?.role !== "admin") {
      return { error: "Access denied. Admin privileges required." };
    }

    // Since we need all users, we can use the admin client
    const adminAuthClient = createAdminClient();
    
    // Fetch users from Auth to ensure we have the absolute source of truth
    const { data: authUsers, error: listError } = await adminAuthClient.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error fetching users from Auth Admin:", listError);
      return { error: "Failed to fetch users from authentication." };
    }

    const users: UserRow[] = authUsers.users.map((u) => ({
      id: u.id,
      name: u.user_metadata?.name || "Unknown",
      email: u.email || "",
      role: (u.user_metadata?.role as AppRole) || "karyawan",
      created_at: u.created_at,
    }));

    // Sort by name or created date if needed, let's just return as is
    return { success: true, data: users };
  } catch (err) {
    console.error("Unexpected error in getAllUsersAction:", err);
    return { error: "Terjadi kesalahan pada server saat mengambil data pengguna." };
  }
}

export async function updateUserRoleAction(userId: string, newRole: AppRole): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized. Please log in." };
    }

    if (user.user_metadata?.role !== "admin") {
      return { error: "Access denied. Admin privileges required." };
    }

    // Protect self-demotion if they are the only admin (optional, skip for now but good practice)
    if (userId === user.id && newRole !== "admin") {
      return { error: "Anda tidak dapat mengubah peran Anda sendiri." };
    }

    const adminAuthClient = createAdminClient();

    // 1. Update Auth Metadata
    const { data: updateData, error: updateError } = await adminAuthClient.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole }
    });

    if (updateError) {
      console.error("Error updating user auth metadata:", updateError);
      return { error: "Gagal memperbarui metadata autentikasi pengguna." };
    }

    // 2. Update Public Users table to keep it in sync
    const { error: dbError } = await adminAuthClient
      .from("users")
      .update({ role: newRole })
      .eq("id", userId);

    if (dbError) {
      console.error("Error syncing role to public.users table:", dbError);
      // We don't fail hard here because Auth is the source of truth, but it's good to log
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in updateUserRoleAction:", err);
    return { error: "Terjadi kesalahan pada server saat memperbarui role pengguna." };
  }
}
