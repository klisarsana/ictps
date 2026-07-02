"use server";

import { createClient } from "@/utils/supabase/server";
import { CoachingSchema } from "@/lib/validations/coaching";
import { generateCoachingSummary } from "@/lib/ai/summarize";
import * as z from "zod";

export async function submitCoachingAction(data: z.infer<typeof CoachingSchema>, menteeId?: string, bookingId?: string) {
  try {
    const validatedData = CoachingSchema.parse(data);
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: "Unauthorized. Please log in again." };
    }

    // Use menteeId from frontend if provided, otherwise fallback to finding the booking
    let targetUserId = menteeId;

    if (!targetUserId) {
      const { data: activeBooking } = await supabase
        .from("booking_coaching")
        .select("id, karyawan_id")
        .eq("coach_id", user.id)
        .eq("status", "Disetujui")
        .order("tanggal_usulan", { ascending: false })
        .limit(1)
        .maybeSingle();
        
      targetUserId = activeBooking ? activeBooking.karyawan_id : user.id;
    }

    console.log("=== SUBMIT COACHING DEBUG ===");
    console.log("Coach ID:", user.id);
    console.log("Mentee ID passed:", menteeId);
    console.log("Final Target User ID:", targetUserId);

    // Step 2: Insert into coaching_records for the Coach (owner)
    const { error: insertError } = await supabase
      .from("coaching_records")
      .insert({
        user_id: user.id,
        ...validatedData
      });

    console.log("Insert Error:", insertError);

    if (insertError) {
      console.error("Supabase insert error (coaching_records):", insertError);
      return { error: `Gagal menyimpan data Coaching Record: ${insertError.message}` };
    }

    // Step 3: Call AI Summary Utility
    const summary = await generateCoachingSummary(validatedData);

    // Step 4: Fetch the mentee's most recent pemetaan_diri record
    // Use the targetUserId already defined above

    const { data: pemetaanData, error: pemetaanFetchError } = await supabase
      .from("pemetaan_diri")
      .select("id")
      .eq("user_id", targetUserId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pemetaanFetchError) {
      console.error("Error fetching pemetaan_diri:", pemetaanFetchError);
    }

    // Step 4: Perform an .update() on that pemetaan_diri record
    if (pemetaanData && pemetaanData.id) {
      const { error: pemetaanUpdateError } = await supabase
        .from("pemetaan_diri")
        .update({ coaching_summary_update: summary })
        .eq("id", pemetaanData.id);

      if (pemetaanUpdateError) {
        console.error("Error updating pemetaan_diri with summary:", pemetaanUpdateError);
      }
    }

    // Step 5: Auto-Delete Hygiene for MS Teams link
    const activeBookingId = bookingId || (activeBooking ? activeBooking.id : null);
    if (activeBookingId) {
      const { error: hygieneError } = await supabase
        .from("booking_coaching")
        .update({
          status: "Selesai",
          teams_link: null
        })
        .eq("id", activeBookingId);

      if (hygieneError) {
        console.error("Error performing data hygiene on booking:", hygieneError);
      }
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Coaching action error:", error);
    if (error instanceof z.ZodError) {
      return { error: "Validasi gagal. Pastikan semua field terisi dengan benar." };
    }
    return { error: "Terjadi kesalahan pada server. Silakan coba lagi." };
  }
}
