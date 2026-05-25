import { Target, Calendar, Clock, CheckCircle2 } from "lucide-react";

interface ActionPlanItem {
  langkah: string;
  waktu: string;
  output: string;
}

interface CoachingRecordData {
  tanggal_sesi: string;
  tujuan_utama: string;
  action_plan: string | ActionPlanItem[];
}

interface CoachingProgressProps {
  coachingData: CoachingRecordData | null;
}

export default function CoachingProgress({ coachingData }: CoachingProgressProps) {
  if (!coachingData) {
    return (
      <div className="rounded-2xl border border-border-light bg-white p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-[17px] font-bold text-text-primary mb-4">Coaching Progress</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-text-secondary text-sm space-y-3">
          <Target className="h-8 w-8 text-gray-300" />
          <p>Belum ada data coaching tercatat</p>
        </div>
      </div>
    );
  }

  // Handle action_plan parsing safely
  let actionPlans: ActionPlanItem[] = [];
  try {
    if (typeof coachingData.action_plan === 'string') {
      actionPlans = JSON.parse(coachingData.action_plan);
    } else if (Array.isArray(coachingData.action_plan)) {
      actionPlans = coachingData.action_plan;
    }
  } catch (e) {
    console.error("Failed to parse action_plan", e);
  }

  return (
    <div className="rounded-2xl border border-border-light bg-white p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[17px] font-bold text-text-primary">Goal & Action Plan</h3>
          <p className="text-sm text-text-secondary mt-1 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Sesi: {new Date(coachingData.tanggal_sesi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}
          </p>
        </div>
        <div className="rounded-xl bg-blue-50 p-2 border border-blue-100">
          <Target className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      <div className="mb-6">
        <div className="rounded-xl bg-gray-50 border border-border-light p-4">
          <div className="text-xs text-text-secondary mb-1 uppercase tracking-wider font-bold">Tujuan Utama</div>
          <p className="text-text-primary font-medium leading-relaxed">{coachingData.tujuan_utama}</p>
        </div>
      </div>

      <div className="flex-1">
        <h4 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Daftar Rencana Aksi ({actionPlans.length})
        </h4>
        
        {actionPlans.length > 0 ? (
          <div className="space-y-4">
            {actionPlans.map((plan, index) => (
              <div key={index} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-4 before:w-px before:bg-gray-200 last:before:hidden">
                <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-white bg-[#5d51c7] shadow-sm"></div>
                <div className="rounded-xl border border-border-light bg-white p-3 hover:bg-gray-50 transition-colors shadow-sm">
                  <div className="font-semibold text-text-primary text-sm mb-1">{plan.langkah}</div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {plan.waktu}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" /> {plan.output}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-text-secondary italic px-2">Tidak ada action plan yang terdaftar.</div>
        )}
      </div>
    </div>
  );
}
