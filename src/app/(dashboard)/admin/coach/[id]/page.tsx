import React from "react";
import { getCoachDetail } from "@/app/actions/adminDetail";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, AlertCircle, Calendar, Briefcase, Users, MessageSquare } from "lucide-react";

interface CoachDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CoachDetailPage({ params }: CoachDetailPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const result = await getCoachDetail(id);

  if ("error" in result) {
    if (result.error === "Coach not found.") {
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

  const { userProfile, coachingHistory } = result.data;
  
  if (!userProfile) {
    notFound();
  }

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
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-full z-0 opacity-50 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border-4 border-white shadow-md">
              <Briefcase className="w-10 h-10 text-emerald-600" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900">{userProfile.name}</h1>
              <p className="text-slate-500 mt-1">{userProfile.email}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-sm font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  Coach
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg border border-slate-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Total Memimpin Sesi: {coachingHistory.length}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Layout for History */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Riwayat Coaching */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Daftar Sesi Coaching yang Dipimpin</h2>
            
            {coachingHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coachingHistory.map((session, index) => (
                  <div key={session.id || index} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    {/* Top bar indicator */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    
                    <div className="flex items-center justify-between mb-4 mt-2">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(session.tanggal_sesi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Coachee (Peserta)</h4>
                      <p className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        {session.nama_coachee || "Tidak ada nama"}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tujuan / Masalah</h4>
                      <p className="text-sm font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {session.tujuan_utama || "Tujuan Tidak Ditentukan"}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Komitmen / Action Plan
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed pl-3 border-l-2 border-emerald-200">
                        {session.komitmen_tindak_lanjut || "Belum ada komitmen spesifik yang dicatat."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Belum Ada Sesi</h3>
                <p className="text-slate-500 mt-2 max-w-sm">
                  Coach ini belum memimpin atau mencatat sesi coaching apa pun di dalam sistem.
                </p>
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
