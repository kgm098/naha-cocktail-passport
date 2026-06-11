import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const password = authHeader?.replace("Bearer ", "");
  return password === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const [{ data: participants }, { data: stamps }, { data: completes }] =
    await Promise.all([
      supabase.from("participants").select("id, created_at"),
      supabase.from("stamps").select("*").order("obtained_at"),
      supabase.from("complete_records").select("*").order("completed_at"),
    ]);

  // Bar stats
  const barStats: Record<string, number> = {};
  for (const stamp of stamps ?? []) {
    barStats[stamp.bar_slug] = (barStats[stamp.bar_slug] ?? 0) + 1;
  }

  // Group stamps by participant, sorted by order_index
  const participantStamps: Record<string, { barSlug: string; orderIndex: number }[]> = {};
  for (const stamp of stamps ?? []) {
    if (!participantStamps[stamp.participant_id]) {
      participantStamps[stamp.participant_id] = [];
    }
    participantStamps[stamp.participant_id].push({
      barSlug: stamp.bar_slug,
      orderIndex: stamp.order_index,
    });
  }

  // Route (A→B) counts
  const routeCount: Record<string, number> = {};
  for (const pStamps of Object.values(participantStamps)) {
    const sorted = [...pStamps].sort((a, b) => a.orderIndex - b.orderIndex);
    for (let i = 0; i < sorted.length - 1; i++) {
      const key = `${sorted[i].barSlug} → ${sorted[i + 1].barSlug}`;
      routeCount[key] = (routeCount[key] ?? 0) + 1;
    }
  }

  // Bar affinity (given bar X, which bar comes next most often)
  const affinityMap: Record<string, Record<string, number>> = {};
  for (const [key, cnt] of Object.entries(routeCount)) {
    const [from, to] = key.split(" → ");
    if (!affinityMap[from]) affinityMap[from] = {};
    affinityMap[from][to] = cnt;
  }

  // Hourly distribution (JST = UTC+9)
  const hourlyStats: Record<number, number> = {};
  for (const stamp of stamps ?? []) {
    const jstHour = (new Date(stamp.obtained_at).getUTCHours() + 9) % 24;
    hourlyStats[jstHour] = (hourlyStats[jstHour] ?? 0) + 1;
  }

  // Completion funnel: how many participants reached N or more stamps
  const completionFunnel: Record<number, number> = {};
  for (const pStamps of Object.values(participantStamps)) {
    const count = pStamps.length;
    for (let n = 1; n <= count; n++) {
      completionFunnel[n] = (completionFunnel[n] ?? 0) + 1;
    }
  }

  return NextResponse.json({
    totalParticipants: participants?.length ?? 0,
    totalStamps: stamps?.length ?? 0,
    totalCompletes: completes?.length ?? 0,
    barStats,
    routes: Object.entries(routeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([route, count]) => ({ route, count })),
    affinity: affinityMap,
    hourlyStats,
    completionFunnel,
    completeRecords: completes ?? [],
  });
}

export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { achievementCode, claimed } = (await request.json()) as {
    achievementCode: string;
    claimed: boolean;
  };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("complete_records")
    .update({
      reward_claimed: claimed,
      reward_claimed_at: claimed ? new Date().toISOString() : null,
    })
    .eq("achievement_code", achievementCode);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
