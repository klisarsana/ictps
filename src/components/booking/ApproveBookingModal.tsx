"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { X } from "lucide-react";

const approveSchema = z.object({
  teams_link: z.string().url("Link harus berupa URL yang valid").min(1, "Link MS Teams wajib diisi"),
});

type ApproveFormValues = z.infer<typeof approveSchema>;

interface ApproveBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (teamsLink: string) => Promise<void>;
  bookingId: string | null;
}

export default function ApproveBookingModal({ isOpen, onClose, onApprove, bookingId }: ApproveBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ApproveFormValues>({
    resolver: zodResolver(approveSchema),
  });

  if (!isOpen || !bookingId) return null;

  const onSubmit = async (data: ApproveFormValues) => {
    setIsSubmitting(true);
    await onApprove(data.teams_link);
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
        
        <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Setujui Jadwal</h2>
        <p className="text-sm text-slate-600 mb-6">
          Masukkan link MS Teams untuk jadwal coaching ini. Karyawan akan menggunakan link ini untuk bergabung ke sesi.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {isSubmitting ? "Menyimpan..." : "Setujui Jadwal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
