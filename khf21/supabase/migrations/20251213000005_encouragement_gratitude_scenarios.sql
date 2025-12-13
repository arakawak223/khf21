-- 元気づけ/感謝のストーリーベースシナリオテーブル
-- 旅行中に電話・メール・日記などを通じて思い出す、深い背景を持つ感謝や元気づけのシナリオ

CREATE TABLE IF NOT EXISTS encouragement_gratitude_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- カテゴリー分類
  category TEXT NOT NULL CHECK (category IN ('gratitude_happy', 'gratitude_help', 'encouragement')),
  -- gratitude_happy: 嬉しい出来事への感謝
  -- gratitude_help: 辛い時に助けてもらった感謝
  -- encouragement: 相手が辛い時の元気づけ

  subcategory TEXT, -- 仕事、学業、恋愛、健康、家族など

  -- きっかけ
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('phone', 'email', 'message', 'diary', 'photo', 'letter', 'encounter', 'video_call')),
  trigger_from TEXT, -- 親友、家族、同僚、先輩など

  -- ストーリー
  travel_situation TEXT NOT NULL, -- 旅行中の状況
  background_story TEXT NOT NULL, -- 背景となる出来事
  message_text TEXT NOT NULL, -- 感謝/元気づけの言葉
  location_context TEXT, -- 場所（ロンドン、パリなど）

  -- ポイント
  impressed_points INTEGER DEFAULT 0,
  giver_points INTEGER DEFAULT 0,

  -- タイムスタンプ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_encouragement_gratitude_category ON encouragement_gratitude_scenarios(category);
CREATE INDEX idx_encouragement_gratitude_trigger ON encouragement_gratitude_scenarios(trigger_type);
CREATE INDEX idx_encouragement_gratitude_subcategory ON encouragement_gratitude_scenarios(subcategory);

-- コメント
COMMENT ON TABLE encouragement_gratitude_scenarios IS '元気づけ/感謝のストーリーベースシナリオ - 旅行中に思い出す深い背景を持つ感謝や励ましの言葉';
COMMENT ON COLUMN encouragement_gratitude_scenarios.category IS 'メインカテゴリー: gratitude_happy(嬉しい出来事への感謝), gratitude_help(辛い時の助けへの感謝), encouragement(相手への元気づけ)';
COMMENT ON COLUMN encouragement_gratitude_scenarios.trigger_type IS 'きっかけの種類: phone, email, message, diary, photo, letter, encounter, video_call';
COMMENT ON COLUMN encouragement_gratitude_scenarios.travel_situation IS '旅行中の状況説明';
COMMENT ON COLUMN encouragement_gratitude_scenarios.background_story IS '背景となる出来事の詳細';
COMMENT ON COLUMN encouragement_gratitude_scenarios.message_text IS '感謝または元気づけの言葉';
