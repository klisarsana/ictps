"use server";

import { createClient } from "@/utils/supabase/server";
import { PemetaanSchema } from "@/lib/validations/pemetaan";
import * as z from "zod";

export async function submitPemetaanAction(data: z.infer<typeof PemetaanSchema>) {
  try {
    const validatedData = PemetaanSchema.parse(data);
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: "Unauthorized" };
    }

    const { error: insertError } = await supabase
      .from("pemetaan_diri")
      .insert({
        user_id: user.id,
        ...validatedData
      });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return { error: "Gagal menyimpan data pemetaan diri. Silakan coba lagi." };
    }

    return { success: true };
  } catch (error) {
    console.error("Pemetaan action error:", error);
    return { error: "Terjadi kesalahan pada server. Pastikan semua field terisi dengan benar." };
  }
}
