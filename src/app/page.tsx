"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PassportHeader from "@/components/PassportHeader";
import StampGrid from "@/components/StampGrid";
import ProgressBar from "@/components/ProgressBar";
import { ensureParticipant } from "@/lib/participant";
import { Stamp } from "@/types";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const id = await ensureParticipant();
        const res = await fetch(`/api/stamps?participantId=${id}`);
        if (res.ok) {
          const data = await res.json();
          setStamps(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] max-w-md mx-auto">
      <PassportHeader />

      <section className="px-6 pb-6">
        {loading ? (
          <div className="text-center py-8 text-[#333]">
            <div className="text-sm tracking-widest animate-pulse">LOADING...</div>
          </div>
        ) : (
          <>
            <ProgressBar count={stamps.length} total={6} />
            <div className="mt-6">
              <StampGrid stamps={stamps} />
            </div>
          </>
        )}
      </section>

      <div className="gold-divider mx-6 my-2" />

      <section className="px-6 py-6">
        <Link
          href="/bars"
          className="flex items-center justify-between w-full py-4 px-5 rounded-xl border border-[#222] bg-[#111] active:bg-[#161616] transition-colors"
        >
          <div>
            <div className="text-[10px] tracking-[0.3em] text-gold-700 uppercase mb-1">
              PARTICIPATING BARS
            </div>
            <div className="text-sm text-[#d0c8bc]">参加店舗一覧</div>
          </div>
          <ChevronRight size={18} className="text-gold-700" />
        </Link>

        {stamps.length > 0 && (
          <div className="mt-4">
            <div className="text-[10px] tracking-[0.3em] text-[#444] uppercase mb-3">
              VISIT HISTORY
            </div>
            <div className="space-y-2">
              {stamps.map((stamp) => (
                <div
                  key={stamp.id}
                  className="flex items-center justify-between py-2 border-b border-[#161616]"
                >
                  <span className="text-sm text-[#888]">
                    {new Date(stamp.obtainedAt).toLocaleDateString("ja-JP", {
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                  <span className="text-sm text-[#c0b8ac] font-serif">
                    Bar {stamp.barSlug}
                  </span>
                  <span className="text-xs text-gold-700">#{stamp.orderIndex}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {stamps.length === 6 && (
        <section className="px-6 pb-10">
          <Link
            href="/complete"
            className="block w-full py-4 rounded-xl bg-gradient-to-r from-gold-700 to-gold-500 text-center font-serif font-bold text-[#0a0a0a] text-base tracking-wider shadow-[0_0_20px_rgba(212,160,23,0.4)] animate-glow-pulse"
          >
            COMPLETE — 景品を受け取る
          </Link>
        </section>
      )}

      <div className="pb-16" />
    </main>
  );
}
