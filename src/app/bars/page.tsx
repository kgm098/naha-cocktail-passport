"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BARS } from "@/lib/bars";
import BarCard from "@/components/BarCard";
import { getStoredParticipantId } from "@/lib/participant";
import { Stamp, BarSlug } from "@/types";
import { ArrowLeft } from "lucide-react";

export default function BarsPage() {
  const [obtainedSlugs, setObtainedSlugs] = useState<Set<BarSlug>>(new Set());

  useEffect(() => {
    const id = getStoredParticipantId();
    if (!id) return;
    fetch(`/api/stamps?participantId=${id}`)
      .then((r) => r.json())
      .then((data: Stamp[]) => setObtainedSlugs(new Set(data.map((s) => s.barSlug))));
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] max-w-md mx-auto">
      <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-10 px-4 py-4 flex items-center gap-4 border-b border-[#161616]">
        <Link href="/" className="text-[#555] hover:text-gold-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="text-[9px] tracking-[0.3em] text-gold-700 uppercase">
            NAHA COCKTAIL PASSPORT
          </div>
          <h1 className="text-sm font-serif text-[#d0c8bc]">参加店舗一覧</h1>
        </div>
      </div>

      <div className="px-4 py-6 grid grid-cols-1 gap-4">
        {BARS.map((bar) => (
          <BarCard
            key={bar.slug}
            bar={bar}
            hasStamp={obtainedSlugs.has(bar.slug as BarSlug)}
          />
        ))}
      </div>

      <div className="pb-16" />
    </main>
  );
}
