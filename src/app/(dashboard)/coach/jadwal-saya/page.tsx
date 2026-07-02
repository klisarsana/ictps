import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BookingCoaching } from "@/types/auth";
import { CheckCircle, Video, FileText, Calendar, History } from "lucide-react";
import Link from "next/link";

export default async function CoachJadwalSayaPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user || user.user_metadata?.role !== "coach") {
    redirect("/");
  }

  // Fetch approved (upcoming) bookings
  const { data: upcomingBookings, error: upcomingError } = await supabase
    .from("booking_coaching")
    .select("*")
    .eq("coach_id", user.id)
    .eq("status", "Disetujui")
    .order("tanggal_usulan", { ascending: true });

  if (upcomingError) console.error("Error fetching upcoming bookings:", upcomingError);

  // Fetch completed bookings
  const { data: completedBookings, error: completedError } = await supabase
    .from("booking_coaching")
    .select("*")
    .eq("coach_id", user.id)
    .eq("status", "Selesai")
    .order("tanggal_usulan", { ascending: false });

  if (completedError) console.error("Error fetching completed bookings:", completedError);

  // Fetch Karyawan names from users table
  type UserRow = { id: string; name: string };
  const { data: usersData } = await supabase
    .from("users")
    .select("id, name")
    .returns<UserRow[]>();

  const userMap = new Map<string, string>();
  if (usersData) {
    usersData.forEach(u => userMap.set(u.id, u.name));
  }

  const mapKaryawan = (bookingsArray: any[]) => 
    (bookingsArray || []).map((booking: BookingCoaching) => ({
      ...booking,
      karyawan_name: userMap.get(booking.karyawan_id) || "Unknown Karyawan"
    }));

  const upcomingWithNames = mapKaryawan(upcomingBookings || []);
  const completedWithNames = mapKaryawan(completedBookings || []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-[#0F172A]">Jadwal Coaching Saya</h1>
      
      {/* SECTION 1: UPCOMING SESSIONS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-[#1E3A8A]" />
            Sesi Coaching yang Akan Datang
          </h2>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200">
            {upcomingWithNames.length} Sesi Disetujui
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Karyawan (Peserta)</th>
                <th className="px-6 py-4 font-medium">Jadwal Sesi</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {upcomingWithNames.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <Calendar className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-base font-medium text-slate-600">Belum ada jadwal yang disetujui</p>
                      <p className="text-sm mt-1">Jadwal yang telah Anda setujui akan muncul di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                upcomingWithNames.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] font-bold text-xs mr-3">
                          {booking.karyawan_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">{booking.karyawan_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {new Date(booking.tanggal_usulan).toLocaleString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Disetujui
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {booking.teams_link && (
                          <a
                            href={booking.teams_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors shadow-sm"
                          >
                            <Video className="w-3.5 h-3.5 mr-1" />
                            Join MS Teams
                          </a>
                        )}
                        <Link
                          href={`/coaching/create?bookingId=${booking.id}&menteeId=${booking.karyawan_id}&menteeName=${encodeURIComponent(booking.karyawan_name)}&sessionDate=${booking.tanggal_usulan.split('T')[0]}`}
                          className="inline-flex items-center px-3 py-1.5 bg-[#1E3A8A] text-white text-xs font-medium rounded-lg hover:bg-[#1e3a8ad2] transition-colors shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          Isi Hasil Coaching
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: COMPLETED SESSIONS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <History className="w-5 h-5 mr-2 text-slate-600" />
            Sesi yang Telah Selesai
          </h2>
          <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200">
            {completedWithNames.length} Sesi Selesai
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Karyawan (Peserta)</th>
                <th className="px-6 py-4 font-medium">Jadwal Sesi</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedWithNames.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <History className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-base font-medium text-slate-600">Belum ada riwayat sesi</p>
                      <p className="text-sm mt-1">Sesi coaching yang telah selesai akan tercatat di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                completedWithNames.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs mr-3">
                          {booking.karyawan_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">{booking.karyawan_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {new Date(booking.tanggal_usulan).toLocaleString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Selesai
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
