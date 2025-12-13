-- 世界旅行すごろくゲーム データベーススキーマ

-- 空港マスタテーブル（世界主要100空港）
CREATE TABLE airports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(3) UNIQUE NOT NULL, -- IATA空港コード
  name VARCHAR(255) NOT NULL,
  name_ja VARCHAR(255), -- 日本語名
  city VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  region VARCHAR(50), -- アジア、ヨーロッパ、北米等
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 航空会社マスタテーブル（主要10社）
CREATE TABLE airlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(3) UNIQUE NOT NULL, -- IATA航空会社コード
  name VARCHAR(255) NOT NULL,
  name_ja VARCHAR(255), -- 日本語名
  country VARCHAR(100) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 航空会社ルートマスタテーブル
CREATE TABLE airline_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airline_id UUID REFERENCES airlines(id) ON DELETE CASCADE,
  origin_airport_id UUID REFERENCES airports(id) ON DELETE CASCADE,
  destination_airport_id UUID REFERENCES airports(id) ON DELETE CASCADE,
  distance_km INTEGER NOT NULL, -- 実際の距離（km）
  flight_time_hours DECIMAL(4, 2), -- 飛行時間
  board_spaces INTEGER GENERATED ALWAYS AS (CEILING(distance_km::DECIMAL / 500)) STORED, -- 500km=1マス
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(airline_id, origin_airport_id, destination_airport_id)
);

-- 船の港マスタテーブル
CREATE TABLE ports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_ja VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 船ルートマスタテーブル
CREATE TABLE ship_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_port_id UUID REFERENCES ports(id) ON DELETE CASCADE,
  destination_port_id UUID REFERENCES ports(id) ON DELETE CASCADE,
  distance_km INTEGER NOT NULL,
  sailing_time_hours DECIMAL(4, 2),
  board_spaces INTEGER GENERATED ALWAYS AS (CEILING(distance_km::DECIMAL / 100)) STORED, -- 100km=1マス
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(origin_port_id, destination_port_id)
);

-- 名所マスタテーブル（世界遺産・絶景ポイント・名所）
CREATE TABLE attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ja VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'world_heritage', 'scenic_spot', 'landmark'
  description TEXT,
  city VARCHAR(255),
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT, -- フリー素材画像URL
  impressed_points INTEGER DEFAULT 0, -- 獲得impressedポイント
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- スターマスタテーブル（ミュージシャン・アーティスト・映画スター・著名スポーツ選手）
CREATE TABLE stars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ja VARCHAR(255),
  category VARCHAR(50) NOT NULL, -- 'musician', 'artist', 'movie_star', 'athlete'
  description TEXT,
  nationality VARCHAR(100),
  portrait_url TEXT, -- 似顔絵画像URL
  impressed_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- アートマスタテーブル（コンサート・ミュージカル・パフォーマンス・大道芸）
CREATE TABLE arts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ja VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'concert', 'musical', 'performance', 'street_art'
  description TEXT,
  venue VARCHAR(255),
  city VARCHAR(255),
  country VARCHAR(100),
  image_url TEXT,
  impressed_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- グルメマスタテーブル
CREATE TABLE gourmet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ja VARCHAR(255) NOT NULL,
  description TEXT,
  city VARCHAR(255),
  country VARCHAR(100) NOT NULL,
  cuisine_type VARCHAR(100), -- 料理のタイプ
  image_url TEXT,
  impressed_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- トラブルマスタテーブル
CREATE TABLE troubles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ja VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'theft', 'robbery', 'flight_delay', 'hijack', 'engine_failure', 'shipwreck', 'pirate', 'fire'
  description TEXT NOT NULL,
  severity INTEGER DEFAULT 1, -- 重要度 1-5
  image_url TEXT, -- 映画シーン/マンガ素材
  impressed_points_loss INTEGER DEFAULT 0, -- 失うポイント（マイナス）
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- トラブル解消マスタテーブル
CREATE TABLE trouble_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trouble_id UUID REFERENCES troubles(id) ON DELETE CASCADE,
  helper_type VARCHAR(100) NOT NULL, -- 'local_person', 'tour_guide', 'firefighter', 'paramedic', 'police', etc.
  resolution_text TEXT NOT NULL, -- 解消シナリオ
  encouragement_text TEXT, -- 励ましの言葉
  impressed_points INTEGER DEFAULT 0, -- 獲得impressedポイント
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 感動体験シナリオマスタテーブル
CREATE TABLE impressed_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'attraction', 'star', 'art', 'gourmet', 'trouble_resolution'
  related_id UUID, -- attractions, stars, arts, gourmet, trouble_resolutionsのいずれかのID
  scenario_text TEXT NOT NULL,
  impressed_points INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 喜び提供シナリオマスタテーブル
