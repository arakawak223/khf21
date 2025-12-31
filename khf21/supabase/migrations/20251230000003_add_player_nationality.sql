-- プレイヤーに国籍フィールドを追加

ALTER TABLE game_players
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100) NOT NULL DEFAULT 'Japan';

COMMENT ON COLUMN game_players.nationality IS 'プレイヤーの国籍';
