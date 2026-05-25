import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DevelopmentGapProps {
  avgPotensi: number;
  avgTantangan: number;
}

export default function DevelopmentGap({ avgPotensi, avgTantangan }: DevelopmentGapProps) {
  // We need data to calculate gap
  if (avgPotensi === 0 && avgTantangan === 0) {
    return (
      <div className="rounded-2xl border border-border-light bg-white p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-[17px] font-bold text-text-primary mb-4">Development Gap</h3>
        <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
          Belum ada data pemetaan
        </div>
      </div>
    );
  }

  // Calculate gap (ideal gap is positive and large, meaning Potensi > Tantangan)
  const gap = avgPotensi - avgTantangan;
  const absGap = Math.abs(gap).toFixed(1);
  
  let GapIcon = Minus;
  let gapColor = "text-text-secondary";
  let gapMessage = "Potensi seimbang dengan Tantangan";
  
  if (gap > 0.5) {
    GapIcon = TrendingUp;
    gapColor = "text-green-600";
    gapMessage = "Kapasitas potensi melebihi hambatan";
  } else if (gap < -0.5) {
    GapIcon = TrendingDown;
    gapColor = "text-rose-600";
    gapMessage = "Hambatan lebih mendominasi";
  }

  // Calculate percentage for progress bars (0-5 scale)
  const potensiPct = (avgPotensi / 5) * 100;
  const tantanganPct = (avgTantangan / 5) * 100;

  return (
    <div className="rounded-2xl border border-border-light bg-white p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[17px] font-bold text-text-primary">Development Gap</h3>
        <div className={`flex items-center gap-1 text-sm font-semibold ${gapColor} bg-gray-50 px-3 py-1 rounded-lg border border-border-light`}>
          <GapIcon className="h-4 w-4" />
          <span>{gap > 0 ? "+" : gap < 0 ? "-" : ""}{absGap} Gap</span>
        </div>
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {/* Potensi Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700 font-semibold">Potensi</span>
            <span className="text-text-primary font-medium">{avgPotensi.toFixed(1)} / 5.0</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${potensiPct}%` }}
            />
          </div>
        </div>

        {/* Tantangan Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-rose-600 font-semibold">Tantangan</span>
            <span className="text-text-primary font-medium">{avgTantangan.toFixed(1)} / 5.0</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${tantanganPct}%` }}
            />
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-gray-50 p-3 text-center border border-border-light">
          <p className="text-sm text-text-secondary font-medium">{gapMessage}</p>
        </div>
      </div>
    </div>
  );
}
