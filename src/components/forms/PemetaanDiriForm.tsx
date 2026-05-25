"use client";

import React, { useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LikertWithNote } from "@/components/ui/LikertWithNote";
import { ChevronLeft, ChevronRight, Save, Target } from "lucide-react";
import { submitPemetaanAction } from "@/app/actions/pemetaan";
import { PemetaanSchema } from "@/lib/validations/pemetaan";
import { useRouter } from "next/navigation";

const SECTION_A = [
  {
    scaleName: "a1_score",
    noteName: "a1_penjelasan",
    label: "1. Saya mengetahui dengan jelas apa saja kelebihan saya.",
  },
  {
    scaleName: "a2_score",
    noteName: "a2_penjelasan",
    label: "2. Saya percaya diri dalam menyelesaikan tugas.",
  },
  {
    scaleName: "a3_score",
    noteName: "a3_penjelasan",
    label: "3. Saya mampu belajar hal baru dengan cepat.",
  },
  {
    scaleName: "a4_score",
    noteName: "a4_penjelasan",
    label: "4. Saya mampu bekerja sama dengan baik dalam tim.",
  },
  {
    scaleName: "a5_score",
    noteName: "a5_penjelasan",
    label: "5. Saya memiliki motivasi untuk terus berkembang.",
  },
];

const SECTION_B = [
  {
    scaleName: "b1_score",
    noteName: "b1_penjelasan",
    label:
      "1. Saya mengalami kesulitan dalam menyelesaikan pekerjaan tepat waktu.",
  },
  {
    scaleName: "b2_score",
    noteName: "b2_penjelasan",
    label: "2. Saya merasa kurang percaya diri dalam situasi tertentu.",
  },
  {
    scaleName: "b3_score",
    noteName: "b3_penjelasan",
    label: "3. Saya mudah terdistraksi saat bekerja atau belajar.",
  },
  {
    scaleName: "b4_score",
    noteName: "b4_penjelasan",
    label: "4. Saya mengalami hambatan dalam berkomunikasi dengan orang lain.",
  },
  {
    scaleName: "b5_score",
    noteName: "b5_penjelasan",
    label: "5. Saya merasa terbebani dengan tuntutan pekerjaan atau tugas.",
  },
];

const SECTION_C = [
  {
    scaleName: "c1_score",
    noteName: "c1_penjelasan",
    label: "1. Saya merasa tenang dalam menjalani aktivitas sehari-hari.",
  },
  {
    scaleName: "c2_score",
    noteName: "c2_penjelasan",
    label: "2. Saya mampu mengelola stres dengan baik.",
  },
  {
    scaleName: "c3_score",
    noteName: "c3_penjelasan",
    label: "3. Saya tetap berpikir positif saat menghadapi masalah.",
  },
  {
    scaleName: "c4_score",
    noteName: "c4_penjelasan",
    label: "4. Saya merasa memiliki dukungan dari orang sekitar.",
  },
  {
    scaleName: "c5_score",
    noteName: "c5_penjelasan",
    label: "5. Saya merasa bersemangat dalam menjalani aktivitas.",
  },
];

type PemetaanFormValues = z.infer<typeof PemetaanSchema>;

const STEPS = [
  { id: 1, title: "Kekuatan/Potensi Diri" },
  { id: 2, title: "Tantangan/Hambatan" },
  { id: 3, title: "Situasi Mental" },
  { id: 4, title: "Riwayat & Umpan Balik" },
];

