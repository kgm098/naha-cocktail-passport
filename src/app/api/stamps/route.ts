import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { isValidBarSlug } from "@/lib/bars";
import { BarSlug } from "@/types";

export async function GET(request: NextRequest) {
  const participantId = request.nextUrl.searchParams.get("participantId");
  if (!participantId) {
    return NextResponse.json({ error: "Missing participantId" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("stamps")
    .select("*")
    .eq("participant_id", participantId)
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch stamps" }, { status: 500 });
  }

  return NextResponse.json(
    (data ?? []).map((s) => ({
      id: s.id,
      participantId: s.participant_id,
      barSlug: s.bar_slug,
      obtainedAt: s.obtained_at,
      orderIndex: s.order_index,
    }))
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantId, barSlug } = body as {
      participantId: string;
      barSlug: BarSlug;
    };

    if (!participantId || !barSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isValidBarSlug(barSlug)) {
      return NextResponse.json({ error: "Invalid barSlug" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Duplicate check
    const { data: duplicateCheck } = await supabase
      .from("stamps")
      .select("id")
      .eq("participant_id", participantId)
      .eq("bar_slug", barSlug)
      .maybeSingle();

    if (duplicateCheck) {
      return NextResponse.json(
        { success: false, message: "このバーのスタンプはすでに取得済みです" },
        { status: 200 }
      );
    }

    // Count existing stamps to determine order
    const { count: currentCount } = await supabase
      .from("stamps")
      .select("id", { count: "exact", head: true })
      .eq("participant_id", participantId);

    const orderIndex = (currentCount ?? 0) + 1;

    const { data: stamp, error: stampError } = await supabase
      .from("stamps")
      .insert({
        participant_id: participantId,
        bar_slug: barSlug,
        order_index: orderIndex,
      })
      .select()
      .single();

    if (stampError) throw stampError;

    const totalStamps = orderIndex;
    const isComplete = totalStamps >= 6;
    let achievementCode: string | undefined;

    if (isComplete) {
      // Check if complete record already exists
      const { data: existingComplete } = await supabase
        .from("complete_records")
        .select("achievement_code")
        .eq("participant_id", participantId)
        .maybeSingle();

      if (!existingComplete) {
        const { count: completeCount } = await supabase
          .from("complete_records")
          .select("id", { count: "exact", head: true });
        achievementCode = `NCP-2026-${String((completeCount ?? 0) + 1).padStart(3, "0")}`;
        await supabase.from("complete_records").insert({
          participant_id: participantId,
          achievement_code: achievementCode,
        });
      } else {
        achievementCode = existingComplete.achievement_code;
      }
    }

    return NextResponse.json({
      success: true,
      message: "スタンプを獲得しました！",
      stamp: {
        id: stamp.id,
        participantId: stamp.participant_id,
        barSlug: stamp.bar_slug,
        obtainedAt: stamp.obtained_at,
        orderIndex: stamp.order_index,
      },
      totalStamps,
      isComplete,
      achievementCode,
    });
  } catch (err) {
    console.error("Stamp error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
