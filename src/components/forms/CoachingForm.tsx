"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DynamicActionPlanTable } from "@/components/ui/DynamicActionPlanTable";
import { Save, Users, AlertCircle } from "lucide-react";
import { submitCoachingAction } from "@/app/actions/coaching";
import { CoachingSchema, CoachingFormValues } from "@/lib/validations/coaching";
import { useRouter, useSearchParams } from "next/navigation";

export function CoachingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menteeName = searchParams.get("menteeName") || "";
  const sessionDate = searchParams.get("sessionDate") || "";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState("");

  const methods = useForm<CoachingFormValues>({
    // @ts-expect-error - Zod coerce causes input/output type mismatch with RHF
    resolver: zodResolver(CoachingSchema),
    defaultValues: {
      nama_coachee: menteeName,
      tanggal_sesi: sessionDate,
      action_plan: [{ langkah: "", waktu: "", output: "" }],
    },
    mode: "onBlur",
  });

  const { register, formState: { errors } } = methods;

  const onSubmit = async (data: CoachingFormValues) => {
    setIsSubmitting(true);
    setErrorSubmit("");
    try {
      const menteeId = searchParams.get("menteeId") || undefined;
      const bookingId = searchParams.get("bookingId") || undefined;
      const result = await submitCoachingAction(data, menteeId, bookingId);
      if (result.error) {
        setErrorSubmit(result.error);
        alert("Error: " + result.error);
        window.scrollTo(0, 0);
      } else {
        router.push("/dashboard"); 
      }
    } catch (err) {
      setErrorSubmit(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formSectionClasses = "bg-surface-card rounded-xl border border-border-light p-6 shadow-sm mb-6";
  const labelClasses = "block text-sm font-bold text-text-primary mb-2";
  const inputClasses = (error: boolean) => `w-full p-3 bg-surface-bg border ${error ? 'border-error-red focus:border-error-red focus:ring-error-red/10' : 'border-border-light focus:border-coach-record focus:ring-coach-record/10'} rounded-xl text-sm min-h-[45px] focus:outline-none focus:ring-4 transition-all`;
  const textareaClasses = (error: boolean) => `${inputClasses(error)} min-h-[100px] resize-y`;
  const errorClasses = "text-xs text-error-red mt-2 flex items-center gap-1";

  const renderLikert = (name: string, label: string) => (
    <div className="mb-4">
      <label className={labelClasses}>{label} (Skor 1-5)</label>
      <div className="flex items-center gap-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <label key={`${name}_${num}`} className="relative flex flex-col items-center gap-2 cursor-pointer group">
            <input type="radio" value={num} {...register(name as keyof CoachingFormValues)} className="peer sr-only" />
            <div className="w-10 h-10 rounded-full border-2 border-border-light flex items-center justify-center text-text-secondary font-medium transition-all peer-checked:border-brand-navy peer-checked:bg-brand-navy peer-checked:text-white group-hover:border-brand-navy/50">
              {num}
            </div>
          </label>
        ))}
      </div>
      {errors[name as keyof CoachingFormValues] && (
        <p className={errorClasses}><AlertCircle className="w-3.5 h-3.5"/>
          {errors[name as keyof CoachingFormValues]?.message as string}
        </p>
      )}
    </div>
  );

  return (
    <FormProvider {...methods}>
      <form 
        // @ts-expect-error - React Hook Form struggles inferring Zod coerced types
        onSubmit={methods.handleSubmit(onSubmit)} 
        className="animate-fade-in-up"
      >
        
        {/* Header */}
        <div className="bg-coach-record/5 px-6 py-5 border border-border-light rounded-xl mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-coach-record text-white flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Catatan Sesi Coaching</h2>
            <p className="text-sm text-text-secondary mt-1">
              Dokumentasikan sesi coaching dan rencana aksi pengembangan talenta Anda.
            </p>
          </div>
        </div>

        {errorSubmit && (
          <div className="mb-6 p-4 bg-error-red/10 border border-error-red/20 rounded-lg text-error-red text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {errorSubmit}
          </div>
        )}

        {/* A. Identitas */}
        <div className={formSectionClasses}>
          <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-light pb-2">A. Identitas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Nama Coachee</label>
              <input type="text" {...register("nama_coachee")} readOnly className={inputClasses(!!errors.nama_coachee) + " bg-slate-100 text-slate-500 cursor-not-allowed pointer-events-none"} />
              {errors.nama_coachee && <p className={errorClasses}>{errors.nama_coachee.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Jabatan</label>
              <input type="text" {...register("jabatan")} className={inputClasses(!!errors.jabatan)} />
              {errors.jabatan && <p className={errorClasses}>{errors.jabatan.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Unit Kerja</label>
              <input type="text" {...register("unit_kerja")} className={inputClasses(!!errors.unit_kerja)} />
              {errors.unit_kerja && <p className={errorClasses}>{errors.unit_kerja.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Tanggal Sesi</label>
              <input type="date" {...register("tanggal_sesi")} readOnly className={inputClasses(!!errors.tanggal_sesi) + " bg-slate-100 text-slate-500 cursor-not-allowed pointer-events-none"} />
              {errors.tanggal_sesi && <p className={errorClasses}>{errors.tanggal_sesi.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Nama Coach / Mentor</label>
              <input type="text" {...register("coach_mentor")} className={inputClasses(!!errors.coach_mentor)} />
              {errors.coach_mentor && <p className={errorClasses}>{errors.coach_mentor.message}</p>}
            </div>
          </div>
        </div>

        {/* B. Tujuan */}
        <div className={formSectionClasses}>
          <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-light pb-2">B. Tujuan Sesi</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Tujuan Utama</label>
              <textarea {...register("tujuan_utama")} className={textareaClasses(!!errors.tujuan_utama)} />
              {errors.tujuan_utama && <p className={errorClasses}>{errors.tujuan_utama.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Kejelasan Tujuan</label>
              <textarea {...register("tujuan_kejelasan")} className={textareaClasses(!!errors.tujuan_kejelasan)} />
              {errors.tujuan_kejelasan && <p className={errorClasses}>{errors.tujuan_kejelasan.message}</p>}
            </div>
            {renderLikert("tujuan_score", "Skor Tujuan")}
          </div>
        </div>

        {/* C. Kriteria */}
        <div className={formSectionClasses}>
          <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-light pb-2">C. Kriteria Pencapaian</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Indikator Kriteria</label>
              <textarea {...register("kriteria_indikator")} className={textareaClasses(!!errors.kriteria_indikator)} />
              {errors.kriteria_indikator && <p className={errorClasses}>{errors.kriteria_indikator.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Kejelasan Kriteria</label>
              <textarea {...register("kriteria_kejelasan")} className={textareaClasses(!!errors.kriteria_kejelasan)} />
              {errors.kriteria_kejelasan && <p className={errorClasses}>{errors.kriteria_kejelasan.message}</p>}
            </div>
            {renderLikert("kriteria_score", "Skor Kriteria")}
          </div>
        </div>

        {/* D. Motivasi */}
        <div className={formSectionClasses}>
          <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-light pb-2">D. Motivasi & Realitas</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Alasan / Realitas Saat Ini</label>
              <textarea {...register("motivasi_alasan")} className={textareaClasses(!!errors.motivasi_alasan)} />
              {errors.motivasi_alasan && <p className={errorClasses}>{errors.motivasi_alasan.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Kekuatan / Motivasi</label>
              <textarea {...register("motivasi_kekuatan")} className={textareaClasses(!!errors.motivasi_kekuatan)} />
              {errors.motivasi_kekuatan && <p className={errorClasses}>{errors.motivasi_kekuatan.message}</p>}
            </div>
            {renderLikert("motivasi_score", "Skor Motivasi")}
          </div>
        </div>

        {/* E. Cara Mencapai & Action Plan */}
        <div className={formSectionClasses}>
          <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-light pb-2">E. Cara Mencapai</h3>
          
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Ide / Gagasan</label>
                <textarea {...register("ide_gagasan")} className={textareaClasses(!!errors.ide_gagasan)} />
                {errors.ide_gagasan && <p className={errorClasses}>{errors.ide_gagasan.message}</p>}
              </div>
              <div>
                <label className={labelClasses}>Kreativitas Ide</label>
                <textarea {...register("ide_kreativitas")} className={textareaClasses(!!errors.ide_kreativitas)} />
                {errors.ide_kreativitas && <p className={errorClasses}>{errors.ide_kreativitas.message}</p>}
              </div>
            </div>
            {renderLikert("ide_score", "Skor Ide")}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className={labelClasses}>Alternatif Pilihan / Hambatan</label>
                <textarea {...register("alternatif_pilihan")} className={textareaClasses(!!errors.alternatif_pilihan)} />
                {errors.alternatif_pilihan && <p className={errorClasses}>{errors.alternatif_pilihan.message}</p>}
              </div>
              <div>
                <label className={labelClasses}>Seberapa Realistis?</label>
                <textarea {...register("alternatif_realistis")} className={textareaClasses(!!errors.alternatif_realistis)} />
                {errors.alternatif_realistis && <p className={errorClasses}>{errors.alternatif_realistis.message}</p>}
              </div>
            </div>
            {renderLikert("alternatif_score", "Skor Alternatif")}
          </div>

          <div className="mt-8 border-t border-border-light pt-6">
            <DynamicActionPlanTable name="action_plan" />
            
            <div className="mt-6 space-y-4">
              <div>
                <label className={labelClasses}>Kejelasan Action Plan</label>
                <textarea {...register("action_plan_kejelasan")} className={textareaClasses(!!errors.action_plan_kejelasan)} />
                {errors.action_plan_kejelasan && <p className={errorClasses}>{errors.action_plan_kejelasan.message}</p>}
              </div>
              {renderLikert("action_plan_score", "Skor Action Plan")}
            </div>
          </div>
        </div>

        {/* F. Komitmen */}
        <div className={formSectionClasses}>
          <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-light pb-2">F. Komitmen</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Komitmen Peserta</label>
              <textarea {...register("komitmen_peserta")} className={textareaClasses(!!errors.komitmen_peserta)} />
              {errors.komitmen_peserta && <p className={errorClasses}>{errors.komitmen_peserta.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Tindak Lanjut</label>
              <textarea {...register("komitmen_tindak_lanjut")} className={textareaClasses(!!errors.komitmen_tindak_lanjut)} />
              {errors.komitmen_tindak_lanjut && <p className={errorClasses}>{errors.komitmen_tindak_lanjut.message}</p>}
            </div>
            {renderLikert("komitmen_score", "Skor Komitmen")}
          </div>
        </div>

        {/* G. Catatan */}
        <div className={formSectionClasses}>
          <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-light pb-2">G. Catatan Coach (Opsional)</h3>
          <div>
            <textarea {...register("catatan_coach")} placeholder="Tambahkan catatan khusus di sini jika ada..." className={textareaClasses(!!errors.catatan_coach)} />
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-4 mb-10">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-bg hover:text-text-primary border border-transparent hover:border-border-light transition-all disabled:opacity-50"
          >
            Batal
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-coach-record hover:bg-coach-record/90 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan & Membuat Ringkasan AI...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Coaching Record
              </>
            )}
          </button>
        </div>

      </form>
    </FormProvider>
  );
}
