import { LogoutButton } from "@/app/(dashboard)/dashboard/logout-button";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-18 bg-white border-b border-border-light flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button (hidden on desktop) */}
        <button onClick={onMenuClick} className="lg:hidden p-2 text-text-secondary hover:bg-surface-bg rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-text-secondary hover:bg-surface-bg rounded-lg relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-error-red rounded-full border border-white"></span>
        </button>
        <div className="h-6 w-px bg-border-light mx-2"></div>
        <LogoutButton />
      </div>
    </header>
  );
}
