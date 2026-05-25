"use client";

import { logoutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-error-red hover:bg-error-red/5 transition-all duration-200"
        id="logout-btn"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Keluar</span>
      </button>
    </form>
  );
}
