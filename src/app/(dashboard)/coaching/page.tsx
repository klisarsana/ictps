import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Users, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { CoachingHistoryItem } from "@/components/ui/CoachingHistoryItem";

export const metadata: Metadata = {
  title: "Riwayat Coaching Record | ICTPS",
  description: "Daftar riwayat sesi coaching Anda beserta ringkasan AI.",
};

export default async function CoachingHistoryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = user.user_metadata?.role;
  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  let recordsQuery = supabase
    .from("coaching_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (role === "karyawan") {
    recordsQuery = recordsQuery.ilike("nama_coachee", userName); // using ilike
  } else {
    recordsQuery = recordsQuery.eq("user_id", user.id);
  }

  const { data: records } = await recordsQuery;

  const hasRecords = records && records.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-card rounded-xl border border-border-light p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-coach-record/10 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-coach-record" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Coaching Record</h1>
            <p className="text-sm text-text-secondary mt-1">
              Dokumentasikan dan lihat kembali riwayat sesi coaching Anda.
            </p>
          </div>
        </div>
        {user.user_metadata?.role !== "karyawan" && (
          <Link
            href="/coaching/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-coach-record hover:bg-coach-record/90 text-white text-sm font-bold rounded-lg transition-all shadow-sm hover:shadow"
          >
            {hasRecords ? (
              <>
                <ArrowRight className="w-4 h-4" />
                Update Data (Sesi Baru)
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Catat Sesi Pertama
              </>
            )}
          </Link>
        )}
      </div>

      {/* History List */}
      <div className="bg-surface-card rounded-xl border border-border-light shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-light">
          <h2 className="text-lg font-bold text-text-primary">Riwayat Sesi Coaching</h2>
        </div>
        
        {hasRecords ? (
          <div className="divide-y divide-border-light">
            {records.map((record: any, index: number) => (
              <CoachingHistoryItem 
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
              <Users className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Belum ada sesi coaching</h3>
            <p className="text-text-secondary max-w-sm mb-6">
              Anda belum mencatat riwayat sesi coaching. Silakan tambah catatan pertama Anda.
            </p>
            {user.user_metadata?.role !== "karyawan" && (
              <Link
                href="/coaching/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-coach-record text-white text-sm font-bold rounded-lg hover:bg-coach-record/90 transition-all shadow-sm hover:shadow"
              >
                <Plus className="w-4 h-4" />
                Catat Sesi Baru
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
