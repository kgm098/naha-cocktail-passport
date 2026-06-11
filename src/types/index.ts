export type BarSlug =
  | "sou"
  | "daisy"
  | "stir"
  | "hammock"
  | "fortuna"
  | "whisky-japan";

export interface Bar {
  slug: BarSlug;
  name: string;
  shortName: string;
  area: string;
  description: string;
  address: string;
  hours: string;
  closedDays: string;
  instagram?: string;
  website?: string;
  googleMapUrl: string;
  cocktails: Cocktail[];
}

export interface Cocktail {
  name: string;
  description: string;
  imageUrl?: string;
}

export interface Participant {
  id: string;
  participantCode: string;
  createdAt: string;
}

export interface Stamp {
  id: string;
  participantId: string;
  barSlug: BarSlug;
  obtainedAt: string;
  orderIndex: number;
}

export interface CompleteRecord {
  id: string;
  participantId: string;
  achievementCode: string;
  completedAt: string;
  rewardClaimed: boolean;
  rewardClaimedAt?: string;
}

export interface StampResult {
  success: boolean;
  message: string;
  stamp?: Stamp;
  totalStamps?: number;
  isComplete?: boolean;
  achievementCode?: string;
}
