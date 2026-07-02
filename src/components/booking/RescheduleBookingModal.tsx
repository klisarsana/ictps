"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";

const rescheduleSchema = z.object({
  tanggal_reschedule: z.string().min(1, "Tanggal usulan baru wajib diisi"),
  catatan_reschedule: z.string().min(1, "Catatan wajib diisi agar karyawan memahami alasan reschedule"),
  teams_link: z.string().url("Format link tidak valid (harus dimulai dengan https://)").min(1, "Link MS Teams wajib diisi"),
});

type RescheduleFormValues = z.infer<typeof rescheduleSchema>;

interface RescheduleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (newDate: string, note: string, teamsLink: string) => Promise<void>;
  bookingId: string | null;
  currentUsulanDate?: Date;
}

export default function RescheduleBookingModal({ isOpen, onClose, onReschedule, bookingId, currentUsulanDate }: RescheduleBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RescheduleFormValues>({
    resolver: zodResolver(rescheduleSchema),
  });

  if (!isOpen || !bookingId) return null;

  const onSubmit = async (data: RescheduleFormValues) => {
    setIsSubmitting(true);
    await onReschedule(data.tanggal_reschedule, data.catatan_reschedule, data.teams_link);
    setIsSubmitting(false);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Reschedule Jadwal</h2>
        
        {currentUsulanDate && (
          <div className="mb-4 flex items-center p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200">
            <CalendarIcon className="w-4 h-4 mr-2 text-amber-600 shrink-0" />
            <span>
              Tanggal usulan karyawan saat ini: <strong>{currentUsulanDate.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</strong>
            </span>
          </div>
        )}

        <p className="text-sm text-slate-600 mb-6">
          Berikan tanggal usulan baru beserta catatan untuk karyawan. Karyawan harus menyetujui usulan ini.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal & Waktu Baru</label>
            <input 
              type="datetime-local" 
              {...register("tanggal_reschedule")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-shadow text-slate-800"
            />
            {errors.tanggal_reschedule && <p className="text-red-500 text-xs mt-1">{errors.tanggal_reschedule.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Reschedule</label>
            <textarea 
              rows={3}
              placeholder="Mohon maaf, saya ada rapat mendadak..."
              {...register("catatan_reschedule")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-shadow text-slate-800"
            />
            {errors.catatan_reschedule && <p className="text-red-500 text-xs mt-1">{errors.catatan_reschedule.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link MS Teams</label>
            <input 
              type="url"
              placeholder="https://teams.microsoft.com/l/meetup-join/..."
              {...register("teams_link")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-shadow text-slate-800"
            />
            {errors.teams_link && <p className="text-red-500 text-xs mt-1">{errors.teams_link.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#1e3a8ad2] rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Usulan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
