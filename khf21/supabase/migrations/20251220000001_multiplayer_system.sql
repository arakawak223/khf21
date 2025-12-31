-- 複数プレイヤー対戦システム
-- 2人対戦（人間 vs フリーマン）の実装

-- game_sessionsテーブルに複数プレイヤー対応カラムを追加
ALTER TABLE game_sessions
ADD COLUMN IF NOT EXISTS current_turn_order INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_multiplayer BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_players INTEGER DEFAULT 1;

-- game_playersテーブル: 各プレイヤーの情報を管理
CREATE TABLE IF NOT EXISTS game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_type VARCHAR(20) NOT NULL CHECK (player_type IN ('human', 'freeman_d', 'freeman_s')),
  player_order INTEGER NOT NULL CHECK (player_order > 0),
  player_nickname VARCHAR(100) NOT NULL,
  player_color VARCHAR(20) NOT NULL DEFAULT 'blue',

  -- 現在位置
  current_location_type VARCHAR(20) DEFAULT 'airport' CHECK (current_location_type IN ('airport', 'port', 'flight', 'ship')),
  current_airport_id UUID REFERENCES airports(id),
  current_port_id UUID REFERENCES ports(id),
  current_space_number INTEGER DEFAULT 0 CHECK (current_space_number >= 0),
  destination_airport_id UUID REFERENCES airports(id),
  route_spaces JSONB, -- 経路マス配列 [{ lat, lng, spaceNumber }]

  -- ポイント
  impressed_points INTEGER DEFAULT 0 CHECK (impressed_points >= 0),
  giver_points INTEGER DEFAULT 0 CHECK (giver_points >= 0),
  total_points INTEGER GENERATED ALWAYS AS (impressed_points + giver_points) STORED,

  -- 状態管理
  is_skipping_turn BOOLEAN DEFAULT false, -- 1回休み状態
  freeman_type VARCHAR(20) CHECK (freeman_type IN ('defense', 'support') OR freeman_type IS NULL),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 制約: 同じゲームセッション内で player_order は一意
  UNIQUE(game_session_id, player_order)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_game_players_session_id ON game_players(game_session_id);
CREATE INDEX IF NOT EXISTS idx_game_players_session_order ON game_players(game_session_id, player_order);
CREATE INDEX IF NOT EXISTS idx_game_players_type ON game_players(player_type);

-- overtake_eventsテーブル: 追い越しイベントの記録
CREATE TABLE IF NOT EXISTS overtake_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  overtaking_player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  overtaken_player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  space_number INTEGER NOT NULL CHECK (space_number >= 0),

  -- ペナルティ/サポートの種類
  action_type VARCHAR(20) NOT NULL CHECK (
    action_type IN (
      'move_back',      -- 後退
      'get_points',     -- ポイント奪取
      'skip_turn',      -- 1回休み
      'move_forward',   -- 前進
      'give_points',    -- ポイント付与
      'encourage'       -- 激励メッセージ+50ポイント
    )
  ),
  action_value INTEGER, -- 後退/前進マス数、ポイント数

  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_overtake_events_session_id ON overtake_events(game_session_id);
CREATE INDEX IF NOT EXISTS idx_overtake_events_overtaking_player ON overtake_events(overtaking_player_id);
CREATE INDEX IF NOT EXISTS idx_overtake_events_overtaken_player ON overtake_events(overtaken_player_id);
CREATE INDEX IF NOT EXISTS idx_overtake_events_occurred_at ON overtake_events(occurred_at DESC);

-- freeman_transformationsテーブル: フリーマンの変化記録
CREATE TABLE IF NOT EXISTS freeman_transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  freeman_player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  from_type VARCHAR(20) NOT NULL CHECK (from_type IN ('defense', 'support')),
  to_type VARCHAR(20) NOT NULL CHECK (to_type IN ('defense', 'support')),
  reason TEXT,

  transformed_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_freeman_transformations_session_id ON freeman_transformations(game_session_id);
CREATE INDEX IF NOT EXISTS idx_freeman_transformations_freeman_player ON freeman_transformations(freeman_player_id);
CREATE INDEX IF NOT EXISTS idx_freeman_transformations_transformed_at ON freeman_transformations(transformed_at DESC);

-- updated_atの自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- game_playersテーブルのトリガー
DROP TRIGGER IF EXISTS update_game_players_updated_at ON game_players;
CREATE TRIGGER update_game_players_updated_at
  BEFORE UPDATE ON game_players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- コメント
COMMENT ON TABLE game_players IS '各プレイヤー（人間・フリーマン）の情報を管理';
COMMENT ON COLUMN game_players.player_type IS 'プレイヤーのタイプ: human（人間）, freeman_d（Dフリーマン）, freeman_s（Sフリーマン）';
COMMENT ON COLUMN game_players.player_order IS 'ターン順序（1から始まる）';
COMMENT ON COLUMN game_players.freeman_type IS 'フリーマンの種類: defense（対戦型）, support（サポート型）';
COMMENT ON COLUMN game_players.is_skipping_turn IS '1回休み状態かどうか';

COMMENT ON TABLE overtake_events IS '追い越しイベントの記録';
COMMENT ON COLUMN overtake_events.action_type IS 'ペナルティ/サポートの種類';

COMMENT ON TABLE freeman_transformations IS 'フリーマンの変化記録（DフリーマンからSフリーマンへなど）';





