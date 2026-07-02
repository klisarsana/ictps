import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getPortfolioData } from "@/app/actions/portfolio";
import TalentSnapshot from "@/components/portfolio/TalentSnapshot";
import DevelopmentGap from "@/components/portfolio/DevelopmentGap";
import CoachingProgress from "@/components/portfolio/CoachingProgress";
import CapaianKinerjaManager from "@/components/portfolio/CapaianKinerjaManager";
import { Briefcase, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Portfolio Dashboard | ICTPS",
  description: "Dashboard Portofolio dan Capaian Kinerja",
};

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { pemetaan, coaching, capaian, calculated } = await getPortfolioData(user.id);

  // Fetch Kompetensi Manajerial data
  const { data: kompetensiDataList } = await supabase
    .from("kompetensi_manajerial")
    .select("*")
    .eq("karyawan_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);
    
  const kompetensiData = kompetensiDataList?.[0] || null;

  const hasData = pemetaan !== null || coaching !== null || kompetensiData !== null;

  return (
    <div className="flex-1 space-y-6 p-6 pb-12 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-[#5d51c7]" />
          Portfolio Dashboard
        </h2>
        <p className="text-text-secondary">
          Ringkasan komprehensif profil talenta dan capaian kinerja Anda.
        </p>
      </div>

      {!hasData && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-[#5d51c7] mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">Belum Ada Data Profil</h3>
          <p className="text-text-secondary max-w-md mx-auto mb-6">
            Dashboard ini membutuhkan data dari Pemetaan Diri dan Sesi Coaching untuk menampilkan analisis talenta Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/pemetaan-diri/create"
              className="px-6 py-2 bg-[#5d51c7] hover:bg-[#4b40a3] text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Mulai Pemetaan Diri
            </Link>
            <Link 
              href="/coaching/create"
              className="px-6 py-2 bg-white border border-border-light hover:bg-gray-50 text-text-primary rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Ajukan Coaching
            </Link>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-2">
          <TalentSnapshot 
            avgPotensi={calculated.avgPotensi}
            avgTantangan={calculated.avgTantangan}
            avgMental={calculated.avgMental}
            talentStatus={calculated.talentStatus}
          />
        </div>
        
        <div className="md:col-span-1 lg:col-span-1">
          <DevelopmentGap 
            avgPotensi={calculated.avgPotensi}
            avgTantangan={calculated.avgTantangan}
          />
        </div>
      </div>

      {/* Kompetensi Manajerial Full Width */}
      {kompetensiData ? (
        <div className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary leading-tight">Kompetensi Manajerial & Sosiokultural</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Hasil penilaian kompetensi Anda berdasarkan observasi atasan/admin.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex flex-col items-end">
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-0.5">Rata-rata Skor</span>
              <div className="text-2xl font-black text-blue-700 leading-none">
                {((kompetensiData.integritas + kompetensiData.kerjasama + kompetensiData.komunikasi + kompetensiData.pelayanan_publik + kompetensiData.orientasi_hasil + kompetensiData.mengelola_perubahan + kompetensiData.pengembangan_diri + kompetensiData.pengambilan_keputusan + kompetensiData.perekat_bangsa) / 9).toFixed(1)} <span className="text-sm font-medium text-blue-400">/ 5.0</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <ProgressBar label="Integritas" score={kompetensiData.integritas} />
            <ProgressBar label="Kerjasama" score={kompetensiData.kerjasama} />
            <ProgressBar label="Komunikasi" score={kompetensiData.komunikasi} />
            <ProgressBar label="Pelayanan Publik" score={kompetensiData.pelayanan_publik} />
            <ProgressBar label="Orientasi pada Hasil" score={kompetensiData.orientasi_hasil} />
            <ProgressBar label="Mengelola Perubahan" score={kompetensiData.mengelola_perubahan} />
            <ProgressBar label="Pengembangan Diri" score={kompetensiData.pengembangan_diri} />
            <ProgressBar label="Pengambilan Keputusan" score={kompetensiData.pengambilan_keputusan} />
            <ProgressBar label="Perekat Bangsa" score={kompetensiData.perekat_bangsa} />
          </div>
          
          {kompetensiData.catatan && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Catatan Tambahan</h4>
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                {kompetensiData.catatan}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm p-6 lg:p-8 flex items-center justify-center min-h-[200px] opacity-80">
          <div className="text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-500">Belum Ada Penilaian Kompetensi</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">Admin atau atasan belum memberikan penilaian kompetensi manajerial Anda.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <div>
          <CoachingProgress coachingData={coaching} />
        </div>
        
        <div>
          <CapaianKinerjaManager initialData={capaian} />
        </div>
      </div>
    </div>
  );
}

// -- Helper UI Components --

function ProgressBar({ label, score }: { label: string; score: number }) {
  const percentage = Math.min(Math.max((score / 5) * 100, 0), 100);
  
  // Decide color based on score
  let colorClass = "bg-blue-600";
  if (score < 3) colorClass = "bg-red-500";
  else if (score < 4) colorClass = "bg-amber-500";
  else if (score >= 4.5) colorClass = "bg-emerald-500";

  return (
    <div>
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">{score.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 5.0</span></span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
        <div className={`h-2 rounded-full ${colorClass} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
