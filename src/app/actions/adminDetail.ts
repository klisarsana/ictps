"use server";

import { createClient } from "@/utils/supabase/server";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface PemetaanDiriRecord {
  id: string;
  created_at: string;
  kekuatan_utama: string;
  tantangan_terbesar: string;
  kondisi_mental: string;
  // These might vary slightly depending on your actual DB schema
  skor_kompetensi_1: number;
  skor_kompetensi_2: number;
  skor_kompetensi_3: number;
  skor_tantangan_1: number;
  skor_tantangan_2: number;
  skor_tantangan_3: number;
  skor_mental_1: number;
  skor_mental_2: number;
  skor_mental_3: number;
  [key: string]: any;
}

export interface CoachingRecord {
  id: string;
  tanggal_sesi: string;
  coach_mentor: string;
  tujuan_utama: string;
  komitmen_tindak_lanjut: string;
  [key: string]: any;
}

export interface EmployeeDetailData {
  userProfile: UserProfile | null;
  latestPemetaan: PemetaanDiriRecord | null;
  coachingHistory: CoachingRecord[];
}

export async function getEmployeeDetail(userId: string): Promise<{ success: true; data: EmployeeDetailData } | { error: string }> {
  try {
    const supabase = await createClient();

    // Verify current user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.user_metadata?.role !== "admin") {
      return { error: "Unauthorized access. Admin privileges required." };
    }

    // Fetch concurrently
    const [userResponse, pemetaanResponse, coachingResponse] = await Promise.all([
      // Use the view since we know it contains the user's name, email, and role
      supabase.from("admin_dashboard_summary").select("user_id, name, email, role").eq("user_id", userId).limit(1).maybeSingle(),
      supabase.from("pemetaan_diri").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("coaching_records").select("*").eq("user_id", userId).order("tanggal_sesi", { ascending: false }),
    ]);

    if (userResponse.error && userResponse.error.code !== "PGRST116") {
      console.error("Error fetching user profile:", userResponse.error);
      return { error: "Failed to fetch user profile." };
    }

    // Map the view's data to our UserProfile interface
    let userProfile: UserProfile | null = null;
    if (userResponse.data) {
      userProfile = {
        id: userResponse.data.user_id,
        name: userResponse.data.name,
        email: userResponse.data.email,
        role: userResponse.data.role,
      };
    }

    if (!userProfile) {
      return { error: "Employee not found." };
    }

    return {
      success: true,
      data: {
        userProfile,
        latestPemetaan: pemetaanResponse.data as PemetaanDiriRecord | null,
        coachingHistory: coachingResponse.data as CoachingRecord[] || [],
      },
    };
  } catch (err) {
    console.error("Unexpected error in getEmployeeDetail:", err);
    return { error: "An unexpected error occurred while fetching details." };
  }
}
