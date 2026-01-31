-- 主要路線の航空会社・便名データを追加
-- 飛行機マニアが喜ぶような、実際の路線に基づいたデータ

-- 航空会社のIDを取得するためのヘルパー関数的なWITH句
WITH airline_ids AS (
  SELECT id, code FROM airlines
),
airport_ids AS (
  SELECT id, code FROM airports
)

-- airline_routesテーブルにデータを投入
INSERT INTO airline_routes (airline_id, origin_airport_id, destination_airport_id, distance_km, flight_time_hours, board_spaces, flight_number)
SELECT
  (SELECT id FROM airline_ids WHERE code = routes.airline_code),
  (SELECT id FROM airport_ids WHERE code = routes.origin_code),
  (SELECT id FROM airport_ids WHERE code = routes.dest_code),
  routes.distance_km,
  routes.flight_time_hours,
  CEILING(routes.distance_km / 500.0)::integer,
  routes.flight_number
FROM (VALUES
  -- 東京（成田）発の主要路線
  ('JAL', 'NRT', 'JFK', 10850, 13.5, 'JAL006'),  -- 日空航空 成田→ニューヨーク
  ('JAL', 'NRT', 'LHR', 9580, 12.5, 'JAL041'),   -- 日空航空 成田→ロンドン
  ('JAL', 'NRT', 'CDG', 9720, 12.5, 'JAL045'),   -- 日空航空 成田→パリ
  ('JAL', 'NRT', 'SIN', 5320, 7.0, 'JAL711'),    -- 日空航空 成田→シンガポール
  ('JAL', 'NRT', 'BKK', 4600, 6.5, 'JAL707'),    -- 日空航空 成田→バンコク
  ('JAL', 'NRT', 'ICN', 1260, 2.5, 'JAL091'),    -- 日空航空 成田→ソウル
  ('JAL', 'NRT', 'HKG', 2900, 4.5, 'JAL029'),    -- 日空航空 成田→香港
  ('JAL', 'NRT', 'SYD', 7820, 9.5, 'JAL051'),    -- 日空航空 成田→シドニー

  ('ANA', 'NRT', 'JFK', 10850, 13.5, 'ANA010'),  -- 全日輸送 成田→ニューヨーク
  ('ANA', 'NRT', 'LAX', 8800, 11.0, 'ANA006'),   -- 全日輸送 成田→ロサンゼルス
  ('ANA', 'NRT', 'LHR', 9580, 12.5, 'ANA212'),   -- 全日輸送 成田→ロンドン
  ('ANA', 'NRT', 'CDG', 9720, 12.5, 'ANA218'),   -- 全日輸送 成田→パリ
  ('ANA', 'NRT', 'FRA', 9380, 12.0, 'ANA208'),   -- 全日輸送 成田→フランクフルト
  ('ANA', 'NRT', 'SIN', 5320, 7.0, 'ANA801'),    -- 全日輸送 成田→シンガポール
  ('ANA', 'NRT', 'ICN', 1260, 2.5, 'ANA1062'),   -- 全日輸送 成田→ソウル
  ('ANA', 'NRT', 'PEK', 2100, 4.0, 'ANA903'),    -- 全日輸送 成田→北京

  -- 東京（羽田）発の主要路線
  ('JAL', 'HND', 'SFO', 8280, 10.5, 'JAL002'),   -- 日空航空 羽田→サンフランシスコ
  ('JAL', 'HND', 'LAX', 8800, 11.0, 'JAL016'),   -- 日空航空 羽田→ロサンゼルス
  ('JAL', 'HND', 'SIN', 5320, 7.0, 'JAL035'),    -- 日空航空 羽田→シンガポール
  ('JAL', 'HND', 'ICN', 1200, 2.5, 'JAL095'),    -- 日空航空 羽田→ソウル

  ('ANA', 'HND', 'SFO', 8280, 10.5, 'ANA107'),   -- 全日輸送 羽田→サンフランシスコ
  ('ANA', 'HND', 'LAX', 8800, 11.0, 'ANA105'),   -- 全日輸送 羽田→ロサンゼルス
  ('ANA', 'HND', 'LHR', 9600, 12.5, 'ANA211'),   -- 全日輸送 羽田→ロンドン
  ('ANA', 'HND', 'SIN', 5320, 7.0, 'ANA841'),    -- 全日輸送 羽田→シンガポール

  -- 大阪（関西）発の主要路線
  ('JAL', 'KIX', 'LAX', 8900, 11.0, 'JAL060'),   -- 日空航空 関西→ロサンゼルス
  ('JAL', 'KIX', 'SIN', 5300, 7.0, 'JAL723'),    -- 日空航空 関西→シンガポール
  ('ANA', 'KIX', 'LAX', 8900, 11.0, 'ANA106'),   -- 全日輸送 関西→ロサンゼルス

  -- アメリカ系航空会社の路線
  ('UAL', 'JFK', 'NRT', 10850, 14.0, 'UAL79'),   -- 統一航空 ニューヨーク→成田
  ('UAL', 'SFO', 'NRT', 8280, 11.0, 'UAL837'),   -- 統一航空 サンフランシスコ→成田
  ('UAL', 'LAX', 'NRT', 8800, 11.5, 'UAL32'),    -- 統一航空 ロサンゼルス→成田
  ('UAL', 'JFK', 'LHR', 5570, 7.5, 'UAL14'),     -- 統一航空 ニューヨーク→ロンドン
  ('UAL', 'SFO', 'SIN', 13600, 16.5, 'UAL1'),    -- 統一航空 サンフランシスコ→シンガポール

  ('AAL', 'JFK', 'NRT', 10850, 14.0, 'AAL60'),   -- 米国航空 ニューヨーク→成田
  ('AAL', 'LAX', 'NRT', 8800, 11.5, 'AAL26'),    -- 米国航空 ロサンゼルス→成田
  ('AAL', 'JFK', 'LHR', 5570, 7.5, 'AAL100'),    -- 米国航空 ニューヨーク→ロンドン
  ('AAL', 'LAX', 'LHR', 8760, 11.0, 'AAL134'),   -- 米国航空 ロサンゼルス→ロンドン

  -- ヨーロッパ系航空会社の路線
  ('BAW', 'LHR', 'NRT', 9580, 12.5, 'BAW7'),     -- 英国翼 ロンドン→成田
  ('BAW', 'LHR', 'HND', 9600, 12.5, 'BAW5'),     -- 英国翼 ロンドン→羽田
  ('BAW', 'LHR', 'JFK', 5570, 8.0, 'BAW112'),    -- 英国翼 ロンドン→ニューヨーク
  ('BAW', 'LHR', 'CDG', 340, 1.5, 'BAW308'),     -- 英国翼 ロンドン→パリ
  ('BAW', 'LHR', 'SIN', 10870, 13.5, 'BAW11'),   -- 英国翼 ロンドン→シンガポール

  ('AFR', 'CDG', 'NRT', 9720, 12.5, 'AFR276'),   -- 仏蘭西空 パリ→成田
  ('AFR', 'CDG', 'JFK', 5840, 8.5, 'AFR6'),      -- 仏蘭西空 パリ→ニューヨーク
  ('AFR', 'CDG', 'LHR', 340, 1.5, 'AFR1180'),    -- 仏蘭西空 パリ→ロンドン
  ('AFR', 'CDG', 'SIN', 10740, 13.0, 'AFR256'),  -- 仏蘭西空 パリ→シンガポール

  ('DLH', 'FRA', 'NRT', 9380, 12.0, 'DLH710'),   -- 独逸翼 フランクフルト→成田
  ('DLH', 'FRA', 'JFK', 6200, 9.0, 'DLH400'),    -- 独逸翼 フランクフルト→ニューヨーク
  ('DLH', 'FRA', 'LHR', 660, 1.5, 'DLH902'),     -- 独逸翼 フランクフルト→ロンドン
  ('DLH', 'FRA', 'SIN', 10280, 12.5, 'DLH778'),  -- 独逸翼 フランクフルト→シンガポール

  -- アジア系航空会社の路線
  ('SIA', 'SIN', 'NRT', 5320, 7.0, 'SIA638'),    -- 獅子空 シンガポール→成田
  ('SIA', 'SIN', 'LHR', 10870, 13.5, 'SIA12'),   -- 獅子空 シンガポール→ロンドン
  ('SIA', 'SIN', 'JFK', 15330, 18.5, 'SIA22'),   -- 獅子空 シンガポール→ニューヨーク
  ('SIA', 'SIN', 'SYD', 6300, 8.0, 'SIA232'),    -- 獅子空 シンガポール→シドニー
  ('SIA', 'SIN', 'HKG', 2590, 4.0, 'SIA866'),    -- 獅子空 シンガポール→香港

  -- 中東系航空会社の路線
  ('EK', 'DXB', 'NRT', 7990, 10.5, 'EK319'),     -- 首長国空 ドバイ→成田
  ('EK', 'DXB', 'LHR', 5480, 7.5, 'EK2'),        -- 首長国空 ドバイ→ロンドン
  ('EK', 'DXB', 'JFK', 11040, 14.5, 'EK201'),    -- 首長国空 ドバイ→ニューヨーク
  ('EK', 'DXB', 'SIN', 6020, 7.5, 'EK354'),      -- 首長国空 ドバイ→シンガポール

  -- オセアニア系航空会社の路線
  ('QFA', 'SYD', 'NRT', 7820, 9.5, 'QFA26'),     -- 豪州翼 シドニー→成田
  ('QFA', 'SYD', 'LHR', 17000, 22.0, 'QFA1'),    -- 豪州翼 シドニー→ロンドン（超長距離！）
  ('QFA', 'SYD', 'LAX', 12050, 13.5, 'QFA11'),   -- 豪州翼 シドニー→ロサンゼルス
  ('QFA', 'SYD', 'SIN', 6300, 8.0, 'QFA81'),     -- 豪州翼 シドニー→シンガポール

  -- アジア内の主要路線
  ('JAL', 'ICN', 'NRT', 1260, 2.5, 'JAL092'),    -- 日空航空 ソウル→成田
  ('ANA', 'ICN', 'NRT', 1260, 2.5, 'ANA1060'),   -- 全日輸送 ソウル→成田
  ('SIA', 'HKG', 'SIN', 2590, 4.0, 'SIA856'),    -- 獅子空 香港→シンガポール
  ('JAL', 'BKK', 'NRT', 4600, 6.5, 'JAL708'),    -- 日空航空 バンコク→成田
  ('ANA', 'PEK', 'NRT', 2100, 4.0, 'ANA906')     -- 全日輸送 北京→成田

) AS routes(airline_code, origin_code, dest_code, distance_km, flight_time_hours, flight_number)
WHERE
  (SELECT id FROM airline_ids WHERE code = routes.airline_code) IS NOT NULL
  AND (SELECT id FROM airport_ids WHERE code = routes.origin_code) IS NOT NULL
  AND (SELECT id FROM airport_ids WHERE code = routes.dest_code) IS NOT NULL;

-- 確認用コメント
-- 航空会社名（もじった名前）:
-- JAL → 日空航空（にっくうこうくう）
-- ANA → 全日輸送（ぜんにちゆそう）
-- UAL → 統一航空（とういつこうくう）
-- AAL → 米国航空（べいこくこうくう）
-- BAW → 英国翼（えいこくよく）
-- AFR → 仏蘭西空（ふらんすくう）
-- DLH → 独逸翼（どいつよく）
-- SIA → 獅子空（ししくう）
-- EK → 首長国空（しゅちょうこくくう）
-- QFA → 豪州翼（ごうしゅうよく）
