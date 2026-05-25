"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Star, AlertTriangle, Activity } from "lucide-react";

export interface PemetaanRecordData {
  id: string;
  created_at: string;
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
  pernah_pelatihan: boolean;
  relevansi_score?: number;
  membantu_score?: number;
  kekuatan_utama: string;
  tantangan_terbesar: string;
  kondisi_mental: string;
  nama_pelatihan?: string;
  bersertifikat?: boolean;
  pelatihan_dibutuhkan?: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface PemetaanDiriHistoryItemProps {
  record: PemetaanRecordData;
  index: number;
  totalRecords: number;
}

export function PemetaanDiriHistoryItem({ record, index, totalRecords }: PemetaanDiriHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const date = new Date(record.created_at);
  const formattedDate = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Rata-rata sederhana
  const kekuatan = ((record.a1_score + record.a2_score + record.a3_score + record.a4_score + record.a5_score) / 5).toFixed(1);
  const tantangan = ((record.b1_score + record.b2_score + record.b3_score + record.b4_score + record.b5_score) / 5).toFixed(1);
  const mental = ((record.c1_score + record.c2_score + record.c3_score + record.c4_score + record.c5_score) / 5).toFixed(1);

  return (
    <div className="p-6 hover:bg-surface-bg/50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-start gap-4 flex-1 w-full">
        <div className="w-10 h-10 rounded-full bg-surface-bg border border-border-light flex items-center justify-center shrink-0 mt-1">
          <span className="text-xs font-bold text-text-secondary">#{totalRecords - index}</span>
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-perf-analysis" />
            <h3 className="text-base font-bold text-text-primary">{formattedDate}</h3>
          </div>
          <p className="text-sm text-text-secondary mb-3">Pukul {time} WIB</p>
          
          <div className="bg-[#5d51c7]/5 border border-[#5d51c7]/10 rounded-lg p-4 relative overflow-hidden transition-all duration-300">
            <div className="flex flex-wrap items-center gap-3 relative z-10">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#5d51c7]/10 text-[#5d51c7]">
                Kekuatan: {kekuatan}/5
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f97316]/10 text-[#f97316]">
                Tantangan: {tantangan}/5
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#10b981]/10 text-[#10b981]">
                Mental: {mental}/5
              </span>
            </div>

            {record.pernah_pelatihan && (
              <div className="w-full mt-3 bg-[#3b82f6]/5 border border-[#3b82f6]/20 rounded-md p-2.5 relative z-10">
                <span className="block text-xs font-bold text-[#3b82f6] mb-1">Pelatihan:</span>
                <div className="flex flex-col gap-0.5 text-xs font-medium text-text-secondary">
                  <span>Relevan : {record.relevansi_score || '-'}/5</span>
                  <span>Membantu : {record.membantu_score || '-'}/5</span>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end relative z-10">
               <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#5d51c7] hover:text-[#5d51c7]/80 transition-colors"
               >
                 {isExpanded ? (
                   <>Tutup Detail <ChevronUp className="w-4 h-4" /></>
                 ) : (
                   <>Lihat Detail Lengkap <ChevronDown className="w-4 h-4" /></>
                 )}
               </button>
            </div>

            {/* EXPANDABLE CONTENT */}
            {isExpanded && (
              <div className="mt-5 pt-5 border-t border-[#5d51c7]/10 space-y-6 relative z-10 animate-fade-in-up">
                
                {/* Kesimpulan (Pertanyaan Terbuka) */}
                <div>
                  <h5 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <div className="w-1.5 h-4 bg-[#5d51c7] rounded-full"></div>
                    Kesimpulan Analisis
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded border border-border-light text-sm shadow-sm">
                      <span className="block text-[11px] font-bold text-[#5d51c7] mb-1 uppercase tracking-wider">Kekuatan Utama</span>
                      <p className="text-text-primary">{record.kekuatan_utama}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-border-light text-sm shadow-sm">
                      <span className="block text-[11px] font-bold text-[#f97316] mb-1 uppercase tracking-wider">Tantangan Terbesar</span>
                      <p className="text-text-primary">{record.tantangan_terbesar}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-border-light text-sm shadow-sm">
                      <span className="block text-[11px] font-bold text-[#10b981] mb-1 uppercase tracking-wider">Kondisi Mental</span>
                      <p className="text-text-primary">{record.kondisi_mental}</p>
                    </div>
                  </div>
                </div>

                {/* Detail Pelatihan */}
                {record.pernah_pelatihan && (
                  <div>
                    <h5 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-2 uppercase tracking-wider">
                      <div className="w-1.5 h-4 bg-[#3b82f6] rounded-full"></div>
                      Detail Riwayat Pelatihan
                    </h5>
                    <div className="bg-white p-4 rounded border border-border-light text-sm shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs text-text-secondary font-medium">Nama Pelatihan:</span>
                        <p className="text-text-primary font-medium">{record.nama_pelatihan || '-'}</p>
                      </div>
                      <div>
                        <span className="block text-xs text-text-secondary font-medium">Bersertifikat:</span>
                        <p className="text-text-primary font-medium">{record.bersertifikat ? "Ya" : "Tidak"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="block text-xs text-text-secondary font-medium">Pelatihan yang Dibutuhkan:</span>
                        <p className="text-text-primary">{record.pelatihan_dibutuhkan || '-'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rincian Skor */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-text-primary mb-2 flex items-center gap-2 uppercase tracking-wider">
                    <div className="w-1.5 h-4 bg-text-secondary rounded-full"></div>
                    Rincian Penilaian (Skor & Deskripsi)
                  </h5>

                  {/* Kekuatan */}
                  <div className="border border-border-light rounded-lg overflow-hidden bg-white">
                    <div className="bg-[#5d51c7]/5 px-4 py-2 border-b border-border-light flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#5d51c7]" />
                      <span className="font-bold text-xs text-text-primary uppercase">Bagian A: Kekuatan Diri</span>
                    </div>
                    <div className="divide-y divide-border-light text-sm">
                      {[
                        { num: 1, label: "Saya mengetahui dengan jelas apa saja kelebihan saya." },
                        { num: 2, label: "Saya percaya diri dalam menyelesaikan tugas." },
                        { num: 3, label: "Saya mampu belajar hal baru dengan cepat." },
                        { num: 4, label: "Saya mampu bekerja sama dengan baik dalam tim." },
                        { num: 5, label: "Saya memiliki motivasi untuk terus berkembang." }
                      ].map(({ num, label }) => (
                        <div key={`a${num}`} className="p-3 grid grid-cols-[auto_1fr] gap-4 items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-surface-bg border border-border-light font-bold text-[#5d51c7] text-xs shrink-0">
                            {record[`a${num}_score`]}
                          </span>
                          <div className="pt-0.5 space-y-1">
                            <p className="text-xs font-semibold text-text-primary">{label}</p>
                            <p className="text-text-secondary text-sm">{record[`a${num}_penjelasan`]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tantangan */}
                  <div className="border border-border-light rounded-lg overflow-hidden bg-white">
                    <div className="bg-[#f97316]/5 px-4 py-2 border-b border-border-light flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#f97316]" />
                      <span className="font-bold text-xs text-text-primary uppercase">Bagian B: Tantangan/Hambatan</span>
                    </div>
                    <div className="divide-y divide-border-light text-sm">
                      {[
                        { num: 1, label: "Saya mengalami kesulitan dalam menyelesaikan pekerjaan tepat waktu." },
                        { num: 2, label: "Saya merasa kurang percaya diri dalam situasi tertentu." },
                        { num: 3, label: "Saya mudah terdistraksi saat bekerja atau belajar." },
                        { num: 4, label: "Saya mengalami hambatan dalam berkomunikasi dengan orang lain." },
                        { num: 5, label: "Saya merasa terbebani dengan tuntutan pekerjaan atau tugas." }
                      ].map(({ num, label }) => (
                        <div key={`b${num}`} className="p-3 grid grid-cols-[auto_1fr] gap-4 items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-surface-bg border border-border-light font-bold text-[#f97316] text-xs shrink-0">
                            {record[`b${num}_score`]}
                          </span>
                          <div className="pt-0.5 space-y-1">
                            <p className="text-xs font-semibold text-text-primary">{label}</p>
                            <p className="text-text-secondary text-sm">{record[`b${num}_penjelasan`]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mental */}
                  <div className="border border-border-light rounded-lg overflow-hidden bg-white">
                    <div className="bg-[#10b981]/5 px-4 py-2 border-b border-border-light flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#10b981]" />
                      <span className="font-bold text-xs text-text-primary uppercase">Bagian C: Situasi Mental</span>
                    </div>
                    <div className="divide-y divide-border-light text-sm">
                      {[
                        { num: 1, label: "Saya merasa tenang dalam menjalani aktivitas sehari-hari." },
                        { num: 2, label: "Saya mampu mengelola stres dengan baik." },
                        { num: 3, label: "Saya tetap berpikir positif saat menghadapi masalah." },
                        { num: 4, label: "Saya merasa memiliki dukungan dari orang sekitar." },
                        { num: 5, label: "Saya merasa bersemangat dalam menjalani aktivitas." }
                      ].map(({ num, label }) => (
                        <div key={`c${num}`} className="p-3 grid grid-cols-[auto_1fr] gap-4 items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-surface-bg border border-border-light font-bold text-[#10b981] text-xs shrink-0">
                            {record[`c${num}_score`]}
                          </span>
                          <div className="pt-0.5 space-y-1">
                            <p className="text-xs font-semibold text-text-primary">{label}</p>
                            <p className="text-text-secondary text-sm">{record[`c${num}_penjelasan`]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
