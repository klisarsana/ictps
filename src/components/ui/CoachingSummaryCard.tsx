import React from "react";
import Link from "next/link";
import { Users, ChevronRight, UserCircle, Target, ListChecks } from "lucide-react";

interface CoachingSummaryData {
  created_at: string;
  coach_mentor: string;
  tujuan_utama: string;
  action_plan?: Array<{ langkah: string }>;
  [key: string]: unknown;
}

interface CoachingSummaryCardProps {
  data: CoachingSummaryData;
}

export function CoachingSummaryCard({ data }: CoachingSummaryCardProps) {
  const date = new Date(data.created_at);
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Ambil action plan pertama (jika ada) untuk cuplikan
  let actionPlanText = "Belum ada rencana aksi spesifik.";
  if (data.action_plan && Array.isArray(data.action_plan) && data.action_plan.length > 0) {
    actionPlanText = data.action_plan[0].langkah;
    if (data.action_plan.length > 1) {
      actionPlanText += ` (+${data.action_plan.length - 1} tindakan lain)`;
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="h-1.5 bg-coach-record w-full"></div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-coach-record flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-[15px] font-bold text-text-primary leading-tight">
          2. Coaching Record
        </h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-secondary">Terakhir diisi: {formattedDate}</span>
        <span className="px-3 py-1 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-md">
          Sudah Diisi
        </span>
      </div>

      <p className="text-sm text-text-secondary mb-6 leading-relaxed">
        Ringkasan dari sesi coaching terakhir Anda, termasuk tujuan dan rencana aksi yang disepakati.
      </p>

      <div className="border border-border-light bg-[#fdfdfd] rounded-xl p-4 mb-6 space-y-4 flex-1 flex flex-col justify-center">
        <div className="flex gap-3 items-start">
          <UserCircle className="w-4 h-4 text-coach-record mt-0.5 shrink-0" />
          <div>
            <span className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">Coach / Mentor</span>
            <span className="text-sm font-medium text-text-primary">{data.coach_mentor}</span>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <Target className="w-4 h-4 text-perf-analysis mt-0.5 shrink-0" />
          <div>
            <span className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">Tujuan Utama</span>
            <span className="text-sm text-text-primary line-clamp-2 italic">&quot;{data.tujuan_utama}&quot;</span>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <ListChecks className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
          <div>
            <span className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">Rencana Aksi</span>
            <span className="text-sm text-text-primary line-clamp-2">{actionPlanText}</span>
          </div>
        </div>
      </div>

      <Link
        href="/coaching"
        className="w-full bg-coach-record hover:bg-coach-record/90 text-white flex items-center justify-between px-5 py-3 rounded-xl text-sm font-medium transition-colors"
      >
        <span>Lihat Detail Coaching Record</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
      </div>
    </div>
  );
}
