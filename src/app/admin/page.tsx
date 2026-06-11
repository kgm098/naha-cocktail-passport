"use client";

import { useState } from "react";

interface AdminData {
  totalParticipants: number;
  totalStamps: number;
  totalCompletes: number;
  barStats: Record<string, number>;
  routes: { route: string; count: number }[];
  affinity: Record<string, Record<string, number>>;
  hourlyStats: Record<number, number>;
  completionFunnel: Record<number, number>;
  completeRecords: {
    id: string;
    achievement_code: string;
    completed_at: string;
    reward_claimed: boolean;
    reward_claimed_at?: string;
  }[];
}

const BAR_LABELS: Record<string, string> = {
  sou: "Bar Sou",
  daisy: "Bar Daisy",
  stir: "Bar Stir Lab",
  hammock: "Bar Hammock",
  fortuna: "BAR FORTUNA",
  "whisky-japan": "Whisky&JAPAN",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (!res.ok) {
        setError("パスワードが違います");
        setLoading(false);
        return;
      }
      const d = await res.json();
      setData(d);
      setAuthed(true);
    } catch {
      setError("エラーが発生しました");
    }
    setLoading(false);
  }

  async function toggleReward(code: string, currentClaimed: boolean) {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ achievementCode: code, claimed: !currentClaimed }),
    });
    // Refresh
    const res = await fetch("/api/admin", {
      headers: { Authorization: `Bearer ${password}` },
    });
    setData(await res.json());
  }

  async function downloadCSV() {
    if (!data) return;
    const rows = [
      ["達成コード", "完了日時", "引換状況", "引換日時"],
      ...data.completeRecords.map((r) => [
        r.achievement_code,
        new Date(r.completed_at).toLocaleString("ja-JP"),
        r.reward_claimed ? "引換済" : "未引換",
        r.reward_claimed_at
          ? new Date(r.reward_claimed_at).toLocaleString("ja-JP")
          : "",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ncp2026_completes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
        <div className="text-[10px] tracking-[0.4em] text-gold-700 uppercase mb-6">
          ADMIN — NAHA COCKTAIL PASSPORT
        </div>
        <div className="w-full max-w-xs space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="管理者パスワード"
            className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#d0c8bc] focus:outline-none focus:border-gold-700"
          />
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            onClick={login}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gold-700 to-gold-500 rounded-xl text-sm font-bold text-[#0a0a0a] disabled:opacity-50"
          >
            {loading ? "..." : "ログイン"}
          </button>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] max-w-2xl mx-auto px-4 py-8">
      <div className="text-[10px] tracking-[0.4em] text-gold-700 uppercase mb-8">
        ADMIN DASHBOARD — NAHA COCKTAIL PASSPORT Vol.1
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "参加者数", value: data.totalParticipants },
          { label: "総スタンプ数", value: data.totalStamps },
          { label: "コンプリート", value: data.totalCompletes },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="border border-[#222] bg-[#111] rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-serif font-bold text-gold-400">{kpi.value}</div>
            <div className="text-[10px] text-[#555] mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Bar stats */}
      <section className="mb-8">
        <h2 className="text-[10px] tracking-[0.3em] text-gold-700 uppercase mb-4">店舗別スタンプ獲得数</h2>
        <div className="space-y-2">
          {Object.entries(data.barStats)
            .sort((a, b) => b[1] - a[1])
            .map(([slug, count]) => {
              const max = Math.max(...Object.values(data.barStats));
              const pct = Math.round((count / max) * 100);
              return (
                <div key={slug} className="flex items-center gap-3">
                  <div className="text-xs text-[#888] w-28 flex-shrink-0">{BAR_LABELS[slug] ?? slug}</div>
                  <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-700 to-gold-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-xs text-gold-600 w-8 text-right">{count}</div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Routes */}
      <section className="mb-8">
        <h2 className="text-[10px] tracking-[0.3em] text-gold-700 uppercase mb-4">回遊ルート分析（上位）</h2>
        <div className="space-y-2">
          {data.routes.slice(0, 10).map(({ route, count }) => (
            <div key={route} className="flex items-center justify-between py-2 border-b border-[#141414]">
              <span className="text-xs text-[#888]">{route}</span>
              <span className="text-xs text-gold-600">{count}回</span>
            </div>
          ))}
        </div>
      </section>

      {/* Completion funnel */}
      <section className="mb-8">
        <h2 className="text-[10px] tracking-[0.3em] text-gold-700 uppercase mb-4">完走率分析</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((n) => {
            const count = data.completionFunnel[n] ?? 0;
            const total = data.completionFunnel[1] ?? 1;
            const pct = Math.round((count / total) * 100);
            return (
              <div key={n} className="flex items-center gap-3">
                <div className="text-xs text-[#666] w-20 flex-shrink-0">{n}店舗達成</div>
                <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-800 to-gold-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-[#666] w-16 text-right">{count}人 ({pct}%)</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hourly */}
      <section className="mb-8">
        <h2 className="text-[10px] tracking-[0.3em] text-gold-700 uppercase mb-4">来店時間帯分析</h2>
        <div className="space-y-2">
          {[
            { label: "18〜20時", hours: [18, 19] },
            { label: "20〜22時", hours: [20, 21] },
            { label: "22〜24時", hours: [22, 23] },
            { label: "24時以降", hours: [0, 1, 2, 3, 4] },
          ].map(({ label, hours }) => {
            const count = hours.reduce((s, h) => s + (data.hourlyStats[h] ?? 0), 0);
            const total = Object.values(data.hourlyStats).reduce((s, v) => s + v, 0) || 1;
            const pct = Math.round((count / total) * 100);
            return (
              <div key={label} className="flex items-center gap-3">
                <div className="text-xs text-[#666] w-20 flex-shrink-0">{label}</div>
                <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-800 to-gold-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-[#666] w-16 text-right">{count}件 ({pct}%)</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Complete records */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] tracking-[0.3em] text-gold-700 uppercase">景品管理</h2>
          <button
            onClick={downloadCSV}
            className="text-[10px] tracking-wider text-gold-700 border border-gold-800 px-3 py-1 rounded-lg hover:bg-[#1a1400] transition-colors"
          >
            CSV出力
          </button>
        </div>
        <div className="space-y-2">
          {data.completeRecords.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between py-3 px-4 border border-[#1a1a1a] rounded-xl bg-[#0f0f0f]"
            >
              <div>
                <div className="font-mono text-sm text-gold-400">{r.achievement_code}</div>
                <div className="text-[10px] text-[#444] mt-0.5">
                  {new Date(r.completed_at).toLocaleDateString("ja-JP")}
                </div>
              </div>
              <button
                onClick={() => toggleReward(r.achievement_code, r.reward_claimed)}
                className={`text-[10px] px-3 py-1.5 rounded-lg border transition-colors ${
                  r.reward_claimed
                    ? "border-[#333] text-[#555] bg-[#111]"
                    : "border-gold-800 text-gold-600 bg-[#1a1400] hover:bg-[#2a2000]"
                }`}
              >
                {r.reward_claimed ? "引換済" : "未引換"}
              </button>
            </div>
          ))}
          {data.completeRecords.length === 0 && (
            <p className="text-xs text-[#444] text-center py-4">まだコンプリート者はいません</p>
          )}
        </div>
      </section>
    </main>
  );
}
