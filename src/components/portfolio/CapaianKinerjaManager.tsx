"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CapaianSchema } from "@/lib/validations/portfolio";
import { addCapaianAction, deleteCapaianAction, updateCapaianAction } from "@/app/actions/portfolio";
import { Trophy, Plus, Trash2, Calendar, Loader2, Award, Edit2 } from "lucide-react";

interface CapaianRecord {
  id: string;
  judul_capaian: string;
  deskripsi: string;
  tanggal_pencapaian: string;
  status: "Dalam Proses" | "Selesai";
  created_at: string;
}

interface CapaianKinerjaManagerProps {
  initialData: CapaianRecord[];
}

export default function CapaianKinerjaManager({ initialData }: CapaianKinerjaManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof CapaianSchema>>({
    resolver: zodResolver(CapaianSchema),
    defaultValues: {
      judul_capaian: "",
      deskripsi: "",
      tanggal_pencapaian: "",
      status: "Dalam Proses",
    },
  });

  async function onSubmit(values: z.infer<typeof CapaianSchema>) {
    setIsSubmitting(true);
    setErrorMsg("");

    const result = editingId 
      ? await updateCapaianAction(editingId, values)
      : await addCapaianAction(values);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      form.reset();
      setShowForm(false);
      setEditingId(null);
    }

    setIsSubmitting(false);
  }

  function handleEdit(item: CapaianRecord) {
    form.setValue("judul_capaian", item.judul_capaian);
    form.setValue("deskripsi", item.deskripsi);
    form.setValue("tanggal_pencapaian", item.tanggal_pencapaian);
    form.setValue("status", item.status);
    setEditingId(item.id);
    setShowForm(true);
  }

  function handleCancelForm() {
    form.reset();
    setEditingId(null);
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus capaian ini?")) return;
    
    setIsDeleting(id);
    await deleteCapaianAction(id);
    setIsDeleting(null);
  }

  return (
    <div className="rounded-2xl border border-border-light bg-white p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-[17px] font-bold text-text-primary flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Capaian Kinerja
          </h3>
          <p className="text-sm text-text-secondary mt-1">Lacak pencapaian dan progres kinerja Anda</p>
        </div>
        
        <button
          onClick={() => showForm ? handleCancelForm() : setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-[#5d51c7] px-4 py-2 text-sm font-medium text-white hover:bg-[#4b40a3] transition-colors shadow-sm"
        >
          {showForm ? "Batal" : <><Plus className="h-4 w-4" /> Tambah Capaian</>}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-border-light bg-gray-50 p-5">
          <h4 className="text-sm font-bold text-text-primary mb-4 border-b border-gray-200 pb-2">
            {editingId ? "Edit Capaian Kinerja" : "Form Tambah Capaian"}
          </h4>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {errorMsg}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Judul Capaian</label>
                <input
                  {...form.register("judul_capaian")}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-text-primary focus:border-[#5d51c7] focus:outline-none focus:ring-1 focus:ring-[#5d51c7]"
                  placeholder="Contoh: Menyelesaikan Proyek X"
                />
                {form.formState.errors.judul_capaian && (
                  <p className="text-xs text-red-500">{form.formState.errors.judul_capaian.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Tanggal Pencapaian</label>
                <input
                  type="date"
                  {...form.register("tanggal_pencapaian")}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-text-primary focus:border-[#5d51c7] focus:outline-none focus:ring-1 focus:ring-[#5d51c7]"
                />
                {form.formState.errors.tanggal_pencapaian && (
                  <p className="text-xs text-red-500">{form.formState.errors.tanggal_pencapaian.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Deskripsi Singkat</label>
              <textarea
                {...form.register("deskripsi")}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-text-primary focus:border-[#5d51c7] focus:outline-none focus:ring-1 focus:ring-[#5d51c7] min-h-20"
                placeholder="Jelaskan secara singkat mengenai capaian ini..."
              />
              {form.formState.errors.deskripsi && (
                <p className="text-xs text-red-500">{form.formState.errors.deskripsi.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Status</label>
              <select
                {...form.register("status")}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-text-primary focus:border-[#5d51c7] focus:outline-none focus:ring-1 focus:ring-[#5d51c7]"
              >
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Selesai">Selesai</option>
              </select>
              {form.formState.errors.status && (
                <p className="text-xs text-red-500">{form.formState.errors.status.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors w-full sm:w-auto shadow-sm"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                ) : editingId ? (
                  "Simpan Perubahan"
                ) : (
                  "Simpan Capaian"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline/List */}
      <div className="space-y-4">
        {initialData.length === 0 ? (
          <div className="text-center py-8 rounded-xl border border-dashed border-gray-300 bg-gray-50/50">
            <Award className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-text-secondary text-sm">Belum ada capaian kinerja yang dicatat.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-2 text-[#5d51c7] text-sm font-medium hover:text-[#4b40a3] transition-colors"
            >
              Mulai catat capaian pertama Anda
            </button>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
            {initialData.map((item) => (
              <div key={item.id} className="relative">
                <div className={`absolute -left-7.75 top-1 h-4 w-4 rounded-full border-2 border-white shadow-sm ${item.status === 'Selesai' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                
                <div className="group rounded-xl border border-border-light bg-white p-4 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-text-primary">{item.judul_capaian}</h5>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-gray-400 hover:text-[#5d51c7] transition-colors p-1 rounded hover:bg-blue-50"
                        title="Edit capaian"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                        className="text-gray-400 hover:text-rose-500 transition-colors p-1 rounded hover:bg-rose-50"
                        title="Hapus capaian"
                      >
                        {isDeleting === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-secondary mb-3">{item.deskripsi}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-gray-500 font-medium">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.tanggal_pencapaian).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'Selesai' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
