import * as z from "zod";

export const CoachingSchema = z.object({
  // A. Identitas
  nama_coachee: z.string().min(2, "Nama coachee minimal 2 karakter"),
  jabatan: z.string().min(2, "Jabatan minimal 2 karakter"),
  unit_kerja: z.string().min(2, "Unit kerja minimal 2 karakter"),
  tanggal_sesi: z.string().min(1, "Tanggal sesi wajib diisi"),
  coach_mentor: z.string().min(2, "Nama coach/mentor minimal 2 karakter"),

  // B. Tujuan
  tujuan_utama: z.string().min(5, "Tujuan utama minimal 5 karakter"),
  tujuan_kejelasan: z.string().min(5, "Tujuan kejelasan minimal 5 karakter"),
  tujuan_score: z.coerce.number().min(1).max(5),

  // C. Kriteria
  kriteria_indikator: z.string().min(5, "Kriteria indikator minimal 5 karakter"),
  kriteria_kejelasan: z.string().min(5, "Kriteria kejelasan minimal 5 karakter"),
  kriteria_score: z.coerce.number().min(1).max(5),

  // D. Motivasi
  motivasi_alasan: z.string().min(5, "Alasan motivasi minimal 5 karakter"),
  motivasi_kekuatan: z.string().min(5, "Kekuatan motivasi minimal 5 karakter"),
  motivasi_score: z.coerce.number().min(1).max(5),

  // E. Cara Mencapai
  ide_gagasan: z.string().min(5, "Ide gagasan minimal 5 karakter"),
  ide_kreativitas: z.string().min(5, "Kreativitas ide minimal 5 karakter"),
  ide_score: z.coerce.number().min(1).max(5),
  alternatif_pilihan: z.string().min(5, "Alternatif pilihan minimal 5 karakter"),
  alternatif_realistis: z.string().min(5, "Realistis alternatif minimal 5 karakter"),
  alternatif_score: z.coerce.number().min(1).max(5),

  // Action Plan
  action_plan: z.array(
    z.object({
      langkah: z.string().min(3, "Langkah minimal 3 karakter"),
      waktu: z.string().min(1, "Waktu wajib diisi"),
      output: z.string().min(3, "Output minimal 3 karakter"),
    })
  ).min(1, "Minimal 1 rencana aksi harus ditambahkan"),
  action_plan_kejelasan: z.string().min(5, "Kejelasan action plan minimal 5 karakter"),
  action_plan_score: z.coerce.number().min(1).max(5),

  // F. Komitmen
  komitmen_peserta: z.string().min(5, "Komitmen peserta minimal 5 karakter"),
  komitmen_tindak_lanjut: z.string().min(5, "Tindak lanjut komitmen minimal 5 karakter"),
  komitmen_score: z.coerce.number().min(1).max(5),

  // G. Catatan
  catatan_coach: z.string().optional(),
});

export type CoachingFormValues = z.infer<typeof CoachingSchema>;
