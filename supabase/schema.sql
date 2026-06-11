-- NAHA COCKTAIL PASSPORT Vol.1 — Supabase Schema

-- 参加者テーブル
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- スタンプテーブル
CREATE TABLE stamps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  bar_slug TEXT NOT NULL CHECK (bar_slug IN ('sou', 'daisy', 'stir', 'hammock', 'fortuna', 'whisky-japan')),
  obtained_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_index INTEGER NOT NULL,
  UNIQUE (participant_id, bar_slug)
);

-- コンプリート記録テーブル
CREATE TABLE complete_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  achievement_code TEXT NOT NULL UNIQUE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reward_claimed BOOLEAN NOT NULL DEFAULT false,
  reward_claimed_at TIMESTAMPTZ,
  UNIQUE (participant_id)
);

-- インデックス
CREATE INDEX idx_stamps_participant_id ON stamps(participant_id);
CREATE INDEX idx_stamps_bar_slug ON stamps(bar_slug);
CREATE INDEX idx_stamps_obtained_at ON stamps(obtained_at);
CREATE INDEX idx_complete_records_participant_id ON complete_records(participant_id);

-- RLS: 全テーブルを有効化（Service Role Keyのみでアクセス）
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE complete_records ENABLE ROW LEVEL SECURITY;

-- Anon ユーザーにはアクセス不可（APIはService Role Keyを使用）
-- Service Role Keyはすべてのポリシーを bypass するため追加設定不要
