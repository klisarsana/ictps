"use server";

import { createClient } from "@/utils/supabase/server";
import { EmployeeSummary } from "@/types/admin";

export async function getAdminDashboardData(): Promise<{ success: true; data: EmployeeSummary[] } | { error: string }> {
  try {
    const supabase = await createClient();
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized access. Please log in." };
    }

    // Verify user has 'admin' role in their metadata
    // Note: Adjust the exact path to 'role' based on your Supabase Auth configuration
    const role = user.user_metadata?.role;
    if (role !== "admin") {
      return { error: "Access denied. Admin privileges required." };
    }

    // Fetch data from the secure view (contains stats)
    const { data: summaryData, error: summaryError } = await supabase
      .from("admin_dashboard_summary")
      .select("*");

    if (summaryError) {
      console.error("Error fetching admin_dashboard_summary:", summaryError);
      return { error: "Failed to fetch dashboard data." };
    }

    // Fetch all users to ensure nobody is missing (e.g. Coaches who don't have pemetaan)
    const { data: allUsers, error: usersError } = await supabase
      .from("users")
      .select("id, name, email, role");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return { error: "Failed to fetch users." };
    }

    // Merge them
    const uniqueDataMap = new Map<string, EmployeeSummary>();
    
    // First put all users in with default empty stats
    (allUsers || []).forEach((u: any) => {
      uniqueDataMap.set(u.id, {
        user_id: u.id,
        name: u.name || "Unknown",
        email: u.email || "",
        role: u.role || "karyawan",
        status_pemetaan: "Belum Selesai",
        avg_kekuatan: 0,
        avg_tantangan: 0,
        avg_mental: 0,
        total_coaching_sessions: 0,
      });
    });

    // Then overwrite with summary stats if they exist
    (summaryData as EmployeeSummary[]).forEach((employee) => {
      if (uniqueDataMap.has(employee.user_id)) {
        // Merge keeping the name/email/role from users table if possible, but taking stats from summary
        const existing = uniqueDataMap.get(employee.user_id)!;
        uniqueDataMap.set(employee.user_id, {
          ...existing,
          ...employee,
          // override role from users table just in case the view is outdated
          role: existing.role, 
        });
      } else {
        // Fallback if they are in summary but not in users table (unlikely)
        uniqueDataMap.set(employee.user_id, employee);
      }
    });

    // Finally, calculate the total coaching sessions where the user acted as the coach
    const { data: coachRecords, error: coachRecordsError } = await supabase
      .from("coaching_records")
      .select("user_id");

    if (!coachRecordsError && coachRecords) {
      // Count how many records each user_id has
      const coachCounts = new Map<string, number>();
      coachRecords.forEach(record => {
        if (record.user_id) {
          coachCounts.set(record.user_id, (coachCounts.get(record.user_id) || 0) + 1);
        }
      });

      // Update the map for coaches
      for (const [userId, employee] of uniqueDataMap.entries()) {
        if (employee.role === "coach") {
          employee.total_coaching_sessions = coachCounts.get(userId) || 0;
        }
      }
    }

    const finalUniqueData = Array.from(uniqueDataMap.values());

    return { success: true, data: finalUniqueData };
  } catch (err) {
    console.error("Unexpected error in getAdminDashboardData:", err);
    return { error: "An unexpected error occurred." };
  }
}