CREATE TABLE giver_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  location_type VARCHAR(50) NOT NULL, -- 'airport', 'flight', 'port', 'ship', 'restaurant', 'concert_hall', 'museum'
  situation_text TEXT NOT NULL, -- 状況説明
  action_options JSONB NOT NULL, -- 選択肢の配列 [{"text": "...", "points": 10}, ...]
  giver_points INTEGER NOT NULL, -- 基本獲得giverポイント
  feedback_text TEXT, -- 相手からの感謝/喜びのフィードバック
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ゲーム期間設定マスタテーブル
CREATE TABLE game_period_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_name VARCHAR(50) UNIQUE NOT NULL, -- '1week', '2weeks', '1month', '2months', '3months', '6months', '1year'
  period_name_ja VARCHAR(50) NOT NULL, -- '1週間', '2週間', '1か月', '2か月', '3か月', '6か月', '1年'
  total_days INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ゲーム期間設定の初期データ
INSERT INTO game_period_settings (period_name, period_name_ja, total_days) VALUES
  ('1week', '1週間', 7),
  ('2weeks', '2週間', 14),
  ('1month', '1か月', 30),
  ('2months', '2か月', 60),
  ('3months', '3か月', 90),
  ('6months', '6か月', 180),
  ('1year', '1年', 365);

-- ゲームセッションテーブル
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  period_setting_id UUID REFERENCES game_period_settings(id),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  total_days INTEGER NOT NULL, -- 選択した期間の総日数
  elapsed_days INTEGER DEFAULT 0, -- 経過日数
  current_location_type VARCHAR(20) DEFAULT 'airport', -- 'airport', 'port', 'flight', 'ship'
  current_airport_id UUID REFERENCES airports(id),
  current_port_id UUID REFERENCES ports(id),
  impressed_points INTEGER DEFAULT 0, -- 累計impressedポイント
  giver_points INTEGER DEFAULT 0, -- 累計giverポイント
  total_points INTEGER GENERATED ALWAYS AS (impressed_points + giver_points) STORED, -- 合計ポイント
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ゲーム進行履歴テーブル
CREATE TABLE game_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL, -- 訪問順序
  destination_type VARCHAR(20) NOT NULL, -- 'airport', 'port'
  destination_airport_id UUID REFERENCES airports(id),
  destination_port_id UUID REFERENCES ports(id),
  distance_km INTEGER NOT NULL, -- 移動距離
  stay_days INTEGER NOT NULL, -- 滞在日数（5000km以下=2日、5000km超=3日）
  arrival_date TIMESTAMPTZ NOT NULL,
  departure_date TIMESTAMPTZ,
  impressed_points_gained INTEGER DEFAULT 0,
  giver_points_gained INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_session_id, sequence_number)
);

-- イベント発生履歴テーブル
CREATE TABLE event_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  game_progress_id UUID REFERENCES game_progress(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'attraction', 'star', 'art', 'gourmet', 'trouble', 'trouble_resolution', 'giver'
  related_table VARCHAR(50), -- 関連テーブル名
  related_id UUID, -- 関連レコードのID
  event_text TEXT,
  impressed_points INTEGER DEFAULT 0,
  giver_points INTEGER DEFAULT 0,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_airline_routes_origin ON airline_routes(origin_airport_id);
CREATE INDEX idx_airline_routes_destination ON airline_routes(destination_airport_id);
CREATE INDEX idx_ship_routes_origin ON ship_routes(origin_port_id);
CREATE INDEX idx_ship_routes_destination ON ship_routes(destination_port_id);
CREATE INDEX idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_game_progress_session ON game_progress(game_session_id);
CREATE INDEX idx_event_history_session ON event_history(game_session_id);

-- RLS (Row Level Security) 有効化
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_history ENABLE ROW LEVEL SECURITY;

-- RLSポリシー: ユーザーは自分のゲームセッションのみ閲覧・編集可能
CREATE POLICY "Users can view their own game sessions"
  ON game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions"
  ON game_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own game progress"
  ON game_progress FOR SELECT
  USING (
    game_session_id IN (
      SELECT id FROM game_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own game progress"
  ON game_progress FOR INSERT
  WITH CHECK (
    game_session_id IN (
      SELECT id FROM game_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own event history"
  ON event_history FOR SELECT
  USING (
    game_session_id IN (
      SELECT id FROM game_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own event history"
  ON event_history FOR INSERT
  WITH CHECK (
    game_session_id IN (
      SELECT id FROM game_sessions WHERE user_id = auth.uid()
    )
  );

-- 滞在日数計算関数（移動距離に基づく）
CREATE OR REPLACE FUNCTION calculate_stay_days(distance_km INTEGER)
RETURNS INTEGER AS $$
BEGIN
  IF distance_km <= 5000 THEN
    RETURN 2;
  ELSE
    RETURN 3;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ゲームセッション更新時の自動タイムスタンプ更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにupdated_atトリガーを設定
CREATE TRIGGER update_airports_updated_at BEFORE UPDATE ON airports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_airlines_updated_at BEFORE UPDATE ON airlines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at BEFORE UPDATE ON game_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
