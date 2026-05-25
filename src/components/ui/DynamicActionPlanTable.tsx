import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

interface DynamicActionPlanTableProps {
  name: string; // The array name in the form schema
}

export function DynamicActionPlanTable({ name }: DynamicActionPlanTableProps) {
  const { control, register, formState: { errors } } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  const arrayError = errors[name]?.message as string | undefined;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-bold text-text-primary">
          Action Plan (Rencana Aksi)
        </label>
        <button
          type="button"
          onClick={() => append({ langkah: "", waktu: "", output: "" })}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-coach-record bg-coach-record/10 hover:bg-coach-record/20 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Baris
        </button>
      </div>

      {arrayError && typeof arrayError === 'string' && (
        <p className="text-xs text-error-red mb-3">{arrayError}</p>
      )}

      <div className="overflow-x-auto border border-border-light rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-bg border-b border-border-light text-text-secondary">
            <tr>
              <th className="px-4 py-3 font-semibold w-12 text-center">#</th>
              <th className="px-4 py-3 font-semibold w-[40%]">Langkah / Aktivitas</th>
              <th className="px-4 py-3 font-semibold w-[25%]">Waktu Target</th>
              <th className="px-4 py-3 font-semibold w-[35%]">Output / Hasil</th>
              <th className="px-4 py-3 font-semibold w-16 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light bg-white">
            {fields.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                  Belum ada rencana aksi. Klik &quot;Tambah Baris&quot; untuk memulai.
                </td>
              </tr>
            ) : (
              fields.map((field, index) => {
                // Determine errors for this specific row safely without 'any'
                type ActionPlanErrorItem = {
                  langkah?: { message?: string };
                  waktu?: { message?: string };
                  output?: { message?: string };
                };
                const rowErrors = (errors[name] as ActionPlanErrorItem[] | undefined)?.[index];
                
                return (
                  <tr key={field.id} className="group hover:bg-surface-bg/50 transition-colors">
                    <td className="px-4 py-3 text-center text-text-muted font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        {...register(`${name}.${index}.langkah` as const)}
                        placeholder="Deskripsikan langkah..."
                        className={`w-full p-2 bg-transparent border ${rowErrors?.langkah ? 'border-error-red' : 'border-transparent group-hover:border-border-light focus:border-border-light'} rounded focus:outline-none focus:ring-2 focus:ring-brand-navy/10 resize-y min-h-12.5 text-sm`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        {...register(`${name}.${index}.waktu` as const)}
                        placeholder="Bulan/Minggu ke..."
                        className={`w-full p-2 bg-transparent border ${rowErrors?.waktu ? 'border-error-red' : 'border-transparent group-hover:border-border-light focus:border-border-light'} rounded focus:outline-none focus:ring-2 focus:ring-brand-navy/10 text-sm`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        {...register(`${name}.${index}.output` as const)}
                        placeholder="Hasil yang diharapkan..."
                        className={`w-full p-2 bg-transparent border ${rowErrors?.output ? 'border-error-red' : 'border-transparent group-hover:border-border-light focus:border-border-light'} rounded focus:outline-none focus:ring-2 focus:ring-brand-navy/10 resize-y min-h-10 text-sm`}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1.5 text-text-muted hover:text-error-red hover:bg-error-red/10 rounded transition-colors"
                        title="Hapus baris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
