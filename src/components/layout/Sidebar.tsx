"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Users,
  Folder,
  Blocks,
  Calendar,
} from "lucide-react";

interface SidebarProps {
  role?: string;
  onClose?: () => void;
}

export function Sidebar({ role = "karyawan", onClose }: SidebarProps) {
  const pathname = usePathname();

  let navigation: { name: string; href: string; icon: React.ElementType }[] = [];

  if (role === "admin") {
    navigation = [
      { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Manajemen Pengguna", href: "/admin/users", icon: Users },
    ];
  } else if (role === "coach") {
    navigation = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Jadwal Coaching Saya", href: "/coach/jadwal-saya", icon: Calendar },
      { name: "Persetujuan Jadwal", href: "/coach/jadwal", icon: Calendar },
      { name: "Pemetaan Diri", href: "/pemetaan-diri", icon: Target },
      { name: "Coaching Record", href: "/coaching", icon: Users },
      { name: "Portofolio", href: "/portfolio", icon: Folder },
    ];
  } else {
    navigation = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Jadwal Coaching Saya", href: "/karyawan/jadwal", icon: Calendar },
      { name: "Pemetaan Diri", href: "/pemetaan-diri", icon: Target },
      { name: "Coaching Record", href: "/coaching", icon: Users },
      { name: "Portofolio", href: "/portfolio", icon: Folder },
    ];
  }

  return (
    <div className="flex w-64 flex-col bg-brand-navy text-white h-screen shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Blocks className="w-8 h-8 text-accent-cyan" />
        </div>
        <div>
          <span className="font-bold text-lg leading-none tracking-wide text-white">
            ICTPS
          </span>
          <p className="text-[12px] text-white tracking-wider font-medium mt-1">
            Integrated Coaching and Talent Portfolio System
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold text-white/40 tracking-widest uppercase mb-3">
          Menu Utama
        </p>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 group ${
                isActive
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon
                className={`w-8 h-8 shrink-0 ${isActive ? "text-accent-cyan" : "text-white/40 group-hover:text-white/70"}`}
              />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
