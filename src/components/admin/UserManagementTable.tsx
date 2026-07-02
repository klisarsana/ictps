"use client";

import { useState } from "react";
import { UserRow, AppRole, updateUserRoleAction } from "@/app/actions/admin_users";
import { Search, ShieldAlert, CheckCircle2, ChevronDown, User, Shield, Briefcase } from "lucide-react";

interface UserManagementTableProps {
  initialUsers: UserRow[];
}

export function UserManagementTable({ initialUsers }: UserManagementTableProps) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    setLoadingId(userId);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await updateUserRoleAction(userId, newRole);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      setSuccessMsg("Role berhasil diperbarui.");
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    
    setLoadingId(null);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case "admin": return <Shield className="w-4 h-4 text-purple-600" />;
      case "coach": return <Briefcase className="w-4 h-4 text-emerald-600" />;
      default: return <User className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRoleColor = (role: AppRole) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800 border-purple-200";
      case "coach": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <ShieldAlert className="w-5 h-5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm">
              <th className="px-6 py-4 font-semibold text-slate-600">Nama Pengguna</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Email</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Role Saat Ini</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-right">Ubah Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-400 mt-1">Terdaftar: {new Date(user.created_at).toLocaleDateString('id-ID')}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block text-left">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as AppRole)}
                      disabled={loadingId === user.id}
                      className="appearance-none bg-white border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <option value="karyawan">Karyawan</option>
                      <option value="coach">Coach</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  {loadingId === user.id && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </td>
              </tr>
            ))}
            
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  Tidak ada pengguna yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
