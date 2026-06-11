"use client";

export { generateParticipantCode } from "./participant-shared";

const PARTICIPANT_ID_KEY = "ncp_participant_id";

export function getStoredParticipantId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PARTICIPANT_ID_KEY);
}

export function storeParticipantId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PARTICIPANT_ID_KEY, id);
}

export async function ensureParticipant(): Promise<string> {
  const stored = getStoredParticipantId();
  if (stored) return stored;

  const res = await fetch("/api/participants", { method: "POST" });
  if (!res.ok) throw new Error("Failed to create participant");
  const data = await res.json();
  storeParticipantId(data.id);
  return data.id;
}
