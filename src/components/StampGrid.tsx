"use client";

import { BARS } from "@/lib/bars";
import { BarSlug, Stamp } from "@/types";
import { CheckCircle } from "lucide-react";

interface StampGridProps {
  stamps: Stamp[];
  size?: "sm" | "lg";
}

export default function StampGrid({ stamps, size = "lg" }: StampGridProps) {
  const obtained = new Set(stamps.map((s) => s.barSlug));

  return (
    <div className={`grid grid-cols-3 gap-3 ${size === "sm" ? "max-w-xs" : "max-w-sm"} mx-auto`}>
      {BARS.map((bar) => {
        const hasStamp = obtained.has(bar.slug as BarSlug);
        return (
          <div
            key={bar.slug}
            className={`
              relative flex flex-col items-center justify-center rounded-lg p-3 aspect-square
              transition-all duration-300
              ${hasStamp
                ? "border border-gold-600 bg-gradient-to-br from-[#1a1400] to-[#2a2000] shadow-[0_0_12px_rgba(212,160,23,0.3)]"
                : "border border-[#2a2a2a] bg-[#111111]"
              }
            `}
          >
            {hasStamp ? (
              <>
                <div className="absolute top-1 right-1">
                  <CheckCircle size={12} className="text-gold-500" />
                </div>
                <div className="text-gold-400 font-bold text-center leading-tight">
                  <div className="text-[10px] tracking-wider uppercase mb-1">BAR</div>
                  <div className="text-xs font-serif">{bar.shortName}</div>
                </div>
                <div className="mt-1 w-6 h-[1px] bg-gold-600 opacity-60" />
              </>
            ) : (
              <div className="text-[#333] font-bold text-center leading-tight">
                <div className="text-[10px] tracking-wider uppercase mb-1">BAR</div>
                <div className="text-xs">{bar.shortName}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
