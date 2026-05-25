import { CoachingForm } from "@/components/forms/CoachingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coaching Record | ICTPS",
  description: "Isi form Coaching Record untuk mendokumentasikan sesi pengembangan talenta Anda.",
};

export default function CoachingCreatePage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <CoachingForm />
    </div>
  );
}
