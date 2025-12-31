-- 資源管理システム（ポイントベース）とキャラクター特性の追加
-- プレイヤーの資源ポイントと選択履歴、キャラクター特性を管理

-- game_players テーブルに資源ポイント関連フィールドとキャラクター特性を追加
ALTER TABLE game_players
ADD COLUMN IF NOT EXISTS resource_points INTEGER DEFAULT 100, -- 資源ポイント（初期値100）
ADD COLUMN IF NOT EXISTS total_spent_points INTEGER DEFAULT 0, -- 累計消費ポイント
ADD COLUMN IF NOT EXISTS current_flight_class TEXT DEFAULT 'economy',
ADD COLUMN IF NOT EXISTS current_hotel_grade TEXT DEFAULT 'guesthouse',
ADD COLUMN IF NOT EXISTS star_encounter_bonus INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS character_trait TEXT DEFAULT 'balanced', -- 'adventurer', 'planner', 'socialite', 'efficient', 'balanced'
ADD COLUMN IF NOT EXISTS trait_long_distance_bonus INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trait_event_rate_modifier INTEGER DEFAULT 0;

-- 予算選択履歴テーブル（オプション：詳細な履歴を残したい場合）
CREATE TABLE IF NOT EXISTS budget_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'flight_upgrade', 'hotel_upgrade', 'activity'
  amount INTEGER NOT NULL,
  choice_made TEXT NOT NULL, -- 'economy', 'business', 'first', etc.
  location_context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックスの追加
CREATE INDEX IF NOT EXISTS idx_budget_transactions_game
  ON budget_transactions(game_id);
CREATE INDEX IF NOT EXISTS idx_budget_transactions_player
  ON budget_transactions(player_id);

-- コメント追加
COMMENT ON COLUMN game_players.resource_points IS '現在の資源ポイント（初期値100）';
COMMENT ON COLUMN game_players.total_spent_points IS '累計消費ポイント';
COMMENT ON COLUMN game_players.current_flight_class IS '現在のフライトクラス: economy, business, first';
COMMENT ON COLUMN game_players.current_hotel_grade IS '現在のホテルグレード: guesthouse, standard, luxury';
COMMENT ON COLUMN game_players.star_encounter_bonus IS 'スター遭遇率ボーナス（%）';
COMMENT ON COLUMN game_players.character_trait IS 'キャラクター特性: adventurer（冒険家）, planner（計画的）, socialite（社交的）, efficient（効率重視）, balanced（バランス型）';
COMMENT ON COLUMN game_players.trait_long_distance_bonus IS '長距離移動時のボーナス（%）';
COMMENT ON COLUMN game_players.trait_event_rate_modifier IS 'イベント発生率の修正値（%）';

COMMENT ON TABLE budget_transactions IS '資源ポイント使用履歴テーブル';
COMMENT ON COLUMN budget_transactions.transaction_type IS '取引タイプ: flight_upgrade, hotel_upgrade, activity';
COMMENT ON COLUMN budget_transactions.amount IS '消費ポイント数';
COMMENT ON COLUMN budget_transactions.choice_made IS '選択内容';
