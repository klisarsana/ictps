import { DashboardClientWrapper } from "@/components/layout/DashboardClientWrapper";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard utama sistem ICTPS.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role || "karyawan";

  return <DashboardClientWrapper role={role}>{children}</DashboardClientWrapper>;
}
