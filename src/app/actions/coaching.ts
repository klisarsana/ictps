"use server";

import { createClient } from "@/utils/supabase/server";
import { CoachingSchema } from "@/lib/validations/coaching";
import { generateCoachingSummary } from "@/lib/ai/summarize";
import * as z from "zod";

export async function submitCoachingAction(data: z.infer<typeof CoachingSchema>) {
  try {
    const validatedData = CoachingSchema.parse(data);
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: "Unauthorized. Please log in again." };
    }

    const { error: insertError } = await supabase
      .from("coaching_records")
      .insert({
        user_id: user.id,
        ...validatedData
      });

    if (insertError) {
      console.error("Supabase insert error (coaching_records):", insertError);
      return { error: "Gagal menyimpan data Coaching Record. Silakan coba lagi." };
    }

    // Step 2: Call AI Summary Utility
    const summary = await generateCoachingSummary(validatedData);

    // Step 3: Fetch the mentee's most recent pemetaan_diri record
    const { data: pemetaanData, error: pemetaanFetchError } = await supabase
      .from("pemetaan_diri")
      .select("id")
      .eq("user_id", user.id)
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

    return { success: true };
  } catch (error: unknown) {
    console.error("Coaching action error:", error);
    if (error instanceof z.ZodError) {
      return { error: "Validasi gagal. Pastikan semua field terisi dengan benar." };
    }
    return { error: "Terjadi kesalahan pada server. Silakan coba lagi." };
  }
}
