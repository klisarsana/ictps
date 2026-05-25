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

    // Fetch data from the secure view
    const { data, error } = await supabase
      .from("admin_dashboard_summary")
      .select("*");

    if (error) {
      console.error("Error fetching admin_dashboard_summary:", error);
      return { error: "Failed to fetch dashboard data." };
    }

    // Safeguard: Ensure absolute uniqueness by user_id
    // This acts as a fallback in case the SQL view DISTINCT ON misses anything
    const uniqueDataMap = new Map<string, EmployeeSummary>();
    
    (data as EmployeeSummary[]).forEach((employee) => {
      // If the map already has the user_id, it means we found a duplicate.
      // Since the view should be sorted by created_at DESC, the first one we encounter is the latest.
      if (!uniqueDataMap.has(employee.user_id)) {
        uniqueDataMap.set(employee.user_id, employee);
      }
    });

    const finalUniqueData = Array.from(uniqueDataMap.values());

    return { success: true, data: finalUniqueData };
  } catch (err) {
    console.error("Unexpected error in getAdminDashboardData:", err);
    return { error: "An unexpected error occurred." };
  }
}
