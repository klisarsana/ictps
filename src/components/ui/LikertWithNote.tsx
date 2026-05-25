import React from "react";
import { useFormContext } from "react-hook-form";

interface LikertWithNoteProps {
  label: string;
  description?: string;
  scaleName: string;
  noteName: string;
}

export function LikertWithNote({ label, description, scaleName, noteName }: LikertWithNoteProps) {
  const { register, formState: { errors } } = useFormContext();

  const scaleError = errors[scaleName]?.message as string | undefined;
  const noteError = errors[noteName]?.message as string | undefined;

  return (
    <div className="bg-surface-bg border border-border-light rounded-xl p-5 md:p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-text-primary mb-1">{label}</h3>
        {description && <p className="text-sm text-text-secondary">{description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Likert Scale (1-5) */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
            Penilaian Skala (1-5)
          </label>
          <div className="flex items-center gap-2 sm:gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <label 
                key={num} 
                className="relative flex flex-col items-center gap-2 cursor-pointer group"
              >
                <input 
                  type="radio" 
                  value={num} 
                  {...register(scaleName)}
                  className="peer sr-only" 
                />
                <div className="w-10 h-10 rounded-full border-2 border-border-light flex items-center justify-center text-text-secondary font-medium transition-all peer-checked:border-brand-navy peer-checked:bg-brand-navy peer-checked:text-white group-hover:border-brand-navy/50">
                  {num}
                </div>
              </label>
            ))}
          </div>
          {scaleError && <p className="text-xs text-error-red mt-2">{scaleError}</p>}
        </div>

        {/* Note / Textarea */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
            Catatan / Penjelasan
          </label>
          <textarea
            {...register(noteName)}
            placeholder="Berikan penjelasan atau bukti pendukung..."
            className={`w-full p-3 bg-white border ${noteError ? 'border-error-red focus:border-error-red focus:ring-error-red/20' : 'border-border-light focus:border-brand-navy focus:ring-brand-navy/20'} rounded-lg text-sm text-text-primary resize-y min-h-20 focus:outline-none focus:ring-4 transition-all`}
          />
          {noteError && <p className="text-xs text-error-red mt-2">{noteError}</p>}
        </div>
      </div>
    </div>
  );
}
