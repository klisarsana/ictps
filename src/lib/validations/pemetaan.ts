import * as z from "zod";

export const PemetaanSchema = z.object({
  // A. Kekuatan/Potensi Diri
  a1_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  a1_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  a2_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  a2_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  a3_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  a3_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  a4_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  a4_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  a5_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  a5_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),

  // B. Tantangan/Hambatan
  b1_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  b1_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  b2_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  b2_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  b3_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  b3_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  b4_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  b4_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  b5_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  b5_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),

  // C. Situasi Mental
  c1_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  c1_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  c2_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  c2_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  c3_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  c3_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  c4_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  c4_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),
  c5_score: z.coerce.number({ message: "Skala wajib diisi" }).min(1, "Skala wajib diisi").max(5),
  c5_penjelasan: z.string().min(1, "Penjelasan wajib diisi"),

  // D. Riwayat Pelatihan
  pernah_pelatihan: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : val),
    z.boolean({ message: "Harap pilih status pelatihan" })
  ),
  nama_pelatihan: z.string().optional(),
  bersertifikat: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : val),
    z.boolean().optional()
  ),
  relevansi_score: z.coerce.number().min(1).max(5).optional(),
  membantu_score: z.coerce.number().min(1).max(5).optional(),
  pelatihan_dibutuhkan: z.string().optional(),

  // E. Pertanyaan Terbuka
  kekuatan_utama: z.string().min(1, "Kekuatan utama wajib diisi"),
  tantangan_terbesar: z.string().min(1, "Tantangan terbesar wajib diisi"),
  kondisi_mental: z.string().min(1, "Kondisi mental wajib diisi"),
});
