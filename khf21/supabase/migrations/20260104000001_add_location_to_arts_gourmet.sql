-- artsとgourmetテーブルに位置情報カラムを追加

ALTER TABLE arts
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

ALTER TABLE gourmet
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS type VARCHAR(100); -- cuisine_typeと同様の目的で使用
