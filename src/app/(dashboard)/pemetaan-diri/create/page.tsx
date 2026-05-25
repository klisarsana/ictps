import React from "react";
import { PemetaanDiriForm } from "@/components/forms/PemetaanDiriForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Buat Pemetaan Diri | ICTPS",
  description: "Formulir untuk membuat pemetaan diri baru",
};

export default function PemetaanDiriCreatePage() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-navy transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            Buat Pemetaan Diri
          </h1>
          <p className="text-text-secondary mt-1">
            Isi formulir berikut untuk memetakan kekuatan, potensi, dan kondisi Anda saat ini.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="animate-fade-in-up">
        <PemetaanDiriForm />
      </div>
    </div>
  );
}
