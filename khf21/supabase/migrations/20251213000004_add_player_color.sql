-- プレイヤーカラー列を追加
ALTER TABLE game_sessions
ADD COLUMN player_color VARCHAR(20) DEFAULT 'red';

-- 利用可能なカラー: 'red', 'blue', 'green', 'yellow', 'purple', 'orange'
COMMENT ON COLUMN game_sessions.player_color IS '
プレイヤーの飛行機アイコンの色。
利用可能な色: red, blue, green, yellow, purple, orange
デフォルト: red
';
