import React from "react";
import Link from "next/link";
import { Folder, ChevronRight, CheckCircle, AlertCircle, AlertTriangle, HelpCircle, TrendingUp, TrendingDown, Minus, User, Target, Brain } from "lucide-react";
import { calculateTalentStatus } from "@/lib/utils/talentLogic";

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
}

interface PortfolioSummaryCardProps {
  pemetaanData: PemetaanData | null;
}

export function PortfolioSummaryCard({ pemetaanData }: PortfolioSummaryCardProps) {
  let hasData = false;
  let displayStatus = "Uncategorized";
  let statusColor = "bg-gray-100 text-gray-700 border-gray-200";
  let StatusIcon = HelpCircle;
  
  let gap = 0;
  let gapColor = "text-text-secondary";
  let GapIcon = Minus;
  let gapMessage = "Potensi seimbang dengan Tantangan";
  
  let avgPotensi = 0;
  let avgTantangan = 0;
  let avgMental = 0;
  
  if (pemetaanData) {
    hasData = true;
    
    // Calculate Averages
    avgPotensi = (pemetaanData.a1_score + pemetaanData.a2_score + pemetaanData.a3_score + pemetaanData.a4_score + pemetaanData.a5_score) / 5;
    avgTantangan = (pemetaanData.b1_score + pemetaanData.b2_score + pemetaanData.b3_score + pemetaanData.b4_score + pemetaanData.b5_score) / 5;
    avgMental = (pemetaanData.c1_score + pemetaanData.c2_score + pemetaanData.c3_score + pemetaanData.c4_score + pemetaanData.c5_score) / 5;
    
    // Status Talenta
    const talentStatus = calculateTalentStatus(avgPotensi, avgTantangan, avgMental);
    
    if (talentStatus === "Ready") {
      displayStatus = "Ready Talent";
      statusColor = "bg-green-50 text-green-700 border-green-200";
      StatusIcon = CheckCircle;
    } else if (talentStatus === "Develop") {
      displayStatus = "Need Development";
      statusColor = "bg-amber-50 text-amber-700 border-amber-200";
      StatusIcon = AlertCircle;
    } else if (talentStatus === "Risk") {
      displayStatus = "Risk / Critical";
      statusColor = "bg-rose-50 text-rose-700 border-rose-200";
      StatusIcon = AlertTriangle;
    }

    // Development Gap
    gap = avgPotensi - avgTantangan;
    if (gap > 0.5) {
      GapIcon = TrendingUp;
      gapColor = "text-green-600";
      gapMessage = "Potensi melebihi hambatan";
    } else if (gap < -0.5) {
      GapIcon = TrendingDown;
      gapColor = "text-rose-600";
      gapMessage = "Hambatan mendominasi";
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="h-1.5 bg-portfolio w-full"></div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-portfolio flex items-center justify-center shrink-0">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-[15px] font-bold text-text-primary leading-tight">
            3. Portofolio & Status Talenta
          </h2>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-text-secondary">Dashboard Portofolio</span>
          <span className="px-3 py-1 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-md">
            Ter-Update
          </span>
        </div>

        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          Berdasarkan hasil pemetaan diri, berikut adalah ringkasan status talenta Anda saat ini.
        </p>

        <div className="border border-border-light bg-[#fdfdfd] rounded-xl p-4 mb-6 space-y-4 flex-1 flex flex-col justify-center">
          {hasData ? (
            <>
              {/* Status Talenta */}
              <div className="flex gap-3 items-start">
                <div className={`p-2 rounded-lg border ${statusColor} shrink-0`}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div className="w-full">
                  <span className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">Status Talenta</span>
                  <span className="text-sm font-bold text-text-primary block leading-tight mb-3">{displayStatus}</span>
                  
                  <div className="flex gap-2 w-full">
                    <div className="flex-1 border border-border-light rounded-lg p-2 flex flex-col items-center justify-center bg-white shadow-sm">
                      <div className="bg-[#5d51c7] rounded-md p-1.5 mb-1.5 text-white">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] text-text-secondary font-medium mb-0.5">Potensi</span>
                      <span className="text-sm font-bold text-blue-600">{avgPotensi.toFixed(1)}</span>
                    </div>
                    <div className="flex-1 border border-border-light rounded-lg p-2 flex flex-col items-center justify-center bg-white shadow-sm">
                      <div className="bg-[#f43f5e] rounded-md p-1.5 mb-1.5 text-white">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] text-text-secondary font-medium mb-0.5">Tantangan</span>
                      <span className="text-sm font-bold text-green-600">{avgTantangan.toFixed(1)}</span>
                    </div>
                    <div className="flex-1 border border-border-light rounded-lg p-2 flex flex-col items-center justify-center bg-white shadow-sm">
                      <div className="bg-[#5d51c7] rounded-md p-1.5 mb-1.5 text-white">
                        <Brain className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] text-text-secondary font-medium mb-0.5">Mental</span>
                      <span className="text-sm font-bold text-green-600">{avgMental.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Development Gap */}
              <div className="flex gap-3 items-start">
                <div className={`p-2 rounded-lg border border-border-light bg-white shrink-0 ${gapColor}`}>
                  <GapIcon className="w-5 h-5" />
                </div>
                <div className="w-full">
                  <span className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">Development Gap</span>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-text-primary block leading-tight">
                      {gap > 0 ? "+" : gap < 0 ? "-" : ""}{Math.abs(gap).toFixed(1)} Poin Gap
                    </span>
                    <span className="text-[10px] text-text-secondary">({gapMessage})</span>
                  </div>
                  
                  <div className="mt-1 space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-blue-700 font-semibold">Potensi</span>
                        <span className="text-text-primary font-medium">{avgPotensi.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(avgPotensi/5)*100}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-rose-600 font-semibold">Tantangan</span>
                        <span className="text-text-primary font-medium">{avgTantangan.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${(avgTantangan/5)*100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-text-secondary text-sm italic">
              Data pemetaan belum tersedia untuk dihitung status talentanya.
            </div>
          )}
        </div>

        <Link
          href="/portfolio"
          className="w-full bg-portfolio hover:bg-portfolio/90 text-white flex items-center justify-between px-5 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          <span>Lihat Detail Portofolio</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
