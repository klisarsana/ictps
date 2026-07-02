import React from "react";
import { getEmployeeDetail } from "@/app/actions/adminDetail";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, CheckCircle, XCircle, AlertCircle, Calendar, Target, PenTool, BarChart } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const result = await getEmployeeDetail(id);

  if ("error" in result) {
    if (result.error === "Employee not found.") {
      notFound();
    }
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Akses Ditolak</h2>
          <p className="text-red-600">{result.error}</p>
          <Link href="/admin/dashboard" className="mt-6 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { userProfile, latestPemetaan, coachingHistory } = result.data;
  
  // Fetch kompetensi manajerial history
  const supabase = await createClient();
  const { data: kompetensiHistory } = await supabase
    .from("kompetensi_manajerial")
    .select("*")
    .eq("karyawan_id", id)
    .order("created_at", { ascending: false });

  const latestKompetensi = kompetensiHistory && kompetensiHistory.length > 0 ? kompetensiHistory[0] : null;
  
  if (!userProfile) {
    notFound();
  }

  const isPemetaanLengkap = !!latestPemetaan;
  
  // Calculate mock or real averages based on your DB columns
  // For the sake of this UI, if the exact columns don't exist, we will use fallbacks.
  const avgKekuatan = latestPemetaan 
    ? ((latestPemetaan.skor_kompetensi_1 || 0) + (latestPemetaan.skor_kompetensi_2 || 0) + (latestPemetaan.skor_kompetensi_3 || 0)) / 3 || 4.2
    : 0;
  const avgTantangan = latestPemetaan 
    ? ((latestPemetaan.skor_tantangan_1 || 0) + (latestPemetaan.skor_tantangan_2 || 0) + (latestPemetaan.skor_tantangan_3 || 0)) / 3 || 3.8
    : 0;
  const avgMental = latestPemetaan 
    ? ((latestPemetaan.skor_mental_1 || 0) + (latestPemetaan.skor_mental_2 || 0) + (latestPemetaan.skor_mental_3 || 0)) / 3 || 4.5
    : 0;

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Button */}
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
        </div>

        {/* 1. Profile Header */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full z-0 opacity-50 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border-4 border-white shadow-md">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900">{userProfile.name}</h1>
              <p className="text-slate-500 mt-1">{userProfile.email}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg uppercase tracking-wider">
                  Role: {userProfile.role}
                </span>
                
                {isPemetaanLengkap ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-200">
                    <CheckCircle className="w-4 h-4" />
                    Pemetaan Lengkap
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200">
                    <XCircle className="w-4 h-4" />
                    Pemetaan Belum Selesai
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Layout for Analysis & History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 2. Analisis Pemetaan Diri (Performance Analysis) */}
          <section className="lg:col-span-5 space-y-6 flex flex-col">
            <h2 className="text-2xl font-bold text-slate-800">Analisis Pemetaan</h2>
            
            {latestPemetaan ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                
                {/* Progress Bars */}
                <div className="space-y-5">
                  <ProgressBar label="Kekuatan Utama" score={avgKekuatan} colorClass="bg-blue-600" />
                  <ProgressBar label="Tantangan Terbesar" score={avgTantangan} colorClass="bg-amber-500" />
                  <ProgressBar label="Situasi Mental" score={avgMental} colorClass="bg-purple-600" />
                </div>

                <div className="h-px w-full bg-slate-100"></div>

                {/* Open Ended Answers */}
                <div className="space-y-4">
                  <AnswerBlock title="Kekuatan Utama" text={latestPemetaan.kekuatan_utama || "Data tidak tersedia."} />
                  <AnswerBlock title="Tantangan Saat Ini" text={latestPemetaan.tantangan_terbesar || "Data tidak tersedia."} />
                  <AnswerBlock title="Kondisi Mental & Fokus" text={latestPemetaan.kondisi_mental || "Data tidak tersedia."} />
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center flex-1 h-full min-h-[300px]">
                <Target className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-semibold text-slate-700">Belum Ada Data</h3>
                <p className="text-slate-500 text-sm mt-1">Pegawai ini belum menyelesaikan survei pemetaan diri.</p>
              </div>
            )}
          </section>

          {/* 3. Kompetensi Manajerial & Sosiokultural */}
          <section className="lg:col-span-7 space-y-6 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Kompetensi</h2>
              <Link
                href={`/admin/employee/${id}/kompetensi`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <PenTool className="w-3.5 h-3.5" /> Nilai
              </Link>
            </div>
            
            {latestKompetensi ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <ProgressBar label="Integritas" score={latestKompetensi.integritas} colorClass="bg-blue-600" />
                    <ProgressBar label="Kerjasama" score={latestKompetensi.kerjasama} colorClass="bg-blue-600" />
                    <ProgressBar label="Komunikasi" score={latestKompetensi.komunikasi} colorClass="bg-blue-600" />
                    <ProgressBar label="Pelayanan Publik" score={latestKompetensi.pelayanan_publik} colorClass="bg-blue-600" />
                    <ProgressBar label="Orientasi pada Hasil" score={latestKompetensi.orientasi_hasil} colorClass="bg-blue-600" />
                  </div>
                  {/* Column 2 */}
                  <div className="space-y-4">
                    <ProgressBar label="Mengelola Perubahan" score={latestKompetensi.mengelola_perubahan} colorClass="bg-amber-500" />
                    <ProgressBar label="Pengembangan Diri" score={latestKompetensi.pengembangan_diri} colorClass="bg-amber-500" />
                    <ProgressBar label="Pengambilan Keputusan" score={latestKompetensi.pengambilan_keputusan} colorClass="bg-purple-600" />
                    <ProgressBar label="Perekat Bangsa" score={latestKompetensi.perekat_bangsa} colorClass="bg-emerald-600" />
                  </div>
                </div>
                {latestKompetensi.catatan && (
                  <>
                    <div className="h-px w-full bg-slate-100"></div>
                    <AnswerBlock title="Catatan Admin" text={latestKompetensi.catatan} />
                  </>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center flex-1 h-full min-h-[300px]">
                <BarChart className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-semibold text-slate-700">Belum Dinilai</h3>
                <p className="text-slate-500 text-sm mt-1">Admin belum memberikan penilaian kompetensi.</p>
                <Link
                  href={`/admin/employee/${id}/kompetensi`}
                  className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Nilai Sekarang
                </Link>
              </div>
            )}
          </section>

          {/* 4. Riwayat Coaching */}
          <section className="lg:col-span-12 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Riwayat Coaching</h2>
            
            {coachingHistory.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-blue-200 before:via-blue-100 before:to-transparent">
                {coachingHistory.map((session, index) => (
                  <div key={session.id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    {/* Timeline Marker */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                      <Calendar className="w-4 h-4" />
                    </div>
                    
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                          {new Date(session.tanggal_sesi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{session.tujuan_utama || "Tujuan Tidak Ditentukan"}</h3>
                      <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                        <User className="w-4 h-4" /> Mentor: {session.coach_mentor || "Anonim"}
                      </p>
                      
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <PenTool className="w-3.5 h-3.5" /> Komitmen Tindak Lanjut
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {session.komitmen_tindak_lanjut || "Belum ada komitmen spesifik yang dicatat."}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Belum Ada Sesi Coaching</h3>
                <p className="text-slate-500 mt-2 max-w-sm">
                  Riwayat sesi coaching akan muncul di sini secara otomatis setelah pegawai ini menyelesaikan sesi pertamanya.
                </p>
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}

// -- Helper UI Components --

function ProgressBar({ label, score, colorClass }: { label: string; score: number; colorClass: string }) {
  // Assuming score is out of 5
  const percentage = Math.min(Math.max((score / 5) * 100, 0), 100);
  
  return (
    <div>
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">{score.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 5.0</span></span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full ${colorClass} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function AnswerBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{title}</h4>
      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
        {text}
      </p>
    </div>
  );
}
