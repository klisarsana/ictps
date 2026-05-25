"use client";

import React, { useState } from "react";
import {
  Calendar,
  Bot,
  Target,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Flame,
  Clock,
} from "lucide-react";

interface ActionPlanItem {
  langkah: string;
  waktu: string;
  output: string;
}

interface CoachingRecordData {
  tanggal_sesi: string;
  coach_mentor: string;
  tujuan_utama: string;
  motivasi_score: number;
  komitmen_score: number;
  kriteria_score: number;
  kriteria_indikator: string;
  kriteria_kejelasan?: string;
  motivasi_alasan: string;
  motivasi_kekuatan?: string;
  komitmen_peserta: string;
  komitmen_tindak_lanjut?: string;
  action_plan?: ActionPlanItem[];
  [key: string]: unknown;
}

interface CoachingHistoryItemProps {
  record: CoachingRecordData;
  index: number;
  totalRecords: number;
}

export function CoachingHistoryItem({
  record,
  index,
  totalRecords,
}: CoachingHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const date = new Date(record.tanggal_sesi);
  const formattedDate = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 hover:bg-surface-bg/50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-start gap-4 flex-1 w-full">
        <div className="w-10 h-10 rounded-full bg-surface-bg border border-border-light flex items-center justify-center shrink-0 mt-1">
          <span className="text-xs font-bold text-text-secondary">
            #{totalRecords - index}
          </span>
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between gap-2 mb-1 w-full">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-coach-record" />
              <h3 className="text-base font-bold text-text-primary">
                {formattedDate}
              </h3>
            </div>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            Bersama:{" "}
            <span className="font-semibold">{record.coach_mentor}</span>
          </p>

          <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-lg p-4 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Bot className="w-16 h-16 text-brand-navy" />
            </div>

            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Tujuan Utama Sesi
            </h4>
            <p className="text-sm text-text-primary leading-relaxed relative z-10 italic">
              &quot;{record.tujuan_utama}&quot;
            </p>

            <div className="mt-3 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3 text-xs font-medium text-text-secondary">
                <span className="bg-white px-2 py-1 rounded border border-border-light shadow-sm">
                  Skor Motivasi: {record.motivasi_score}/5
                </span>
                <span className="bg-white px-2 py-1 rounded border border-border-light shadow-sm">
                  Skor Komitmen: {record.komitmen_score}/5
                </span>
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-navy/80 transition-colors"
              >
                {isExpanded ? (
                  <>
                    Tutup Detail <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Lihat Detail Lengkap <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* EXPANDABLE CONTENT */}
            {isExpanded && (
              <div className="mt-6 pt-5 border-t border-brand-navy/10 space-y-5 relative z-10 animate-fade-in-up">
                {/* Kriteria Keberhasilan */}
                <div>
                  <h5 className="text-xs font-bold text-text-primary flex items-center gap-1.5 mb-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#16a34a]" />{" "}
                    Kriteria Keberhasilan (Skor: {record.kriteria_score}/5)
                  </h5>
                  <div className="bg-white p-3 rounded border border-border-light text-sm space-y-2">
                    <div>
                      <span className="block text-xs text-text-secondary font-medium">
                        Indikator:
                      </span>
                      <p className="text-text-primary">
                        {record.kriteria_indikator}
                      </p>
                    </div>
                    {record.kriteria_kejelasan && (
                      <div>
                        <span className="block text-xs text-text-secondary font-medium">
                          Spesifik & Terukur:
                        </span>
                        <p className="text-text-primary">
                          {record.kriteria_kejelasan}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Motivasi & Komitmen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-bold text-text-primary flex items-center gap-1.5 mb-2">
                      <Flame className="w-3.5 h-3.5 text-[#f97316]" /> Detail
                      Motivasi
                    </h5>
                    <div className="bg-white p-3 rounded border border-border-light text-sm space-y-2 h-full">
                      <div>
                        <span className="block text-xs text-text-secondary font-medium">
                          Alasan:
                        </span>
                        <p className="text-text-primary">
                          {record.motivasi_alasan}
                        </p>
                      </div>
                      {record.motivasi_kekuatan && (
                        <div>
                          <span className="block text-xs text-text-secondary font-medium">
                            Kekuatan Mendorong:
                          </span>
                          <p className="text-text-primary">
                            {record.motivasi_kekuatan}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-text-primary flex items-center gap-1.5 mb-2">
                      <Clock className="w-3.5 h-3.5 text-[#3b82f6]" /> Detail
                      Komitmen
                    </h5>
                    <div className="bg-white p-3 rounded border border-border-light text-sm space-y-2 h-full">
                      <div>
                        <span className="block text-xs text-text-secondary font-medium">
                          Komitmen Peserta:
                        </span>
                        <p className="text-text-primary">
                          {record.komitmen_peserta}
                        </p>
                      </div>
                      {record.komitmen_tindak_lanjut && (
                        <div>
                          <span className="block text-xs text-text-secondary font-medium">
                            Tindak Lanjut:
                          </span>
                          <p className="text-text-primary">
                            {record.komitmen_tindak_lanjut}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rencana Aksi */}
                {record.action_plan &&
                  Array.isArray(record.action_plan) &&
                  record.action_plan.length > 0 && (
                    <div className="pt-2">
                      <h5 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-brand-navy rounded-full"></div>
                        Rencana Aksi (Action Plan)
                      </h5>
                      <div className="overflow-hidden rounded-lg border border-border-light shadow-sm">
                        <table className="w-full text-left text-sm bg-white">
                          <thead className="bg-surface-bg border-b border-border-light text-xs font-bold text-brand-navy uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-3 w-1/3">
                                Langkah / Tindakan
                              </th>
                              <th className="px-4 py-3 w-1/4">Target Waktu</th>
                              <th className="px-4 py-3">
                                Indikator Keberhasilan / Output
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-light">
                            {record.action_plan.map(
                              (plan: ActionPlanItem, idx: number) => (
                                <tr
                                  key={idx}
                                  className="hover:bg-brand-navy/5 transition-colors"
                                >
                                  <td className="px-4 py-3 text-text-primary font-medium">
                                    {plan.langkah}
                                  </td>
                                  <td className="px-4 py-3 text-text-secondary">
                                    <span className="inline-flex items-center px-2 py-1 rounded bg-surface-bg text-xs font-medium border border-border-light">
                                      {plan.waktu}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-text-secondary">
                                    {plan.output}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
