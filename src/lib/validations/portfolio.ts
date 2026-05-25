import * as z from "zod";

export const CapaianSchema = z.object({
  judul_capaian: z.string().min(5, "Judul capaian minimal 5 karakter"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  tanggal_pencapaian: z.string().min(1, "Tanggal pencapaian wajib diisi"),
  status: z.enum(["Dalam Proses", "Selesai"], {
    message: "Status wajib dipilih",
  }),
});

export type CapaianFormValues = z.infer<typeof CapaianSchema>;
