import * as z from "zod";

export const KompetensiManajerialSchema = z.object({
  integritas: z.coerce.number().min(1, "Wajib diisi").max(5),
  kerjasama: z.coerce.number().min(1, "Wajib diisi").max(5),
  komunikasi: z.coerce.number().min(1, "Wajib diisi").max(5),
  pelayanan_publik: z.coerce.number().min(1, "Wajib diisi").max(5),
  orientasi_hasil: z.coerce.number().min(1, "Wajib diisi").max(5),
  mengelola_perubahan: z.coerce.number().min(1, "Wajib diisi").max(5),
  pengembangan_diri: z.coerce.number().min(1, "Wajib diisi").max(5),
  pengambilan_keputusan: z.coerce.number().min(1, "Wajib diisi").max(5),
  perekat_bangsa: z.coerce.number().min(1, "Wajib diisi").max(5),
  catatan: z.string().optional(),
});

export type KompetensiManajerialValues = z.infer<typeof KompetensiManajerialSchema>;
