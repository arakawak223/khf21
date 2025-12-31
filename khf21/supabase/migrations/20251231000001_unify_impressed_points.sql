-- 名所・グルメ・アートのimpressed_pointsを統一
-- 選択肢によって獲得ポイントが異なると、高いポイントの選択肢に目が行ってしまい、
-- 他の選択肢を読まずに進めてしまうため、全て統一する

-- 名所: 全て50ptに統一
UPDATE attractions SET impressed_points = 50;

-- アート: 全て60ptに統一
UPDATE arts SET impressed_points = 60;

-- グルメ: 全て50ptに統一
UPDATE gourmet SET impressed_points = 50;
