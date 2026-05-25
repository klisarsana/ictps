"use client";

import React, { useState, useMemo } from "react";
import { EmployeeSummary } from "@/types/admin";
import { Search, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";

interface EmployeeTableProps {
  data: EmployeeSummary[];
}

export function EmployeeTable({ data }: EmployeeTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Lengkap" | "Belum Selesai">("All");

  const filteredData = useMemo(() => {
    return data.filter((employee) => {
      const name = employee.name || "";
      const email = employee.email || "";
      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || employee.status_pemetaan === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-5 w-5 text-slate-400 hidden sm:block" />
          <select
            className="block w-full sm:w-48 pl-3 pr-10 py-2.5 text-base border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="All">Semua Status</option>
            <option value="Lengkap">Lengkap</option>
            <option value="Belum Selesai">Belum Selesai</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold tracking-wider">
              <th className="p-4 px-6">Nama Pegawai</th>
              <th className="p-4 px-6 text-center">Status Pemetaan</th>
              <th className="p-4 px-6 text-center">Rata-rata Skor<br/><span className="text-[10px] text-slate-400 font-medium normal-case">(Kekuatan, Tantangan, Mental)</span></th>
              <th className="p-4 px-6 text-center">Total Sesi Coaching</th>
              <th className="p-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((employee, index) => (
                <tr key={`${employee.user_id}-${index}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{employee.name}</span>
                      <span className="text-sm text-slate-500">{employee.email}</span>
                    </div>
                  </td>
                  <td className="p-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        employee.status_pemetaan === "Lengkap"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {employee.status_pemetaan}
                    </span>
                  </td>
                  <td className="p-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm font-medium">
                      <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded" title="Kekuatan">
                        {employee.avg_kekuatan?.toFixed(1) || "-"}
                      </span>
                      <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded" title="Tantangan">
                        {employee.avg_tantangan?.toFixed(1) || "-"}
                      </span>
                      <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded" title="Mental">
                        {employee.avg_mental?.toFixed(1) || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 px-6 text-center">
                    <span className="text-slate-700 font-medium">
                      {employee.total_coaching_sessions}
                    </span>
                  </td>
                  <td className="p-4 px-6 text-center">
                    <Link
                      href={`/admin/employee/${employee.user_id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm group"
                    >
                      <span>Lihat Detail</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p>Tidak ada data pegawai yang sesuai dengan filter.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
