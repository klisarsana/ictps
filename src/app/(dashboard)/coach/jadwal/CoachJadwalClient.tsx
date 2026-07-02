"use client";

import { useState } from "react";
import { BookingCoaching } from "@/types/auth";
import { approveBookingAction, rescheduleBookingAction } from "@/app/actions/booking";
import ApproveBookingModal from "@/components/booking/ApproveBookingModal";
import RescheduleBookingModal from "@/components/booking/RescheduleBookingModal";
import { CheckCircle, Clock, Calendar, Check, Video, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type BookingWithKaryawanName = BookingCoaching & { karyawan_name: string };

interface CoachJadwalClientProps {
  initialBookings: BookingWithKaryawanName[];
}

type TabType = 'Menunggu' | 'Reschedule';

export default function CoachJadwalClient({ initialBookings }: CoachJadwalClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('Menunggu');
  const [approveModalOpen, setApproveModalOpen] = useState<boolean>(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithKaryawanName | null>(null);

  const handleOpenApprove = (booking: BookingWithKaryawanName) => {
    setSelectedBooking(booking);
    setApproveModalOpen(true);
  };

  const handleOpenReschedule = (booking: BookingWithKaryawanName) => {
    setSelectedBooking(booking);
    setRescheduleModalOpen(true);
  };

  const handleApprove = async (teamsLink: string): Promise<void> => {
    if (!selectedBooking) return;
    const result = await approveBookingAction(selectedBooking.id, teamsLink);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  };

  const handleReschedule = async (newDate: string, note: string, teamsLink: string): Promise<void> => {
    if (!selectedBooking) return;
    const result = await rescheduleBookingAction(selectedBooking.id, newDate, note, teamsLink);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  };

  const filteredBookings = initialBookings.filter((b) => b.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1" /> Menunggu</span>;
      case "Disetujui":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1" /> Disetujui</span>;
      case "Reschedule":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Calendar className="w-3 h-3 mr-1" /> Menunggu Konfirmasi</span>;
      case "Selesai":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><CheckCircle className="w-3 h-3 mr-1" /> Selesai</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setActiveTab('Menunggu')}
          className={`flex-1 py-4 px-4 text-sm font-medium text-center transition-colors border-b-2 ${
            activeTab === 'Menunggu' ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          Permintaan Masuk
        </button>
        <button
          onClick={() => setActiveTab('Reschedule')}
          className={`flex-1 py-4 px-4 text-sm font-medium text-center transition-colors border-b-2 ${
            activeTab === 'Reschedule' ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          Menunggu Konfirmasi Karyawan
        </button>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 rounded-t-lg">
              <tr>
                <th className="px-6 py-4 font-medium rounded-tl-lg">Karyawan</th>
                <th className="px-6 py-4 font-medium">Tanggal Usulan</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium rounded-tr-lg text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Tidak ada jadwal untuk status ini.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{booking.karyawan_name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(booking.tanggal_usulan).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {activeTab === "Menunggu" && (
                          <>
                            <button
                              onClick={() => handleOpenApprove(booking)}
                              className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" /> Terima
                            </button>
                            <button
                              onClick={() => handleOpenReschedule(booking)}
                              className="inline-flex items-center px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-100 border border-amber-200 transition-colors"
                            >
                              <Calendar className="w-3.5 h-3.5 mr-1" /> Reschedule
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ApproveBookingModal
        isOpen={approveModalOpen}
        onClose={() => { setApproveModalOpen(false); setSelectedBooking(null); }}
        onApprove={handleApprove}
        bookingId={selectedBooking?.id ?? null}
      />

      <RescheduleBookingModal
        isOpen={rescheduleModalOpen}
        onClose={() => { setRescheduleModalOpen(false); setSelectedBooking(null); }}
        onReschedule={handleReschedule}
        bookingId={selectedBooking?.id ?? null}
        currentUsulanDate={selectedBooking?.tanggal_usulan ? new Date(selectedBooking.tanggal_usulan) : undefined}
      />
    </div>
  );
}
