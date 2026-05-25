interface ActionPlanItem {
  langkah: string;
  waktu: string;
}

interface CoachingData {
  tujuan_utama?: string;
  action_plan?: ActionPlanItem[];
  catatan_coach?: string;
}

export async function generateCoachingSummary(data: CoachingData): Promise<string> {
  // TODO: Replace with actual OpenAI / Gemini API call
  // This is a mock NLP/LLM response parser for now.

  const tujuan = data.tujuan_utama || "Tidak ada tujuan spesifik yang dicatat.";
  
  const actionPlanSteps = Array.isArray(data.action_plan) 
    ? data.action_plan.map((p: ActionPlanItem, i: number) => `${i + 1}. ${p.langkah} (${p.waktu})`).join(" ")
    : "Tidak ada rencana aksi yang spesifik.";

  const catatan = data.catatan_coach 
    ? `Catatan tambahan dari Coach: ${data.catatan_coach}`
    : "Tidak ada catatan khusus dari Coach.";

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const summary = `Berdasarkan sesi coaching terbaru, tujuan utamanya adalah: "${tujuan}". Untuk mencapai tujuan tersebut, coachee akan melakukan langkah-langkah berikut: ${actionPlanSteps}. ${catatan}`;

  return summary;
}
