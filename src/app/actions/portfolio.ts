"use server";

import { createClient } from "@/utils/supabase/server";
import { CapaianSchema } from "@/lib/validations/portfolio";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { calculateTalentStatus } from "@/lib/utils/talentLogic";

export async function getPortfolioData(userId: string) {
  const supabase = await createClient();

  // 1. Fetch latest pemetaan_diri
  const { data: pemetaan, error: pemetaanError } = await supabase
    .from("pemetaan_diri")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // 2. Fetch latest coaching_records
  const { data: coaching, error: coachingError } = await supabase
    .from("coaching_records")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // 3. Fetch all capaian_kinerja
  const { data: capaian, error: capaianError } = await supabase
    .from("capaian_kinerja")
    .select("*")
    .eq("user_id", userId)
    .order("tanggal_pencapaian", { ascending: false });

  // Calculate Averages if pemetaan exists
  let avgPotensi = 0;
  let avgTantangan = 0;
  let avgMental = 0;
  let talentStatus = "Uncategorized";

  if (pemetaan) {
    avgPotensi =
      (pemetaan.a1_score +
        pemetaan.a2_score +
        pemetaan.a3_score +
        pemetaan.a4_score +
        pemetaan.a5_score) /
      5;

    avgTantangan =
      (pemetaan.b1_score +
        pemetaan.b2_score +
        pemetaan.b3_score +
        pemetaan.b4_score +
        pemetaan.b5_score) /
      5;

    avgMental =
      (pemetaan.c1_score +
        pemetaan.c2_score +
        pemetaan.c3_score +
        pemetaan.c4_score +
        pemetaan.c5_score) /
      5;

    // Talent Status Logic
    talentStatus = calculateTalentStatus(avgPotensi, avgTantangan, avgMental);
  }

  return {
    pemetaan,
    coaching,
    capaian: capaian || [],
    calculated: {
      avgPotensi,
      avgTantangan,
      avgMental,
      talentStatus,
    },
    errors: {
      pemetaanError: pemetaanError ? pemetaanError.message : null,
      coachingError: coachingError ? coachingError.message : null,
      capaianError: capaianError ? capaianError.message : null,
    },
  };
}

export async function addCapaianAction(data: z.infer<typeof CapaianSchema>) {
  try {
    const validatedData = CapaianSchema.parse(data);
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized" };
    }

    const { error: insertError } = await supabase.from("capaian_kinerja").insert({
      user_id: user.id,
      ...validatedData,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return { error: "Gagal menyimpan capaian. Silakan coba lagi." };
    }

    revalidatePath("/portfolio");
    return { success: true };
  } catch (error) {
    console.error("Add capaian action error:", error);
    return { error: "Terjadi kesalahan pada server." };
  }
}

export async function deleteCapaianAction(id: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized" };
    }

    const { error: deleteError } = await supabase
      .from("capaian_kinerja")
      .delete()
      .match({ id: id, user_id: user.id });

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return { error: "Gagal menghapus capaian." };
    }

    revalidatePath("/portfolio");
    return { success: true };
  } catch (error) {
    console.error("Delete capaian action error:", error);
    return { error: "Terjadi kesalahan pada server." };
  }
}

export async function updateCapaianAction(id: string, data: z.infer<typeof CapaianSchema>) {
  try {
    const validatedData = CapaianSchema.parse(data);
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized" };
    }

    const { error: updateError } = await supabase
      .from("capaian_kinerja")
      .update(validatedData)
      .match({ id: id, user_id: user.id });

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return { error: "Gagal memperbarui capaian. Silakan coba lagi." };
    }

    revalidatePath("/portfolio");
    return { success: true };
  } catch (error) {
    console.error("Update capaian action error:", error);
    return { error: "Terjadi kesalahan pada server." };
  }
}
