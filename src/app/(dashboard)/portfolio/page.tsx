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

  const hasData = pemetaan !== null || coaching !== null;

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
