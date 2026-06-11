"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ensureParticipant } from "@/lib/participant";
import { getBar, isValidBarSlug } from "@/lib/bars";
import { StampResult } from "@/types";
import Link from "next/link";

type Phase = "loading" | "acquiring" | "success" | "duplicate" | "complete" | "error" | "invalid";

export default function StampPage() {
  const params = useParams();
  const barSlug = params.barSlug as string;
  const [phase, setPhase] = useState<Phase>("loading");
  const [result, setResult] = useState<StampResult | null>(null);
  const bar = getBar(barSlug);

  useEffect(() => {
    if (!isValidBarSlug(barSlug)) {
      setPhase("invalid");
      return;
    }

    async function acquire() {
      try {
        setPhase("acquiring");
        const participantId = await ensureParticipant();

        const res = await fetch("/api/stamps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantId, barSlug }),
        });

        const data: StampResult = await res.json();
        setResult(data);

        if (!data.success) {
          setPhase("duplicate");
        } else if (data.isComplete) {
          setPhase("complete");
        } else {
          setPhase("success");
        }
      } catch {
        setPhase("error");
      }
    }

    // Small delay so the animation feels intentional
    setTimeout(acquire, 600);
  }, [barSlug]);

  if (phase === "invalid" || !bar) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <p className="text-[#666] mb-8">無効なQRコードです</p>
        <Link href="/" className="text-gold-600 text-sm underline">トップへ戻る</Link>
      </main>
    );
  }

  if (phase === "loading" || phase === "acquiring") {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
        <div className="text-[10px] tracking-[0.4em] text-gold-700 uppercase animate-pulse">
          ACQUIRING STAMP...
        </div>
      </main>
    );
  }

  if (phase === "duplicate") {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-6">✓</div>
        <div className="text-[10px] tracking-[0.4em] text-gold-700 uppercase mb-3">ALREADY STAMPED</div>
        <h2 className="font-serif text-xl text-[#d0c8bc] mb-2">{bar.name}</h2>
        <p className="text-sm text-[#555] mb-10">このバーのスタンプはすでに取得済みです</p>
        <Link
          href="/"
          className="px-8 py-3 border border-[#333] rounded-xl text-sm text-[#888]"
        >
          パスポートを見る
        </Link>
      </main>
    );
  }

  if (phase === "complete") {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 animate-stamp-appear">
          <div className="text-[10px] tracking-[0.5em] text-gold-600 uppercase mb-6">
            CONGRATULATIONS
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#f5f0e8] leading-tight mb-2">
            NAHA COCKTAIL<br />
            <span className="text-gold-400">PASSPORT</span>
          </h1>
          <div className="text-[10px] tracking-[0.4em] text-gold-700 uppercase mt-2 mb-6">
            COMPLETE — 2026 SUMMER
          </div>
          <div className="gold-divider max-w-[100px] mx-auto mb-6" />
          <div className="text-xs text-[#555] mb-2">達成コード</div>
          <div className="font-mono text-gold-400 text-lg tracking-widest border border-gold-800 rounded-lg px-6 py-3 bg-[#0f0c00]">
            {result?.achievementCode}
          </div>
        </div>
        <p className="text-xs text-[#444] mb-10 leading-relaxed">
          このコードをバーのスタッフにお見せください。<br />
          景品（木製コースター）と交換できます。
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-gradient-to-r from-gold-700 to-gold-500 rounded-xl text-sm font-bold text-[#0a0a0a]"
        >
          パスポートを見る
        </Link>
      </main>
    );
  }

  if (phase === "error") {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[#666] mb-8">エラーが発生しました。もう一度お試しください。</p>
        <Link href="/" className="text-gold-600 text-sm underline">トップへ戻る</Link>
      </main>
    );
  }

  // success
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
      <div className="animate-stamp-appear">
        <div className="text-[10px] tracking-[0.5em] text-gold-700 uppercase mb-6">
          STAMP ACQUIRED
        </div>

        <div className="w-36 h-36 mx-auto rounded-full border-2 border-gold-600 bg-gradient-to-br from-[#1a1400] to-[#0f0f0f] flex flex-col items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,160,23,0.25)]">
          <div className="text-[9px] tracking-widest text-gold-700 uppercase">BAR</div>
          <div className="font-serif font-bold text-gold-300 text-lg">{bar.shortName}</div>
          <div className="text-[8px] tracking-widest text-gold-800 uppercase mt-1">NAHA</div>
        </div>

        <h2 className="font-serif text-xl text-[#d0c8bc] mb-1">{bar.name}</h2>
        <div className="text-xs text-[#555] mb-8">
          {result?.totalStamps} / 6 COMPLETE
        </div>
      </div>

      <Link
        href="/"
        className="px-8 py-3 bg-gradient-to-r from-gold-700 to-gold-500 rounded-xl text-sm font-bold text-[#0a0a0a]"
      >
        パスポートを見る
      </Link>
    </main>
  );
}
