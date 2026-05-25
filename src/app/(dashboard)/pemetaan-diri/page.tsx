import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Target, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { PemetaanDiriHistoryItem, type PemetaanRecordData } from "@/components/ui/PemetaanDiriHistoryItem";

export const metadata: Metadata = {
  title: "Riwayat Pemetaan Diri | ICTPS",
  description: "Riwayat pengisian formulir Pemetaan Diri Anda.",
};

export default async function PemetaanHistoryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil semua riwayat pemetaan diri, urutkan dari yang terbaru
  const { data: records } = await supabase
    .from("pemetaan_diri")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const hasRecords = records && records.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-card rounded-xl border border-border-light p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-perf-analysis/10 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-perf-analysis" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Pemetaan Diri</h1>
            <p className="text-sm text-text-secondary mt-1">
              Lihat riwayat pemetaan atau perbarui data kompetensi Anda.
            </p>
          </div>
        </div>
        
        <Link
          href="/pemetaan-diri/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-perf-analysis hover:bg-perf-analysis/90 text-white text-sm font-bold rounded-lg transition-all shadow-sm hover:shadow"
        >
          {hasRecords ? (
            <>
              <ArrowRight className="w-4 h-4" />
              Update Data (Isi Ulang)
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Buat Pemetaan Baru
            </>
          )}
        </Link>
      </div>

      {/* History List */}
      <div className="bg-surface-card rounded-xl border border-border-light shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-light">
          <h2 className="text-lg font-bold text-text-primary">Riwayat Pengisian</h2>
        </div>
        
        {hasRecords ? (
          <div className="divide-y divide-border-light">
            {records.map((record: PemetaanRecordData, index: number) => (
              <PemetaanDiriHistoryItem 
                key={record.id} 
                record={record} 
                index={index} 
                totalRecords={records.length} 
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-surface-bg flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Belum ada riwayat</h3>
            <p className="text-text-secondary max-w-sm mb-6">
              Anda belum pernah mengisi formulir Pemetaan Diri. Silakan isi form untuk pertama kalinya.
            </p>
            <Link
              href="/pemetaan-diri/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-perf-analysis text-white text-sm font-bold rounded-lg hover:bg-perf-analysis/90 transition-all shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" />
              Mulai Pemetaan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
