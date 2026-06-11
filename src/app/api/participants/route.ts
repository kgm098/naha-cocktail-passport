import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generateParticipantCode } from "@/lib/participant-shared";

export async function POST() {
  try {
    const supabase = createServiceClient();
    const participantCode = generateParticipantCode();

    const { data, error } = await supabase
      .from("participants")
      .insert({ participant_code: participantCode })
      .select("id, participant_code, created_at")
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      participantCode: data.participant_code,
    });
  } catch (err) {
    console.error("Failed to create participant:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
