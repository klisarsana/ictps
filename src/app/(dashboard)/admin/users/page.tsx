import React from "react";
import { getAllUsersAction } from "@/app/actions/admin_users";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { AlertCircle, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Manajemen Pengguna | Admin ICTPS",
  description: "Kelola akun pengguna, karyawan, dan coach.",
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "admin") {
    redirect("/login");
  }

  const result = await getAllUsersAction();

  if (result.error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Gagal Memuat Data</h2>
          <p className="text-red-600">{result.error}</p>
        </div>
      </div>
    );
  }

  const users = result.data || [];

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 lg:p-8 animate-fade-in-up">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                Manajemen Pengguna
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Kelola hak akses dan *role* seluruh pengguna dalam sistem.
              </p>
            </div>
          </div>
        </div>

        {/* User Table Section */}
        <UserManagementTable initialUsers={users} />

      </div>
    </main>
  );
}
