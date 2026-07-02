import React from "react";
import { getAdminDashboardData } from "@/app/actions/admin";
import { StatCards } from "@/components/admin/StatCards";
import { EmployeeTable } from "@/components/admin/EmployeeTable";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | ICTPS",
  description: "Corporate Admin Dashboard for Integrated Coaching & Talent Portfolio System",
};

export default async function AdminDashboardPage() {
  const result = await getAdminDashboardData();

  if ("error" in result) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Akses Ditolak</h2>
          <p className="text-red-600">{result.error}</p>
        </div>
      </div>
    );
  }

  const { data } = result;

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 text-lg">
              Ringkasan data progres pemetaan dan coaching karyawan.
            </p>
          </div>
        </div>

        {/* Top Statistics Cards */}
        <StatCards data={data} />

        {/* Interactive Data Table Section - Pegawai */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Direktori Pegawai (Karyawan)</h2>
            <p className="text-slate-500 mt-1">
              Kelola dan pantau progres seluruh karyawan dari satu tempat.
            </p>
          </div>
          <EmployeeTable data={data.filter(emp => emp.role === 'karyawan')} />
        </section>

        {/* Interactive Data Table Section - Coach */}
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Direktori Coach</h2>
            <p className="text-slate-500 mt-1">
              Daftar seluruh coach beserta aktivitas mentoring mereka.
            </p>
          </div>
          <EmployeeTable data={data.filter(emp => emp.role === 'coach')} type="coach" />
        </section>

      </div>
    </main>
  );
}
