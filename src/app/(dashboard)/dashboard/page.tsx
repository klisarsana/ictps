import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Target, Users, ChevronRight, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import { PemetaanSummaryCard } from "@/components/ui/PemetaanSummaryCard";
import { CoachingSummaryCard } from "@/components/ui/CoachingSummaryCard";
import { PortfolioSummaryCard } from "@/components/ui/PortfolioSummaryCard";

export const metadata: Metadata = {
  title: "Dashboard | ICTPS",
  description: "Dashboard utama sistem ICTPS.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  // Fetch Pemetaan Diri data and exact count
  const { data: pemetaanDataList, count: pemetaanCount } = await supabase
    .from("pemetaan_diri")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const pemetaanData = pemetaanDataList?.[0] || null;
  const totalPemetaan = pemetaanCount || 0;

  let coachingQuery = supabase
    .from("coaching_records")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(1);

  if (user.user_metadata?.role === "karyawan") {
    coachingQuery = coachingQuery.ilike("nama_coachee", userName); // using ilike for case insensitivity
  } else {
    coachingQuery = coachingQuery.eq("user_id", user.id);
  }

  const { data: coachingDataList, count: coachingCount } = await coachingQuery;

  const coachingData = coachingDataList?.[0] || null;
  const totalCoaching = coachingCount || 0;

  // Fetch Kompetensi Manajerial data
  const { data: kompetensiDataList, count: kompetensiCount } = await supabase
    .from("kompetensi_manajerial")
    .select("*", { count: "exact" })
    .eq("karyawan_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const kompetensiData = kompetensiDataList?.[0] || null;
  const totalKompetensi = kompetensiCount || 0;

  let profilLengkap = 25;
  if (totalPemetaan > 0) profilLengkap += 35;
  if (totalCoaching > 0) profilLengkap += 40;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="bg-surface-card rounded-xl border border-border-light p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-full bg-brand-navy/5 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-brand-navy" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Selamat datang kembali, {userName}
            </h1>
            <p className="text-text-secondary">
              Pantau progres pengembangan talenta dan portofolio Anda hari ini.
            </p>
          </div>
        </div>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Pemetaan Diri */}
        {pemetaanData ? (
          <PemetaanSummaryCard data={pemetaanData} />
        ) : (
          <div className="bg-surface-card rounded-xl border border-border-light overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="h-1.5 bg-perf-analysis w-full"></div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-perf-analysis/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-perf-analysis" />
                </div>
                <h2 className="text-lg font-bold text-text-primary">Pemetaan Diri</h2>
              </div>
              <p className="text-sm text-text-secondary mb-6 flex-1">
                Analisis kekuatan, area pengembangan, dan buat rencana aksi untuk mencapai target kinerja Anda.
              </p>
              <Link 
                href="/pemetaan-diri/create"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-perf-analysis text-white font-medium text-sm rounded-lg hover:bg-perf-analysis/90 transition-colors"
              >
                Mulai Pemetaan
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Card 2: Coaching Record */}
        {coachingData ? (
          <CoachingSummaryCard data={coachingData} />
        ) : (
          <div className="bg-surface-card rounded-xl border border-border-light overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="h-1.5 bg-coach-record w-full"></div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-coach-record/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-coach-record" />
                </div>
                <h2 className="text-lg font-bold text-text-primary">Coaching Record</h2>
              </div>
              <p className="text-sm text-text-secondary mb-6 flex-1">
                {user.user_metadata?.role === "karyawan" 
                  ? "Hasil catatan sesi coaching Anda oleh Coach/Mentor akan muncul di sini." 
                  : "Catat sesi coaching Anda bersama atasan, tetapkan tujuan, dan evaluasi hasil secara berkala."}
              </p>
              {user.user_metadata?.role !== "karyawan" ? (
                <Link 
                  href="/coaching/create"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-coach-record text-white font-medium text-sm rounded-lg hover:bg-coach-record/90 transition-colors"
                >
                  Tambah Catatan
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-slate-100 text-slate-400 font-medium text-sm rounded-lg cursor-not-allowed">
                  Menunggu Sesi Selesai
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card 3: Portofolio Update */}
        <PortfolioSummaryCard pemetaanData={pemetaanData} />
      </div>

      {/* Bottom Widget: Ringkasan Perkembangan */}
      <div className="bg-surface-card rounded-xl border border-border-light p-6 shadow-sm mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent-blue" />
          </div>
          <h2 className="text-lg font-bold text-text-primary">Ringkasan Perkembangan</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border border-border-light rounded-lg p-4 bg-surface-bg flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-brand-navy mb-1">{totalCoaching}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Sesi Coaching</span>
          </div>
          <div className="border border-border-light rounded-lg p-4 bg-surface-bg flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-brand-navy mb-1">{totalPemetaan}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Pemetaan Selesai</span>
          </div>
          <div className="border border-border-light rounded-lg p-4 bg-surface-bg flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-brand-navy mb-1">{profilLengkap}%</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Profil Lengkap</span>
          </div>
        </div>
      </div>
    </div>
  );
}
