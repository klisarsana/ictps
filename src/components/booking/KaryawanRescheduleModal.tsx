"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";

const rescheduleSchema = z.object({
  tanggal_usulan: z.string().min(1, "Tanggal usulan baru wajib diisi"),
});

type RescheduleFormValues = z.infer<typeof rescheduleSchema>;

interface KaryawanRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (newDate: string) => Promise<void>;
  bookingId: string | null;
  coachRescheduleDate?: Date | null;
}

export default function KaryawanRescheduleModal({ 
  isOpen, 
  onClose, 
  onReschedule, 
  bookingId, 
  coachRescheduleDate 
}: KaryawanRescheduleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RescheduleFormValues>({
    resolver: zodResolver(rescheduleSchema),
  });

  if (!isOpen || !bookingId) return null;

  const onSubmit = async (data: RescheduleFormValues) => {
    setIsSubmitting(true);
    await onReschedule(data.tanggal_usulan);
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
        
        <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Ajukan Waktu Lain</h2>
        
        {coachRescheduleDate && (
          <div className="mb-4 flex items-center p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-200">
            <CalendarIcon className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
            <span>
              Usulan Coach saat ini: <strong>{coachRescheduleDate.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</strong>
            </span>
          </div>
        )}

        <p className="text-sm text-slate-600 mb-6">
          Jika usulan jadwal dari Coach tidak sesuai, Anda bisa mengajukan tanggal alternatif lain di sini. Status jadwal akan kembali menjadi "Menunggu" konfirmasi Coach.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Tanggal & Waktu Alternatif</label>
            <input 
              type="datetime-local" 
              {...register("tanggal_usulan")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-shadow text-slate-800"
            />
            {errors.tanggal_usulan && <p className="text-red-500 text-xs mt-1">{errors.tanggal_usulan.message}</p>}
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
              {isSubmitting ? "Mengajukan..." : "Ajukan Ulang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
