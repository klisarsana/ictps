import { createClient } from "@/utils/supabase/server";
import { BookingCoaching } from "@/types/auth";
import CoachJadwalClient from "./CoachJadwalClient";
import { redirect } from "next/navigation";

export default async function CoachJadwalPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/");
  }

  // Ensure role is coach or admin
  const role = user.user_metadata?.role;
  if (role !== "coach" && role !== "admin") {
    redirect("/");
  }

  // Fetch incoming booking requests for this coach
  const { data: bookings, error: bookingsError } = await supabase
    .from("booking_coaching")
    .select("*")
    .eq("coach_id", user.id)
    .order("tanggal_usulan", { ascending: true });

  if (bookingsError) {
    console.error("Error fetching coach bookings:", bookingsError);
  }

  // We should also fetch the names of the karyawan.
  // Assuming we can fetch them from admin_dashboard_summary or similar users view.
  const { data: karyawanData, error: karyawanError } = await supabase
    .from("admin_dashboard_summary")
    .select("user_id, name")
    .eq("role", "karyawan");

  if (karyawanError) {
    console.error("Error fetching karyawan data:", karyawanError);
  }

  const karyawanMap = new Map<string, string>();
  if (karyawanData) {
    karyawanData.forEach((k: { user_id: string; name: string }) => {
      karyawanMap.set(k.user_id, k.name);
    });
  }

  const bookingsWithKaryawanNames = (bookings || []).map((booking: BookingCoaching) => {
    return {
      ...booking,
      karyawan_name: karyawanMap.get(booking.karyawan_id) || "Unknown Karyawan"
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Permintaan Jadwal Coaching</h1>
      
      <CoachJadwalClient initialBookings={bookingsWithKaryawanNames} />
    </div>
  );
}