export function PemetaanDiriForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState("");

  const methods = useForm<PemetaanFormValues>({
    // @ts-expect-error - Zod coerce causes input/output type mismatch with RHF
    resolver: zodResolver(PemetaanSchema),
    mode: "onChange",
  });

  const {
    trigger,
    register,
    formState: { errors },
  } = methods;

  const pernahPelatihan = useWatch({
    control: methods.control,
    name: "pernah_pelatihan",
  });

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof PemetaanFormValues> = [];
    if (currentStep === 1) {
      fieldsToValidate = SECTION_A.flatMap(
        (q) => [q.scaleName, q.noteName] as Array<keyof PemetaanFormValues>,
      );
    } else if (currentStep === 2) {
      fieldsToValidate = SECTION_B.flatMap(
        (q) => [q.scaleName, q.noteName] as Array<keyof PemetaanFormValues>,
      );
    } else if (currentStep === 3) {
      fieldsToValidate = SECTION_C.flatMap(
        (q) => [q.scaleName, q.noteName] as Array<keyof PemetaanFormValues>,
      );
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      document
        .getElementById("main-scroll-area")
        ?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    document
      .getElementById("main-scroll-area")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: PemetaanFormValues) => {
    setIsSubmitting(true);
    setErrorSubmit("");
    try {
      const res = await submitPemetaanAction(data);
      if (res?.error) {
        setErrorSubmit(res.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setErrorSubmit(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan data.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (error: boolean) =>
    `w-full p-3 bg-surface-bg border ${error ? "border-error-red focus:border-error-red focus:ring-error-red/10" : "border-border-light focus:border-brand-navy focus:ring-brand-navy/10"} rounded-xl text-sm focus:outline-none focus:ring-4 transition-all`;

  return (
    <div className="bg-surface-card rounded-xl border border-border-light shadow-sm overflow-hidden">
      {/* Header / Progress */}
      <div className="bg-brand-navy/5 px-6 py-4 border-b border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-navy text-white flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              Formulir Pemetaan Diri
            </h2>
            <p className="text-sm text-text-secondary">
              Langkah {currentStep} dari {STEPS.length}:{" "}
              {STEPS[currentStep - 1].title}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 h-2 bg-border-light rounded-full overflow-hidden shrink-0">
          <div
            className="h-full bg-brand-navy transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <FormProvider {...methods}>
        <form
          // @ts-expect-error - React Hook Form struggles inferring Zod coerced types
          onSubmit={methods.handleSubmit(onSubmit)}
          className="p-6"
        >
          {errorSubmit && (
            <div className="mb-6 p-4 bg-error-red/10 border border-error-red/20 rounded-lg text-error-red text-sm font-medium">
              {errorSubmit}
            </div>
          )}

          {/* Step 1: Kekuatan/Potensi Diri */}
          <div
            className={
              currentStep === 1 ? "block animate-fade-in-up" : "hidden"
            }
          >
            {SECTION_A.map((q) => (
              <LikertWithNote
                key={q.scaleName}
                label={q.label}
                scaleName={q.scaleName}
                noteName={q.noteName}
              />
            ))}
          </div>

          {/* Step 2: Tantangan/Hambatan */}
          <div
            className={
              currentStep === 2 ? "block animate-fade-in-up" : "hidden"
            }
          >
            {SECTION_B.map((q) => (
              <LikertWithNote
                key={q.scaleName}
                label={q.label}
                scaleName={q.scaleName}
                noteName={q.noteName}
              />
            ))}
          </div>

          {/* Step 3: Situasi Mental */}
          <div
            className={
              currentStep === 3 ? "block animate-fade-in-up" : "hidden"
            }
          >
            {SECTION_C.map((q) => (
              <LikertWithNote
                key={q.scaleName}
                label={q.label}
                scaleName={q.scaleName}
                noteName={q.noteName}
              />
            ))}
          </div>

          {/* Step 4: Riwayat Pelatihan & Pertanyaan Terbuka */}
          <div
            className={
              currentStep === 4 ? "block animate-fade-in-up" : "hidden"
            }
          >
            <div className="space-y-6">
              {/* Bagian D */}
              <div className="bg-surface-bg border border-border-light rounded-xl p-5 md:p-6">
                <h3 className="text-[15px] font-bold text-text-primary mb-4">
                  D. Riwayat Pelatihan
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">
                      1. Apakah Anda pernah mengikuti pelatihan yang mendukung
                      pekerjaan Anda?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="true"
                          {...register("pernah_pelatihan")}
                          className="w-4 h-4 text-brand-navy focus:ring-brand-navy"
                        />
                        <span className="text-sm">Ya</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="false"
                          {...register("pernah_pelatihan")}
                          className="w-4 h-4 text-brand-navy focus:ring-brand-navy"
                        />
                        <span className="text-sm">Tidak</span>
                      </label>
                    </div>
                    {errors.pernah_pelatihan && (
                      <p className="text-xs text-error-red mt-2">
                        {errors.pernah_pelatihan.message}
                      </p>
                    )}
                  </div>

                  {String(pernahPelatihan) === "true" && (
                    <div className="space-y-4 mt-4 p-4 border border-border-light rounded-lg bg-white">
                      <div>
                        <label className="block text-sm font-bold text-text-primary mb-1">
                          2. Jika ya, sebutkan pelatihan yang pernah diikuti:
                        </label>
                        <input
                          type="text"
                          {...register("nama_pelatihan")}
                          className={inputClasses(!!errors.nama_pelatihan)}
                          placeholder="Masukkan nama pelatihan..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">
                          3. Apakah pelatihan tersebut bersertifikat?
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="true"
                              {...register("bersertifikat")}
                              className="w-4 h-4 text-brand-navy focus:ring-brand-navy"
                            />
                            <span className="text-sm font-medium">Ya</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="false"
                              {...register("bersertifikat")}
                              className="w-4 h-4 text-brand-navy focus:ring-brand-navy"
                            />
                            <span className="text-sm font-medium">Tidak</span>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-text-primary mb-2">
                            4. Seberapa relevan pelatihan tersebut dengan
                            pekerjaan Anda saat ini?
                          </label>
                          <div className="flex items-center gap-3">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <label
                                key={`relevansi_${num}`}
                                className="relative flex flex-col items-center gap-2 cursor-pointer group"
                              >
                                <input
                                  type="radio"
                                  value={num}
                                  {...register("relevansi_score")}
                                  className="peer sr-only"
                                />
                                <div className="w-9 h-9 rounded-full border-2 border-border-light flex items-center justify-center text-text-secondary font-medium transition-all peer-checked:border-brand-navy peer-checked:bg-brand-navy peer-checked:text-white group-hover:border-brand-navy/50">
                                  {num}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-text-primary mb-2">
                            5. Menurut Anda, apakah pelatihan tersebut membantu
                            meningkatkan kemampuan Anda?
                          </label>
                          <div className="flex items-center gap-3">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <label
                                key={`membantu_${num}`}
                                className="relative flex flex-col items-center gap-2 cursor-pointer group"
                              >
                                <input
                                  type="radio"
                                  value={num}
                                  {...register("membantu_score")}
                                  className="peer sr-only"
                                />
                                <div className="w-9 h-9 rounded-full border-2 border-border-light flex items-center justify-center text-text-secondary font-medium transition-all peer-checked:border-brand-navy peer-checked:bg-brand-navy peer-checked:text-white group-hover:border-brand-navy/50">
                                  {num}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">
                      6. Pelatihan apa yang masih Anda butuhkan saat ini?
                    </label>
                    <textarea
                      {...register("pelatihan_dibutuhkan")}
                      className={`${inputClasses(!!errors.pelatihan_dibutuhkan)} min-h-20`}
                      placeholder="Jelaskan kebutuhan pelatihan Anda..."
                    />
                  </div>
                </div>
              </div>

              {/* Bagian E */}
              <div className="bg-surface-bg border border-border-light rounded-xl p-5 md:p-6">
                <h3 className="text-[15px] font-bold text-text-primary mb-4">
                  E. Pertanyaan Terbuka
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">
                      Kekuatan Utama
                    </label>
                    <p className="text-xs text-text-secondary mb-2">
                      Ceritakan kekuatan utama yang Anda miliki dan bagaimana
                      itu membantu pekerjaan Anda.
                    </p>
                    <textarea
                      {...register("kekuatan_utama")}
                      className={`${inputClasses(!!errors.kekuatan_utama)} min-h-25`}
                      placeholder="Kekuatan utama saya adalah..."
                    />
                    {errors.kekuatan_utama && (
                      <p className="text-xs text-error-red mt-2">
                        {errors.kekuatan_utama.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">
                      Tantangan Terbesar
                    </label>
                    <p className="text-xs text-text-secondary mb-2">
                      Apa tantangan terbesar yang sedang Anda hadapi saat ini?
                    </p>
                    <textarea
                      {...register("tantangan_terbesar")}
                      className={`${inputClasses(!!errors.tantangan_terbesar)} min-h-25`}
                      placeholder="Tantangan terbesar yang saya hadapi..."
                    />
                    {errors.tantangan_terbesar && (
                      <p className="text-xs text-error-red mt-2">
                        {errors.tantangan_terbesar.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">
                      Kondisi Mental
                    </label>
                    <p className="text-xs text-text-secondary mb-2">
                      Bagaimana Anda menggambarkan kondisi mental dan emosional
                      Anda saat ini?
                    </p>
                    <textarea
                      {...register("kondisi_mental")}
                      className={`${inputClasses(!!errors.kondisi_mental)} min-h-25`}
                      placeholder="Saat ini kondisi saya..."
                    />
                    {errors.kondisi_mental && (
                      <p className="text-xs text-error-red mt-2">
                        {errors.kondisi_mental.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-border-light flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 1
                  ? "text-text-muted cursor-not-allowed bg-surface-bg"
                  : "text-text-primary bg-surface-bg hover:bg-border-light border border-border-light"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-brand-navy hover:bg-brand-navy/90 transition-colors shadow-sm"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-brand-navy hover:bg-brand-navy/90 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Kirim Pemetaan
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
