import { User, Target, Brain, AlertCircle, CheckCircle, HelpCircle, AlertTriangle } from "lucide-react";

interface TalentSnapshotProps {
  avgPotensi: number;
  avgTantangan: number;
  avgMental: number;
  talentStatus: string;
}

export default function TalentSnapshot({
  avgPotensi,
  avgTantangan,
  avgMental,
  talentStatus,
}: TalentSnapshotProps) {
  // Determine color and icon based on status
  let StatusIcon = HelpCircle;
  let statusColor = "bg-gray-100 text-gray-700 border-gray-200";
  let displayStatus = talentStatus;

  if (talentStatus === "Ready") {
    StatusIcon = CheckCircle;
    statusColor = "bg-green-50 text-green-700 border-green-200";
    displayStatus = "Ready Talent";
  } else if (talentStatus === "Develop") {
    StatusIcon = AlertCircle;
    statusColor = "bg-amber-50 text-amber-700 border-amber-200";
    displayStatus = "Need Development";
  } else if (talentStatus === "Risk") {
    StatusIcon = AlertTriangle;
    statusColor = "bg-rose-50 text-rose-700 border-rose-200";
    displayStatus = "Risk / Critical";
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border-light bg-white p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center`}>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-50/50 blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-[17px] font-bold text-text-primary">Status Talenta</h3>
            <p className="text-sm text-text-secondary">Berdasarkan hasil pemetaan diri terakhir</p>
          </div>
          
          <div className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 ${statusColor}`}>
            <StatusIcon className="h-5 w-5" />
            <span className="font-semibold">{displayStatus}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 md:justify-end">
          <ScoreCard 
            icon={<User className="h-5 w-5 text-white" />} 
            iconBg="bg-[#5d51c7]"
            title="Potensi" 
            score={avgPotensi} 
          />
          <ScoreCard 
            icon={<Target className="h-5 w-5 text-white" />} 
            iconBg="bg-rose-500"
            title="Tantangan" 
            score={avgTantangan} 
            isInverse // lower is better
          />
          <ScoreCard 
            icon={<Brain className="h-5 w-5 text-white" />} 
            iconBg="bg-[#5d51c7]"
            title="Mental" 
            score={avgMental} 
          />
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ icon, iconBg, title, score, isInverse = false }: { icon: React.ReactNode, iconBg: string, title: string, score: number, isInverse?: boolean }) {
  // Determine formatting color
  let scoreColor = "text-text-primary";
  if (score > 0) {
    if (isInverse) {
      scoreColor = score >= 3.5 ? "text-rose-600" : "text-green-600";
    } else {
      scoreColor = score >= 4.0 ? "text-green-600" : score >= 3.0 ? "text-blue-600" : "text-amber-600";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border-light bg-gray-50/50 p-4 min-w-25">
      <div className={`mb-2 rounded-lg ${iconBg} p-2 shadow-sm flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-xs font-semibold text-text-secondary mb-1">{title}</div>
      <div className={`text-xl font-bold ${scoreColor}`}>
        {score > 0 ? score.toFixed(1) : "-"}
      </div>
    </div>
  );
}
