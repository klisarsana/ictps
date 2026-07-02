"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookingCoaching } from "@/types/auth";
import { requestBookingAction, acceptRescheduleAction, declineAndRescheduleAction } from "@/app/actions/booking";
import { CheckCircle, Clock, XCircle, Calendar, MessageSquare, Video } from "lucide-react";
import KaryawanRescheduleModal from "@/components/booking/KaryawanRescheduleModal";

const bookingSchema = z.object({
  coachId: z.string().min(1, "Silakan pilih Coach"),
  date: z.string().min(1, "Silakan pilih tanggal dan waktu"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

type BookingWithCoachName = BookingCoaching & { coach_name: string };

interface KaryawanJadwalClientProps {
  coaches: { id: string; name: string }[];
  initialBookings: BookingWithCoachName[];
}

export default function KaryawanJadwalClient({ coaches, initialBookings }: KaryawanJadwalClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState<string | null>(null);
  const [coachRescheduleDate, setCoachRescheduleDate] = useState<Date | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setError(null);
    const result = await requestBookingAction(data.coachId, data.date);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      reset();
    }
  };

  const handleAcceptReschedule = async (bookingId: string) => {
    const result = await acceptRescheduleAction(bookingId);
    if (result.error) {
      alert(result.error);
    }
  };

  const openRescheduleModal = (bookingId: string, dateString: string | null) => {
    setSelectedBookingForReschedule(bookingId);
    setCoachRescheduleDate(dateString ? new Date(dateString) : null);
    setRescheduleModalOpen(true);
  };

  const handleDeclineAndReschedule = async (newDate: string) => {
    if (!selectedBookingForReschedule) return;
    const result = await declineAndRescheduleAction(selectedBookingForReschedule, newDate);
    if (result.error) {
      alert(result.error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1" /> Menunggu</span>;
      case "Disetujui":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1" /> Disetujui</span>;
      case "Reschedule":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Calendar className="w-3 h-3 mr-1" /> Reschedule</span>;
      case "Selesai":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><CheckCircle className="w-3 h-3 mr-1" /> Selesai</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  console.log("CLIENT RENDER CHECK - Coaches state:", coaches);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Ajukan Jadwal Baru</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 flex items-start">
                <XCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Coach</label>
              <select 
                {...register("coachId")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-shadow"
              >
                <option value="">Pilih Coach...</option>
                {coaches.map((coach) => (
                  <option key={coach.id} value={coach.id}>{coach.name}</option>
                ))}
              </select>
              {errors.coachId && <p className="text-red-500 text-xs mt-1">{errors.coachId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal & Waktu Usulan</label>
              <input 
                type="datetime-local" 
                {...register("date")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-shadow"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8ad2] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Mengajukan..." : "Ajukan Jadwal"}
            </button>
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800">Riwayat Jadwal</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Coach</th>
                  <th className="px-6 py-4 font-medium">Tanggal Usulan</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Aksi / Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Belum ada riwayat jadwal.
                    </td>
                  </tr>
                ) : (
                  initialBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{booking.coach_name}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(booking.tanggal_usulan).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                      <td className="px-6 py-4">
                        {booking.status === "Disetujui" && booking.teams_link && (
                          <a 
                            href={booking.teams_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-medium text-[#1E3A8A] hover:text-[#1e3a8ad2] hover:underline"
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Join MS Teams
                          </a>
                        )}
                        
                        {booking.status === "Reschedule" && (
                          <div className="space-y-2">
                            <div className="text-xs text-slate-600 bg-slate-100 p-2 rounded-md border border-slate-200">
                              <p className="font-medium text-slate-700 mb-1 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Usulan Baru: {booking.tanggal_reschedule ? new Date(booking.tanggal_reschedule).toLocaleString('id-ID') : '-'}
                              </p>
                              {booking.catatan_reschedule && (
                                <p className="text-slate-500 flex items-start mt-1">
                                  <MessageSquare className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                  "{booking.catatan_reschedule}"
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleAcceptReschedule(booking.id)}
                                className="px-3 py-1 bg-[#1E3A8A] text-white text-xs font-medium rounded hover:bg-[#1e3a8ad2] transition-colors"
                              >
                                Terima Reschedule
                              </button>
                              <button 
                                onClick={() => openRescheduleModal(booking.id, booking.tanggal_reschedule)}
                                className="px-3 py-1 bg-white text-slate-700 border border-slate-300 text-xs font-medium rounded hover:bg-slate-50 transition-colors"
                              >
                                Ajukan Waktu Lain
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <KaryawanRescheduleModal 
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        onReschedule={handleDeclineAndReschedule}
        bookingId={selectedBookingForReschedule}
        coachRescheduleDate={coachRescheduleDate}
      />
    </div>
  );
}
