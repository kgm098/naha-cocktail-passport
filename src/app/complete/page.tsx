"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredParticipantId } from "@/lib/participant";

interface CompleteData {
  achievementCode: string;
  completedAt: string;
  rewardClaimed: boolean;
}

export default function CompletePage() {
  const [data, setData] = useState<CompleteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notComplete, setNotComplete] = useState(false);

  useEffect(() => {
    const id = getStoredParticipantId();
    if (!id) {
      setNotComplete(true);
      setLoading(false);
      return;
    }
    fetch(`/api/complete?participantId=${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.complete && res.achievementCode) {
          setData({
            achievementCode: res.achievementCode,
            completedAt: res.completedAt,
            rewardClaimed: res.rewardClaimed,
          });
        } else {
          setNotComplete(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotComplete(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[10px] tracking-widest text-gold-700 animate-pulse uppercase">
          Loading...
        </div>
      </main>
    );
  }

  if (notComplete || !data) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[#555] text-sm mb-6">コンプリート記録が見つかりません</p>
        <Link href="/" className="text-gold-700 text-sm underline">
          パスポートへ戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-10 animate-fade-in">
        <div className="text-[10px] tracking-[0.5em] text-gold-600 uppercase mb-8">
          CONGRATULATIONS
        </div>
        <h1 className="font-serif text-4xl font-bold text-[#f5f0e8] leading-tight mb-3">
          NAHA
          <br />
          <span className="text-gold-400">COCKTAIL</span>
          <br />
          PASSPORT
        </h1>
        <div className="text-[10px] tracking-[0.4em] text-gold-700 uppercase mb-8">
          COMPLETE — 2026 SUMMER
        </div>

        <div className="gold-divider max-w-[80px] mx-auto mb-8" />

        <div className="text-xs text-[#555] mb-3">達成コード</div>
        <div className="font-mono text-gold-400 text-xl tracking-widest border border-gold-800 rounded-xl px-8 py-4 bg-[#0f0c00] inline-block shadow-[0_0_20px_rgba(212,160,23,0.15)]">
          {data.achievementCode}
        </div>

        {data.rewardClaimed && (
          <div className="mt-4 text-xs text-[#444] border border-[#222] rounded-lg px-4 py-2 inline-block">
            景品引換済み
          </div>
        )}

        <p className="text-xs text-[#444] mt-6 leading-relaxed">
          このコードをバーのスタッフにお見せください。
          <br />
          景品（木製コースター）と交換できます。
        </p>
      </div>

      <Link
        href="/"
        className="px-8 py-3 border border-[#333] rounded-xl text-sm text-[#888]"
      >
        パスポートへ戻る
      </Link>
    </main>
  );
}
