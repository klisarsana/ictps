import { createClient } from "@/utils/supabase/server";
import { getCoachList } from "@/app/actions/booking";
import KaryawanJadwalClient from "./KaryawanJadwalClient";
import { BookingCoaching } from "@/types/auth";
import { redirect } from "next/navigation";

export default async function KaryawanJadwalPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/");
  }

  // Fetch Coaches
  const coaches = await getCoachList();

  // Fetch Bookings with Coach details joined if possible.
  // We'll fetch basic bookings, and since we need coach names, we can map them
  const { data: bookings, error: bookingsError } = await supabase
    .from("booking_coaching")
    .select("*")
    .eq("karyawan_id", user.id)
    .order("created_at", { ascending: false });

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError);
  }

  // Map coach names to bookings
  const bookingsWithCoachNames = (bookings || []).map((booking: BookingCoaching) => {
    const coach = coaches.find(c => c.id === booking.coach_id);
    return {
      ...booking,
      coach_name: coach ? coach.name : "Unknown Coach"
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Jadwal Coaching Saya</h1>
      
      <KaryawanJadwalClient 
        coaches={coaches} 
        initialBookings={bookingsWithCoachNames} 
      />
    </div>
  );
}
