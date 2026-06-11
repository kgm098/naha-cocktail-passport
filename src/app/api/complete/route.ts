import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const participantId = request.nextUrl.searchParams.get("participantId");
  if (!participantId) {
    return NextResponse.json({ error: "Missing participantId" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("complete_records")
    .select("achievement_code, completed_at, reward_claimed")
    .eq("participant_id", participantId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Failed to fetch complete record" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ complete: false });
  }

  return NextResponse.json({
    complete: true,
    achievementCode: data.achievement_code,
    completedAt: data.completed_at,
    rewardClaimed: data.reward_claimed,
  });
}
