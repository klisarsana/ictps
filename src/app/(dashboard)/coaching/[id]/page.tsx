import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserCircle, Target, Users, LayoutDashboard, Calendar, ClipboardList } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Coaching Record | ICTPS",
  description: "Melihat keseluruhan form hasil isian coaching record.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CoachingDetailPage({ params }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  // Fetch specific coaching record ensuring it belongs to the user or they are an admin
  const { data: record, error } = await supabase
    .from("coaching_records")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !record) {
    redirect("/coaching"); // Redirect back to list if not found
  }

  // Security check: Only allow access if the user owns this record, is the mentee, or is an admin.
  const role = user.user_metadata?.role;
  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  const isOwner = record.user_id === user.id;
  const isMentee = role?.toLowerCase() === "karyawan" && record.nama_coachee?.toLowerCase().trim() === userName?.toLowerCase().trim();
  const isAdmin = role?.toLowerCase() === "admin";

  if (!isOwner && !isMentee && !isAdmin) {
    console.log("Detail page access denied!");
    console.log("Role:", role);
    console.log("User Name:", userName);
    console.log("Record Nama Coachee:", record.nama_coachee);
    console.log("Record User ID:", record.user_id, "User ID:", user.id);
    redirect("/coaching");
  }

  const date = new Date(record.tanggal_sesi);
  const formattedDate = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const SectionTitle = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
    <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2 mb-4 border-b border-border-light pb-2">
      <Icon className="w-5 h-5 text-coach-record" />
      {title}
    </h2>
  );

  const DataRow = ({ label, value, score }: { label: string, value?: string, score?: number }) => (
    <div className="mb-4">
      <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
        {label}
      </span>
      <p className="text-sm text-text-primary bg-surface-bg p-3 rounded-lg border border-border-light">
        {value || "-"}
      </p>
      {score !== undefined && (
        <div className="mt-2 text-xs font-medium text-coach-record flex items-center gap-1">
          <span className="bg-coach-record/10 px-2 py-1 rounded">Skor: {score} / 5</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/coaching"
          className="p-2 hover:bg-surface-card rounded-full transition-colors text-text-secondary hover:text-text-primary border border-transparent hover:border-border-light shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Detail Form Coaching</h1>
          <p className="text-sm text-text-secondary flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" /> {formattedDate}
          </p>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-light shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* A. Identitas */}
          <section>
            <SectionTitle title="A. Identitas" icon={UserCircle} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataRow label="Nama Coachee" value={record.nama_coachee} />
              <DataRow label="Nama Coach / Mentor" value={record.coach_mentor} />
              <DataRow label="Jabatan" value={record.jabatan} />
              <DataRow label="Unit Kerja" value={record.unit_kerja} />
            </div>
          </section>

          {/* B. Tujuan */}
          <section>
            <SectionTitle title="B. Tujuan" icon={Target} />
            <DataRow label="Tujuan Utama (Goal)" value={record.tujuan_utama} />
            <DataRow label="Spesifik & Terukur (Kejelasan Tujuan)" value={record.tujuan_kejelasan} score={record.tujuan_score} />
          </section>

          {/* C. Kriteria */}
          <section>
            <SectionTitle title="C. Kriteria Keberhasilan" icon={ClipboardList} />
            <DataRow label="Indikator Keberhasilan" value={record.kriteria_indikator} />
            <DataRow label="Kejelasan Kriteria" value={record.kriteria_kejelasan} score={record.kriteria_score} />
          </section>

          {/* D. Motivasi */}
          <section>
            <SectionTitle title="D. Motivasi" icon={Users} />
            <DataRow label="Alasan Motivasi" value={record.motivasi_alasan} />
            <DataRow label="Kekuatan Pendorong" value={record.motivasi_kekuatan} score={record.motivasi_score} />
          </section>

          {/* E. Cara Mencapai */}
          <section>
            <SectionTitle title="E. Cara Mencapai Tujuan" icon={LayoutDashboard} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <DataRow label="Ide & Gagasan" value={record.ide_gagasan} />
                <DataRow label="Kreativitas Ide" value={record.ide_kreativitas} score={record.ide_score} />
              </div>
              <div>
                <DataRow label="Alternatif Pilihan" value={record.alternatif_pilihan} />
                <DataRow label="Realistis Alternatif" value={record.alternatif_realistis} score={record.alternatif_score} />
              </div>
            </div>
          </section>

          {/* Action Plan */}
          <section>
            <SectionTitle title="Rencana Aksi (Action Plan)" icon={Target} />
            <div className="overflow-x-auto rounded-lg border border-border-light mb-4">
              <table className="w-full text-left text-sm bg-white">
                <thead className="bg-surface-bg border-b border-border-light text-xs font-bold text-brand-navy uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Langkah / Tindakan</th>
                    <th className="px-4 py-3 w-1/4">Target Waktu</th>
                    <th className="px-4 py-3">Indikator Keberhasilan / Output</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {record.action_plan && Array.isArray(record.action_plan) ? (
                    record.action_plan.map((plan: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-text-primary font-medium">{plan.langkah}</td>
                        <td className="px-4 py-3 text-text-secondary">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-surface-bg text-xs font-medium border border-border-light">
                            {plan.waktu}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{plan.output}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-text-secondary italic">Tidak ada rencana aksi dicatat.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <DataRow label="Kejelasan Action Plan" value={record.action_plan_kejelasan} score={record.action_plan_score} />
          </section>

          {/* F. Komitmen */}
          <section>
            <SectionTitle title="F. Komitmen" icon={Users} />
            <DataRow label="Komitmen Peserta" value={record.komitmen_peserta} />
            <DataRow label="Tindak Lanjut" value={record.komitmen_tindak_lanjut} score={record.komitmen_score} />
          </section>

          {/* G. Catatan */}
          <section>
            <SectionTitle title="G. Catatan Coach / Mentor" icon={ClipboardList} />
            <DataRow label="Catatan Tambahan (Opsional)" value={record.catatan_coach} />
          </section>

        </div>
      </div>
    </div>
  );
}
