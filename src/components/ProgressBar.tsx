"use client";

interface ProgressBarProps {
  count: number;
  total: number;
}

export default function ProgressBar({ count, total }: ProgressBarProps) {
  const pct = Math.round((count / total) * 100);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-gold-400 font-serif text-2xl font-bold">{count}</span>
        <span className="text-[#555] text-sm">/ {total} COMPLETE</span>
      </div>
      <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-700 to-gold-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
