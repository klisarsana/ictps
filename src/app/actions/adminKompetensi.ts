"use server";

import { createClient } from "@/utils/supabase/server";
import { KompetensiManajerialSchema, KompetensiManajerialValues } from "@/lib/validations/kompetensi";
import { revalidatePath } from "next/cache";

export async function submitKompetensiAction(data: KompetensiManajerialValues, karyawanId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Sesi Anda telah berakhir. Silakan login kembali." };
    }

    if (user.user_metadata?.role !== "admin") {
      return { error: "Akses ditolak. Hanya admin yang dapat melakukan aksi ini." };
    }

    // Validate data using Zod
    const validationResult = KompetensiManajerialSchema.safeParse(data);

    if (!validationResult.success) {
      const errorMsg = validationResult.error.errors.map(e => e.message).join(", ");
      return { error: `Validasi gagal: ${errorMsg}` };
    }

    const validatedData = validationResult.data;

    // Insert into kompetensi_manajerial
    const { error: insertError } = await supabase
      .from("kompetensi_manajerial")
      .insert({
        karyawan_id: karyawanId,
        admin_id: user.id,
        ...validatedData
      });

    if (insertError) {
      console.error("Supabase insert error (kompetensi_manajerial):", insertError);
      return { error: `Gagal menyimpan data kompetensi: ${insertError.message}` };
    }

    // Revalidate paths to update UI
    revalidatePath(`/admin/employee/${karyawanId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: unknown) {
    console.error("Kompetensi action error:", error);
    return { error: "Terjadi kesalahan pada server. Silakan coba lagi." };
  }
}
