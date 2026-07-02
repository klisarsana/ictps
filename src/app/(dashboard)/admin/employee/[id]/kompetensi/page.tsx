"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KompetensiManajerialSchema, KompetensiManajerialValues } from "@/lib/validations/kompetensi";
import { submitKompetensiAction } from "@/app/actions/adminKompetensi";
import { useRouter } from "next/navigation";
import { ArrowLeft, Target, AlertCircle, Save } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const kompetensiList = [
  { id: "integritas", label: "Integritas" },
  { id: "kerjasama", label: "Kerjasama" },
  { id: "komunikasi", label: "Komunikasi" },
  { id: "pelayanan_publik", label: "Pelayanan Publik" },
  { id: "orientasi_hasil", label: "Orientasi pada Hasil" },
  { id: "mengelola_perubahan", label: "Mengelola Perubahan" },
  { id: "pengembangan_diri", label: "Pengembangan Diri dan Orang Lain" },
  { id: "pengambilan_keputusan", label: "Pengambilan Keputusan" },
  { id: "perekat_bangsa", label: "Perekat Bangsa" },
] as const;

export default function KompetensiFormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const karyawanId = resolvedParams.id;
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState("");

  const methods = useForm<KompetensiManajerialValues>({
    resolver: zodResolver(KompetensiManajerialSchema) as any,
    defaultValues: {
      integritas: 0,
      kerjasama: 0,
      komunikasi: 0,
      pelayanan_publik: 0,
      orientasi_hasil: 0,
      mengelola_perubahan: 0,
      pengembangan_diri: 0,
      pengambilan_keputusan: 0,
      perekat_bangsa: 0,
      catatan: "",
    },
  });

  const { register, formState: { errors } } = methods;

  const onSubmit = async (data: KompetensiManajerialValues) => {
    setIsSubmitting(true);
    setErrorSubmit("");
    try {
      const result = await submitKompetensiAction(data, karyawanId);
      if (result.error) {
        setErrorSubmit(result.error);
        alert("Error: " + result.error);
        window.scrollTo(0, 0);
      } else {
        router.push(`/admin/employee/${karyawanId}`); 
      }
    } catch (err) {
      setErrorSubmit(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLikert = (id: string, label: string) => (
    <div key={id} className="mb-6 p-5 bg-white border border-border-light rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <label className="block text-[15px] font-bold text-text-primary mb-4">{label}</label>
      <div className="flex items-center gap-3 md:gap-6">
        {[1, 2, 3, 4, 5].map((num) => (
          <label key={`${id}_${num}`} className="relative flex flex-col items-center gap-2 cursor-pointer group">
            <input type="radio" value={num} {...register(id as keyof KompetensiManajerialValues)} className="peer sr-only" />
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-border-light flex items-center justify-center text-text-secondary font-medium transition-all peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white group-hover:border-blue-600/50">
              {num}
            </div>
            <span className="text-[10px] md:text-xs text-text-secondary font-medium">Level {num}</span>
          </label>
        ))}
      </div>
      {errors[id as keyof KompetensiManajerialValues] && (
        <p className="text-xs text-error-red mt-3 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5"/> Wajib diisi
        </p>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button */}
        <div>
          <Link
            href={`/admin/employee/${karyawanId}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Profil
          </Link>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="animate-fade-in-up">
            
            {/* Header */}
            <div className="bg-blue-600/5 px-6 py-5 border border-blue-600/10 rounded-xl mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Penilaian Kompetensi Manajerial & Sosiokultural</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Berikan penilaian level (1-5) untuk masing-masing aspek kompetensi pegawai.
                </p>
              </div>
            </div>

            {errorSubmit && (
              <div className="mb-6 p-4 bg-error-red/10 border border-error-red/20 rounded-lg text-error-red text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {errorSubmit}
              </div>
            )}

            <div className="space-y-4">
              {kompetensiList.map((k) => renderLikert(k.id, k.label))}

              {/* Catatan Tambahan */}
              <div className="mb-6 p-5 bg-white border border-border-light rounded-xl shadow-sm">
                <label className="block text-[15px] font-bold text-text-primary mb-4">Catatan Tambahan (Opsional)</label>
                <textarea 
                  {...register("catatan")} 
                  className="w-full p-4 bg-surface-bg border border-border-light focus:border-blue-600 focus:ring-blue-600/10 rounded-xl text-sm min-h-[120px] focus:outline-none focus:ring-4 transition-all resize-y"
                  placeholder="Tambahkan catatan khusus terkait penilaian kompetensi..."
                />
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-end gap-4 mt-8 mb-10">
              <Link
                href={`/admin/employee/${karyawanId}`}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-bg hover:text-text-primary border border-transparent hover:border-border-light transition-all"
              >
                Batal
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Penilaian
                  </>
                )}
              </button>
            </div>

          </form>
        </FormProvider>
      </div>
    </main>
  );
}
