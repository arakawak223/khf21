-- プレイヤーニックネーム列を追加
ALTER TABLE game_sessions
ADD COLUMN player_nickname VARCHAR(20);

-- デフォルト値コメント: アプリケーションロジックで「プレイヤー1, 2, 3...」を設定
COMMENT ON COLUMN game_sessions.player_nickname IS '
プレイヤーのニックネーム。
未設定の場合はアプリケーションで「プレイヤー1」「プレイヤー2」等のデフォルト値を表示。
';
