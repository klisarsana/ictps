import React from "react";
import { EmployeeSummary } from "@/types/admin";
import { Users, CheckCircle, MessageSquare } from "lucide-react";

interface StatCardsProps {
  data: EmployeeSummary[];
}

export function StatCards({ data }: StatCardsProps) {
  const totalEmployees = data.length;
  const completedMapping = data.filter((emp) => emp.status_pemetaan === "Lengkap").length;
  const totalCoachingSessions = data.reduce((sum, emp) => sum + (emp.total_coaching_sessions || 0), 0);

  const stats = [
    {
      title: "Total Karyawan Terdaftar",
      value: totalEmployees,
      icon: Users,
      gradient: "from-blue-50 to-blue-100/50",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Pemetaan Selesai",
      value: completedMapping,
      icon: CheckCircle,
      gradient: "from-emerald-50 to-emerald-100/50",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      title: "Total Sesi Coaching",
      value: totalCoachingSessions,
      icon: MessageSquare,
      gradient: "from-indigo-50 to-indigo-100/50",
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`rounded-2xl border border-slate-200 bg-linear-to-br ${stat.gradient} p-6 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02] duration-300`}
          >
            <div className={`p-4 rounded-xl ${stat.iconBg}`}>
              <Icon className={`w-8 h-8 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
