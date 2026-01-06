-- オンラインマルチプレイヤー対戦用のテーブル（最終版 - エラーハンドリング付き）

-- ゲームルーム（ロビー）テーブル
CREATE TABLE IF NOT EXISTS game_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT UNIQUE NOT NULL, -- 6文字のルームコード（例：ABC123）
  room_name TEXT, -- ルーム名（オプション）
  host_user_id TEXT NOT NULL, -- ホストのユーザーID（ゲスト可）
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'playing', 'finished', 'cancelled'
  max_players INTEGER NOT NULL DEFAULT 4, -- 最大プレイヤー数
  current_players INTEGER NOT NULL DEFAULT 0, -- 現在のプレイヤー数

  -- ゲーム設定
  game_settings JSONB DEFAULT '{
    "periodDays": 7,
    "periodName": "1週間",
    "includeFreeman": false,
    "startingAirportId": null
  }'::jsonb,

  -- ゲーム開始後のセッションID
  game_session_id UUID REFERENCES game_sessions(id),

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ, -- ゲーム開始時刻
  finished_at TIMESTAMPTZ -- ゲーム終了時刻
);

-- ルームプレイヤーテーブル
CREATE TABLE IF NOT EXISTS room_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- ユーザーID（ゲスト可）

  -- プレイヤー情報
  player_nickname TEXT NOT NULL,
  player_color TEXT NOT NULL, -- '#3b82f6'形式
  player_order INTEGER NOT NULL, -- ターン順（1から開始）

  -- 準備状態
  is_ready BOOLEAN DEFAULT false,
  is_host BOOLEAN DEFAULT false,

  -- 接続状態
  connection_status TEXT DEFAULT 'connected', -- 'connected', 'disconnected'
  last_ping_at TIMESTAMPTZ DEFAULT NOW(),

  -- ゲーム開始後のプレイヤーID
  game_player_id UUID, -- game_playersテーブルへの参照（ゲーム開始後）

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 制約: 同じルームに同じユーザーは1回のみ参加可能
  UNIQUE(room_id, user_id)
);

-- ルームコード生成関数
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- 紛らわしい文字を除外
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_game_rooms_room_code ON game_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON game_rooms(status);
CREATE INDEX IF NOT EXISTS idx_game_rooms_host ON game_rooms(host_user_id);
CREATE INDEX IF NOT EXISTS idx_room_players_room_id ON room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_room_players_user_id ON room_players(user_id);

-- トリガー: updated_atの自動更新（既存の関数を使用）
DROP TRIGGER IF EXISTS update_game_rooms_updated_at ON game_rooms;
CREATE TRIGGER update_game_rooms_updated_at
  BEFORE UPDATE ON game_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_room_players_updated_at ON room_players;
CREATE TRIGGER update_room_players_updated_at
  BEFORE UPDATE ON room_players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- トリガー: current_players の自動更新
CREATE OR REPLACE FUNCTION update_room_player_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE game_rooms
    SET current_players = current_players + 1
    WHERE id = NEW.room_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE game_rooms
    SET current_players = current_players - 1
    WHERE id = OLD.room_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS room_player_count_trigger ON room_players;
CREATE TRIGGER room_player_count_trigger
  AFTER INSERT OR DELETE ON room_players
  FOR EACH ROW
  EXECUTE FUNCTION update_room_player_count();

-- RLS (Row Level Security) ポリシー
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除してから作成
DROP POLICY IF EXISTS "Anyone can view rooms" ON game_rooms;
DROP POLICY IF EXISTS "Host can update room" ON game_rooms;
DROP POLICY IF EXISTS "Anyone can create room" ON game_rooms;
DROP POLICY IF EXISTS "Host can delete room" ON game_rooms;
DROP POLICY IF EXISTS "Anyone can view room players" ON room_players;
DROP POLICY IF EXISTS "Players can update their own info" ON room_players;
DROP POLICY IF EXISTS "Anyone can join room" ON room_players;
DROP POLICY IF EXISTS "Players can leave room" ON room_players;

-- 全員がルームを見れる
CREATE POLICY "Anyone can view rooms"
  ON game_rooms FOR SELECT
  USING (true);

-- ホストのみがルームを更新できる
CREATE POLICY "Host can update room"
  ON game_rooms FOR UPDATE
  USING (auth.uid()::text = host_user_id OR host_user_id LIKE 'guest-%');

-- 誰でもルームを作成できる
CREATE POLICY "Anyone can create room"
  ON game_rooms FOR INSERT
  WITH CHECK (true);

-- ホストのみがルームを削除できる
CREATE POLICY "Host can delete room"
  ON game_rooms FOR DELETE
  USING (auth.uid()::text = host_user_id OR host_user_id LIKE 'guest-%');

-- 全員がルームプレイヤーを見れる
CREATE POLICY "Anyone can view room players"
  ON room_players FOR SELECT
  USING (true);

-- 自分のプレイヤー情報を更新できる
CREATE POLICY "Players can update their own info"
  ON room_players FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id LIKE 'guest-%');

-- 誰でもルームに参加できる
CREATE POLICY "Anyone can join room"
  ON room_players FOR INSERT
  WITH CHECK (true);

-- 自分のプレイヤー情報を削除できる（退室）
CREATE POLICY "Players can leave room"
  ON room_players FOR DELETE
  USING (auth.uid()::text = user_id OR user_id LIKE 'guest-%');

-- Realtime publication の有効化（エラーハンドリング付き）
DO $$
BEGIN
  -- game_roomsテーブルを追加（既に存在する場合はスキップ）
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'game_rooms is already in supabase_realtime publication';
  END;

  -- room_playersテーブルを追加（既に存在する場合はスキップ）
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE room_players;
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'room_players is already in supabase_realtime publication';
  END;
END $$;

-- コメント
COMMENT ON TABLE game_rooms IS 'オンラインマルチプレイヤー対戦のゲームルーム';
COMMENT ON TABLE room_players IS 'ゲームルームに参加しているプレイヤー';
COMMENT ON COLUMN game_rooms.room_code IS '6文字のユニークなルームコード';
COMMENT ON COLUMN game_rooms.status IS 'ルームの状態: waiting, playing, finished, cancelled';
COMMENT ON COLUMN room_players.connection_status IS 'プレイヤーの接続状態: connected, disconnected';
