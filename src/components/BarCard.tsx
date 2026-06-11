import Link from "next/link";
import { Bar } from "@/types";
import { MapPin, ArrowRight } from "lucide-react";

interface BarCardProps {
  bar: Bar;
  hasStamp: boolean;
}

export default function BarCard({ bar, hasStamp }: BarCardProps) {
  return (
    <Link href={`/bars/${bar.slug}`}>
      <div
        className={`
          relative rounded-xl overflow-hidden border transition-all duration-300 active:scale-[0.98]
          ${hasStamp
            ? "border-gold-700 bg-gradient-to-br from-[#1a1400] to-[#141414]"
            : "border-[#222] bg-[#111]"
          }
        `}
      >
        {/* Placeholder image area */}
        <div className="h-40 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center relative">
          <div className="text-[#2a2a2a] text-5xl font-serif font-bold">
            {bar.shortName[0]}
          </div>
          {hasStamp && (
            <div className="absolute top-3 right-3 bg-gold-700 text-[#0a0a0a] text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
              STAMP ✓
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-serif font-bold text-base ${hasStamp ? "text-gold-300" : "text-[#e0d8cc]"}`}>
                {bar.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={11} className="text-[#555]" />
                <span className="text-[11px] text-[#555]">{bar.area}</span>
              </div>
            </div>
            <ArrowRight size={16} className="text-[#333] mt-1 flex-shrink-0" />
          </div>
        </div>
      </div>
    </Link>
  );
}
