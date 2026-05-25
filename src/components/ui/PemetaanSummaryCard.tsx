import React from "react";
import Link from "next/link";
import { ClipboardList, ChevronRight } from "lucide-react";

interface PemetaanData {
  a1_score: number;
  a2_score: number;
  a3_score: number;
  a4_score: number;
  a5_score: number;
  b1_score: number;
  b2_score: number;
  b3_score: number;
  b4_score: number;
  b5_score: number;
  c1_score: number;
  c2_score: number;
  c3_score: number;
  c4_score: number;
  c5_score: number;
  relevansi_score?: number | null;
  membantu_score?: number | null;
  created_at: string;
}

interface PemetaanSummaryCardProps {
  data: PemetaanData;
}

export function PemetaanSummaryCard({ data }: PemetaanSummaryCardProps) {
  const kekuatan =
    (data.a1_score +
      data.a2_score +
      data.a3_score +
      data.a4_score +
      data.a5_score) /
    5;
  const tantangan =
    (data.b1_score +
      data.b2_score +
      data.b3_score +
      data.b4_score +
      data.b5_score) /
    5;
  const mental =
    (data.c1_score +
      data.c2_score +
      data.c3_score +
      data.c4_score +
      data.c5_score) /
    5;

  let pelatihan = 0;
  if (data.relevansi_score && data.membantu_score) {
    pelatihan = (data.relevansi_score + data.membantu_score) / 2;
  }

  const date = new Date(data.created_at);
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="h-1.5 bg-[#5d51c7] w-full"></div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#5d51c7] flex items-center justify-center shrink-0">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-[15px] font-bold text-text-primary leading-tight">
          1. Pemetaan Diri (Performance Analysis)
        </h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-secondary">Terakhir diisi: {formattedDate}</span>
        <span className="px-3 py-1 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-md">
          Terlengkap
        </span>
      </div>

      <p className="text-sm text-text-secondary mb-6 leading-relaxed">
        Berisi penilaian diri terkait kekuatan, tantangan, situasi mental, pelatihan, dan pertanyaan terbuka.
      </p>

      <div className="border border-border-light bg-[#fdfdfd] rounded-xl p-5 mb-6 flex-1 flex flex-col justify-center">
        <h3 className="text-[13px] font-bold text-text-primary mb-5">Ringkasan Skor (Rata-rata)</h3>
        
        <div className="space-y-4">
          <ScoreBar label="Kekuatan / Potensi Diri" score={kekuatan} color="bg-[#5d51c7]" />
          <ScoreBar label="Tantangan / Hambatan" score={tantangan} color="bg-[#f97316]" />
          <ScoreBar label="Situasi Mental" score={mental} color="bg-[#16a34a]" />
          <ScoreBar label="Pelatihan" score={pelatihan} color="bg-[#3b82f6]" />
        </div>
      </div>

      <Link
        href="/pemetaan-diri"
        className="w-full bg-[#5d51c7] hover:bg-[#4b40a8] text-white flex items-center justify-between px-5 py-3 rounded-xl text-sm font-medium transition-colors"
      >
        <span>Lihat Detail Pemetaan Diri</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const percentage = (score / 5) * 100;
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-35 shrink-0">
        <span className="text-xs font-medium text-text-secondary">{label}</span>
      </div>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
      <div className="w-8 text-right shrink-0">
        <span className="text-xs font-bold text-text-primary">{score.toFixed(2).replace(".", ",")}</span>
      </div>
    </div>
  );
}
